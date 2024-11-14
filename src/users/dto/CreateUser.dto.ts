import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 1, description: 'Role Id' })
  roleId: number;

  @ApiProperty({ example: 'user@example.com', description: 'Email of the user' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Password for the user', writeOnly: true })
  password: string;

  @ApiProperty({ example: '0987654321', description: 'Phone number of the user', nullable: true })
  phoneNumber?: string;

  @ApiProperty({ example: 'john_doe', description: 'Username of the user', nullable: true })
  username?: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', description: 'Avatar URL of the user', nullable: true })
  avatar?: string;

  @ApiProperty({ example: false, description: 'Indicates if the user is locked' })
  isLocked: boolean;

}

