import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Status } from '@prisma/client';
import 'reflect-metadata';
import { NftModel } from './nft';
import { TeamModel } from './team';

@ObjectType('collection')
export class CollectionModel {
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
}

registerEnumType(Status, {
  name: 'Status',
});
