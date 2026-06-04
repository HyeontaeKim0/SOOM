-- CreateTable
CREATE TABLE "BoardPostView" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "viewerKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BoardPostView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BoardPostView_viewerKey_idx" ON "BoardPostView"("viewerKey");

-- CreateIndex
CREATE UNIQUE INDEX "BoardPostView_postId_viewerKey_key" ON "BoardPostView"("postId", "viewerKey");

-- AddForeignKey
ALTER TABLE "BoardPostView" ADD CONSTRAINT "BoardPostView_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BoardPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
