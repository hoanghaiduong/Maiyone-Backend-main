import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProviderDto {
  @ApiProperty({
    description: 'The new name of the provider',
    example: 'Updated Tech Solutions Co.',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'The updated description of the provider',
    example: 'Updated description for the provider.',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'The updated URL or path to the provider logo',
    example: 'https://example.com/new-logo.png',
    required: false,
  })
  logo?: string;
}