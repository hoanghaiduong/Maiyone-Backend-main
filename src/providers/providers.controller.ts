import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UploadedFile } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { ApiFile } from 'src/common/decorator/file.decorator';
import { FileTypes, ImagePath } from 'src/common/enum';
import { MulterUtils, UploadTypesEnum } from 'src/common/utils/multer.utils';

@Controller('providers')
@ApiTags("Providers")
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiFile(
    'logo',
    MulterUtils.getConfig(UploadTypesEnum.IMAGES, ImagePath.CARD_PROVIDER),
  )
  async create(@Body() createProviderDto: CreateProviderDto,@UploadedFile() logo:Express.Multer.File) {
    console.log(logo)
    return this.providersService.create(createProviderDto,logo);
  }

  @Get()
  async findAll(@Query() paginationDto: Pagination) {
    return this.providersService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.providersService.findOne(id);
  }
 
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiFile(
    'logo',
    MulterUtils.getConfig(UploadTypesEnum.IMAGES, ImagePath.CARD_PROVIDER),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProviderDto: UpdateProviderDto,
    @UploadedFile() logo:Express.Multer.File
  ) {
    return this.providersService.update(id, updateProviderDto,logo);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.providersService.remove(id);
  }
}
