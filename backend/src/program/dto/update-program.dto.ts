import { IsString, IsOptional, IsArray, IsInt } from 'class-validator';

export class UpdateProgramDto {
  @IsString()
  @IsOptional()
  leader?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  songs?: number[];
}
