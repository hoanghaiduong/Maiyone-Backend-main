import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags("Users Management")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  async findAll(@Query() pagination: Pagination) {
    return await this.usersService.findAll(pagination);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }
  
}
