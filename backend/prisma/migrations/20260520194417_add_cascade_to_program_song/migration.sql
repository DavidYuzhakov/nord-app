-- DropForeignKey
ALTER TABLE "ProgramSong" DROP CONSTRAINT "ProgramSong_songId_fkey";

-- AddForeignKey
ALTER TABLE "ProgramSong" ADD CONSTRAINT "ProgramSong_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;
