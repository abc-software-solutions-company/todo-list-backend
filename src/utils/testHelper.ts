import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from 'src/configs/database.config';
import appConfig from 'src/configs/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from 'src/database/typeorm-config.service';
import { DataSource } from 'typeorm';
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

export function testHelper() {
  const testingModuleBuilder = Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        load: [databaseConfig, appConfig],
        envFilePath: ['.env'],
      }),
      TypeOrmModule.forRootAsync({
        useClass: TypeOrmConfigService,
        dataSourceFactory: async (options) => {
          const dataSource = await new DataSource(options).initialize();
          return dataSource;
        },
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
