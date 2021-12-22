module.exports = {
  whereComeFromThisDude: (completeDudeName, allTeams) => {
    if(allTeams.ACDC.members.includes(completeDudeName)){
      return 'ACDC';
    }
    if(allTeams.BDL.members.includes(completeDudeName)){
      return 'BDL';
    }
    if(allTeams.ITC.members.includes(completeDudeName)){
      return 'ITC';
    }
  }
}
