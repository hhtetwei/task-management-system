import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { Task } from './task.entity';
import { GetTaskDto } from './dto/get-task.dto';
import { GetTaskResponse } from './types';

const ORDERABLE = new Set(['id', 'createdAt', 'updatedAt', 'dueDate', 'priority', 'status']);

@Injectable()
export class TaskRepository {
  constructor(@InjectRepository(Task) private model: Repository<Task>) {}

  async create(data: DeepPartial<Task>): Promise<Task> {
    return await this.model.save(data);
  }

  async findAllAndCount(dto: GetTaskDto): Promise<GetTaskResponse> {
    const {
      search,
      status,
      priority,
      assigneeId,
      page = 1,
      pageSize = 10,
      sort = 'id',
      direction = 'desc',
    } = dto;

    const qb = this.model
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.assignee', 'assignee');

    qb.where('1=1');

    if (search?.trim()) {
      const q = `%${search.trim().toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(t.title) LIKE :q OR LOWER(t.description) LIKE :q)',
        { q },
      );
    }

    if (status) qb.andWhere('t.status = :status', { status });
    if (priority) qb.andWhere('t.priority = :priority', { priority });
    if (assigneeId) qb.andWhere('t.assigneeId = :assigneeId', { assigneeId });

    const dir = direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const column = ORDERABLE.has(sort) ? sort : 'id';
    qb.orderBy(`t.${column}`, dir);
    
    qb.skip((page - 1) * pageSize).take(pageSize);

    const [data, count] = await qb.getManyAndCount();
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
