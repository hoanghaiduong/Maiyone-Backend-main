import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email of the user',
  })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password for the user',
    writeOnly: true,
  })
  password: string;

  @ApiProperty({
    example: '0987654321',
    description: 'Phone number of the user',
    nullable: true,
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'Username of the user',
    nullable: true,
    required: false,
  })
  username?: string;

  @ApiProperty({
    type:'string',
    format:'binary',
    nullable: true,
    required:false
  })
  avatar?: string;

  
}
