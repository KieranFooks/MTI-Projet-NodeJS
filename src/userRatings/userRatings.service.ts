import { Inject, Injectable } from '@nestjs/common';
import { GraphService } from 'src/common/graph/graph.service';
import { RateNFTInput } from './dto/rateNFT.input';

@Injectable()
export class UserRatingsService {
  constructor(@Inject(GraphService) private graphService: GraphService) {}

  findByUserId(id: number) {
    return this.graphService.userRating.findMany({
      where: {
        userId: id,
      },
      include: {
        nft: true,
        user: true,
      },
    });
  }

  create(rating: RateNFTInput) {
    return this.graphService.userRating.upsert({
      where: {
        NFTId_userId: {
          NFTId: rating.nftId,
          userId: 1, // FIXME: Hardcoded
        },
      },
      update: {
        rate: rating.rate,
      },
      create: {
        NFTId: rating.nftId,
        userId: 1, // FIXME: Hardcoded
        rate: rating.rate,
      },
      include: {
        nft: true,
        user: true,
      },
    });
  }
}
