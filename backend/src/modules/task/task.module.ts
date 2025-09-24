import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Task } from './task.entity';
import { TaskController } from './task.controller';
import { TaskUseCase } from './task.use-case';
import { TaskService } from './task.service';
import { TaskRepository } from './task.repostiory';
import { UserModule } from '../user';


@Module({
    imports: [TypeOrmModule.forFeature([Task]), UserModule],
    controllers: [TaskController],
    providers: [TaskUseCase, TaskService, TaskRepository],
    exports: [TaskService, TaskRepository],
})
export class TaskModule {}
