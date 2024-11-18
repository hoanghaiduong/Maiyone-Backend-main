import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiFileFields } from 'src/common/decorator/file.decorator';
import { FileTypes, ImagePath } from 'src/common/enum';
import { MulterUtils, UploadTypesEnum } from 'src/common/utils/multer.utils';

@Controller('posts')
@ApiTags('Post')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
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
    MulterUtils.getConfig(UploadTypesEnum.IMAGES, ImagePath.CARD_POST),
  )
  @ApiOperation({ summary: 'Tạo mới bài viết' })
  @ApiResponse({ status: 201, description: 'Bài viết đã được tạo.' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ.' })
  async create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bài viết' })
  @ApiResponse({ status: 200, description: 'Danh sách bài viết.' })
  async findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết bài viết' })
  @ApiResponse({ status: 200, description: 'Chi tiết bài viết.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài viết.' })
  async findOne(@Param('id') id: number) {
    return this.postsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật bài viết' })
  @ApiResponse({ status: 200, description: 'Bài viết đã được cập nhật.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài viết.' })
  async update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa bài viết' })
  @ApiResponse({ status: 200, description: 'Bài viết đã được xóa.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài viết.' })
  async remove(@Param('id') id: number) {
    return this.postsService.remove(+id);
  }
}
