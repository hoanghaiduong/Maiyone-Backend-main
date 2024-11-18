import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'Tiêu đề của bài viết',
    example: 'Hướng dẫn sử dụng dịch vụ',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Mô tả ngắn về bài viết',
    example: 'Bài viết hướng dẫn cách sử dụng dịch vụ của chúng tôi.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Nội dung chính của bài viết',
    example: 'Chi tiết nội dung hướng dẫn...',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: 'ID của danh mục',
    example: 1,
  })
  @IsOptional()
  categoryId?: number;

  @ApiPropertyOptional({
    description: 'ID của dịch vụ liên quan',
    example: 1,
  })
  @IsOptional()
  serviceId?: number;

  @ApiPropertyOptional({
    description: 'ID của nhà cung cấp liên quan',
    example: 1,
  })
  @IsOptional()
  providerId?: number;
}
