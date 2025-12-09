import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SongService } from './song.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { GetSongsDto } from './dto/get-songs.dto';

@Controller('song')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Post()
  createSong(@Body() createSongDto: CreateSongDto) {
    return this.songService.create(createSongDto);
  }

  @Get()
  getAllSongs(@Query() dto: GetSongsDto) {
    return this.songService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.songService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSongDto: UpdateSongDto) {
    return this.songService.update(+id, updateSongDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.songService.remove(+id);
  }
}
