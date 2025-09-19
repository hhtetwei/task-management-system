import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { CloudinaryService } from './clodinary.service';

@Module({
  providers: [PasswordService, CloudinaryService],
  exports: [PasswordService, CloudinaryService],
  controllers: [],
})
export class SharedModule {}
