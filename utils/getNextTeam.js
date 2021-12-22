module.exports = {
  /**
   * Je donne le <teamName> de l'équipe dont je veux connaitre la prochaine équipe d'ou va venir l'ambassadeur
   * Exemple:
   *  Je veux savoir quel sera la prochaine équipe a allez au DM de ITC
   *  actual: BDL
   *  last: BDL
   *  => prochaine équipe sera ACDC
   * @param {string} teamName
   * @param {*} state
   */
  getNextTeam: (teamName, localState, allTeams) => {
    const needToChange = localState[teamName].actual.team
        === localState[teamName].last.team;

    if (needToChange) {
      return Object.keys(allTeams).find(
          team => team !== teamName && team !== localState[teamName].actual.team);
    } else {
      return localState[teamName].actual.team;
    }
  }
}
