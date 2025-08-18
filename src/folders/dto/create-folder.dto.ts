import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateFolderDto {
  @ApiProperty({ description: 'Текст слова или фразы', example: 'hello' })
  @IsString()
  name: string;

  @IsOptional()
  @ApiHideProperty()
  ownerUid: string;

  @IsOptional()
  @ApiHideProperty()
  count: number;
}
