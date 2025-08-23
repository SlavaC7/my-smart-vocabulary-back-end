import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
