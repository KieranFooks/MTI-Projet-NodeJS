import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { Status } from '@prisma/client';

@InputType({ description: 'Input for updating an NFT' })
export class UpdateNftInput {
  @Field(() => Int, { description: 'Unique identifier for the NFT' })
  id: number;

  @Field(() => Status, {
    nullable: true,
    description: 'Status of the NFT, stays the same if set to null',
  })
  status: Status | null;

  @Field(() => Float, {
    nullable: true,
    description: 'Price of the NFT, stays the same if set to null',
  })
  price: number | null;
}
