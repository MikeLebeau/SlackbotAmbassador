module.exports = {
  /**
   * Je donne un <teamName> et je veux que ca me donne le prochain dude qui sera ambassadeur
   * Exemple:
   *  Si dans la team ITC c'est mlebeau qui est ambassadeur
   *  Alors je veux que le prochain dude soit atemple
   * @param {string} teamName
   * @param {*} localState
   */
  getNextDude: (teamName, localState, allTeams) => {
    return allTeams[teamName].members[(allTeams[teamName].members.findIndex(
        dude => dude === localState[teamName].ambassador) + 1)
    % allTeams[teamName].members.length]
  }
}
