import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role, Status } from '@prisma/client';
import { PaginationInput } from 'src/users/dto/pagination.input';
import { GraphService } from '../common/graph/graph.service';
import { JWTUser } from '../users/users.decorator';
import { UsersService } from '../users/users.service';
import { CreateCollectionInput } from './dto/createCollection.input';
import { UpdateCollectionInput } from './dto/updateCollection.input';

@Injectable()
export class CollectionsService {
  constructor(
    @Inject(GraphService) private graphService: GraphService,
    @Inject(UsersService) private usersService: UsersService,
  ) {}

  async findAll(user: JWTUser, pagination: PaginationInput | null) {
    if (user == null) {
      return this.graphService.collection.findMany({
        where: {
          status: Status.PUBLISHED,
        },
        include: {
          creatorTeam: false,
          nfts: {
            where: {
              status: Status.PUBLISHED,
            },
          },
        },
        take: pagination?.limit,
        skip: pagination?.offset,
      });
    }

    const userDb = (await this.usersService.findOne(user.userId))!;
    if (userDb.role === Role.ADMIN) {
      return this.graphService.collection.findMany({
        include: {
          creatorTeam: true,
          nfts: true,
        },
      });
    }

    if (userDb.teamId == null) {
      return this.graphService.collection.findMany({
        where: {
          status: Status.PUBLISHED,
        },
        include: {
          creatorTeam: true,
          nfts: true,
        },
      });
    }

    return this.graphService.collection.findMany({
      where: {
        OR: [
          {
            status: Status.PUBLISHED,
          },
          {
            creatorTeamId: userDb.teamId,
          },
        ],
      },
      include: {
        creatorTeam: true,
        nfts: true,
      },
    });
  }

  async findOne(id: number, user: JWTUser) {
    if (user == null) {
      return this.graphService.collection.findUnique({
        where: { id },
        include: {
          creatorTeam: false,
          nfts: {
            where: {
              status: Status.PUBLISHED,
            },
          },
        },
      });
    }

    if (user.payload.role === Role.ADMIN) {
      return this.graphService.collection.findUnique({
        where: { id },
        include: {
          creatorTeam: true,
          nfts: true,
        },
      });
    }

    const userDb = await this.usersService.findOne(user.userId);
    if (userDb?.teamId == null) {
      return this.graphService.collection.findFirst({
        where: {
          id,
          status: Status.PUBLISHED,
        },
        include: {
          creatorTeam: true,
          nfts: true,
        },
      });
    }

    return this.graphService.collection.findFirst({
      where: {
        id,
        OR: [
          {
            status: Status.PUBLISHED,
          },
          {
            creatorTeamId: userDb.teamId,
          },
        ],
      },
      include: {
        creatorTeam: true,
        nfts: true,
      },
    });
  }

  async create(collectionCreateInput: CreateCollectionInput, user: JWTUser) {
    const userDb = (await this.usersService.findOne(user.userId))!;
    if (userDb.teamId == null) {
      throw new ConflictException(`User must be in a team`);
    }

    if (
      collectionCreateInput.timeAutoArchiving != null &&
      collectionCreateInput.timeAutoArchiving.getTime() < Date.now()
    ) {
      throw new BadRequestException(
        `Time auto archiving must be in the future`,
      );
    }
    collectionCreateInput.nfts.forEach((nft) => {
      if (nft.price < 0) {
        throw new BadRequestException(`Price of ${nft.name} must be positive`);
      }
    });

    return this.graphService.collection.create({
      data: {
        name: collectionCreateInput.name,
        logo: collectionCreateInput.logo,
        timeAutoArchiving: collectionCreateInput.timeAutoArchiving,
        creatorTeamId: userDb.teamId,
        nfts: {
          createMany: {
            data: collectionCreateInput.nfts.map((nft) => ({
              ...nft,
              teamId: userDb.teamId!,
            })),
          },
        },
      },
      include: {
        creatorTeam: true,
        nfts: true,
      },
    });
  }

  async update(collectionUpdateInput: UpdateCollectionInput, user: JWTUser) {
    const collectionDb = await this.findOne(
      collectionUpdateInput.collectionId,
      user,
    );
    if (!collectionDb) {
      throw new NotFoundException('Collection not found');
    }
    const userDb = (await this.usersService.findOne(user.userId))!;
    if (userDb.teamId == null) {
      throw new ConflictException(`User must be in a team`);
    }

    if (userDb.role !== Role.ADMIN) {
      if (collectionDb.creatorTeamId !== userDb.teamId) {
        throw new ConflictException(
          `User must be the creator of the collection`,
        );
      }
      if (collectionDb.status === Status.ARCHIVED) {
        throw new ConflictException(`Collection is archived`);
      }

      if (
        collectionUpdateInput.timeAutoArchiving != null &&
        collectionUpdateInput.timeAutoArchiving.getTime() < Date.now()
      ) {
        throw new BadRequestException(
          `Time auto archiving must be in the future`,
        );
      }

      if (
        collectionDb.status == Status.PUBLISHED &&
        collectionUpdateInput.status == Status.DRAFT
      ) {
        throw new ConflictException(`Status can only be increased`);
      }
    }

    return this.graphService.collection.update({
      where: {
        id: collectionUpdateInput.collectionId,
      },
      data: {
        name: collectionUpdateInput.name ?? undefined,
        logo: collectionUpdateInput.logo,
        timeAutoArchiving: collectionUpdateInput.timeAutoArchiving,
        status: collectionUpdateInput.status ?? undefined,
      },
      include: {
        creatorTeam: true,
        nfts: true,
      },
    });
  }
}
