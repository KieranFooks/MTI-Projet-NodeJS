import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Logged user response' })
export class LoggedUserOutput {
  @Field(() => String, { description: 'Generated access_token of the user' })
  access_token: string;
}
