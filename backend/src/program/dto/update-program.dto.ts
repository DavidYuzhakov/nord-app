import {
  IsString,
  IsOptional,
  IsArray,
  IsInt,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class UpdateProgramDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  songsId?: number[];

  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean;

  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;
}
