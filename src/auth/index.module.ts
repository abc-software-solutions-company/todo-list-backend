import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './index.controler';
import { AuthService } from './index.service';
import { jwtConstants } from '../utils/constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from 'src/database/user/index.module';

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtModule, JwtStrategy],
})
export class AuthModule {}
