-- AlterTable
ALTER TABLE "BoardPost" ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "BoardPostLike" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BoardPostLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BoardPostLike_userId_idx" ON "BoardPostLike"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BoardPostLike_postId_userId_key" ON "BoardPostLike"("postId", "userId");

-- AddForeignKey
ALTER TABLE "BoardPostLike" ADD CONSTRAINT "BoardPostLike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BoardPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardPostLike" ADD CONSTRAINT "BoardPostLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
