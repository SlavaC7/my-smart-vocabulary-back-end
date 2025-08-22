import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class AnswerQuizDto {
  @ApiPropertyOptional({
    description: 'id ответа пользователя',
    example: 'string',
  })
  @IsString()
  answerId: string;

  @ApiPropertyOptional({
    description: 'id вопроса (карточки) типа match',
    example: 'string',
  })
  @IsString()
  questionId: string;

  @ApiPropertyOptional({
    description: 'Корректный ли ответ',
    example: 'string',
  })
  @IsBoolean()
  isCorrect: boolean;
}
