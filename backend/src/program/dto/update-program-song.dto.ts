import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsInt, IsOptional, Min } from 'class-validator';
import { CreateSongDto } from '@/song/dto/create-song.dto';

export class UpdateProgramSongDto extends PartialType(
  PickType(CreateSongDto, ['key']),
) {
  @IsOptional()
  @IsInt()
  @Min(1)
  order?: number;
}
