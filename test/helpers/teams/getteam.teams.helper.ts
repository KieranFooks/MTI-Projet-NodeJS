export const GET_TEAM_OPERATION_NAME = 'GetTeam';
export const GET_TEAM_QUERY = `query GetTeam($id: Int!){
  team(id:$id){
    id
    name
    balance
    users {id}
    createdCollection {id}
    ownedNft {id}
  }
}`;

export const generateGetTeamVariables = (id: number) => {
  return {
    id,
  };
};
