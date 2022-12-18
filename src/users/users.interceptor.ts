import { GqlExecutionContext } from '@nestjs/graphql';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { map } from 'rxjs/operators';

@Injectable()
export class Example implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    if (
      req.user.payload.role == Role.USER ||
      req.user.payload.role == Role.ADMIN
    ) {
      return next.handle();
    }

    throw new UnauthorizedException(
      'You are not allowed to access this resource',
    );
  }
}

@Injectable()
export class VerifyIfAdim implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    if (req.user.payload.role === Role.ADMIN) {
      return next.handle();
    }

    throw new UnauthorizedException(
      'You need to be an admin to access this resource',
    );
  }
}

@Injectable()
export class LogAccountCreation implements NestInterceptor {
  private readonly logger = new Logger('AccountCreation');

  async intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    const variables: any = Object.values(req.body.variables)[0];
    const email = variables.email;
    const role = 'USER';

    return next.handle().pipe(
      map((data) => {
        this.logger.log(`User ${email} with role ${role} created`);
        return data;
      }),
    );
  }
}
