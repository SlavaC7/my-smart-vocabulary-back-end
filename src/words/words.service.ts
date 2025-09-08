import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Word } from './entities/word.entity';
import { Model, ObjectId } from 'mongoose';
import { Folder } from 'src/folders/entities/folder.entity';

@Injectable()
export class WordsService {
  constructor(
    @InjectModel(Word.name) private wordsModel: Model<Word>,
    @InjectModel(Folder.name) private folderModel: Model<Folder>,
  ) {}

  private async checkOwnership(wordId: ObjectId, uid: string) {
    const word = await this.wordsModel.findById(wordId);
    if (!word) throw new NotFoundException('Word not found');

    if (word.ownerUid !== uid) {
      throw new ForbiddenException('You are not the owner of this word');
    }

    return { word };
  }

  async create(createWordDto: CreateWordDto) {
    console.log('[CREATE]:createWordDto', createWordDto);
    createWordDto.createdAt = new Date().toISOString();

    if (createWordDto.folderId) {
      const folder = await this.folderModel.findById(createWordDto.folderId);

      if (folder) {
        await this.folderModel.updateOne({ _id: createWordDto.folderId }, { $inc: { count: 1 } });
      }
    }

    return this.wordsModel.create(createWordDto);
  }

  async findAll(
    ownerUid: string,
    search: string | undefined = undefined,
    skip = 0,
    limit = 10,
    folderId: string | undefined,
  ) {
    const filter: Record<string, any> = { ownerUid };

    if (search) {
      filter.word = { $regex: search, $options: 'i' };
    }

    if (folderId) {
      filter.folderId = folderId;
    }

    const docs = await this.wordsModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });

    const totalCount = await this.wordsModel.countDocuments(filter);

    return { totalCount, docs };
  }

  findOne(id: ObjectId) {
    return this.wordsModel.findById(id);
  }

  async update(id: ObjectId, updateWordDto: UpdateWordDto, uid: string) {
    const { word } = await this.checkOwnership(id, uid);

    if (updateWordDto.folderId) {
      await this.folderModel.updateOne({ _id: updateWordDto.folderId }, { $inc: { count: 1 } });
    }

    if (word.folderId && !updateWordDto.folderId) {
      await this.folderModel.updateOne({ _id: word.folderId }, { $inc: { count: -1 } });
    }

    return this.wordsModel.updateOne({ _id: id }, updateWordDto);
  }

  async remove(id: ObjectId, uid: string) {
    const { word } = await this.checkOwnership(id, uid);

    if (word.folderId) {
      const folder = await this.folderModel.findById(word.folderId);

      if (folder && folder?.count !== 0) {
        this.folderModel.updateOne({ _id: word.folderId }, { count: folder.count - 1 });
      }
    }

    return this.wordsModel.deleteOne({ _id: id });
  }
}
