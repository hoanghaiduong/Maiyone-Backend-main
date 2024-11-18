import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 'Service Name', description: 'Name of the service' })
  name: string;

  @ApiProperty({ example: 1, description: 'Category ID for the service' })
  categoryId: number;
  @ApiProperty({ example: 1, description: 'Nhà cunng cấp dịch vụ' })
  providerId: number;
  @ApiProperty({
    example: 'dich-vu-1',
    description: 'Path of the service',
  })
  path: string;
  @ApiProperty({
    example: 'Description of the service',
    description: 'description of the service',
    required: false,
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
   type:'string',
   format:'binary',
   required: false,
  })
  @IsOptional()
  thumbnail?: Express.Multer.File;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    required: false,
  })
  @IsOptional()
  images?: Express.Multer.File[];
}
