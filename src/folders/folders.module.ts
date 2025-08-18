import { Module } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { FoldersController } from './folders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Folder, FolderSchema } from './entities/folder.entity';
import { FirebaseModule } from 'src/common/firebase/firebase.module';
import { Word } from 'src/words/entities/word.entity';

@Module({
  controllers: [FoldersController],
  providers: [FoldersService],
  imports: [
    MongooseModule.forFeature([
      { name: Folder.name, schema: FolderSchema },
      { name: Word.name, schema: FolderSchema },
    ]),
    FirebaseModule,
  ],
})
export class FoldersModule {}
