import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Note } from 'src/common/decorator/description.decorator';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDTO } from './dto/login.dto';
import { AuthUser } from 'src/common/decorator/user.decorator';
import { RefreshAuthGuard } from './guard/refresh-auth.guard';
import { User } from 'src/common/entities/User.entity';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenModel } from './model/token.model';
import { CreateUserDto } from 'src/users/dto/CreateUser.dto';

@Controller('auth')
@ApiTags("Auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Note('Đăng nhập')
  @ApiBody({
    type: LoginDTO,
    examples: {
      ADMIN: {
        value: {
          email: 'user@example.com',
          username: 'john_doe',
          password: 'password123',
        } as LoginDTO,
      },
    //   Provider: {
    //     value: {
    //       email: 'provider@example.com',
    //       username: 'provider',
    //       password: '123456',
    //     } as LoginDTO,
    //   },
    //   USER: {
    //     value: {
    //       email: 'user@example.com',
    //       username: 'user',
    //       password: '123456',
    //     } as LoginDTO,
    //   },
    },
  })
  @Post('login')
  async login(@Body() dto: LoginDTO, @AuthUser() user: User) {
    return this.authService.login(user);
  }

  @Post('register')
  @Note('Đăng ký')
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @Post('refresh-tokens')
  @Note('Lấy lại token mới khi hết hạn')
  @UseGuards(RefreshAuthGuard)
  async refreshTokens(
    @AuthUser() myUser: User,
    @Body() dto: RefreshTokenDto,
  ): Promise<TokenModel> {
    return this.authService.refreshToken(myUser);
  }
}
