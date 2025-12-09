import { Module } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ProgramController],
  imports: [PrismaModule],
  providers: [ProgramService],
})
export class ProgramModule {}
