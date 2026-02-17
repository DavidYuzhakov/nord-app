import { IsString, IsOptional, IsArray, IsInt } from 'class-validator';

export class UpdateProgramDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  songsId?: number[];
}
