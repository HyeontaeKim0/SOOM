-- AlterTable
ALTER TABLE "BoardComment" ADD COLUMN     "depth" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "parentId" TEXT;

-- AddForeignKey
ALTER TABLE "BoardComment" ADD CONSTRAINT "BoardComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "BoardComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
