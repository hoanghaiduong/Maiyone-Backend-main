import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorator/role.decorator';
import { ERole } from 'src/common/enum/ERole';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Note } from 'src/common/decorator/description.decorator';
import { User } from 'src/common/entities/User.entity';
import { ApiFile } from 'src/common/decorator/file.decorator';
import { MulterUtils, UploadTypesEnum } from 'src/common/utils/multer.utils';
import { ImagePath } from 'src/common/enum';
import { UpdateUserDto } from './dto/UpdateUser.dto';

@Controller('users')
@ApiTags("Users Management")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiFile(
    'avatar',
    MulterUtils.getConfig(UploadTypesEnum.IMAGES, ImagePath.CARD_USER),
  )
  async create(@Body() createUserDto: CreateUserDto,  @UploadedFile() avatar?: Express.Multer.File) {
    return this.usersService.createUser(createUserDto,avatar);
  }
  @Patch(':id')
  @ApiFile(
    'avatar',
    MulterUtils.getConfig(UploadTypesEnum.IMAGES, ImagePath.CARD_USER),
  )
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    return this.usersService.updateUser(id, updateUserDto, avatar);
  }
  @Get()
  async findAll(@Query() pagination: Pagination) {
    return await this.usersService.findAll(pagination);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.usersService.getUserById(id);
  }
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.usersService.deleteUser(id);
  }
}
