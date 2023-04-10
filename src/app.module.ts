import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/index.module';
import appConfig from './configs/app.config';
import databaseConfig from './configs/database.config';
import { AttachmentModule } from './database/attachment/index.module';
import { CommentModule } from './database/comment/index.module';
import { DocumentModule } from './database/document/index.module';
import { FavoriteModule } from './database/favorite/index.module';
import { NotificationModule } from './database/notification/index.module';
import { PoolModule } from './database/pool/index.module';
import { StatusModule } from './database/status/index.module';
import { TaskUserModule } from './database/task-user/index.module';
import { TaskModule } from './database/task/index.module';
import { TodolistUserModule } from './database/todolist-user/index.module';
import { TodolistModule } from './database/todolist/index.module';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { UserModule } from './database/user/index.module';
import { AllExceptionsFilter } from './utils/all-exception.filter';
import { LoggerMiddleware } from './utils/logger.middleware';
import { SocketsModule } from './websocket/socket.module';

@Module({
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
    ThrottlerModule.forRoot({
      ttl: 30,
      limit: 100,
    }),
    AttachmentModule,
    CommentModule,
    PoolModule,
    AuthModule,
    UserModule,
    TodolistModule,
    FavoriteModule,
    NotificationModule,
    StatusModule,
    TaskModule,
    TaskUserModule,
    TodolistUserModule,
    SocketsModule,
    DocumentModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
