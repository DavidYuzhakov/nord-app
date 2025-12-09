import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export enum KeyType {
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
  G = 'G',
  A = 'A',
  H = 'H',
}

export class CreateSongDto {
  @IsString()
  name: string;

  @IsEnum(KeyType)
  key: KeyType;

  @IsInt()
  bpm: number;

  @IsString()
  text: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  audio?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  danceVideo?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  structure: string[];
}
