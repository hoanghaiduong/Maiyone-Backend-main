import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class CreateCategoryDto {
 
  
  @ApiProperty({ example: 'Technology', description: 'Name of the category' })
  name: string;

  @ApiProperty({
    example: 'A category for technology-related services',
    description: 'Description of the category',
    nullable: true,
  })
  description?: string;

  @ApiProperty({ example: 'technology', description: 'Path of the category' })
  path: string;
}
