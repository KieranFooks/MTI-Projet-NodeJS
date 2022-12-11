import { InputType, Field } from '@nestjs/graphql';
import { NFTInput } from 'src/Models/nft';

@InputType()
export class CreateCollectionInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  logo: string | null;

  @Field(() => Date, { nullable: true })
  timeAutoArchiving: Date | null;

  @Field(() => [NFTInput], { nullable: 'items' })
  NFTs: NFTInput[];
}
