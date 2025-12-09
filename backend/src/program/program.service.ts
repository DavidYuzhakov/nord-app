import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProgramService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateProgramDto) {
    const songData = dto.songs.map((songId, i) => ({
      songId,
      order: i + 1,
    }));

    try {
      return await this.prisma.program.create({
        data: {
          leader: dto.leader,
          name: dto.name,
          songs: {
            create: songData,
          },
        },
        include: {
          songs: {
            include: {
              song: {
                select: { name: true, id: true },
              },
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
      });
    } catch (e) {
      if (e.code === 'P2002') {
        throw new BadRequestException('Такая песня уже есть в программе');
      }
      throw e;
    }
  }

  async findAll() {
    return this.prisma.program.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const program = await this.prisma.program.findUnique({
      where: { id },
      include: {
        songs: {
          include: {
            song: { select: { id: true, name: true } },
          },
          orderBy: { order: 'asc' },
        },
      },
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

    const data: any = {};
    if (dto.leader) data.leader = dto.leader;
    if (dto.name) data.name = dto.name;

    if (dto.songs) {
      await this.prisma.programSong.deleteMany({
        where: { programId: id },
      });

      data.songs = {
        create: dto.songs.map((songId, index) => ({
          songId,
          order: index + 1,
        })),
      };
    }

    return this.prisma.program.update({
      where: { id },
      data,
      include: {
        songs: {
          include: {
            song: { select: { id: true, name: true } },
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
