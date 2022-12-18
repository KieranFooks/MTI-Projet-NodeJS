import { Field, InputType } from '@nestjs/graphql';

@InputType({ description: 'Input for creating a user' })
export class UserCreateInput {
  @Field(() => String, { description: 'Email of the user' })
  email: string;
  @Field(() => String, { description: 'Name of the user' })
  name: string;
  @Field(() => String, { description: 'Blockchain address of the user' })
  blockchainAddress: string;
}
