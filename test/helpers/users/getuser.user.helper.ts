export const GETUSER_USER_OPERATION_NAME = 'User';
export const GETUSER_USER_QUERY = `query User($id: Int!) {
  user(id: $id)
  {
    id
    email
    name
    blockchainAddress
    role
    team {id}
    buyTransactions {id}
    userRating {id}
  }
}`;

export const generateGetUserVariables = (id) => {
  return {
    id,
  };
};
