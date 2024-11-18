import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ApiTags } from '@nestjs/swagger';
import { Pagination } from 'src/common/pagination/pagination.dto';
import {
  ApiFile,
  ApiFileFields,
  ApiFiles,
} from 'src/common/decorator/file.decorator';
import { MulterUtils, UploadTypesEnum } from 'src/common/utils/multer.utils';
import { FileTypes, ImagePath } from 'src/common/enum';

@Controller('services')
@ApiTags('Services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}
  @Post()
  @ApiFileFields(
    [
      {
        name: 'thumbnail',
      },
      {
        name: 'images',
        maxCount: 5,
      },
    ],
    FileTypes.IMAGE,
    MulterUtils.getConfig(UploadTypesEnum.IMAGES, ImagePath.CARD_SERVICE),
  )
  create(
    @Body() createServiceDto: CreateServiceDto,
    @UploadedFiles()
    uploadsImages: {
      thumbnail: Express.Multer.File;
      images: Express.Multer.File[];
    },
  ) {
    return this.servicesService.create(
      createServiceDto,
      uploadsImages.images,
      uploadsImages.thumbnail[0],
    );
  }
  @Get(':path')
  async findOneByPath(@Param('path') path: string) {
   
    return await this.servicesService.findBySlug(path);
  }
  @Get()
  findAll(@Query() pagination: Pagination) {
    return this.servicesService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.servicesService.findOneRelation(id);
  }



  @Put(':id')
  @ApiFileFields(
    [
      {
        name: 'thumbnail',
      },
      {
        name: 'images',
        maxCount: 5,
      },
    ],
    FileTypes.IMAGE,
    MulterUtils.getConfig(UploadTypesEnum.IMAGES, ImagePath.CARD_SERVICE),
  )
  update(
    @Param('id') id: number,
    @Body() updateServiceDto: UpdateServiceDto,
    @UploadedFiles()
    uploadsImages: {
      thumbnail?: Express.Multer.File;
      images?: Express.Multer.File[];
    },
  ) {
    return this.servicesService.update(
      id,
      updateServiceDto,
      uploadsImages?.images,
      uploadsImages?.thumbnail ? uploadsImages?.thumbnail[0] : null,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.servicesService.remove(id);
  }
}
