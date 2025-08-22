import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Answer, Quiz, QuizConfig, QuizItem } from './entities/quiz.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Word } from 'src/words/entities/word.entity';
import { Model, ObjectId, SortOrder } from 'mongoose';
import { getRandomElement, shuffleArray } from './helpers/generateQuiz';
import { v4 as uuidv4 } from 'uuid';
import { QuizItemMode } from './enum/mode';
import { QuizStatus } from './enum/status';
import { FindQuizQueryDto } from './dto/find-quiz-query.dto';
import { AnswerQuizDto } from './dto/answer-quiz-dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(Word.name) private wordsModel: Model<Word>,
    @InjectModel(Quiz.name) private quizModel: Model<Quiz>,
  ) {}

  async checkOwnership(quizId: ObjectId, uid: string) {
    const quiz = await this.quizModel.findById(quizId);

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    if (quiz.ownerUid !== uid) {
      throw new ForbiddenException('You are not the owner of this quiz');
    }

    return quiz;
  }

  private countAnswers(quiz: Quiz) {
    let correct = 0;
    let incorrect = 0;

    for (const answer of quiz.userAnswers) {
      if (answer.isCorrect) correct++;
      else incorrect++;
    }

    return { correct, incorrect };
  }

  async getWordsForQuiz(config: QuizConfig, uid: string) {
    if (config.count < 5) {
      throw new BadRequestException('Wor must be 5 or more');
    }
    const query: Record<string, any> = { ownerUid: uid };

    // фильтр по папкам
    if (config.folders?.length) {
      query.folderId = { $in: config.folders };
    }

    // фильтр по типу слова
    if (config.type?.length) {
      query.type = { $in: config.type };
    }

    // фильтр по языкам
    if (config.lang?.length) {
      query.code = { $in: config.lang };
    }

    // слабые слова: incorrect > correct
    // if (config.weakWords) {
    //   query.$expr = { $gt: ['$stats.incorrect', '$stats.correct'] };
    //   // ⚠️ нужно, чтобы у Word была схема stats: { correct: number, incorrect: number }
    // }

    // старые слова (созданные ДО даты)
    // if (config.olderThan) {
    //   query.createdAt = { $lt: config.olderThan };
    // }

    // достаём с лимитом
    let words = await this.wordsModel.find(query).limit(config.count).exec();

    // тут можно перемешать, если надо
    words = shuffleArray(words).slice(0, config.count);

    return words;
  }

  async create(config: QuizConfig, uid: string) {
    const words = await this.getWordsForQuiz(config, uid);

    const test: QuizItem[] = words.map((word) => {
      const questionId = uuidv4();

      const correctTranslation = getRandomElement(word.translations);

      const otherWords = words.filter((w) => w._id !== word._id && w.translations.length > 0);

      const incorrectTranslations = shuffleArray(otherWords)
        .slice(0, 3)
        .map((w) => getRandomElement(w.translations));

      const answers: Answer[] = shuffleArray([
        {
          id: uuidv4(),
          questionId: questionId,
          text: correctTranslation,
          isCorrect: true,
        },
        ...incorrectTranslations.map((text) => ({
          id: uuidv4(),
          questionId: questionId,
          text,
          isCorrect: false,
        })),
      ]);

      return {
        id: questionId,
        wordId: word._id,
        mode: QuizItemMode.match,
        word: word.word,
        answers,
        flag: word.flag,
        type: word.type,
      };
    });

    const quiz: Quiz = {
      quiz: test,
      correct: 0,
      incorrect: 0,
      status: QuizStatus.in_progress,
      config: config,
      ownerUid: uid,
      userAnswers: [],
    };

    return this.quizModel.create(quiz);
  }

  async findAll(uid: string, params: FindQuizQueryDto) {
    const filter: Record<string, any> = { ownerUid: uid };

    const docs = await this.quizModel
      .find(filter)
      .skip(params.skip)
      .limit(params.limit)
      .sort({ [params.sortBy || 'createdAt']: (params.order as SortOrder) || -1 });

    const totalCount = await this.quizModel.countDocuments(filter);

    return { totalCount, docs };
  }

  async active(uid: string) {
    const filter: Record<string, any> = { ownerUid: uid, status: QuizStatus.in_progress };

    const docs = await this.quizModel.find(filter);

    if (!docs.length) {
      return null;
    }

    return docs[0];
  }

  async answer(uid: string, id: ObjectId, data: AnswerQuizDto) {
    const quiz = await this.checkOwnership(id, uid);

    if (!quiz.quiz.some((q) => q.id === data.questionId)) {
      throw new BadRequestException('Invalid questionId');
    }

    quiz.userAnswers.push({
      ...data,
      answeredAt: new Date(),
    });

    await quiz.save();

    return quiz;
  }

  async complete(uid: string, id: ObjectId) {
    const quiz = await this.checkOwnership(id, uid);

    const { correct, incorrect } = this.countAnswers(quiz);

    quiz.status = QuizStatus.completed;
    quiz.correct = correct;
    quiz.incorrect = incorrect;

    await quiz.save();

    return quiz;
  }

  async cancel(uid: string, id: ObjectId) {
    const quiz = await this.checkOwnership(id, uid);

    const { correct, incorrect } = this.countAnswers(quiz);

    quiz.correct = correct;
    quiz.incorrect = incorrect;
    quiz.status = QuizStatus.canceled;

    await quiz.save();

    return quiz;
  }

  remove(uid: string) {
    return this.quizModel.deleteMany({ ownerUid: uid });
  }
}
