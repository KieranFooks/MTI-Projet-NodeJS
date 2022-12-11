import { InputType, Field, Int } from '@nestjs/graphql';
import { Status } from '@prisma/client';

@InputType()
export class UpdateCollectionInput {
  @Field(() => Int)
  collectionId: number;

  @Field(() => String, { nullable: true })
  name: string | null;

  @Field(() => String, { nullable: true })
  logo: string | null;

  @Field(() => Date, { nullable: true })
  timeAutoArchiving: Date | null;

  @Field(() => Status, { nullable: true })
  status: Status | null;
}
