import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { GetSongsDto } from './dto/get-songs.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SongService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSongDto) {
    return this.prisma.song.create({
      data: {
        name: dto.name,
        key: dto.key,
        bpm: dto.bpm,
        text: dto.text,
        audio: dto.audio,
        danceVideo: dto.danceVideo,
        structure: dto.structure,
      },
    });
  }

  async findAll(dto: GetSongsDto) {
    const { search } = dto;
    return this.prisma.song.findMany({
      where: search ? { name: { contains: search, mode: 'insensitive' } } : {},
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const song = await this.ensureExists(id);
    return song;
  }

  async update(id: number, updateSongDto: UpdateSongDto) {
    await this.ensureExists(id);

    return this.prisma.song.update({
      where: { id },
      data: updateSongDto,
    });
  }

  async remove(id: number) {
    await this.ensureExists(id);

    return this.prisma.song.delete({ where: { id } });
  }

  private async ensureExists(id: number) {
    const exists = await this.prisma.song.findUnique({ where: { id } });

    if (!exists) {
      throw new NotFoundException('Песня не найдена');
    }

    return exists;
  }
}
