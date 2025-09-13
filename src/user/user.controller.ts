import { Controller, Get, Post, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserGuard } from 'src/common/guards/user.guard';
import { InjectUser } from 'src/common/decorators/user.decorator';
import { DecodedIdToken } from 'firebase-admin/auth';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('me')
  @UseGuards(UserGuard)
  create(@InjectUser() user: DecodedIdToken, @Body() createUserDto: CreateUserDto) {
    createUserDto.uid = user.uid;

    return this.userService.create(createUserDto);
  }

  @Get('me')
  @UseGuards(UserGuard)
  async getMe(@InjectUser() user: DecodedIdToken) {
    return this.userService.findByFirebaseUid(user.uid);
  }

  @Patch('me')
  @UseGuards(UserGuard)
  update(@InjectUser() user: DecodedIdToken, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(user.uid, updateUserDto);
  }

  @Get('me/stats')
  @UseGuards(UserGuard)
  stats(@InjectUser() user: DecodedIdToken) {
    return this.userService.stats(user.uid);
  }

  @Delete('me')
  remove(@InjectUser() user: DecodedIdToken) {
    return this.userService.remove(user.uid);
  }
}
