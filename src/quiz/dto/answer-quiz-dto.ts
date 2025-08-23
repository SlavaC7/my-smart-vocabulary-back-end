import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class AnswerQuizDto {
  @ApiProperty({
    description: 'id ответа пользователя',
    example: 'string',
  })
  @IsString()
  answerId: string;

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
}
