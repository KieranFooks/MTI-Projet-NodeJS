import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PaginationInput {
  @Field(() => Number, { description: 'classical limit', nullable: true })
  limit: number;
  @Field(() => Number, { description: 'classical offset', nullable: true })
  offset: number;
}
