import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, ObjectId } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  @ApiProperty({
    type: 'string',
  })
  _id: ObjectId;

  @Prop()
  @ApiProperty()
  name: string;

  @Prop()
  @ApiProperty()
  uid: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
