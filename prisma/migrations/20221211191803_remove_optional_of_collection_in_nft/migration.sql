/*
  Warnings:

  - Made the column `collectionId` on table `NFT` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "NFT" DROP CONSTRAINT "NFT_collectionId_fkey";

-- AlterTable
ALTER TABLE "NFT" ALTER COLUMN "collectionId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "NFT" ADD CONSTRAINT "NFT_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
