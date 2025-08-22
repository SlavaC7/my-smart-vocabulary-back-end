import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Quiz, QuizSchema } from './entities/quiz.entity';
import { Word, WordsSchema } from 'src/words/entities/word.entity';
import { FirebaseModule } from 'src/common/firebase/firebase.module';

@Module({
  controllers: [QuizController],
  providers: [QuizService],
  imports: [
    MongooseModule.forFeature([
      { name: Quiz.name, schema: QuizSchema },
      { name: Word.name, schema: WordsSchema },
    ]),
    FirebaseModule,
  ],
})
export class QuizModule {}
