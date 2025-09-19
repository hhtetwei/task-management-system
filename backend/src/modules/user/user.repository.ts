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

import { GetUsersDto } from './dto/get-users.dto';
import { User } from './user.entity';
import { GetUsersResponse, UserType } from './types';

@Injectable()
export class UserRepository {
  constructor(@InjectRepository(User) private model: Repository<User>) {}

  async create(data: DeepPartial<User>): Promise<User> {
    return await this.model.save(data);
  }

  async findAllAdmins(): Promise<User[]> {
    return this.model.find({ where: { type: UserType.ADMIN } });
  }

  async insertMany(
    data: DeepPartial<User>[],
    manager?: EntityManager,
  ): Promise<void> {
    if (manager) {
      await manager.insert(User, data);
    } else {
      await this.model.insert(data);
    }
  }

  async findAllAndCount({
    search,
    limit,
    skip,
    sort,
  }: GetUsersDto): Promise<GetUsersResponse> {
    const where: FindManyOptions<User>['where'] = [];

    if (search) {
      where.push({
        name: ILike(`%${search}%`),
      });
    }

    const [data, count] = await this.model.findAndCount({
      where,
      take: limit,
      skip,
      order: {
        [sort ?? 'id']: 'desc',
      },
    });

    return { data, count };
  }

  async findById(id: number): Promise<User | null> {
    return await this.findOne({ id });
  }

  async findOne(filter: FindOneOptions<User>['where']): Promise<User | null> {
    return await this.model.findOne({
      where: filter,
    });
  }

  async updateById(id: number, data: DeepPartial<User>): Promise<User | null> {
    await this.model.update(id, data);
    return this.findById(id);
  }

  async deleteById(id: number): Promise<void> {
    await this.model.softDelete(id);
  }
}
