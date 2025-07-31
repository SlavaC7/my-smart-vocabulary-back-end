import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  findByFirebaseUid(uid: string) {
    return this.userModel
      .findOne({ uid: uid })
      .orFail(new NotFoundException('User not found'));
  }

  update(uid: string, updateUserDto: UpdateUserDto) {
    return this.userModel.updateOne({ uid: uid }, updateUserDto);
  }

  remove(uid: string) {
    return this.userModel.deleteOne({ uid: uid });
  }
}
