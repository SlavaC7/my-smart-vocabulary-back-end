import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type WordsDocument = HydratedDocument<Folder>;

@Schema({ versionKey: false, timestamps: true })
export class Folder {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  @ApiProperty({ description: 'ID владельца слова' })
  ownerUid: string;

  @Prop({ required: true, trim: true, index: true })
  @ApiProperty({ description: 'Название папки' })
  name: string;

  @Prop({ required: true })
  @ApiHideProperty()
  count: number;
}

export const FolderSchema = SchemaFactory.createForClass(Folder);
