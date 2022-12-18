import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { Status } from '@prisma/client';

@InputType({ description: 'Input for creating a new NFT' })
export class CreateNftInput {
  @Field(() => String, { description: 'Name of the NFT' })
  name: string;

  @Field(() => String, { description: 'Image of the NFT' })
  image: string;

  @Field(() => Float, { description: 'Price of the NFT' })
  price: number;

  @Field(() => Int, { description: 'Collection ID of the NFT' })
  collectionId: number;

  @Field(() => Status, {
    nullable: true,
    description: 'Status of the NFT, defaults to DRAFT',
  })
  status: Status | null;
}
