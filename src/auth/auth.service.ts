import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/common/entities/User.entity';
import { IJwtPayload } from 'src/common/interfaces';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import { ApiException } from 'src/common/exceptions/api.exception';
import { ErrorMessages } from 'src/common/exceptions/error.code';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants';
import { TokenModel } from './model/token.model';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}
  async login(user: User) {
    const model = await this.getTokens(user);
    return {
      user,
      ...model,
    };
  }
  async refreshToken(myUser: User): Promise<any> {
    return await this.getAccessToken(myUser);
  }
  private async getAccessToken(user: User): Promise<TokenModel> {
    const payload: IJwtPayload = {
      email: user.email,
      id: user.id,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return new TokenModel(accessToken);
  }
  private async getTokens(user: User): Promise<TokenModel> {
    const payload: IJwtPayload = {
      email: user.email,
      id: user.id,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: jwtConstants._refresh_secret,
        expiresIn: 1000 * 60 * 60 * 24 * 7, // 7 days
      }),
    ]);
    return new TokenModel(accessToken, refreshToken);
  }
  async validateJwt(payload: IJwtPayload): Promise<User> {
    const user = await this.userService.getUserById(payload.id);
    if (!user) throw new UnauthorizedException('User not found');
    if (user.isLocked) throw new UnauthorizedException('User is blocked');
    return user;
  }
  // async validateUser(username: string, password: string): Promise<User | null> {
  //   Logger.debug("tiên")
  //   const user = await this.userService.getUserByField('username', username);
  //   if (user && (await bcrypt.compare(password, user.password))) {
  //     return user;
  //   }
  //   return null;
  // }
  async validateUser(loginDto: LoginDTO): Promise<any> {
    Logger.debug('testing', loginDto);
    const { username, email, password } = loginDto;

    // Check if user exists by username or email
    const user = await this.userService.getUserByField('email', email);

    if (!user) {
      throw new ApiException(
        ErrorMessages.USER_NOT_FOUND,
        username ? 'Username is not correct' : 'Email is not correct',
      );
    }
    if (user.username !== username) {
      throw new ApiException(
        ErrorMessages.USER_NOT_FOUND,
        'Username is not correct',
      );
    }
    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiException(
        ErrorMessages.USER_NOT_FOUND,
        'Password is not correct',
      );
    }

    return user;
  }
  async validateUserRefreshToken(
    id: string,
    refreshToken: string,
  ): Promise<void> {
    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: jwtConstants._refresh_secret,
      });
    } catch (e) {
      switch (e.name) {
        case 'TokenExpiredError':
          throw new ApiException(ErrorMessages.REFRESH_TOKEN_EXPIRED);
        case 'JsonWebTokenError':
          throw new ApiException(ErrorMessages.REFRESH_TOKEN_INVALID);
        default:
          throw new UnauthorizedException();
      }
    }
  }
}
