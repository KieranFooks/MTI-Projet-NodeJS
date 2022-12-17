import * as Chance from 'chance';
import * as RandExp from 'randexp';
const chance = new Chance();

export const SIGNUP_USER_OPERATION_NAME = 'SignUp';

export const SIGNUP_USER_MUTATION = `mutation SignUp($userCreateInput: UserCreateInput!){
  signUp(user:$userCreateInput)
}`;

export const generateCreateUserVariables = () => {
  return {
    userCreateInput: {
      email: chance.email(),
      name: chance.name(),
      blockchainAddress: new RandExp(/^0x[a-fA-F0-9]{40}$/).gen(),
    },
  };
};
