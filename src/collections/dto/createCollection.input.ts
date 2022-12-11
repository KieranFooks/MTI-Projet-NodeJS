import { Field, InputType } from '@nestjs/graphql';
import { NftInput } from 'src/Models/nft';

@InputType()
export class CreateCollectionInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  logo: string | null;

  @Field(() => Date, { nullable: true })
  timeAutoArchiving: Date | null;

  @Field(() => [NftInput], { nullable: 'items' })
  Nfts: NftInput[];
}
