import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateProgramDto {
  @IsString()
  @IsNotEmpty()
  leader: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  songs: number[];
}
