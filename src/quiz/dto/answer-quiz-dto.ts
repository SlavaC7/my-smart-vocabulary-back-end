import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { QuizItemMode } from '../enum/mode';

export class AnswerQuizDto {
  @ApiProperty({
    description: 'id ответа пользователя',
    example: 'string',
  })
  @IsOptional()
  @IsString()
  answerId: string;

  @ApiProperty({
    description: 'Письменный ответ',
    example: 'string',
  })
  @IsOptional()
  @IsString()
  answerText: string;

  @ApiProperty({
    description: 'id вопроса (карточки) типа match',
    example: 'string',
  })
  @IsString()
  questionId: string;

  @ApiProperty({
    description: 'Корректный ли ответ',
    example: 'string',
  })
  @IsBoolean()
  isCorrect: boolean;

  @ApiProperty({
    description: 'id слова',
    example: 'string',
  })
  @IsString()
  wordId: string;

  @ApiProperty({
    description: 'Мод теста',
    example: QuizItemMode.match,
    default: QuizItemMode.match,
  })
  mode: QuizItemMode;
}
