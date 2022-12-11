import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { Status } from '@prisma/client';

@InputType()
export class UpdateNFTInput {
  @Field(() => Int)
  id: number;

  @Field(() => Status, { nullable: true })
  status: Status | null;

  @Field(() => Float, { nullable: true })
  price: number | null;
}
