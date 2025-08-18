import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FindFoldersQueryDto {
  @ApiHideProperty()
  @IsOptional()
  @IsString()
  ownerUid: string;

  @ApiPropertyOptional({ description: 'Поиск по тексту', example: 'hello' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Пропустить N слов', example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  skip?: number = 0;

  @ApiPropertyOptional({
    description: 'Количество слов на страницу',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(10)
  limit?: number = 10;
}
