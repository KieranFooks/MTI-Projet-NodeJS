import { Field, InputType, Int } from '@nestjs/graphql';

@InputType({ description: 'Input for rating an NFT' })
export class RateNftInput {
  @Field(() => Int, { description: 'Unique identifier for the NFT' })
  nftId: number;

  @Field(() => Int, { description: 'Rating of the NFT' })
  rate: number;
}
