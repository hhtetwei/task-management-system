
import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  phoneNumber?: string;

  @MinLength(6)
  password: string;

  @IsOptional()
  profileImage?: Express.Multer.File;
}
