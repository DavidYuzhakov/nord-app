import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { UpdateProgramSongDto } from './dto/update-program-song.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { ProgramUpdateInput } from '@/generated/prisma/models';

@Injectable()
export class ProgramService {
  private readonly logger = new Logger(ProgramService.name);

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
      const program = await this.prisma.program.create({
        data: {
          name: dto.name,
          songs: {
            create: songData,
          },
          date: new Date(dto.date),
        },
        include: this.programInclude,
      });

      this.logger.log(
        `Программа создана: name=${program.name} id=${program.id}`,
      );
      return program;
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
    if (dto.date) data.date = dto.date;

    if (dto.songsId !== undefined) {
      await this.prisma.programSong.deleteMany({
        where: { programId: id },
      });

      data.songs = {
        create: dto.songsId.map((songId, index) => ({
          songId,
          order: index + 1,
          key: program.songs.find((song) => song.songId === songId)?.key,
        })),
      };
    }

    if (dto.isArchived !== undefined) data.isArchived = dto.isArchived;
    if (dto.isFavorite !== undefined) data.isFavorite = dto.isFavorite;

    const updatedProgram = await this.prisma.program.update({
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

    this.logger.log(
      `Программа изменена: name=${updatedProgram.name} id=${updatedProgram.id}`,
    );
    return updatedProgram;
  }

  async findProgramSong(programId: number, songId: number) {
    const programSong = await this.prisma.programSong.findUnique({
      where: { programId_songId: { programId, songId } },
      include: { song: true },
    });
    if (!programSong)
      throw new NotFoundException('Песня не найдена в программе');

    return programSong;
  }

  async updateProgramSong(
    programId: number,
    songId: number,
    dto: UpdateProgramSongDto,
  ) {
    await this.findProgramSong(programId, songId);

    const programSong = await this.prisma.programSong.update({
      where: { programId_songId: { programId, songId } },
      data: dto,
      include: { song: true },
    });

    this.logger.log(
      `Песня в программе изменена: id=${programSong.id}, programId=${programSong.programId}, songId=${programSong.songId}, songName=${programSong.song.name} key=${programSong.key ?? 'не задана'}`,
    );
    return programSong;
  }

  async remove(id: number) {
    const program = await this.prisma.program.findUnique({ where: { id } });
    if (!program) throw new NotFoundException('Программа не найдена');

    await this.prisma.programSong.deleteMany({
      where: { programId: id },
    });

    const deletedProgram = await this.prisma.program.delete({ where: { id } });

    this.logger.log(
      `Программа удалена: name=${program.name} id=${deletedProgram.id}`,
    );
    return deletedProgram;
  }
}
