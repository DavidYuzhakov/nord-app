import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { GetSongsDto } from './dto/get-songs.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class SongService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateSongDto) {
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

  findAll(dto: GetSongsDto) {
    const { search } = dto;
    return this.prisma.song.findMany({
      where: search ? { name: { contains: search, mode: 'insensitive' } } : {},
      orderBy: { name: 'asc' },
    });
  }

  findOne(id: number) {
    return this.ensureExists(id);
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
