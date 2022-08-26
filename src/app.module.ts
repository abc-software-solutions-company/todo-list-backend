import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { TasksModule } from "./task/task.module";
import { User } from "./users/entities/user.entity";
import { Task } from "./task/entities/task.entity";
import { Todolist } from "./todolist/entities/todolist.entity";
import { TodolistModule } from "./todolist/todolist.module";
import 'dotenv/config'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DATABASE,
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      port: process.env.POSTGRES_PORT,
      entities: [User, Task, Todolist],
      synchronize: true,
      dropSchema: true
    }),
    UsersModule,
    TasksModule,
    TodolistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
