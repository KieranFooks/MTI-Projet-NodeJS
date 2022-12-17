import { Inject, Injectable } from '@nestjs/common';
import { PaginationInput } from 'src/users/dto/pagination.input';
import { GraphService } from '../common/graph/graph.service';
import { RateNftInput } from './dto/rateNFT.input';

@Injectable()
export class UserRatingsService {
  constructor(@Inject(GraphService) private graphService: GraphService) {}

  findByUserId(id: number, pagination: PaginationInput | null) {
    return this.graphService.userRating.findMany({
      where: {
        userId: id,
      },
      include: {
        nft: true,
        user: true,
      },
      take: pagination?.limit,
      skip: pagination?.offset,
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
