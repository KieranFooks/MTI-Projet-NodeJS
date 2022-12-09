import 'reflect-metadata';
import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Status } from '@prisma/client';
import { NFTModel } from './nft';
import { TeamModel } from './team';

@ObjectType('collection')
export class CollectionModel {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  email?: string | null;

  @Field(() => Status)
  status: Status;

  @Field(() => Date)
  timeAutoArchive: Date | null;

  @Field(() => [NFTModel], { nullable: 'items' })
  nfts: NFTModel[];

  @Field(() => TeamModel)
  creatorTeam: TeamModel;
}

registerEnumType(Status, {
  name: 'Status',
});
