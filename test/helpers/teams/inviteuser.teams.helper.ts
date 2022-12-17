export const INVITEUSER_TEAM_OPERATION_NAME = 'InviteUserToTeam';
export const INVITEUSER_TEAM_MUTATION = `mutation InviteUserToTeam($userEmail: String!, $teamId: Int) {
  inviteUserToTeam(userEmail: $userEmail, teamId: $teamId) {
    id
    name
    balance
    users {id}
    createdCollection {id}
    ownedNft {id}
  }
}`;

export const generateInviteUserVariables = (userEmail, teamId?) => {
  return {
    userEmail,
    teamId,
  };
};
