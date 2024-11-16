import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ApiTags } from '@nestjs/swagger';
import { Pagination } from 'src/common/pagination/pagination.dto';

@Controller('services')
@ApiTags("Services")
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}
  @Post()
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  findAll(@Query() pagination: Pagination) {
    return this.servicesService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.servicesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.servicesService.remove(id);
  }
}
