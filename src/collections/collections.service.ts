import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GraphService } from 'src/common/graph/graph.service';
import { CreateCollectionInput } from './dto/createCollection.input';
import { UpdateCollectionInput } from './dto/updateCollection.input';

@Injectable()
export class CollectionsService {
  constructor(@Inject(GraphService) private graphService: GraphService) {}

  findAll() {
    return this.graphService.collection.findMany({
      include: {
        creatorTeam: true,
        nfts: true,
      },
    });
  }

  findOne(id: number) {
    return this.graphService.collection.findUnique({
      where: { id },
      include: {
        creatorTeam: true,
        nfts: true,
      },
    });
  }

  create(collectionCreateInput: CreateCollectionInput) {
    return this.graphService.collection.create({
      data: {
        name: collectionCreateInput.name,
        logo: collectionCreateInput.logo,
        timeAutoArchiving: collectionCreateInput.timeAutoArchiving,
        creatorTeamId: 1, // FIXME: Hardcoded
        nfts: {
          createMany: {
            data: collectionCreateInput.Nfts.map((nft) => ({
              ...nft,
              teamId: 1,
            })), // FIXME: Hardcoded
          },
        },
      },
    });
  }

  async update(collectionUpdateInput: UpdateCollectionInput) {
    const collectionDb = await this.graphService.collection.findUnique({
      where: {
        id: collectionUpdateInput.collectionId,
      },
    });
    if (!collectionDb) {
      throw new NotFoundException('Collection not found');
    }

    return this.graphService.collection.update({
      where: {
        id: collectionUpdateInput.collectionId,
      },
      data: {
        name: collectionUpdateInput.name,
        logo: collectionUpdateInput.logo,
        timeAutoArchiving: collectionUpdateInput.timeAutoArchiving,
        status: collectionUpdateInput.status,
      },
    });
  }
}
