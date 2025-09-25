import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Matches, Min } from 'class-validator';
import { TaskPriority, TaskStatus } from '../types';

export class GetTaskDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsOptional()
  skip?: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  sort = 'createdAt';

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsInt()
  assigneeId?: number;

  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : 1))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : 10))
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  @IsString()
  @IsOptional()
  search?: string;

  @IsOptional()
  @Matches(/^(asc|desc)$/i, { message: 'direction must be asc or desc' })
  direction?: 'asc' | 'desc' = 'desc';
}
