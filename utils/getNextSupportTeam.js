module.exports = {
  getNextSupportTeam: (actualSupportTeamCode, allTeams) => {
    return Object.keys(allTeams)[((Object.keys(allTeams).indexOf(actualSupportTeamCode)+1)%Object.keys(allTeams).length)];
  }
}
