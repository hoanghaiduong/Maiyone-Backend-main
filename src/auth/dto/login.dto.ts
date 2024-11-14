import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({ nullable: false })
  email: string;
  @ApiProperty({ nullable: true })
  username?: string;
  @ApiProperty({ nullable: false })
  password: string;
}
