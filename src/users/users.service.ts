import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/common/auth/auth.service';
import { GraphService } from 'src/common/graph/graph.service';
import { LoginInput } from './dto/login-input.input';
import { UserCreateInput } from './dto/user-create-input.input';
import { PaginationInput } from './dto/pagination.input';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    @Inject(GraphService) private graphService: PrismaClient,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  setGraphService(prismaService: PrismaClient) {
    this.graphService = prismaService;
  }

  async findAll(pagination: PaginationInput | null) {
    return this.graphService.user.findMany({
      include: {
        buyTransactions: true,
        team: true,
        userRating: true,
      },
      take: pagination?.limit,
      skip: pagination?.offset,
    });
  }

  async findOne(id: number) {
    return this.graphService.user.findUnique({
      where: { id },
      include: {
        buyTransactions: true,
        team: true,
        userRating: true,
      },
    });
  }

  async findOneByEmail(email: string) {
    return this.graphService.user.findUnique({
      where: { email },
      include: {
        buyTransactions: true,
        team: true,
        userRating: true,
      },
    });
  }

  async create(user: UserCreateInput) {
    if (!/^0x[a-fA-F0-9]{40}$/.test(user.blockchainAddress)) {
      throw new BadRequestException('Invalid blockchain address');
    }

    const password = Math.random().toString(36).slice(-8);

    const foundUser = await this.graphService.user.findUnique({
      where: {
        email: user.email,
      },
    });
    if (foundUser !== null) {
      throw new ConflictException('Email already used');
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    await this.graphService.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: encryptedPassword,
        blockchainAddress: user.blockchainAddress,
      },
    });
    return password;
  }

  async login(loginUserInput: LoginInput) {
    const user = await this.authService.validateUser(
      loginUserInput.email,
      loginUserInput.password,
    );
    if (!user) {
      throw new BadRequestException(`Email or password are invalid`);
    } else {
      return this.authService.generateUserCredentials(user);
    }
  }
}
