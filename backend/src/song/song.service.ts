import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { GetSongsDto } from './dto/get-songs.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class SongService {
  private readonly logger = new Logger(SongService.name);

  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSongDto) {
    const song = await this.prisma.song.create({
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

    this.logger.log(`Песня создана: name=${song.name} id=${song.id}`);
    return song;
  }

  async findAll(dto: GetSongsDto) {
    const { search } = dto;
    if (!search) {
      return this.prisma.song.findMany({
        orderBy: { name: 'asc' },
      });
    }

    const songsByName = await this.prisma.song.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    const songsByText = await this.prisma.song.findMany({
      where: {
        text: {
          contains: search,
          mode: 'insensitive',
        },
        NOT: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return [...songsByName, ...songsByText];
  }

  findOne(id: number) {
    return this.ensureExists(id);
  }

  async update(id: number, updateSongDto: UpdateSongDto) {
    await this.ensureExists(id);

    const song = await this.prisma.song.update({
      where: { id },
      data: updateSongDto,
    });

    this.logger.log(`Песня изменена: name=${song.name} id=${song.id}`);
    return song;
  }

  async remove(id: number) {
    await this.ensureExists(id);

    const song = await this.prisma.song.delete({ where: { id } });

    this.logger.log(`Песня удалена: name=${song.name} id=${song.id}`);
    return song;
  }

  private async ensureExists(id: number) {
    const exists = await this.prisma.song.findUnique({ where: { id } });

    if (!exists) {
      throw new NotFoundException('Песня не найдена');
    }

    return exists;
  }
}
