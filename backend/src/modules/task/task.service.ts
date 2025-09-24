import { Injectable } from '@nestjs/common';
import { GetTaskResponse} from './types';
import { TaskRepository } from './task.repostiory';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { GetTaskDto } from './dto/get-task.dto';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
  ) {}

  async createTask(
    data: CreateTaskDto
  ): Promise<Task> {

    return await this.taskRepository.create(data);
  }

  async getAllTasks(query: GetTaskDto): Promise<GetTaskResponse> {
    return await this.taskRepository.findAllAndCount(query);
  }

  async getTaskById(id: number): Promise<Task | null> {
    return await this.taskRepository.findById(id);
  }

  async updateTask(id: number, data: Partial<Task>): Promise<Task> {
    return this.taskRepository.updateById(id, data);
  }

  async deleteTask(id: number): Promise<void> {
    return await this.taskRepository.deleteById(id);
  }
}
