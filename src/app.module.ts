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
import { CatModule } from "./cat/cat.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      database: "postgres",
      username: "postgres",
      password: "thienlam",
      port: 5432,
      entities: [User, Task, Todolist],
      synchronize: true,
    }),
    UsersModule,
    TasksModule,
    TodolistModule,
    CatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
