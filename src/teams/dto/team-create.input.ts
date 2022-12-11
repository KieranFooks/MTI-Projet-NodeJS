import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TeamCreateInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  balance: number;
}
