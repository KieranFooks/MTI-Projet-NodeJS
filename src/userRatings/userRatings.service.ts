import { Inject, Injectable } from '@nestjs/common';
import { GraphService } from '../common/graph/graph.service';
import { RateNftInput } from './dto/rateNFT.input';

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

  create(rating: RateNftInput, userId: number) {
    return this.graphService.userRating.upsert({
      where: {
        nftId_userId: {
          nftId: rating.nftId,
          userId: userId,
        },
      },
      update: {
        rate: rating.rate,
      },
      create: {
        nftId: rating.nftId,
        userId: userId,
        rate: rating.rate,
      },
      include: {
        nft: true,
        user: true,
      },
    });
  }
}
