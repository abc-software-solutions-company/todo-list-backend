import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import appConfig from './configs/app.config';
import databaseConfig from './configs/database.config';
import { FavoriteModule } from './database/favorite/favorite.module';
import { PoolModule } from './database/pool/pool.module';
import { StatusModule } from './database/status/status.module';
import { TasksModule } from './database/task/task.module';
import { TodolistModule } from './database/todolist/todolist.module';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { UsersModule } from './database/user/users.module';
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
    PoolModule,
    AuthModule,
    UsersModule,
    TodolistModule,
    FavoriteModule,
    StatusModule,
    TasksModule,
    SocketsModule,
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
