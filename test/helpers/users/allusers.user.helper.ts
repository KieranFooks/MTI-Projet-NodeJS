export const ALLUSERS_USER_OPERATION_NAME = 'AllUsers';
export const ALLUSERS_USER_QUERY = `query AllUsers($pagination: PaginationInput){
  allUsers(pagination:$pagination){
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

export const generateLoginUserVariables = (limit, offset) => {
  return {
    pagination: {
      limit,
      offset,
    },
  };
};
