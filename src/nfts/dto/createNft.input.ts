import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { Status } from '@prisma/client';

@InputType()
export class CreateNftInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  image: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  collectionId: number;

  @Field(() => Status, { nullable: true })
  status: Status | null;
}
