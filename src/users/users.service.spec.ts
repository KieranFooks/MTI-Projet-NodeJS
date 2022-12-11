import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { AuthService } from 'src/common/auth/auth.service';
import { GraphqlModule } from 'src/common/graphql.module';
import { UserModel } from 'src/Models/user';
import { prismaMock } from 'src/prismaMock';
import { LoginInput } from './dto/login-input.input';
import { PaginationInput } from './dto/pagination.input';
import { UserCreateInput } from './dto/user-create-input.input';
import { UsersService } from './users.service';

const createUserInput: UserCreateInput = {
  name: 'test',
  email: 'test@gmail.com',
  blockchainAddress: '0x1234567890123456789012345678901234567890',
};

const prismaCreatedUser: User = {
  id: 1,
  ...createUserInput,
  password: 'password',
  role: 'USER',
  teamId: null,
};

const createExistingUserInput: UserCreateInput = {
  name: 'test2',
  email: 'test2@gmail.com',
  blockchainAddress: '0x1234567890123456789012345678901234567890',
};

const prismaExistingCreatedUser: User = {
  id: 1,
  ...createUserInput,
  password: 'password',
  role: 'USER',
  teamId: null,
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

describe('UsersService', () => {
  let service: UsersService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [GraphqlModule],
      providers: [
        UsersService,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn((email, password) => {
              if (email !== createUserInput.email || password !== 'password') {
                return null;
              } else {
                return createUserInput;
              }
            }),
            generateUserCredentials: jest.fn(() => {
              return { access_token: '' };
            }),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    service.setGraphService(prismaMock);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an user with createUserInput', async () => {
    prismaMock.user.create.mockResolvedValue(prismaCreatedUser);
    prismaMock.user.findUnique.mockResolvedValue(null);

    const password = await service.create(createUserInput);
    expect(password).toBeDefined();
  });

  it('should fail create an user because email already used', async () => {
    prismaMock.user.findUnique.mockResolvedValue(prismaExistingCreatedUser);

    const call = async () => await service.create(createExistingUserInput);
    expect(call).rejects.toThrow('Email already used');
  });

  it('should fail create an user because blockChainAdress does not respect format', async () => {
    const user = createUserInput;
    user.blockchainAddress = 'sqd1qsd56qsd';
    const call = async () => await service.create(user);
    expect(call).rejects.toThrow('Invalid blockchain address');
  });

  it('should get a list of users', async () => {
    prismaMock.user.findMany.mockResolvedValue([prismaCreatedUser]);

    const paginationQuery: PaginationInput = { offset: 0, limit: 10 };
    const users = await service.findAll(paginationQuery);
    expect(users).toBeDefined();
    expect(Array.isArray(users)).toEqual(true);
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual(createUserInput.email);
  });

  it('should find a user by Id', async () => {
    prismaMock.user.findUnique.mockResolvedValue(prismaCreatedUser);
    const user = await service.findOne(prismaCreatedUser.id);
    expect(user).toBeDefined();
    expect(user?.id).toEqual(prismaCreatedUser.id);
    expect(user?.email).toEqual(prismaCreatedUser.email);
  });

  it('should find a user by email', async () => {
    prismaMock.user.findUnique.mockResolvedValue(prismaCreatedUser);
    const user = await service.findOneByEmail(prismaCreatedUser.email);
    expect(user).toBeDefined();
    expect(user?.id).toEqual(prismaCreatedUser.id);
    expect(user?.email).toEqual(prismaCreatedUser.email);
  });

  it('should be able to generate an access token', async () => {
    const loginUserInput: LoginInput = {
      email: createUserInput.email,
      password: 'password',
    };
    const { access_token } = await service.login(loginUserInput);
    expect(access_token).toBeDefined();
  });

  it('should be throw an exception', async () => {
    const loginUserInput: LoginInput = {
      email: createUserInput.email,
      password: 'pass',
    };
    const call = async () => await service.login(loginUserInput);
    expect(call).rejects.toThrow('Email or password are invalid');
  });
});
