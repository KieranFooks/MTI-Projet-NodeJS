import { InputType, Field, Int } from '@nestjs/graphql';
import { Status } from '@prisma/client';

@InputType({ description: 'Input for updating a collection' })
export class UpdateCollectionInput {
  @Field(() => Int, { description: 'Unique identifier for the collection' })
  collectionId: number;

  @Field(() => String, {
    nullable: true,
    description: 'Name of the collection, stays the same if set to null',
  })
  name: string | null;

  @Field(() => String, {
    nullable: true,
    description: 'Logo of the collection',
  })
  logo: string | null;

  @Field(() => Date, { nullable: true, description: 'Date of auto-archiving' })
  timeAutoArchiving: Date | null;

  @Field(() => Status, {
    nullable: true,
    description: 'Status of the collection, stays the same if set to null',
  })
  status: Status | null;
}
