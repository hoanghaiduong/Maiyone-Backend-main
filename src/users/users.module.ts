import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/common/entities/User.entity';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/common/entities/Role.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User,Role])],
  providers: [UsersService,RolesService],
  controllers: [UsersController],
  exports:[UsersService]
})
export class UsersModule {}
