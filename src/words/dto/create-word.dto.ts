import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { EWordType } from '../enum/type';

export class CreateWordDto {
  @ApiProperty({ description: 'Текст слова или фразы', example: 'hello' })
  @IsString()
  word: string;

  @ApiProperty({
    description: 'Список переводов',
    example: ['привет', 'здравствуйте'],
    type: [String],
  })
  @IsArray()
  translations: string[];

  @ApiProperty({
    description: 'ID папки (опционально)',
    example: '66a1f26c7b16b2e43d834c92',
    required: false,
  })
  @IsOptional()
  @IsString()
  folderId?: Types.ObjectId | null;

  @ApiProperty({
    description: 'Тип слова',
    enum: EWordType,
    example: EWordType.word,
  })
  @IsEnum(EWordType)
  type: EWordType;

  @ApiProperty({
    description: 'Язык слова (код ISO)',
    example: 'en',
  })
  @IsString()
  lang: string;

  @ApiProperty({
    description: 'Флаг страны',
    example: '🇬🇧',
  })
  @IsString()
  flag: string;

  // For detect user
  @IsOptional()
  @ApiHideProperty()
  uid: string;

  @IsOptional()
  @ApiHideProperty()
  ownerUid: string;

  @IsOptional()
  @ApiHideProperty()
  createdAt: string;
}
