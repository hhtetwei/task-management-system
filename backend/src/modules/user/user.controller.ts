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
  import { ChangeUserPasswordDto, User, UserUseCase } from '.';
  import { GetUsersDto } from './dto/get-users.dto';
  import { CreateUserDto } from './dto/create-user.dto';
  import { UpdateUserDto } from './dto/update-user.dto';
  import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ValidateFiles } from '@/validators';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorators';
  
  @Controller('users')
  export class UserController {
    constructor(private readonly userUseCase: UserUseCase) {}
  
    @Get()
    async getAllUsers(@Query() query: GetUsersDto) {
      return await this.userUseCase.getAllUsers(query);
    }
  
    @Get(':id')
    async getUserById(@Param('id') id: number) {
      return await this.userUseCase.getUserById(id);
    }
  
    @Post()
    @UseInterceptors(
      FileFieldsInterceptor([{ name: 'profileImage', maxCount: 1 }]),
    )
    async createUser(
      @Body() data: CreateUserDto,
      @UploadedFiles()
      @ValidateFiles({
        profileImage: {
          required: false,
          maxSize: 1024 * 1024, // 1 MB for each image
          allowedTypes: ['jpeg', 'jpg', 'png'],
        },
      })
      {
        profileImage,
      }: {
        profileImage: Express.Multer.File[];
      },
    ) {
      return await this.userUseCase.createUser({
        ...data,
        profileImage: profileImage?.[0],
      });
    }
  
    @Patch(':id')
    async updateUser(
      @Param('id') id: number,
      @Body() data: Partial<UpdateUserDto>,
      @Req() req: Request,
    ) {
      const updatedUser = await this.userUseCase.updateUser(id, data);
      const currentUser = (req as any).user;
  
      if (updatedUser && currentUser && currentUser.id === updatedUser.id) {
        (req as any).session.user = updatedUser;
      }
  
      return updatedUser;
    }
  
    @Patch('password/me')
    async updateUserPassword(
      @GetCurrentUser() user: User,
      @Body() data: ChangeUserPasswordDto,
    ) {
      return await this.userUseCase.updateUserPassword(user.id, data);
    }
  
    @Delete(':id')
    async deleteUser(@Param() { id }: { id: number }) {
      return await this.userUseCase.deleteUser(id);
    }
  }
  