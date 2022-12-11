/*
  Warnings:

  - You are about to drop the column `NFTId` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `sellerId` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `NFTId` on the `UserRating` table. All the data in the column will be lost.
  - You are about to drop the `NFT` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nftId,userId]` on the table `UserRating` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nftId` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellerTeamId` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nftId` to the `UserRating` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "NFT" DROP CONSTRAINT "NFT_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "NFT" DROP CONSTRAINT "NFT_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_NFTId_fkey";

-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "UserRating" DROP CONSTRAINT "UserRating_NFTId_fkey";

-- DropIndex
DROP INDEX "UserRating_NFTId_userId_key";

-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "NFTId",
DROP COLUMN "sellerId",
ADD COLUMN     "nftId" INTEGER NOT NULL,
ADD COLUMN     "sellerTeamId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UserRating" DROP COLUMN "NFTId",
ADD COLUMN     "nftId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "NFT";

-- CreateTable
CREATE TABLE "Nft" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "collectionId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,

    CONSTRAINT "Nft_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserRating_nftId_userId_key" ON "UserRating"("nftId", "userId");

-- AddForeignKey
ALTER TABLE "Nft" ADD CONSTRAINT "Nft_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nft" ADD CONSTRAINT "Nft_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "Nft"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_sellerTeamId_fkey" FOREIGN KEY ("sellerTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRating" ADD CONSTRAINT "UserRating_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "Nft"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
