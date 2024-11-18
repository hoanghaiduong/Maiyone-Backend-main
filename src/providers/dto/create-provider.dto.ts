import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProviderDto {
  @ApiProperty({
    description: 'The new name of the provider',
    example: 'Updated Tech Solutions Co.',
    required: true,
  })
  name: string;

  @ApiProperty({
    description: 'The updated description of the provider',
    example: 'Updated description for the provider.',
    required: false,
  })
  description?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  
  logo?: Express.Multer.File;
}
