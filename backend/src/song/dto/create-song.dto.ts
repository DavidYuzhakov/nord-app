export class CreateSongDto {
  name: string;
  key: string; // соответствует enum KeyType в Prisma
  bpm: number;
  text: string;
  audio: string;
  danceVideo: string;
  structure: string[];
}
