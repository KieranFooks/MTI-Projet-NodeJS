import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import {
  clearDatabase,
  initDatabaseForTeamsTests,
} from './helpers/database.helper';
import {
  CREATE_TEAM_MUTATION,
  CREATE_TEAM_OPERATION_NAME,
  generateCreateTeamVariables,
} from './helpers/teams/createteam.teams.helper';
import * as request from 'supertest';
import { TeamModel } from 'src/Models/team';
import {
  ALLTEAMS_OPERATION_NAME,
  ALLTEAMS_QUERY,
} from './helpers/teams/allteams.teams.helper';
import {
  generateGetTeamVariables,
  GET_TEAM_OPERATION_NAME,
  GET_TEAM_QUERY,
} from './helpers/teams/getteam.teams.helper';
import { Team, User } from '@prisma/client';
import {
  generateLoginUserVariables,
  SIGNIN_USER_MUTATION,
  SIGNIN_USER_OPERATION_NAME,
} from './helpers/users/signin.user.helper';
import {
  generateInviteUserVariables,
  INVITEUSER_TEAM_MUTATION,
  INVITEUSER_TEAM_OPERATION_NAME,
} from './helpers/teams/inviteuser.teams.helper';
import {
  BESTSELLERS_TEAMS_QUERY,
  BESTSLLERS_TEAMS_OPERATION_NAME,
  generateBestSellersVariables,
} from './helpers/teams/bestsellers.teams.helper';

const GRAPHQL_ENDPOINT = '/graphql';

