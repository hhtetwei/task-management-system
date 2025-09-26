import { Injectable } from '@nestjs/common';
import { GetUsersDto } from './dto/get-users.dto';
import { PasswordService } from '../shared';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersResponse, UserType } from './types';
import { User } from './user.entity';
import { duplicateUserError } from './user.error';
import { UserRepository } from './user.repository';
import { CloudinaryService } from '../shared/clodinary.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly cloudinary: CloudinaryService,
  ) {}


  async createUser(
    data: CreateUserDto & {
      profileImage?: Express.Multer.File
      type?: UserType;
    },
  ): Promise<User> {
    const user = await this.getUserByEmail(data.email);
    if (user) throw duplicateUserError;

    const { hashed, salt } = await this.passwordService.hash(data.password);

    let profileImage = null;
    if (data.profileImage) {
      profileImage = await this.cloudinary.uploadFile(
        data.profileImage,
        'profile_images',
      );
    }

    return await this.userRepository.create({
      ...data,
      password: hashed,
      salt,
      profileImage,
    });
  }

  async getAllAdmins(): Promise<User[]> {
    return this.userRepository.findAllAdmins();
  }

  async insertUsers(data: CreateUserDto[]): Promise<void> {
    const users = [];
    for (let i = 0; i < data.length; i++) {
      const user = data[i];
      const { hashed, salt } = await this.passwordService.hash(user.password);
      users.push({
        ...user,
        password: hashed,
        salt,
      });
    }
    return await this.userRepository.insertMany(users);
  }

  async getAllUsers(query: GetUsersDto): Promise<GetUsersResponse> {
    return await this.userRepository.findAllAndCount(query);
  }

  async getUserById(id: number): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ email });
  }

  async updateUser(
    id: number,
    {
      profileImage,
      ...data
    }: Omit<Partial<User>, 'profileImage'> & {
      profileImage?: Express.Multer.File;
    },
  ): Promise<User | null> {
    if (profileImage) {
      const image = await this.cloudinary.uploadFile(profileImage, 'profile_images');
      Object.assign(data, { profileImage: image });
    }
    return await this.userRepository.updateById(id, data);
  }

  async deleteUser(id: number): Promise<void> {
    return await this.userRepository.deleteById(id);
  }
}
