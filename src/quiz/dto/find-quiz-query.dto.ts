import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn, IsInt, Min, IsEnum } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { QuizStatus } from '../enum/status';

export class FindQuizQueryDto {
  @ApiPropertyOptional({
    description: 'Статус теста',
    example: QuizStatus.in_progress,
  })
  @IsOptional()
  @IsEnum(QuizStatus, { each: true })
  status?: QuizStatus;

  @ApiPropertyOptional({
    description: 'Поле сортировки (например: createdAt, word)',
    example: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Направление сортировки: 1 = ASC, -1 = DESC',
    example: -1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsIn([-1, 1])
  order: number = -1;

  @ApiPropertyOptional({ description: 'Пропустить N элементов', example: 0 })
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => (value === undefined ? 0 : Number(value)))
  @IsInt()
  @Min(0)
  skip: number = 0;

  @ApiPropertyOptional({
    description: 'Количество элементов на страницу',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => (value === undefined ? 10 : Number(value)))
  @IsInt()
  @Min(1)
  limit: number = 10;
}
