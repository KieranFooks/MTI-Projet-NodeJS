import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class RateNFTInput {
  @Field(() => Int)
  nftId: number;

  @Field(() => Int)
  rate: number;
}
