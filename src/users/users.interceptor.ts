import { GqlExecutionContext } from '@nestjs/graphql';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common/exceptions';

@Injectable()
export class Example implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    if (req.user.role == Role.USER || req.user.role == Role.ADMIN) {
      return next.handle();
    }

    throw new UnauthorizedException(
      'You are not allowed to access this resource',
    );
  }
}