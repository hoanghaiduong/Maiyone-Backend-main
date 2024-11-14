import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RolesService } from './roles.service';

import { ApiTags } from '@nestjs/swagger';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { Role } from 'src/common/entities/Role.entity';

@Controller('roles')
@ApiTags("Roles")
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

 
  @Get()
 async findAll(@Query() pagination:Pagination) :Promise<PaginationModel<Role>>{
    return await this.rolesService.findAll(pagination);
  }

  @Get(':id')
  async findOne(@Query('id') id: number) {
    return await this.rolesService.findOne(id);
  }

}
