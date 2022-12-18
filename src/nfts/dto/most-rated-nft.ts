import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Status } from '@prisma/client';
import { CollectionModel } from '../../Models/collection';
import { TeamModel } from '../../Models/team';
import { TransactionsModel } from '../../Models/transactions';
import { UserRatingModel } from '../../Models/userRating';

@ObjectType({ description: 'NFT with average rating' })
export class MostRatedNftOutput {
  @Field(() => Int, { description: 'Unique identifier for the NFT' })
  id: number;

  @Field(() => String, { description: 'Name of the NFT' })
  name: string;

  @Field(() => String, { description: 'Image of the NFT' })
  image: string;

  @Field(() => Int, { description: 'Price of the NFT' })
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
    description: 'User ratings of the NFT',
  })
  userRating: UserRatingModel[];

  @Field(() => Float, { description: 'Average rating of the NFT' })
  averageRate: number;
}
