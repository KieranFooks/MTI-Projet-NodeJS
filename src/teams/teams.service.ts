import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GraphService } from 'src/common/graph/graph.service';

@Injectable()
export class TeamsService {
  constructor(@Inject(GraphService) private graphService: GraphService) {}

  async findAll() {
    return this.graphService.team.findMany({
      include: {
        users: true,
      },
    });
  }

  async findOne(id: number) {
    return this.graphService.team.findUnique({
      where: { id },
      include: {
        users: true,
      },
    });
  }

  async create(name: string, userId: number) {
    const newTeam = await this.graphService.team.create({
      data: {
        name,
        users: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return newTeam;
  }

  async inviteUserToTeam(email: string, teamId: number, isAdmin: boolean) {
    const user = await this.graphService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!isAdmin && user.teamId) {
      throw new ConflictException('User already has a team');
    }

    await this.graphService.user.update({
      where: { id: user.id },
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
}
