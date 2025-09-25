// src/task/task.use-case.ts
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
import { TASK_ASSIGNED_EVENT, TASK_CREATED_EVENT, TASK_UPDATED_EVENT, TaskEventPayload } from './domain/event';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class TaskUseCase {
  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UserService,
    private readonly events: EventEmitter2,
  ) {}

  async createTask(dto: CreateTaskDto) {
    const task = await this.taskService.createTask({ ...dto });
    const payload: TaskEventPayload = {
      id: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate?.toString(),
      assigneeId: task.assigneeId ?? null,
      prevAssigneeId: null,
    };
    
    this.events.emit(TASK_CREATED_EVENT, payload);

    if (task.assigneeId) {
      this.events.emit(TASK_ASSIGNED_EVENT, payload);
    }

    return task;
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

    const [taskBefore, user] = await Promise.all([
      this.taskService.getTaskById(id),
      this.userService.getUserById(userId), 
    ]);

    if (!taskBefore) throw notFoundTaskError;
    if (!user) throw new UnauthorizedException();

    const isAdmin = user.type === UserType.ADMIN;

    if (!isAdmin && taskBefore.assigneeId !== user.id) {
      throw notAllowedToUpdateTask;
    }

    const updatePayload = Object.fromEntries(
      Object.entries(body).filter(([, v]) => v !== undefined),
    ) as Partial<Task>;

    if (Object.keys(updatePayload).length === 0) {
      throw new BadRequestException('No fields provided to update.');
    }

    const taskAfter = await this.taskService.updateTask(id, updatePayload);


    this.emitAssignmentEvents(taskBefore, taskAfter, userId);

    return taskAfter;
  }

  private emitAssignmentEvents(taskBefore: Task, taskAfter: Task, userId: number) {
    const prevAssigneeId = taskBefore.assigneeId ?? null;
    const newAssigneeId = taskAfter.assigneeId ?? null;


    if (prevAssigneeId !== newAssigneeId) {
      const payload: TaskEventPayload = {
        id: taskAfter.id,
        title: taskAfter.title,
        status: taskAfter.status,
        priority: taskAfter.priority,
        dueDate: taskAfter.dueDate?.toString(),
        assigneeId: newAssigneeId,
        prevAssigneeId: prevAssigneeId,
      };


      if (newAssigneeId) {
        this.events.emit(TASK_ASSIGNED_EVENT, payload);
      }

 
      if (prevAssigneeId && prevAssigneeId !== newAssigneeId) {
        this.events.emit(TASK_ASSIGNED_EVENT, { 
          ...payload, 
          type: 'task_reassigned_away' 
        });
      }
    }
  }
    
  async deleteTask(id: number): Promise<void> {
    await this.getTaskById(id);
    return await this.taskService.deleteTask(id);
  }
}