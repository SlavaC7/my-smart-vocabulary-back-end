import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { QuizItemMode } from '../enum/mode';
import { EWordType } from 'src/words/enum/type';
import { Answer, AnswerSchema } from './answer.entity';
import { Types } from 'mongoose';

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
export const QuizItemSchema = SchemaFactory.createForClass(QuizItem);
