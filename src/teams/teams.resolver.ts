import 'reflect-metadata';
import { Resolver, Args, Query, Mutation, Int } from '@nestjs/graphql';
import { TeamModel } from '../Models/team';
import { TeamsService } from './teams.service';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { CurrentUser, JWTUser } from '../users/users.decorator';
import { Role } from '@prisma/client';
import { VerifyIfAdim } from '../users/users.interceptor';
import { PaginationInput } from '../users/dto/pagination.input';
import { BestSellersTeamOutput } from './dto/best-sellers-team.output';

@Resolver(TeamModel)
export class TeamsResolver {
  constructor(private readonly teamsService: TeamsService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [TeamModel])
  teams(
    @Args('pagination', { nullable: true, type: () => PaginationInput })
    pagination: PaginationInput | null,
  ) {
    return this.teamsService.findAll(pagination);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => TeamModel, { nullable: true })
  team(@Args('id', { type: () => Int }) id: number) {
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
    @Args({ name: 'teamId', nullable: true, type: () => Int }) teamId: number,
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

  @Query(() => [BestSellersTeamOutput], { nullable: 'items' })
  async bestSellersTeam(
    @Args('top', { type: () => Int })
    top: number,
  ) {
    return await this.teamsService.bestSellers(top);
  }
}
