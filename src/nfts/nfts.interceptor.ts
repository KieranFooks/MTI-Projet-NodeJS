import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { map } from 'rxjs/operators';

@Injectable()
export class LogSellNft implements NestInterceptor {
  private readonly logger = new Logger('SellNft');

  async intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    return next.handle().pipe(
      map((data) => {
        this.logger.log(
          `The nft ${data.id} has been bought by the user ${
            req.user.userId
          }  of the team ${data.teamId} from the team ${
            data.transactions[data.transactions.length - 1].sellerTeamId
          } for ${data.price}$.${
            data.collection
              ? ` The nft bellongs to the collection ${data.collection.name}.`
              : ''
          }`,
        );
        return data;
      }),
    );
  }
}
