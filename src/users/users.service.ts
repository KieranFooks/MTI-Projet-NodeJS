import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginInput } from './dto/login-input.input';
import { UserCreateInput } from './dto/user-create-input.input';
import { GraphService } from 'src/common/graph/graph.service';
import { AuthService } from 'src/common/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(GraphService) private graphService: GraphService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async findAll() {
    return this.graphService.user.findMany({
      include: {
        buyTransactions: true,
        sellTransactions: true,
        team: true,
        userRating: true,
      },
    });
  }

  async findOne(id: number) {
    return this.graphService.user.findUnique({
      where: { id },
      include: {
        buyTransactions: true,
        sellTransactions: true,
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
        sellTransactions: true,
        team: true,
        userRating: true,
      },
    });
  }

  async create(user: UserCreateInput) {
    const foundUser = await this.graphService.user.findUnique({
      where: {
        email: user.email,
      },
    });
    if (foundUser !== null) {
      throw new ConflictException('Email already used');
    }

    const encryptedPassword = await bcrypt.hash(user.password, 10);
    return this.graphService.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: encryptedPassword,
        blockchainAddress: user.blockchainAddress,
      },
    });
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
