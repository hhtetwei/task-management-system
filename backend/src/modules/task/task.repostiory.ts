import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  ILike,
  Repository,
} from 'typeorm';
import { Task } from './task.entity';
import { GetTaskDto } from './dto/get-task.dto';
import { GetTaskResponse } from './types';

@Injectable()
export class TaskRepository {
  constructor(@InjectRepository(Task) private model: Repository<Task>) {}

  async create(data: DeepPartial<Task>): Promise<Task> {
    return await this.model.save(data);
  }

  async findAllAndCount({
    search,
    limit,
    skip,
    sort,
    assigneeId,
  }: GetTaskDto): Promise<GetTaskResponse> {
    const where: FindManyOptions<Task>['where'] = [];

    if (search) {
      where.push({
        title: ILike(`%${search}%`),
      });
    }

  if (assigneeId) {
    where.push({ assigneeId });
  }

    const [data, count] = await this.model.findAndCount({
      where,
      take: limit,
      skip,
      order: {
        [sort ?? 'id']: 'desc',
      },
      relations: { assignee: true },
    });

    return { data, count };
  }

  async findById(id: number): Promise<Task | null> {
    return this.model.findOne({
      where: { id },
      relations: { assignee: true }, 
    });
  }

  async findOne(filter: FindOneOptions<Task>['where']): Promise<Task | null> {
    return await this.model.findOne({
      where: filter,
    });
  }

  async updateById(id: number, data: DeepPartial<Task>): Promise<Task | null> {
    await this.model.update(id, data);
    return this.findById(id);
  }

  async deleteById(id: number): Promise<void> {
    await this.model.softDelete(id);
  }
}
