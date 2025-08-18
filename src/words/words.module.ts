import { Module } from '@nestjs/common';
import { WordsService } from './words.service';
import { WordsController } from './words.controller';
import { FirebaseModule } from 'src/common/firebase/firebase.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Word, WordsSchema } from './entities/word.entity';

@Module({
  controllers: [WordsController],
  providers: [WordsService],

  imports: [MongooseModule.forFeature([{ name: Word.name, schema: WordsSchema }]), FirebaseModule],
})
export class WordsModule {}
