import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateProgramDto {
  @IsDateString()
  date!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  songsId!: number[];
}
