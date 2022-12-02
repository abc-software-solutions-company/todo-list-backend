import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttachmentModule } from 'src/database/attachment/index.module';
import { CommentModule } from 'src/database/comment/index.module';
import { PoolModule } from 'src/database/pool/index.module';
import { AuthModule } from 'src/auth/index.module';
import { UserModule } from 'src/database/user/index.module';
import { TodolistModule } from 'src/database/todolist/index.module';
import { FavoriteModule } from 'src/database/favorite/index.module';
import { StatusModule } from 'src/database/status/index.module';
import { TaskModule } from 'src/database/task/index.module';
import { TaskUserModule } from 'src/database/task-user/index.module';
import { TodolistUserModule } from 'src/database/todolist-user/index.module';
import { SocketsModule } from 'src/websocket/socket.module';
import * as dotenv from 'dotenv';
import { User } from 'src/database/user/index.entity';
import { Attachment } from 'src/database/attachment/index.entity';
import { Comment } from 'src/database/comment/index.entity';
import { Favorite } from 'src/database/favorite/index.entity';
import { Pool } from 'src/database/pool/index.entity';
import { Status } from 'src/database/status/index.entity';
import { Task } from 'src/database/task/index.entity';
import { TaskUser } from 'src/database/task-user/index.entity';
import { Todolist } from 'src/database/todolist/index.entity';
import { TodolistUser } from 'src/database/todolist-user/index.entity';

export function testHelper() {
  dotenv.config();
  const testingModuleBuilder = Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        schema: process.env.DATABASE_SCHEMA,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        port: parseInt(process.env.DATABASE_PORT),
        entities: [Attachment, Comment, Favorite, Pool, Status, Task, TaskUser, Todolist, TodolistUser, User],
        synchronize: true,
      }),
      AttachmentModule,
      CommentModule,
      PoolModule,
      AuthModule,
      UserModule,
      TodolistModule,
      FavoriteModule,
      StatusModule,
      TaskModule,
      TaskUserModule,
      TodolistUserModule,
      SocketsModule,
    ],
  });
  return testingModuleBuilder.compile();
}
