import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.schema';
import { FirebaseModule } from 'src/common/firebase/firebase.module';
import { Folder, FolderSchema } from 'src/folders/entities/folder.entity';
import { Word, WordsSchema } from 'src/words/entities/word.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Folder.name, schema: FolderSchema },
      { name: Word.name, schema: WordsSchema },
    ]),
    FirebaseModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
