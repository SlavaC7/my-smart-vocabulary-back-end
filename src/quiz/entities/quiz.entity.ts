// src/quiz/entities/quiz.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { QuizStatus } from '../enum/status';
import { QuizItem, QuizItemSchema } from './quiz-item.entity';
import { UserAnswer, UserAnswerSchema } from './user-answer.entity';
import { QuizConfigSchema } from './quiz-config.entity';
import { QuizConfigDto } from '../dto/create-quiz-dto';
//разнести в разные файлы
export type QuizDocument = HydratedDocument<Quiz>;

@Schema({
  versionKey: false,
  timestamps: { createdAt: true, updatedAt: true },
})
export class Quiz {
  @Prop({ required: true, index: true, trim: true })
  ownerUid: string;

  @Prop({
    type: [QuizItemSchema],
    required: true,
    default: [],
    validate: {
      validator: (v: any[]) => !v || v.length <= 50,
      message: 'Quiz size must be ≤ 50 items',
    },
  })
  quiz: QuizItem[];

  @Prop({ type: [UserAnswerSchema], default: [] })
  userAnswers: UserAnswer[];

  @Prop({ type: Number, default: 0 })
  correct: number;

  @Prop({ type: Number, default: 0 })
  incorrect: number;

  @Prop({
    required: true,
    enum: QuizStatus,
    index: true,
    default: QuizStatus.in_progress,
  })
  status: QuizStatus;

  @Prop({ type: Date })
  completedAt?: Date;

  @Prop({ type: Date })
  canceledAt?: Date;

  @Prop({ type: Number })
  duration?: number;

  @Prop({ type: QuizConfigSchema, required: true })
  config: QuizConfigDto;
}
export const QuizSchema = SchemaFactory.createForClass(Quiz);
