import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import { EWordType } from '../enum/type';

export type WordsDocument = HydratedDocument<Word>;

@Schema({ _id: true, versionKey: false, timestamps: true })
export class Word {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  @ApiProperty({ description: 'ID владельца слова' })
  ownerUid: string;

  @Prop({ required: true, trim: true, index: true })
  @ApiProperty({ description: 'Текст слова или фразы' })
  word: string;

  @Prop({ type: [String], default: [] })
  @ApiProperty({ description: 'Список переводов' })
  translations: string[];

  @Prop({ type: Types.ObjectId, ref: 'Folder', default: null, index: true })
  @ApiProperty({ description: 'ID папки, если есть' })
  folderId?: Types.ObjectId | null;

  @Prop({
    type: String,
    enum: EWordType,
    required: true,
    index: true,
  })
  @ApiProperty({ description: 'Тип слова', enum: EWordType })
  type: EWordType;

  @Prop({ required: true, index: true })
  @ApiProperty({ description: 'Язык слова (код ISO)' })
  lang: string;

  @Prop()
  @ApiProperty({ description: 'Флаг страны' })
  flag: string;

  @Prop()
  @ApiProperty({ description: 'Кол-во правильно ответов на это слово' })
  correct: number;

  @Prop()
  @ApiProperty({ description: 'Кол-во не правильно ответов на это слово' })
  incorrect: number;
}

export const WordsSchema = SchemaFactory.createForClass(Word);
