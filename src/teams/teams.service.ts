import { Inject, Injectable } from '@nestjs/common';
import { GraphService } from 'src/common/graph/graph.service';
import { TeamCreateInput } from './dto/team-create.input';

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

  async create(teamCreateInput: TeamCreateInput) {
    const newTeam = await this.graphService.team.create({
      data: teamCreateInput,
    });

    await this.graphService.user.update({
      where: { id: 1 },
      data: {
        team: {
          connect: {
            id: newTeam.id,
          },
        },
      },
    });

    return this.graphService.team.findUnique({
      where: { id: newTeam.id },
    });
  }
}
