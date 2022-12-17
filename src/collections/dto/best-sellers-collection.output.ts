import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Status } from '@prisma/client';
import { TeamModel } from '../../Models/team';
import { NftModel } from '../../Models/nft';

@ObjectType()
export class BestSellersCollectionOutput {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  logo: string | null;

  @Field(() => Status)
  status: Status;

  @Field(() => Date, { nullable: true })
  timeAutoArchive: Date | null;

  @Field(() => [NftModel], { nullable: 'items' })
  nfts: NftModel[];

  @Field(() => TeamModel)
  creatorTeam: TeamModel;

  @Field(() => Int)
  amount: number;
}
