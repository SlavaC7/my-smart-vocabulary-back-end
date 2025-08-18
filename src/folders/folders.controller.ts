import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { UserGuard } from 'src/common/guards/user.guard';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { InjectUser } from 'src/common/decorators/user.decorator';
import { ObjectId } from 'mongoose';

@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  @UseGuards(UserGuard)
  create(@InjectUser() user: DecodedIdToken, @Body() createFolderDto: CreateFolderDto) {
    createFolderDto.ownerUid = user.uid;
    return this.foldersService.create(createFolderDto);
  }

  //TODO: Implement search and pagination (If needed)
  @Get()
  @UseGuards(UserGuard)
  findAll(@InjectUser() user: DecodedIdToken) {
    return this.foldersService.findAll(user.uid);
  }

  @Get(':id')
  @UseGuards(UserGuard)
  findOne(@Param('id') id: ObjectId) {
    return this.foldersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(UserGuard)
  update(
    @InjectUser() user: DecodedIdToken,
    @Param('id') id: ObjectId,
    @Body() updateFolderDto: UpdateFolderDto,
  ) {
    return this.foldersService.update(id, updateFolderDto, user.uid);
  }

  @Delete(':id')
  @UseGuards(UserGuard)
  remove(@InjectUser() user: DecodedIdToken, @Param('id') id: ObjectId) {
    return this.foldersService.remove(id, user.uid);
  }
}
