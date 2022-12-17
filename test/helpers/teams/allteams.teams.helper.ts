export const ALLTEAMS_OPERATION_NAME = 'GetTeams';
export const ALLTEAMS_QUERY = `query GetTeams {
  teams {
    id
    name
    balance
    users {id}
    createdCollection {id}
    ownedNft {id}
  }
}`;
