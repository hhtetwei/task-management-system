import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { GetTaskResponse } from './types';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskDto } from './dto/get-task.dto';
import { notAllowedToUpdateTask, notFoundTaskError } from '../user/task.error';
import { Task } from './task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User, UserService } from '../user';
import { UserType } from '../user/types';



@Injectable()
export class TaskUseCase {
  constructor(
      private readonly taskService: TaskService,
      private readonly userService: UserService,
  ) {}

  async createTask(
    data: CreateTaskDto
  ): Promise<Task> {
    return await this.taskService.createTask(data);
  }


  async getAllTasks(query: GetTaskDto): Promise<GetTaskResponse> {
    return await this.taskService.getAllTasks(query);
  }

  async getTaskById(id: number): Promise<Task | null> {
    const data = await this.taskService.getTaskById(id);
    if (!data) throw notFoundTaskError;
    return data;
  }

  async getAllTasksForCaller(query: GetTaskDto, userId: number): Promise<GetTaskResponse> {
    if (!userId) throw new UnauthorizedException();

    const user = await this.userService.getUserById(userId);
    if (!user) throw new UnauthorizedException();

    const isAdmin = user.type === UserType.ADMIN;

    const effectiveQuery: GetTaskDto = isAdmin
      ? query
      : { ...query, assigneeId: user.id };

    return this.taskService.getAllTasks(effectiveQuery);
  }
    
  async updateTask(id: number, body: UpdateTaskDto, userId: number): Promise<Task> {
    if (!userId) throw new UnauthorizedException();

    const [task, user] = await Promise.all([
      this.taskService.getTaskById(id),
      this.userService.getUserById(userId), 
    ]);

    if (!task) throw notFoundTaskError;
    if (!user) throw new UnauthorizedException();

    const isAdmin = user.type === UserType.ADMIN;

    if (!isAdmin && task.assigneeId !== user.id) {
        throw notAllowedToUpdateTask;
    }

    const updatePayload = Object.fromEntries(
      Object.entries(body).filter(([, v]) => v !== undefined),
    ) as Partial<Task>;

    if (Object.keys(updatePayload).length === 0) {
      throw new BadRequestException('No fields provided to update.');
    }

    return this.taskService.updateTask(id, updatePayload);
  }
    

    //task can only be deleted by admin
//   async deleteTask(id: number): Promise<void> {
//     await this.getUserById(id);
//     return await this.userService.deleteUser(id);
//   }
}
