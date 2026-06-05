-- AlterTable
ALTER TABLE "BoardComment" ADD COLUMN     "commentLikeCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "BoardCommentLike" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BoardCommentLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BoardCommentLike_userId_idx" ON "BoardCommentLike"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BoardCommentLike_commentId_userId_key" ON "BoardCommentLike"("commentId", "userId");

-- AddForeignKey
ALTER TABLE "BoardCommentLike" ADD CONSTRAINT "BoardCommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "BoardComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardCommentLike" ADD CONSTRAINT "BoardCommentLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
