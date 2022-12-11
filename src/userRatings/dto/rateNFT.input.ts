import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class RateNftInput {
  @Field(() => Int)
  nftId: number;

  @Field(() => Int)
  rate: number;
}
