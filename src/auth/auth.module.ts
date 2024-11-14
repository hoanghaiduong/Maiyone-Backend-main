import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { jwtConstants } from './constants';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/common/entities/User.entity';
import { JwtRefreshStrategy } from './strategy/jwt.refresh.strategy';
@Global()
@Module({
  imports:[
    UsersModule,
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
     
      useFactory: () => ({
        secret: jwtConstants._access_secret,
        signOptions: { expiresIn: '1y' },
      }),
    }),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy,JwtStrategy,JwtRefreshStrategy],
  exports:[AuthService]
})
export class AuthModule {}
