import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './CreateUser.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password'] as const),
) {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email of the user',
    nullable: true,
  })
  email?: string;

  @ApiProperty({
    example: '0987654321',
    description: 'Phone number of the user',
    nullable: true,
  })
  phoneNumber?: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'Username of the user',
    nullable: true,
  })
  username?: string;

  @ApiProperty({
    type: 'string',
    format:'binary',
    nullable: true,
    required:false
  })
  avatar?: string;

  @ApiProperty({
    example: false,
    description: 'Indicates if the user is locked',
    nullable: true,
  })
  isLocked?: boolean;

}
