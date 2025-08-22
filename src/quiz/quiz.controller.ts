import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizConfig } from './entities/quiz.entity';
import { InjectUser } from 'src/common/decorators/user.decorator';
import { UserGuard } from 'src/common/guards/user.guard';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { FindQuizQueryDto } from './dto/find-quiz-query.dto';
import { AnswerQuizDto } from './dto/answer-quiz-dto';
import { ObjectId } from 'mongoose';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post('/create')
  @UseGuards(UserGuard)
  create(@InjectUser() user: DecodedIdToken, @Body() config: QuizConfig) {
    return this.quizService.create(config, user.uid);
  }

  @Post('/quiz/:id/answer')
  @UseGuards(UserGuard)
  answer(
    @InjectUser() user: DecodedIdToken,
    @Param('id') id: ObjectId,
    @Body() data: AnswerQuizDto,
  ) {
    console.log('ANSWER controller:', id, data);
    return this.quizService.answer(user.uid, id, data);
  }

  @Post('/quiz/:id/complete')
  @UseGuards(UserGuard)
  complete(
    @InjectUser() user: DecodedIdToken,
    @Param('id') id: ObjectId,
    // @Body() data: AnswerQuizDto,
  ) {
    return this.quizService.complete(user.uid, id);
  }

  @Post('/quiz/:id/cancel')
  @UseGuards(UserGuard)
  calncel(
    @InjectUser() user: DecodedIdToken,
    @Param('id') id: ObjectId,
    // @Body() data: AnswerQuizDto,
  ) {
    return this.quizService.cancel(user.uid, id);
  }

  @Get('/history')
  @UseGuards(UserGuard)
  findAll(@InjectUser() user: DecodedIdToken, @Query() params: FindQuizQueryDto) {
    return this.quizService.findAll(user.uid, params);
  }

  @Get('/quiz/active')
  @UseGuards(UserGuard)
  active(@InjectUser() user: DecodedIdToken) {
    return this.quizService.active(user.uid);
  }

  @Delete('/history/clear')
  @UseGuards(UserGuard)
  remove(@InjectUser() user: DecodedIdToken) {
    return this.quizService.remove(user.uid);
  }
}
