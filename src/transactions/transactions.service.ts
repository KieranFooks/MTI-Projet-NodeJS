import { Inject, Injectable } from '@nestjs/common';
import { JWTUser } from 'src/users/users.decorator';
import { GraphService } from '../common/graph/graph.service';

@Injectable()
export class TransactionsService {
  constructor(@Inject(GraphService) private graphService: GraphService) {}

  async lastSells(top: number) {
    return this.graphService.transactions.findMany({
      include: {
        nft: true,
        buyer: true,
        sellerTeam: true,
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: top,
    });
  }

  async myLastSells(user: JWTUser) {
    return this.graphService.transactions.findMany({
      where: {
        buyerId: user.userId,
      },
      include: {
        nft: true,
        buyer: true,
        sellerTeam: true,
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: 10,
    });
  }
}
