import { Field, InputType } from '@nestjs/graphql';

@InputType({ description: 'Input for pagination' })
export class PaginationInput {
  @Field(() => Number, { description: 'Classical limit', nullable: true })
  limit: number;
  @Field(() => Number, { description: 'Classical offset', nullable: true })
  offset: number;
}
