import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UploadedFiles,
    UseInterceptors,
  } from '@nestjs/common';
import { TaskUseCase } from './task.use-case';
import { GetTaskDto } from './dto/get-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorators';
import { UpdateTaskDto } from './dto/update-task.dto';
  
  @Controller('tasks')
  export class TaskController {
    constructor(private readonly taskUseCase: TaskUseCase) {}
  
    @Get()
    async getAllTasks(
      @Query() query: GetTaskDto,
      @GetCurrentUser('id') userId: number,          
    ) {
      return this.taskUseCase.getAllTasksForCaller(query, userId);
    }
  
  
    @Get(':id')
    async getTaskById(@Param('id') id: number) {
      return await this.taskUseCase.getTaskById(id);
    }
  
    @Post()
    async createTask(
      @Body() data: CreateTaskDto,
    ) {
      return await this.taskUseCase.createTask({
        ...data,   
      });
    }
  
    @Patch(':id')
    async updateTask(
      @Param('id') id: number,
      @Body() body: UpdateTaskDto,
      @GetCurrentUser('id') userId: number,  
    ) {
      return this.taskUseCase.updateTask(id, body, userId);
    }
  
  
  
    // @Delete(':id')
    // async deleteUser(@Param() { id }: { id: number }) {
    //   return await this.userUseCase.deleteUser(id);
    // }
  }
  