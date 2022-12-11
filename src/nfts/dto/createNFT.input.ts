import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { Status } from '@prisma/client';

@InputType()
export class CreateNFTInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  image: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int, { nullable: true })
  collectionId: number | null;

  @Field(() => Status, { nullable: true })
  status: Status | null;
}
