-- CreateEnum
CREATE TYPE "KeyType" AS ENUM ('C', 'D', 'E', 'F', 'G', 'A', 'H');

-- CreateTable
CREATE TABLE "Song" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "key" "KeyType" NOT NULL,
    "bpm" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "audio" TEXT,
    "danceVideo" TEXT,
    "structure" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramSong" (
    "id" SERIAL NOT NULL,
    "programId" INTEGER NOT NULL,
    "songId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "ProgramSong_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" SERIAL NOT NULL,
    "leader" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProgramSong_programId_order_idx" ON "ProgramSong"("programId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramSong_programId_songId_key" ON "ProgramSong"("programId", "songId");

-- AddForeignKey
ALTER TABLE "ProgramSong" ADD CONSTRAINT "ProgramSong_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramSong" ADD CONSTRAINT "ProgramSong_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
