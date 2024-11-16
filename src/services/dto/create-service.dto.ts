import { ApiProperty } from "@nestjs/swagger";

export class CreateServiceDto {
    @ApiProperty({ example: 'Service Name', description: 'Name of the service' })
    name: string;
  
    @ApiProperty({ example: 1, description: 'Category ID for the service' })
    categoryId: number;
    @ApiProperty({ example: 1, description: 'Nhà cunng cấp dịch vụ' })
    providerId: number;
    @ApiProperty({ example: '/path/to/service', description: 'Path of the service' })
    path: string;
    @ApiProperty({
      example: 'Description of the service',
      description: 'description of the service',
      nullable: true,
    })
    description?: string;
  
    @ApiProperty({
      example: 'https://example.com/thumbnail.jpg',
      description: 'Thumbnail image URL for the service',
      nullable: true,
    })
    thumbnail?: string;
  
    @ApiProperty({
      example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
      description: 'Array of image URLs for the service',
      nullable: true,
    })
    images?: string[];
}
