import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { GetSongsDto } from './dto/get-songs.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SongService {
  constructor(private prisma: PrismaService) {}

  async create(createSongDto: CreateSongDto) {
    const data: any = { ...createSongDto };

    if (data.audio === undefined) {
      delete data.audio;
    }
    if (data.danceVideo === undefined) {
      delete data.danceVideo;
    }

    return this.prisma.song.create({
      data,
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
