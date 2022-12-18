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
  @Query(() => [TeamModel], {
    nullable: 'items',
    name: 'teams',
    description: 'Get all teams. You need to be logged in to use this query.',
  })
  teams(
    @Args('pagination', {
      nullable: true,
      type: () => PaginationInput,
      description: 'Optional argument used to paginate the query.',
    })
    pagination: PaginationInput | null,
  ) {
    return this.teamsService.findAll(pagination);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => TeamModel, {
    nullable: true,
    name: 'team',
    description: 'Get team by id. You need to be logged in to use this query.',
  })
  team(
    @Args('id', {
      type: () => Int,
      description: 'The id of the requested team.',
    })
    id: number,
  ) {
    return this.teamsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => TeamModel, {
    nullable: true,
    name: 'createTeam',
    description:
      'Create a new team. You need to be logged in to use this mutation.',
  })
  async createTeam(
    @CurrentUser() jwtUser: JWTUser,
    @Args('name') name: string,
  ) {
    return await this.teamsService.create(name, jwtUser.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => TeamModel, {
    name: 'inviteUserToTeam',
    description:
      'Invite a user to a team. You need to be logged in to use this mutation.',
  })
  async inviteUserToTeam(
    @Args('userEmail') userEmail: string,
    @Args({
      name: 'teamId',
      nullable: true,
      type: () => Int,
      description:
        'The id of team where the user is invited. If the user is not an admin, this id needs to be the id of the team where the user is a member.',
    })
    teamId: number,
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
  @Mutation(() => TeamModel, {
    name: 'increaseTeamBalance',
    description: 'Increase the balance of a team. You need to be an admin.',
  })
  async increaseTeamBalance(
    @Args({
      name: 'teamId',
      type: () => Int,
      description: 'The id of the team',
    })
    teamId: number,
    @Args({
      name: 'money',
      type: () => Int,
      description: 'The amount of money that will be add the team balance',
    })
    money: number,
  ) {
    return await this.teamsService.increaseTeamBalance(teamId, money);
  }

  @Query(() => [BestSellersTeamOutput], {
    nullable: 'items',
    name: 'bestSellersTeam',
    description: 'Get the best sellers teams.',
  })
  async bestSellersTeam(
    @Args('top', {
      type: () => Int,
      description: 'The number of teams to return.',
    })
    top: number,
  ) {
    return await this.teamsService.bestSellers(top);
  }
}
