-- DropForeignKey
ALTER TABLE "UserRating" DROP CONSTRAINT "UserRating_nftId_fkey";

-- DropForeignKey
ALTER TABLE "UserRating" DROP CONSTRAINT "UserRating_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserRating" ADD CONSTRAINT "UserRating_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "Nft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRating" ADD CONSTRAINT "UserRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
