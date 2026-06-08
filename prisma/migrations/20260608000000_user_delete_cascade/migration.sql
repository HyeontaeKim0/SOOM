-- DropForeignKey
ALTER TABLE "Meeting" DROP CONSTRAINT "Meeting_hostId_fkey";

-- DropForeignKey
ALTER TABLE "BoardPost" DROP CONSTRAINT "BoardPost_authorId_fkey";

-- DropForeignKey
ALTER TABLE "BoardComment" DROP CONSTRAINT "BoardComment_authorId_fkey";

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardPost" ADD CONSTRAINT "BoardPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardComment" ADD CONSTRAINT "BoardComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
