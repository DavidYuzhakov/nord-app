import { IsOptional, IsString } from 'class-validator';

export class GetSongsDto {
  @IsOptional()
  @IsString()
  search?: string;
}
