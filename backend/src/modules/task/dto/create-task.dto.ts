import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskPriority, TaskStatus } from '../types';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status: TaskStatus;

  @IsEnum(TaskPriority)
  @IsNotEmpty()
  priority: TaskPriority;
    
  @IsString()
  @IsNotEmpty()
  dueDate: string;
    
  @IsString()
  @IsNotEmpty()
  assigneeId?: number;
    
}
