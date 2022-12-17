import * as Chance from 'chance';
const chance = new Chance();

export const CREATE_TEAM_OPERATION_NAME = 'CreateTeam';
export const CREATE_TEAM_MUTATION = `mutation CreateTeam($name: String!){
  createTeam(name:$name){
    id
    name
    balance
    users {id}
    createdCollection {id}
    ownedNft {id}
  }
}`;

export const generateCreateTeamVariables = () => {
  const name = chance.name();
  return {
    name,
  };
};
