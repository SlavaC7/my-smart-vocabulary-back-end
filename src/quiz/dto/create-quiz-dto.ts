import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { EWordType } from 'src/words/enum/type';
import { QuizItemMode } from '../enum/mode';

export class QuizConfigDto {
  @ApiPropertyOptional({
    description: 'Кол-во вопросов в тесте',
    example: 10,
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @IsNumber()
  count: number;

  @ApiPropertyOptional({
    description: 'Фильтрация по папкам',
    example: ['folder1', 'folder2'],
  })
  @IsArray()
  @IsString({ each: true }) // каждый элемент должен быть строкой
  folders?: string[];

  @ApiPropertyOptional({
    description: 'Типы слов',
    example: [EWordType.word, EWordType.phrase],
  })
  @IsArray()
  @IsEnum(EWordType, { each: true }) // каждый элемент должен быть енамом
  type?: EWordType[];

  @ApiPropertyOptional({
    description: 'Языки для теста',
    example: ['EN', 'IT'],
  })
  @IsArray()
  @IsString({ each: true }) // каждый элемент строка
  lang?: string[];

  @ApiPropertyOptional({
    description: 'Слабые слова',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  weakWords?: boolean;

  @ApiPropertyOptional({
    description: 'Слова старше чем ...',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsString()
  olderThan?: string;

  @ApiPropertyOptional({
    description: 'Режимы теста',
    example: [QuizItemMode.match],
    default: [QuizItemMode.match],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(QuizItemMode, { each: true }) // массив енамов
  mode?: QuizItemMode[];
}
