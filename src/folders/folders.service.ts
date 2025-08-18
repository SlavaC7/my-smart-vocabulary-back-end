import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { Folder } from './entities/folder.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Word } from 'src/words/entities/word.entity';

@Injectable()
export class FoldersService {
  constructor(
    @InjectModel(Folder.name) private foldersModel: Model<Folder>,
    @InjectModel(Word.name) private wordsModel: Model<Word>,
  ) {}

  private async checkOwnership(wordId: ObjectId, uid: string) {
    const folder = await this.foldersModel.findById(wordId);
    if (!folder) throw new NotFoundException('Word not found');

    if (folder.ownerUid !== uid) {
      throw new ForbiddenException('You are not the owner of this word');
    }

    return { folder };
  }

  async create(createFolderDto: CreateFolderDto) {
    const duplicateCount = await this.foldersModel.countDocuments({
      ownerUid: createFolderDto.ownerUid,
      name: createFolderDto.name,
    });

    if (duplicateCount >= 1) {
      throw new ForbiddenException('Duplicate name');
    }

    const totalCount = await this.foldersModel.countDocuments({
      ownerUid: createFolderDto.ownerUid,
    });

    if (totalCount >= 20) {
      throw new ForbiddenException('You can create up to 20 folders');
    }

    createFolderDto.count = 0;

    return this.foldersModel.create(createFolderDto);
  }

  async findAll(ownerUid: string) {
    const filter: Record<string, any> = { ownerUid };

    const docs = await this.foldersModel.find(filter).sort({ createdAt: -1 });

    const totalCount = await this.foldersModel.countDocuments(filter);

    return { totalCount, docs };
  }

  findOne(id: ObjectId) {
    return this.foldersModel.findById(id);
  }

  async update(id: ObjectId, updateFolderDto: UpdateFolderDto, uid: string) {
    await this.checkOwnership(id, uid);

    return this.foldersModel.updateOne({ _id: id }, updateFolderDto);
  }

  async remove(id: ObjectId, uid: string) {
    await this.checkOwnership(id, uid);

    await this.wordsModel.updateMany({ folderId: id }, { folderId: undefined });

    return this.foldersModel.deleteOne({ _id: id });
  }
}
