import 'reflect-metadata';
import { Resolver, Args, Query, Mutation } from '@nestjs/graphql';
import { TeamModel } from 'src/Models/team';
import { TeamsService } from './teams.service';
import { TeamCreateInput } from './dto/team-create.input';

@Resolver(TeamModel)
export class TeamsResolver {
  constructor(private readonly teamsService: TeamsService) {}

  @Query(() => [TeamModel])
  teams() {
    return this.teamsService.findAll();
  }

  @Query(() => TeamModel, { nullable: true })
  team(@Args('id') id: number) {
    return this.teamsService.findOne(id);
  }

  @Mutation(() => TeamModel)
  async createTeam(@Args('teamCreateInput') teamCreateInput: TeamCreateInput) {
    return await this.teamsService.create(teamCreateInput);
  }
}
