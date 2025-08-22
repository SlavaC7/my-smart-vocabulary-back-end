// src/quiz/entities/quiz.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { EWordType } from 'src/words/enum/type';
import { QuizStatus } from '../enum/status';
import { QuizItemMode } from '../enum/mode';

export type QuizDocument = HydratedDocument<Quiz>;

@Schema({ _id: false, versionKey: false })
export class Answer {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true, trim: true })
  text: string;

  @Prop({ required: true })
  isCorrect: boolean;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);

@Schema({ _id: false, versionKey: false })
export class QuizItem {
  @Prop({ required: true })
  id: string;

  // если слово удалено — будет null
  @Prop({ type: Types.ObjectId, ref: 'Words', default: null })
  wordId: Types.ObjectId | null;

  // снапшот текста слова на момент теста
  @Prop({ required: true, trim: true })
  word: string;

  @Prop({ type: [AnswerSchema], required: true, default: [] })
  answers: Answer[];

  @Prop({ required: true, trim: true })
  flag: string;

  @Prop({ required: true, enum: Object.values(EWordType) })
  type: EWordType;

  @Prop({
    required: true,
    enum: QuizItemMode,
    default: QuizItemMode.match,
  })
  mode: QuizItemMode;
}
export const TestItemSchema = SchemaFactory.createForClass(QuizItem);

@Schema({ _id: false, versionKey: false })
export class UserAnswer {
  @Prop({ type: String, required: true })
  questionId: string;

  @Prop({ type: String, required: true })
  answerId: string;

  @Prop({ required: true })
  isCorrect: boolean;

  @Prop({ type: Date, required: true })
  answeredAt: Date;
}
export const UserAnswerSchema = SchemaFactory.createForClass(UserAnswer);

@Schema({ _id: false, versionKey: false })
export class QuizConfig {
  @Prop({ type: Number, required: true, min: 5, max: 50 })
  count: number;

  // фильтр по папкам
  @Prop({ type: [Types.ObjectId], ref: 'Folder', default: [] })
  folders?: Types.ObjectId[];

  // фильтр по типу слова
  @Prop({ type: [String], enum: Object.values(EWordType), default: [] })
  type?: EWordType[];

  // коды языков (например, 'en', 'it', 'ru' и т.д.)
  @Prop({ type: [String], default: [] })
  lang?: string[];

  // "слабые слова" (incorrect > correct)
  @Prop({ type: Boolean, default: false })
  weakWords?: boolean;

  // "старые слова" — взять слова, созданные ДО этой даты
  @Prop({ type: Date, required: false })
  olderThan?: Date;

  @Prop({
    required: false,
    enum: QuizItemMode,
    default: QuizItemMode.match,
  })
  mode?: QuizItemMode;
}
export const QuizConfigSchema = SchemaFactory.createForClass(QuizConfig);

@Schema({
  versionKey: false,
  timestamps: { createdAt: true, updatedAt: true },
})
export class Quiz {
  @Prop({ required: true, index: true, trim: true })
  ownerUid: string;

  @Prop({
    type: [TestItemSchema],
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
  config: QuizConfig;
}
export const QuizSchema = SchemaFactory.createForClass(Quiz);
