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
export class VerifyIfUserInTeam implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    if (req.user.role == Role.ADMIN) {
      return next.handle();
    }

    if (req.user.payload.teamId == null) {
      throw new UnauthorizedException(
        'You need to be in a team to access this resource',
      );
    }

    if (req.body?.variables?.teamId == null) {
      req.body.variables.teamId = req.user.payload.teamId;
      return next.handle();
    }

    if (req.user.payload.teamId !== req.body?.variables?.teamId) {
      throw new UnauthorizedException(
        'You need to be in the same team to access this resource',
      );
    }

    return next.handle();
  }
}
