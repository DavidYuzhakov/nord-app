import { Module } from '@nestjs/common';
import { SongModule } from './song/song.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProgramModule } from './program/program.module';

@Module({
  imports: [SongModule, PrismaModule, ProgramModule],
})
export class AppModule {}
