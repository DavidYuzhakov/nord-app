import {
  IsString,
  IsOptional,
  IsArray,
  IsInt,
  IsBoolean,
} from 'class-validator';

export class UpdateProgramDto {
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
