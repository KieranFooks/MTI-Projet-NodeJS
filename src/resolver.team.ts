import 'reflect-metadata';
import {
  Resolver,
  InputType,
  Field,
  Args,
  Query,
  Mutation,
} from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { TeamModel } from './Models/team';

@InputType()
export class TeamCreateInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  balance: number;
}

@Resolver(TeamModel)
export class TeamResolver {
  constructor(@Inject(AppService) private appService: AppService) {}

  @Query(() => [TeamModel])
  teams() {
    return this.appService.team.findMany();
  }

  @Query(() => TeamModel, { nullable: true })
  team(@Args('id') id: number) {
    return this.appService.team.findUnique({
      where: { id },
    });
  }

  @Mutation(() => TeamModel)
  async createTeam(@Args('teamCreateInput') teamCreateInput: TeamCreateInput) {
    const newTeam = await this.appService.team.create({
      data: teamCreateInput,
    });

    await this.appService.user.update({
      where: { id: 1 },
      data: {
        team: {
          connect: {
            id: newTeam.id,
          },
        },
      },
    });

    return this.appService.team.findUnique({
      where: { id: newTeam.id },
    });
  }
}
