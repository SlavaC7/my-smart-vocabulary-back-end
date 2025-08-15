import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type WordsDocument = HydratedDocument<Words>;

export enum EWordType {
  word = 'word',
  phrase = 'phrase',
}

@Schema({ versionKey: false })
export class Words {
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

  @Prop({ type: Date, default: Date.now, index: true })
  @ApiProperty({ description: 'Дата создания' })
  createdAt?: Date;

  @Prop({
    type: String,
    enum: Object.values(EWordType),
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
}

export const WordsSchema = SchemaFactory.createForClass(Words);
