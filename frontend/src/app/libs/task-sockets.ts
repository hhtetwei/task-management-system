
import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export interface TaskEventPayload {
  id: number;
  title: string;
  status: string;
  priority: string;
  dueDate?: string;
  assigneeId?: number;
  prevAssigneeId?: number;
  creatorId?: number;
  type?: string;
  timestamp?: string;
}

interface UseTasksSocketProps {
  userId?: number;
  onTaskCreated?: (payload: TaskEventPayload) => void;
  onTaskAssigned?: (payload: TaskEventPayload) => void;
  onTaskReassignedAway?: (payload: TaskEventPayload) => void;
}

export const useTasksSocket = ({
  userId,
  onTaskCreated,
  onTaskAssigned,
  onTaskReassignedAway,
}: UseTasksSocketProps) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) {
      console.log('No user ID, skipping WebSocket connection');
      return;
    }

    console.log('Attempting to connect to WebSocket for user:', userId);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';
    console.log('Connecting to:', `${apiUrl}/tasks`);

    const socket = io(`${apiUrl}/tasks`, {
      withCredentials: true, // This is crucial for cookies
      transports: ['websocket', 'polling'],
      timeout: 10000,
      autoConnect: true,
      forceNew: true,
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('✅ Connected to tasks WebSocket, socket ID:', socket.id);
    });

    socket.on('connected', (data) => {
      console.log('✅ Server connection confirmed:', data);
    });


    socket.on('task_created', (data: TaskEventPayload) => {
      console.log('📝 Task created notification received:', data);
      onTaskCreated?.(data);
    });
    
    socket.on('task_assigned', (data: TaskEventPayload) => {
      console.log('🎯 Task assigned notification received:', data);
      console.log('👤 Current user ID should match assigneeId:', data.assigneeId);
      onTaskAssigned?.(data);
    });
    
    socket.on('task_reassigned_away', (data: TaskEventPayload) => {
      console.log('🔄 Task reassigned away notification received:', data);
      onTaskReassignedAway?.(data);
    });


    socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from tasks WebSocket. Reason:', reason);
      

      if (reason !== 'io client disconnect') {
        console.log('Attempting to reconnect...');
        setTimeout(() => {
          if (!socket.connected) {
            socket.connect();
          }
        }, 2000);
      }
    });

    socket.on('error', (error) => {
      console.error('💥 WebSocket error:', error);
    });

    socket.on('connect_error', (error) => {
      console.error('🔌 WebSocket connection error:', error.message);
    });

    socket.on('auth_error', (error) => {
      console.error('🔐 WebSocket authentication error:', error);
    });

   
    const pingInterval = setInterval(() => {
      if (socket.connected) {
        socket.emit('ping');
      }
    }, 30000);

    socket.on('pong', (data) => {
      console.log('🏓 Pong received:', data);
    });


    const connectTimeout = setTimeout(() => {
      if (!socket.connected) {
        console.log('Manual connection attempt...');
        socket.connect();
      }
    }, 100);

    return () => {
      console.log('🧹 Cleaning up WebSocket connection');
      clearTimeout(connectTimeout);
      clearInterval(pingInterval);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, onTaskCreated, onTaskAssigned, onTaskReassignedAway]);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('mark_notification_read', { notificationId });
    }
  }, []);

  return { markNotificationAsRead };
};