import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FirebaseModule } from './common/firebase/firebase.module';
import { WordsModule } from './words/words.module';
import { FoldersModule } from './folders/folders.module';
import { QuizModule } from './quiz/quiz.module';

@Module({
  imports: [
    FirebaseModule,
    UserModule,
    ConfigModule.forRoot({
      envFilePath: '.env.dev',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    WordsModule,
    FoldersModule,
    QuizModule,
  ],
})
export class AppModule {}
