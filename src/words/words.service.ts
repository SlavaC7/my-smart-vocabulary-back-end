import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Words } from './entities/word.entity';
import { Model } from 'mongoose';

@Injectable()
export class WordsService {
  constructor(@InjectModel(Words.name) private wordsModel: Model<Words>) {}

  private async checkOwnership(wordId: string, uid: string) {
    const word = await this.wordsModel.findById(wordId);
    if (!word) throw new NotFoundException('Word not found');

    if (word.ownerUid !== uid) {
      throw new ForbiddenException('You are not the owner of this word');
    }

    return { word };
  }

  async create(createWordDto: CreateWordDto) {
    createWordDto.ownerUid = createWordDto.uid;

    createWordDto.createdAt = new Date().toISOString();

    return this.wordsModel.create(createWordDto);
  }

  async findAll(ownerUid: string, search: string | undefined = undefined, skip = 0, limit = 10) {
    const filter: Record<string, any> = { ownerUid };

    if (search) {
      filter.word = { $regex: search, $options: 'i' };
    }

    const docs = await this.wordsModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });

    const totalCount = await this.wordsModel.countDocuments(filter);

    return { totalCount, docs };
  }

  findOne(id: string) {
    return this.wordsModel.findById(id);
  }

  async update(id: string, updateWordDto: UpdateWordDto, uid: string) {
    await this.checkOwnership(id, uid);

    return this.wordsModel.updateOne({ _id: id }, updateWordDto);
  }

  async remove(id: string, uid: string) {
    await this.checkOwnership(id, uid);

    return this.wordsModel.deleteOne({ _id: id });
  }
}
