import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginDTO } from '../dto/login.dto';
import { User } from 'src/common/entities/User.entity';
import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // Sử dụng email thay vì username
      passReqToCallback: true, // Cho phép truyền toàn bộ request (bao gồm DTO)
    });
  }

  async validate(req: Request, email: string, password: string): Promise<User> {
    const loginDto: LoginDTO = req.body as LoginDTO;

    Logger.debug(`Validating user: ${JSON.stringify(loginDto)}`);

    // Gọi AuthService để xác thực
    const user = await this.authService.validateUser(loginDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
