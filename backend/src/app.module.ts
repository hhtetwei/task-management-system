
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt.guard';

import { TaskModule } from './modules/task/task.module';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { dataSourceOptions } from './db/data-source';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env', 
      isGlobal: true,    
    }),
    TypeOrmModule.forRoot({ ...dataSourceOptions, autoLoadEntities: true,  synchronize: false }),
    UserModule,
    AuthModule,
    TaskModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,

  }, { provide: APP_GUARD, useClass: RolesGuard },AppService],
})
export class AppModule {}
