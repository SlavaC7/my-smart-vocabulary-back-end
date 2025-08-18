import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.schema';
import { Folder } from 'src/folders/entities/folder.entity';
import { Word } from 'src/words/entities/word.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Folder.name) private folderModel: Model<Folder>,
    @InjectModel(Word.name) private wordsModel: Model<Word>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  findByFirebaseUid(uid: string) {
    return this.userModel.findOne({ uid: uid }).orFail(new NotFoundException('User not found'));
  }

  update(uid: string, updateUserDto: UpdateUserDto) {
    return this.userModel.updateOne({ uid: uid }, updateUserDto);
  }

  async remove(uid: string) {
    await this.folderModel.deleteMany({ ownerUid: uid });
    await this.wordsModel.deleteMany({ ownerUid: uid });
    return this.userModel.deleteOne({ uid: uid });
  }
}
