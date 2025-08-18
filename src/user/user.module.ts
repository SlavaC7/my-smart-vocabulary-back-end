import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.schema';
import { FirebaseModule } from 'src/common/firebase/firebase.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), FirebaseModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
