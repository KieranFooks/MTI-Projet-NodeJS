import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PaginationInput } from 'src/users/dto/pagination.input';
import { JWTUser } from 'src/users/users.decorator';
import { GraphService } from '../common/graph/graph.service';

@Injectable()
export class TeamsService {
  constructor(@Inject(GraphService) private graphService: GraphService) {}

  async findAll(pagination: PaginationInput | null) {
    return this.graphService.team.findMany({
      include: {
        users: true,
        ownedNft: true,
        createdCollection: true,
      },
      take: pagination?.limit,
      skip: pagination?.offset,
    });
  }

  async findOne(id: number) {
    return this.graphService.team.findUnique({
      where: { id },
      include: {
        users: true,
        ownedNft: true,
        createdCollection: true,
      },
    });
  }

  async create(name: string, userId: number) {
    const newTeam = await this.graphService.team.create({
      data: {
        name,
        balance: 0,
        users: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        users: true,
        ownedNft: true,
        createdCollection: true,
      },
    });

    return newTeam;
  }

  async inviteUserToTeam(
    jwtUser: JWTUser,
    email: string,
    teamId: number,
    isAdmin: boolean,
  ) {
    const invitedUser = await this.graphService.user.findUnique({
      where: { email },
    });

    const user = await this.graphService.user.findUnique({
      where: { id: jwtUser.userId },
    });

    if (!user || !invitedUser) {
      throw new NotFoundException('User not found');
    }

    if (!isAdmin && invitedUser.teamId) {
      throw new ConflictException('User already has a team');
    }

    if (!teamId && !user.teamId) {
      throw new UnauthorizedException('You are not in a team');
    }

    if (!teamId && user.teamId) {
      teamId = user.teamId;
    }

    if (!isAdmin && (!user.teamId || user.teamId !== teamId)) {
      throw new UnauthorizedException(
        'You are not allowed to invite users to this team',
      );
    }

    if (!teamId && user.teamId) {
      teamId = user.teamId;
    }

    await this.graphService.user.update({
      where: { id: invitedUser.id },
      data: {
        team: {
          connect: {
            id: teamId,
          },
        },
      },
    });

    return this.graphService.team.findUnique({
      where: { id: teamId },
      include: {
        users: true,
        ownedNft: true,
        createdCollection: true,
      },
    });
  }

  async increaseTeamBalance(teamId: number, money: number) {
    try {
      return await this.graphService.team.update({
        where: { id: teamId },
        data: {
          balance: { increment: money },
        },
      });
    } catch (e) {
      throw new NotFoundException('Team not found');
    }
  }

  async bestSellers(pagination: PaginationInput | null) {
    //return teams with the sum of the amount of transactions
    const teams = await this.graphService.team.findMany({
      include: {
        transactions: {
          select: {
            amount: true,
          },
        },
        users: true,
        ownedNft: true,
        createdCollection: true,
      },
      take: pagination?.limit,
      skip: pagination?.offset,
    });

    const teamsWithTotalTransactions = teams.map((team) => {
      const totalTransactions = team.transactions.reduce(
        (acc, curr) => acc + curr.amount,
        0,
      );
      return { ...team, totalTransactions };
    });

    return teamsWithTotalTransactions.sort(
      (a, b) => b.totalTransactions - a.totalTransactions,
    );
  }
}
