import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
