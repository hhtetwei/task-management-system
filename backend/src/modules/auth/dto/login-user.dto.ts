import {
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class LoginUserDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @IsString()
    @IsNotEmpty()
    password: string;
  
    @IsBoolean()
    @IsOptional()
    rememberMe = false;
  
    @IsString()
    @IsOptional()
    fcmToken: string;
  }
  