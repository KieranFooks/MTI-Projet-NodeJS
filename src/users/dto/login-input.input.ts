import { Field, InputType } from '@nestjs/graphql';

@InputType({ description: 'Input for logging in' })
export class LoginInput {
  @Field(() => String, { description: 'Email of the user' })
  email: string;
  @Field(() => String, { description: 'Password of the user' })
  password: string;
}
