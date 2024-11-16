import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { AuthUser } from './common/decorator/user.decorator';
import { Roles } from './common/decorator/role.decorator';
import { ERole } from './common/enum/ERole';
import { RolesGuard } from './auth/guard/role-auth.guard';

@Controller()
@ApiTags("TEST")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Roles(ERole.GUEST)
  @UseGuards(JwtAuthGuard)
  @Get()
  getHello(@AuthUser() user:any): string {
    return user;
  }
}
