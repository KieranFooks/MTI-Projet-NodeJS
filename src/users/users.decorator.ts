// user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '@prisma/client';

export class JWTUser {
  userId: number;
  payload: {
    email: string;
    name: string;
    id: string;
    teamId: number;
    role: Role;
  };
}

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
