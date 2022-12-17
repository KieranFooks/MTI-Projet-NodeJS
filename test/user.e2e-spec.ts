import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import {
  SIGNUP_USER_MUTATION,
  SIGNUP_USER_OPERATION_NAME,
  generateCreateUserVariables,
} from './helpers/users/signup.user.helper';
import * as request from 'supertest';
import {
  generateLoginUserVariables as generateSignInVariables,
  SIGNIN_USER_MUTATION,
  SIGNIN_USER_OPERATION_NAME,
} from './helpers/users/signin.user.helper';
import { UserCreateInput } from '../src/users/dto/user-create-input.input';
import { clearDatabase } from './helpers/database.helper';
import {
  ALLUSERS_USER_QUERY,
  ALLUSERS_USER_OPERATION_NAME,
} from './helpers/users/allusers.user.helper';
import {
  generateGetUserVariables,
  GETUSER_USER_OPERATION_NAME,
  GETUSER_USER_QUERY,
} from './helpers/users/getuser.user.helper copy';
import { Role } from '@prisma/client';

const GRAPHQL_ENDPOINT = '/graphql';

describe('Users resolver (e2e)', () => {
  let app: INestApplication;
  let user: UserCreateInput;
  let BEARER_JWT;
  let user_password;
  let id;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  afterAll(async () => {
    clearDatabase();
  });

  it('Should create an user with user mutation', () => {
    const userCreateInput = generateCreateUserVariables().userCreateInput;
    user = userCreateInput;
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        operationName: SIGNUP_USER_OPERATION_NAME,
        query: SIGNUP_USER_MUTATION,
        variables: { userCreateInput },
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.signUp).toBeDefined();
        user_password = res.body.data.signUp;
      });
  });

  it('Should login the new user with login user mutation', () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        operationName: SIGNIN_USER_OPERATION_NAME,
        query: SIGNIN_USER_MUTATION,
        variables: generateSignInVariables(user.email, user_password),
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.signIn).toBeDefined();
        expect(res.body.data.signIn.access_token).toBeDefined();
        BEARER_JWT = `Bearer ${res.body.data.signIn.access_token}`;
      });
  });

  it('Should get all users with users query', () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .set('Authorization', BEARER_JWT)
      .send({
        operationName: ALLUSERS_USER_OPERATION_NAME,
        query: ALLUSERS_USER_QUERY,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.allUsers).toBeDefined();
        expect(res.body.data.allUsers).toBeInstanceOf(Array);
        expect(res.body.data.allUsers.length).toBeGreaterThan(0);
        id = res.body.data.allUsers[0].id;
        expect(res.body.data.allUsers[0].email).toEqual(user.email);
        expect(res.body.data.allUsers[0].name).toEqual(user.name);
        expect(res.body.data.allUsers[0].blockchainAddress).toEqual(
          user.blockchainAddress,
        );
      });
  });

  it('Should get an user by id with user query', () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .set('Authorization', BEARER_JWT)
      .send({
        operationName: GETUSER_USER_OPERATION_NAME,
        query: GETUSER_USER_QUERY,
        variables: generateGetUserVariables(id),
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.user).toBeDefined();
        expect(res.body.data.user.id).toEqual(id);
        expect(res.body.data.user.email).toEqual(user.email);
        expect(res.body.data.user.name).toEqual(user.name);
        expect(res.body.data.user.blockchainAddress).toEqual(
          user.blockchainAddress,
        );
        expect(res.body.data.user.role).toEqual(Role.USER);
        expect(res.body.data.user.team).toEqual(null);
        expect(res.body.data.user.buyTransactions).toBeDefined();
        expect(res.body.data.user.userRating).toBeDefined();
      });
  });

  it('Should return an error when trying to get an user by id with no authorization', () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .set('Authorization', '')
      .send({
        operationName: GETUSER_USER_OPERATION_NAME,
        query: GETUSER_USER_QUERY,
        variables: generateGetUserVariables(id),
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.errors[0].extensions.response.statusCode).toEqual(401);
      });
  });

  it('Sould return an error when creating user with wrong blockchain address', () => {
    const userCreateInput = generateCreateUserVariables().userCreateInput;
    user = userCreateInput;
    user.blockchainAddress = '0x123';
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        operationName: SIGNUP_USER_OPERATION_NAME,
        query: SIGNUP_USER_MUTATION,
        variables: { userCreateInput },
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.errors[0].extensions.response.statusCode).toEqual(400);
      });
  });
});
