import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Status } from '@prisma/client';
import 'reflect-metadata';
import { NftModel } from './nft';
import { TeamModel } from './team';

@ObjectType('collection', { description: 'A group of NFTs' })
export class CollectionModel {
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
}

registerEnumType(Status, {
  name: 'Status',
});
