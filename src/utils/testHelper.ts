import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Task } from 'src/task/entities/task.entity';
import { TasksModule } from 'src/task/task.module';
import { Todolist } from 'src/todolist/entities/todolist.entity';
import { TodolistModule } from 'src/todolist/todolist.module';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { Uuidstorage } from 'src/uuidstorage/entities/uuidstorage.entity';
import { UuidstorageModule } from 'src/uuidstorage/uuidstorage.module';


export function testHelper() {
  const testingModuleBuilder = Test.createTestingModule({
    imports:[
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DATABASE,
        schema: process.env.POSTGRES_SCHEMA,
        username: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        port: parseInt(process.env.POSTGRES_PORT),
        entities: [User, Task, Todolist, Uuidstorage],
        synchronize: true
        // dropSchema: true
      }),
      UsersModule,
      TasksModule,
      AuthModule,
      TodolistModule,
      UuidstorageModule
    ],
  });
  return testingModuleBuilder.compile();
}
