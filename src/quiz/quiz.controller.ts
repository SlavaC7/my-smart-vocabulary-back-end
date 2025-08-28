import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { InjectUser } from 'src/common/decorators/user.decorator';
import { UserGuard } from 'src/common/guards/user.guard';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { FindQuizQueryDto } from './dto/find-quiz-query.dto';
import { AnswerQuizDto } from './dto/answer-quiz-dto';
import { ObjectId } from 'mongoose';
import { QuizConfigDto } from './dto/create-quiz-dto';

// add rapteToObjectId
// change id:objectId => string in params

@Controller('quiz')
@UseGuards(UserGuard)
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post('')
  create(@InjectUser() user: DecodedIdToken, @Body() config: QuizConfigDto) {
    console.log('DATA:', config);
    return this.quizService.create(config, user.uid);
  }

  @Post('/:id/answer')
  answer(
    @InjectUser() user: DecodedIdToken,
    @Param('id') id: ObjectId,
    @Body() data: AnswerQuizDto,
  ) {
    console.log('ANSWER controller:', id, data);
    return this.quizService.answer(user.uid, id, data);
  }

  @Post('/:id/complete')
  complete(@InjectUser() user: DecodedIdToken, @Param('id') id: ObjectId) {
    return this.quizService.complete(user.uid, id);
  }

  @Post('/:id/cancel')
  calncel(@InjectUser() user: DecodedIdToken, @Param('id') id: ObjectId) {
    return this.quizService.cancel(user.uid, id);
  }

  @Get('')
  findAll(@InjectUser() user: DecodedIdToken, @Query() params: FindQuizQueryDto) {
    return this.quizService.findAll(user.uid, params);
  }

  @Delete('')
  remove(@InjectUser() user: DecodedIdToken) {
    return this.quizService.remove(user.uid);
  }
}
