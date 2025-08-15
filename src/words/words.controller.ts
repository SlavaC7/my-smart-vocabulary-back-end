import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { WordsService } from './words.service';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { UserGuard } from 'src/common/guards/user.guard';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { InjectUser } from 'src/common/decorators/user.decorator';
import { FindWordsQueryDto } from './dto/find-words-query.dto';

@Controller('words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Post()
  @UseGuards(UserGuard)
  create(
    @InjectUser() user: DecodedIdToken,
    @Body() createWordDto: CreateWordDto,
  ) {
    createWordDto.uid = user.uid;
    return this.wordsService.create(createWordDto);
  }

  @Get()
  @UseGuards(UserGuard)
  findAll(
    @InjectUser() user: DecodedIdToken,
    @Query() query: FindWordsQueryDto,
  ) {
    const { search, skip, limit } = query;
    return this.wordsService.findAll(user.uid, search, skip, limit);
  }

  @Get(':id')
  @UseGuards(UserGuard)
  findOne(@Param('id') id: string) {
    return this.wordsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(UserGuard)
  update(
    @InjectUser() user: DecodedIdToken,
    @Param('id') id: string,
    @Body() updateWordDto: UpdateWordDto,
  ) {
    return this.wordsService.update(id, updateWordDto, user.uid);
  }

  @Delete(':id')
  @UseGuards(UserGuard)
  remove(@InjectUser() user: DecodedIdToken, @Param('id') id: string) {
    return this.wordsService.remove(id, user.uid);
  }
}
