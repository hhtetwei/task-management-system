
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@/modules/user';
import { UserType } from '@/modules/user/types';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/tasks',
})
@Injectable()
export class TaskGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger(TaskGateway.name);
  private connectedUsers = new Map<number, string>();
  private jwtSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {

    this.jwtSecret = this.configService.get<string>('JWT_SECRET') || 'your-default-secret-key';
  }

  afterInit(server: Server) {
    this.logger.log('Task WebSocket Gateway initialized');
    this.logger.log(`JWT Secret configured: ${this.jwtSecret ? 'Yes' : 'No'}`);
  }

  async handleConnection(socket: Socket) {
    try {
      this.logger.log(`Connection attempt: ${socket.id}`);
      

      const cookieHeader = socket.handshake.headers.cookie;
      this.logger.log('Raw cookie header:', cookieHeader);

      if (!cookieHeader) {
        this.logger.error('No cookies provided in handshake');
        socket.emit('auth_error', { message: 'No authentication cookies found' });
        socket.disconnect();
        return;
      }


      const cookies = this.parseCookies(cookieHeader);
      this.logger.log('Parsed cookies keys:', Object.keys(cookies));

      const token = cookies['access_token'];
      if (!token) {
        this.logger.error('No access_token cookie found');
        socket.emit('auth_error', { message: 'Access token not found in cookies' });
        socket.disconnect();
        return;
      }

      this.logger.log('Token found in cookies, length:', token.length);

      try {
 
        const payload = jwt.verify(token, this.jwtSecret) as any;
        this.logger.log(`Token verified for user ID: ${payload.sub}`);

        const user = await this.userService.getUserById(payload.sub);
        
        if (!user) {
          this.logger.error('User not found in database');
          socket.emit('auth_error', { message: 'User not found' });
          socket.disconnect();
          return;
        }


        this.connectedUsers.set(user.id, socket.id);
        socket.data.userId = user.id;

  
        socket.join(`user_${user.id}`);
        

        if (user.type === UserType.ADMIN) {
          socket.join('admin_room');
          this.logger.log(`Admin ${user.id} joined admin room`);
        }

        this.logger.log(`User ${user.id} connected to tasks namespace. Total connections: ${this.connectedUsers.size}`);

 
        socket.emit('connected', { 
          message: 'Successfully connected to task notifications', 
          userId: user.id,
          userType: user.type 
        });

      } catch (jwtError) {
        this.logger.error('JWT verification failed:', jwtError.message);
        socket.emit('auth_error', { message: 'Invalid token' });
        socket.disconnect();
        return;
      }

    } catch (error) {
      this.logger.error('WebSocket connection error:', error.message);
      socket.emit('auth_error', { message: 'Connection failed' });
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    if (socket.data.userId) {
      this.connectedUsers.delete(socket.data.userId);
      this.logger.log(`User ${socket.data.userId} disconnected. Total connections: ${this.connectedUsers.size}`);
    }
  }

 
  private parseCookies(cookieHeader: string): { [key: string]: string } {
    const cookies: { [key: string]: string } = {};
    if (cookieHeader) {
      cookieHeader.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        if (name && value) {
          cookies[name] = decodeURIComponent(value);
        }
      });
    }
    return cookies;
  }

  notifyTaskCreated(taskData: any) {
    this.logger.log(`Notifying admin room about task creation: ${taskData.title}`);
    this.server.to('admin_room').emit('task_created', taskData);
  }
  notifyTaskAssigned(userId: number, taskData: any) {
    this.logger.log(`Notifying user_${userId} about task assignment: ${taskData.title}`);
    const rooms = [...this.server.sockets.adapter.rooms.keys()];
    this.logger.log(`Rooms snapshot: ${JSON.stringify(rooms.slice(0, 50))}`);
    this.server.to(`user_${userId}`).emit('task_assigned', taskData);
  }

  notifyTaskReassigned(previousUserId: number, taskData: any) {
    if (previousUserId) {
      this.logger.log(`Notifying previous assignee ${previousUserId} about reassignment: ${taskData.title}`);
      this.server.to(`user_${previousUserId}`).emit('task_reassigned_away', taskData);
    }
  }

  @SubscribeMessage('ping')
  handlePing(socket: Socket) {
    socket.emit('pong', { message: 'pong', timestamp: new Date().toISOString() });
  }
}