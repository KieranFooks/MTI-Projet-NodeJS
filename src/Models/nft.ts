import {
  Field,
  Float,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Status } from '@prisma/client';
import 'reflect-metadata';
import { CollectionModel } from './collection';
import { TeamModel } from './team';
import { TransactionsModel } from './transactions';
import { UserRatingModel } from './userRating';

@ObjectType('nft', {
  description:
    'A non-fungible token. Is owned by a team and belongs to a collection',
})
export class NftModel {
  @Field(() => Int, { description: 'Unique identifier for the NFT' })
  id: number;

  @Field(() => String, { description: 'Name of the NFT' })
  name: string;

  @Field(() => String, { description: 'Image of the NFT' })
  image: string;

  @Field(() => Float, { description: 'Price of the NFT' })
  price: number;

  @Field(() => Status, { description: 'Status of the NFT' })
  status: Status;

  @Field(() => TeamModel, { description: 'Team that owns the NFT' })
  team: TeamModel;

  @Field(() => [TransactionsModel], {
    nullable: 'items',
    description: 'Transaction history of the NFT',
  })
  transactions: TransactionsModel[];

  @Field(() => CollectionModel, {
    description: 'Collection the NFT belongs to',
  })
  collection: CollectionModel;

  @Field(() => [UserRatingModel], {
    nullable: 'items',
    description: 'User rating of the NFT',
  })
  userRating: UserRatingModel[];
}

@InputType('nftInput', { description: 'Input for creating a new NFT' })
export class NftInput {
  @Field(() => String, { description: 'Name of the NFT' })
  name: string;

  @Field(() => String, { description: 'Image of the NFT' })
  image: string;

  @Field(() => Float, { description: 'Price of the NFT' })
  price: number;
}

registerEnumType(Status, {
  name: 'Status',
});
