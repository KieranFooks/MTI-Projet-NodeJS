import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { NftModel } from '../../Models/nft';
import { CollectionModel } from '../../Models/collection';
import { UserModel } from '../../Models/user';

@ObjectType()
export class BestSellersTeamOutput {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => Float)
  balance: number;

  @Field(() => [UserModel])
  users: UserModel[];

  @Field(() => [CollectionModel], { nullable: 'items' })
  createdCollection: CollectionModel[];

  @Field(() => [NftModel], { nullable: 'items' })
  ownedNft: NftModel[];

  @Field(() => Int)
  amount: number;
}
