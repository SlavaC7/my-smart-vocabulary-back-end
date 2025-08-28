import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { EWordType } from 'src/words/enum/type';
import { QuizItemMode } from '../enum/mode';

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

  @Prop({ type: [String], enum: Object.values(QuizItemMode), default: [] })
  mode?: QuizItemMode[];
}
export const QuizConfigSchema = SchemaFactory.createForClass(QuizConfig);
