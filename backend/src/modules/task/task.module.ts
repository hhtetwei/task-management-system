import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Task } from './task.entity';
import { TaskController } from './task.controller';
import { TaskUseCase } from './task.use-case';
import { TaskService } from './task.service';
import { TaskRepository } from './task.repostiory';
import { UserModule } from '../user';
import { TaskGateway } from './socket/task.socket.gateway';
import { TaskEventListener } from './listeners/task.event-listeners';
import { JwtModule } from '@nestjs/jwt';


@Module({
    imports: [TypeOrmModule.forFeature([Task]), UserModule, JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1h' },
      }),],
    controllers: [TaskController],
    providers: [TaskUseCase, TaskService, TaskRepository, TaskGateway,
        TaskEventListener],
    exports: [TaskService, TaskRepository],
})
export class TaskModule {}
