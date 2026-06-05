-- AlterTable
ALTER TABLE "BoardPostView" ADD COLUMN "viewedOn" DATE;

UPDATE "BoardPostView"
SET "viewedOn" = ("createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul')::date;

ALTER TABLE "BoardPostView" ALTER COLUMN "viewedOn" SET NOT NULL;

-- DropIndex
DROP INDEX "BoardPostView_postId_viewerKey_key";

-- CreateIndex
CREATE UNIQUE INDEX "BoardPostView_postId_viewerKey_viewedOn_key" ON "BoardPostView"("postId", "viewerKey", "viewedOn");

-- CreateIndex
CREATE INDEX "BoardPostView_viewedOn_postId_idx" ON "BoardPostView"("viewedOn", "postId");
