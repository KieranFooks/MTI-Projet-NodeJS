import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { UserCreateInput } from './dto/user-create-input.input';
import { UserModel } from 'src/Models/user';
import { PaginationInput } from './dto/pagination.input';
import { LoginInput } from './dto/login-input.input';

const createUserInput: UserCreateInput = {
  name: 'test',
  email: 'test@gmail.com',
  blockchainAddress: '0x1234567890123456789012345678901234567890',
};

const createdUser: UserModel = {
  id: 1,
  ...createUserInput,
  role: 'USER',
  team: null,
  buyTransactions: [],
  sellTransactions: [],
  userRating: [],
};

describe('UsersResolver', () => {
  let resolver: UsersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(() => {
              return [
                {
                  ...createdUser,
                },
              ];
            }),
            findOne: jest.fn(() => {
              return {
                ...createdUser,
              };
            }),
            create: jest.fn(() => {
              return 'password';
            }),
            login: jest.fn(() => {
              return { access_token: '' };
            }),
          },
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should be able to create an user', async () => {
    const password = await resolver.signUp(createUserInput);
    expect(password).toBeDefined();
    expect(password).toBe('password');
  });
  it('should be able to list all users', async () => {
    const paginationInput: PaginationInput = { limit: 10, offset: 0 };
    const users = await resolver.allUsers(paginationInput);
    expect(users).toBeDefined();
    expect(Array.isArray(users)).toBe(true);
    expect(users[0].id).toBe(createdUser.id);
  });
  it('should be able to find one user by id', async () => {
    const user = await resolver.user(createdUser.id);
    expect(user).toBeDefined();
    expect(createdUser.id).toBe(createdUser.id);
  });
  it('should be able generate an access token', async () => {
    const loginUserInput: LoginInput = {
      email: createUserInput.email,
      password: 'password',
    };
    const { access_token } = await resolver.signIn(loginUserInput);
    expect(access_token).toBeDefined();
  });
});
