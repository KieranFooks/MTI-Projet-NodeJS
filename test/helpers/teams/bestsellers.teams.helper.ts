export const BESTSLLERS_TEAMS_OPERATION_NAME = 'BestSellers';
export const BESTSELLERS_TEAMS_QUERY = `query BestSellers($top: Int!) {
  bestSellersTeam(top: $top) {
    id
    name
    balance
    amount
  }
}`;

export const generateBestSellersVariables = (top) => {
  return {
    top,
  };
};
