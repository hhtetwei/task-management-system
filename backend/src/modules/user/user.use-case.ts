import { Injectable } from '@nestjs/common';
import { GetUsersDto } from './dto/get-users.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordService } from '../shared';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { GetUsersResponse } from './types';
import { ChangeUserPasswordDto } from './dto';
import { notFoundUserError } from './user.error';
import { UserService } from './user.service';



@Injectable()
export class UserUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
  ) {}

  async createUser(
    data: CreateUserDto & { profileImage: Express.Multer.File },
  ): Promise<User> {
    return await this.userService.createUser(data);
  }

  async getAllUsers(query: GetUsersDto): Promise<GetUsersResponse> {
    return await this.userService.getAllUsers(query);
  }

  async getUserById(id: number): Promise<User | null> {
    const data = await this.userService.getUserById(id);
    if (!data) throw notFoundUserError;
    return data;
  }

  async updateUser(
    id: number,
    data: Partial<UpdateUserDto>,
  ): Promise<User | null> {
    await this.getUserById(id);
    return await this.userService.updateUser(id, data);
  }

  async updateUserPassword(
    id: number,
    data: ChangeUserPasswordDto,
  ): Promise<User | null> {
    await this.getUserById(id);
    const { hashed, salt } = await this.passwordService.hash(data.password);
    return await this.userService.updateUser(id, { password: hashed, salt });
  }

  async deleteUser(id: number): Promise<void> {
    await this.getUserById(id);
    return await this.userService.deleteUser(id);
  }
}
