export const SIGNIN_USER_OPERATION_NAME = 'SignIn';
export const SIGNIN_USER_MUTATION = `mutation SignIn($user:LoginInput!){
  signIn(user:$user){
    access_token
  }
}`;

export const generateLoginUserVariables = (email, password) => {
  return {
    user: {
      email,
      password,
    },
  };
};
