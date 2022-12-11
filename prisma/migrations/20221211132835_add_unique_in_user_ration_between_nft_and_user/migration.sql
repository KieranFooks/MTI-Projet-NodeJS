/*
  Warnings:

  - A unique constraint covering the columns `[NFTId,userId]` on the table `UserRating` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserRating_NFTId_userId_key" ON "UserRating"("NFTId", "userId");
