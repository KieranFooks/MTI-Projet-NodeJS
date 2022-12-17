import 'reflect-metadata';
import { Resolver, Args, Query, Mutation, Int } from '@nestjs/graphql';
import { TeamModel } from '../Models/team';
import { TeamsService } from './teams.service';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { CurrentUser, JWTUser } from '../users/users.decorator';
import { Role } from '@prisma/client';
import { VerifyIfAdim } from '../users/users.interceptor';

@Resolver(TeamModel)
export class TeamsResolver {
  constructor(private readonly teamsService: TeamsService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [TeamModel])
  teams() {
    return this.teamsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => TeamModel, { nullable: true })
  team(@Args('id') id: number) {
    return this.teamsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => TeamModel)
  async createTeam(
    @CurrentUser() jwtUser: JWTUser,
    @Args('name') name: string,
  ) {
    return await this.teamsService.create(name, jwtUser.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => TeamModel)
  async inviteUserToTeam(
    @Args('userEmail') userEmail: string,
    @Args({ name: 'teamId', nullable: true }) teamId: number,
    @CurrentUser() jwtUser: JWTUser,
  ) {
    return await this.teamsService.inviteUserToTeam(
      jwtUser,
      userEmail,
      teamId,
      jwtUser.payload.role == Role.ADMIN,
    );
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(VerifyIfAdim)
  @Mutation(() => TeamModel)
  async increaseTeamBalance(
    @Args({ name: 'teamId', type: () => Int }) teamId: number,
    @Args({ name: 'money', type: () => Int }) money: number,
  ) {
    return await this.teamsService.increaseTeamBalance(teamId, money);
  }
}
