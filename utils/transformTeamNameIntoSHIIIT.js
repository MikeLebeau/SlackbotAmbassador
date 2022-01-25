module.exports = {
  transformTeamNameIntoCode: (completeTeamName) => {
    switch(completeTeamName){
      case 'ACDC':
      case 'AC/DC':
        return 'C01TC2LRY6Q';
      case 'ITC':
      case 'IT Crowd':
        return 'C01TVM4PQ9E';
      case 'BDL':
      case 'Bureau des Légendes':
        return 'C01TAB1KUDU';
      default:
          throw `Aucune idée de ce que c'est ce team name => ${completeTeamName}`
    }
  },

  // To remove ? On verra plus tard
  transformCodeIntoTeamName: (codeDeSesMorts) => {
    switch(codeDeSesMorts){
      case 'C01TC2LRY6Q':
        return 'AC/DC';
      case 'C01TVM4PQ9E':
        return 'IT Crowd';
      case 'C01TAB1KUDU':
        return 'Bureau des Légendes';
      default:
        throw `Aucune idée de ce que c'est ce code => ${codeDeSesMorts}`
    }
  }
}
