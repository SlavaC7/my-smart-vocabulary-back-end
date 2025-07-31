import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @ApiHideProperty()
  uid: string;
}
