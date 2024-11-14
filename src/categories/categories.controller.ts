import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { CategoriesService } from './categories.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('categories')
@ApiTags("Categories")
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll(@Query() pagination: Pagination) {
    return this.categoryService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.categoryService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.categoryService.remove(id);
  }
}