import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { TasksModule } from "./task/task.module";
import { User } from "./users/entities/user.entity";
import { Task } from "./task/entities/task.entity";
import { Todolist } from "./todolist/entities/todolist.entity";
import { TodolistModule } from "./todolist/todolist.module";
import 'dotenv/config'
import { AppGateway } from './websocket/app.gateway';
import { UuidstorageModule } from './uuidstorage/uuidstorage.module';
import { Uuidstorage } from './uuidstorage/entities/uuidstorage.entity';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controler';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './utils/all-exception.filter';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DATABASE,
      schema: process.env.POSTGRES_SCHEMA,
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      port: process.env.POSTGRES_PORT,
      entities: [User, Task, Todolist,Uuidstorage],
      synchronize: true,
      // dropSchema: true
    }),
    UsersModule,
    TasksModule,
    AuthModule,
    TodolistModule,
    UuidstorageModule,
  ],
  controllers: [ AuthController],
  providers: [AppGateway, {
    provide: APP_FILTER,
    useClass: AllExceptionsFilter
  }],
})
export class AppModule {}
