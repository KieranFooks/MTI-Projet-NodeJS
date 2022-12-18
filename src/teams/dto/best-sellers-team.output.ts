import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { NftModel } from '../../Models/nft';
import { CollectionModel } from '../../Models/collection';
import { UserModel } from '../../Models/user';

@ObjectType({ description: 'A team with the ' })
export class BestSellersTeamOutput {
  @Field(() => Int, { description: 'Unique identifier for the team' })
  id: number;

  @Field(() => String, { description: 'Name of the team' })
  name: string;

  @Field(() => Float, { description: 'Current balance of the team' })
  balance: number;

  @Field(() => [UserModel], { description: 'Members of the team' })
  users: UserModel[];

  @Field(() => [CollectionModel], {
    nullable: 'items',
    description: 'Collections created by the team',
  })
  createdCollection: CollectionModel[];

  @Field(() => [NftModel], {
    nullable: 'items',
    description: 'NFTs owned by the team',
  })
  ownedNft: NftModel[];

  @Field(() => Float, {
    description: 'Total amount of money gained by selling NFTs',
  })
  amount: number;
}
