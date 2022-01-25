module.exports = {
  getNextSupportTeam: (actualSupportTeamCode, lastSupportTeamCode, allTeams) => {
    return Object.keys(allTeams).filter(teamName => teamName !== actualSupportTeamCode && teamName !== lastSupportTeamCode)[0];
  }
}