describe('Teams resolver (e2e)', () => {
  let app: INestApplication;
  let team: TeamModel;
  let user1: User;
  let user2: User;
  let user3: User;
  let team1: Team;
  let team2: Team;
  let admin: User;
  let BEARER_JWT;
  let ADMIN_BEARER_JWT;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const dbValues = await initDatabaseForTeamsTests();
    user1 = dbValues.user;
    user2 = dbValues.user2;
    user3 = dbValues.user3;
    admin = dbValues.admin;
    team1 = dbValues.team1;
    team2 = dbValues.team2;

    await request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        operationName: SIGNIN_USER_OPERATION_NAME,
        query: SIGNIN_USER_MUTATION,
        variables: generateLoginUserVariables(user1.email, 'test'),
      })
      .expect((res) => {
        expect(res.body.data.signIn).toBeDefined();
        expect(res.body.data.signIn.access_token).toBeDefined();
        BEARER_JWT = `Bearer ${res.body.data.signIn.access_token}`;
      });
    await request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        operationName: SIGNIN_USER_OPERATION_NAME,
        query: SIGNIN_USER_MUTATION,
        variables: generateLoginUserVariables(admin.email, 'admin'),
      })
      .expect((res) => {
        expect(res.body.data.signIn).toBeDefined();
        expect(res.body.data.signIn.access_token).toBeDefined();
        ADMIN_BEARER_JWT = `Bearer ${res.body.data.signIn.access_token}`;
      });
  });

  afterAll(async () => {
    await clearDatabase();
    await app.close();
  });

  it('Should create a team with team mutation', () => {
    const variables = generateCreateTeamVariables();
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .set('Authorization', BEARER_JWT)
      .send({
        operationName: CREATE_TEAM_OPERATION_NAME,
        query: CREATE_TEAM_MUTATION,
        variables: variables,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.createTeam).toBeDefined();
        team = body.data.createTeam;
        expect(body.data.createTeam.name).toEqual(variables.name);
        expect(body.data.createTeam.balance).toEqual(0);
        expect(body.data.createTeam.users).toBeDefined();
        expect(body.data.createTeam.users[0].id).toEqual(user1.id);
        expect(body.data.createTeam.createdCollection).toBeDefined();
        expect(body.data.createTeam.ownedNft).toBeDefined();
      });
  });

  it('Should find all teams with team query', () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .set('Authorization', BEARER_JWT)
      .send({
        operationName: ALLTEAMS_OPERATION_NAME,
        query: ALLTEAMS_QUERY,
      })
      .expect(({ body }) => {
        expect(body.data.teams).toBeDefined();
        expect(body.data.teams.length).toEqual(3);
        const index = body.data.teams.length - 1;
        expect(body.data.teams[index].id).toEqual(team.id);
        expect(body.data.teams[index].name).toEqual(team.name);
        expect(body.data.teams[index].balance).toEqual(team.balance);
        expect(body.data.teams[index].users).toBeDefined();
        expect(body.data.teams[index].users[0].id).toEqual(team.users[0].id);
        expect(body.data.teams[index].createdCollection).toBeDefined();
        expect(body.data.teams[index].ownedNft).toBeDefined();
      });
  });

  it('Should find a team by id with team query', () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .set('Authorization', BEARER_JWT)
      .send({
        operationName: GET_TEAM_OPERATION_NAME,
        query: GET_TEAM_QUERY,
        variables: generateGetTeamVariables(team.id),
      })
      .expect(({ body }) => {
        expect(body.data.team).toBeDefined();
        expect(body.data.team.id).toEqual(team.id);
        expect(body.data.team.name).toEqual(team.name);
        expect(body.data.team.balance).toEqual(team.balance);
        expect(body.data.team.users).toBeDefined();
        expect(body.data.team.users[0].id).toEqual(team.users[0].id);
        expect(body.data.team.createdCollection).toBeDefined();
        expect(body.data.team.ownedNft).toBeDefined();
      });
  });

  it('Should add user to team', () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .set('Authorization', BEARER_JWT)
      .send({
        operationName: INVITEUSER_TEAM_OPERATION_NAME,
        query: INVITEUSER_TEAM_MUTATION,
        variables: generateInviteUserVariables(user2.email),
      })
      .expect(({ body }) => {
        expect(body.data.inviteUserToTeam).toBeDefined();
        expect(body.data.inviteUserToTeam.id).toEqual(team.id);
        expect(body.data.inviteUserToTeam.name).toEqual(team.name);
        expect(body.data.inviteUserToTeam.balance).toEqual(team.balance);
        expect(body.data.inviteUserToTeam.users).toBeDefined();
        expect(body.data.inviteUserToTeam.users.length).toEqual(2);
        expect(body.data.inviteUserToTeam.users[0].id).toEqual(user1.id);
        expect(body.data.inviteUserToTeam.users[1].id).toEqual(user2.id);
        expect(body.data.inviteUserToTeam.createdCollection).toBeDefined();
        expect(body.data.inviteUserToTeam.ownedNft).toBeDefined();
      });
  });

  it('Should add user to team with admin role', () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .set('Authorization', ADMIN_BEARER_JWT)
      .send({
        operationName: INVITEUSER_TEAM_OPERATION_NAME,
        query: INVITEUSER_TEAM_MUTATION,
        variables: generateInviteUserVariables(user3.email, team.id),
      })
      .expect((res) => {
        const { body } = res;
        expect(body.data.inviteUserToTeam).toBeDefined();
        expect(body.data.inviteUserToTeam.id).toEqual(team.id);
        expect(body.data.inviteUserToTeam.name).toEqual(team.name);
        expect(body.data.inviteUserToTeam.balance).toEqual(team.balance);
        expect(body.data.inviteUserToTeam.users).toBeDefined();
        expect(body.data.inviteUserToTeam.users.length).toEqual(3);
        expect(body.data.inviteUserToTeam.users[0].id).toEqual(user1.id);
        expect(body.data.inviteUserToTeam.users[1].id).toEqual(user2.id);
        expect(body.data.inviteUserToTeam.users[2].id).toEqual(user3.id);
        expect(body.data.inviteUserToTeam.createdCollection).toBeDefined();
        expect(body.data.inviteUserToTeam.ownedNft).toBeDefined();
      });
  });

  it('Should get the best sellers', () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        operationName: BESTSLLERS_TEAMS_OPERATION_NAME,
        query: BESTSELLERS_TEAMS_QUERY,
        variables: generateBestSellersVariables(10),
      })
      .expect((res) => {
        const { body } = res;
        expect(body.data.bestSellersTeam).toBeDefined();
        expect(body.data.bestSellersTeam.length).toEqual(3);
        expect(body.data.bestSellersTeam[1].amount).toBeLessThan(
          body.data.bestSellersTeam[0].amount,
        );
        expect(body.data.bestSellersTeam[2].amount).toBeLessThan(
          body.data.bestSellersTeam[1].amount,
        );
      });
  });
});
