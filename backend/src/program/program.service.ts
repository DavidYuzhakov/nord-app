import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { ProgramUpdateInput } from '@/generated/prisma/models';

@Injectable()
export class ProgramService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly programInclude = {
    songs: {
      include: {
        song: true,
      },
      orderBy: {
        order: 'asc' as const,
      },
    },
  };

  async create(dto: CreateProgramDto) {
    const songData = dto.songsId.map((songId, i) => ({
      songId,
      order: i + 1,
    }));

    try {
      return await this.prisma.program.create({
        data: {
          name: dto.name,
          songs: {
            create: songData,
          },
          date: new Date(dto.date),
        },
        include: this.programInclude,
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new BadRequestException('Такая песня уже есть в программе');
      }
      throw e;
    }
  }

  findAll() {
    return this.prisma.program.findMany({
      orderBy: { createdAt: 'desc' },
      include: this.programInclude,
    });
  }

  async findOne(id: number) {
    const program = await this.prisma.program.findUnique({
      where: { id },
      include: this.programInclude,
    });

    if (!program) throw new NotFoundException('Программа не найдена');
    return program;
  }

  async update(id: number, dto: UpdateProgramDto) {
    const program = await this.prisma.program.findUnique({
      where: { id },
      include: { songs: true },
    });
    if (!program) throw new NotFoundException('Программа не найдена');

    const data: ProgramUpdateInput = {};
    if (dto.name) data.name = dto.name;

    if (dto.songsId !== undefined) {
      await this.prisma.programSong.deleteMany({
        where: { programId: id },
      });

      data.songs = {
        create: dto.songsId.map((songId, index) => ({
          songId,
          order: index + 1,
        })),
      };
    }

    if (dto.isArchived !== undefined) data.isArchived = dto.isArchived;
    if (dto.isFavorite !== undefined) data.isFavorite = dto.isFavorite;

    return this.prisma.program.update({
      where: { id },
      data,
      include: {
        songs: {
          include: {
            song: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async remove(id: number) {
    const program = await this.prisma.program.findUnique({ where: { id } });
    if (!program) throw new NotFoundException('Программа не найдена');

    await this.prisma.programSong.deleteMany({
      where: { programId: id },
    });

    return await this.prisma.program.delete({ where: { id } });
  }
}
