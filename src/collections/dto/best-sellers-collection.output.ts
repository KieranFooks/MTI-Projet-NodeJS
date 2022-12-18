import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Status } from '@prisma/client';
import { TeamModel } from '../../Models/team';
import { NftModel } from '../../Models/nft';

@ObjectType({ description: 'Collection with most NFTs sold' })
export class BestSellersCollectionOutput {
  @Field(() => Int, { description: 'Unique identifier for the collection' })
  id: number;

  @Field(() => String, { description: 'Name of the collection' })
  name: string;

  @Field(() => String, {
    nullable: true,
    description: 'Optional logo of the collection',
  })
  logo: string | null;

  @Field(() => Status, { description: 'Status of the collection' })
  status: Status;

  @Field(() => Date, {
    nullable: true,
    description: 'Optional date where the collection will be archived',
  })
  timeAutoArchive: Date | null;

  @Field(() => [NftModel], {
    nullable: 'items',
    description: 'NFTs in the collection',
  })
  nfts: NftModel[];

  @Field(() => TeamModel, { description: 'Team that created the collection' })
  creatorTeam: TeamModel;

  @Field(() => Int, { description: 'Amount of NFTs sold' })
  amount: number;
}
