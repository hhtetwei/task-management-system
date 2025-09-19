import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { User } from './user.entity';
import { SharedModule } from '../shared';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserUseCase } from './user.use-case';
import { UserRepository } from './user.repository';


@Module({
    imports: [TypeOrmModule.forFeature([User]), SharedModule],
    controllers: [UserController],
    providers: [UserUseCase, UserService, UserRepository],
    exports: [UserService, UserRepository],
})
export class UserModule {}
