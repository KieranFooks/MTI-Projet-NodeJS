import { Field, InputType } from '@nestjs/graphql';
import { NftInput } from '../../Models/nft';

@InputType({ description: 'Input for creating a collection' })
export class CreateCollectionInput {
  @Field(() => String, { description: 'Name of the collection' })
  name: string;

  @Field(() => String, {
    nullable: true,
    description: 'Optional logo of the collection',
  })
  logo: string | null;

  @Field(() => Date, {
    nullable: true,
    description: 'Optional date where the collection will be archived',
  })
  timeAutoArchiving: Date | null;

  @Field(() => [NftInput], {
    nullable: 'items',
    description: 'NFTs in the collection',
  })
  nfts: NftInput[];
}
