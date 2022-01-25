const {getNextTeam} = require("../utils/getNextTeam");
const {getNextDude} = require("../utils/getNextDude");
const {getNextSupportTeam} = require("../utils/getNextSupportTeam");
const {transformTeamNameIntoCode} = require(
    "../utils/transformTeamNameIntoSHIIIT");
const {saveState} = require("../utils/googleSheet");

module.exports = {
  name: 'next',
  description: `Ca c\'est pour désigner les ambassadeurs pour la semaine prochaine
  \`/ambassadeur next [ITC|ACDC|BDL]\`
  Ca c'est pour désigner une autre personne qui doit être ambassadeur pour l'équipe donnée`,
  method: (myState, allTeams, args) => {

    if(args.length === 1 && Object.keys(allTeams).includes(args[0])){
      const teamName = args[0];
      const newDude = getNextDude(myState[teamName].actual.team, myState, allTeams);

      myState[teamName].actual = {name: newDude, team: myState[teamName].actual.team};
      myState[myState[teamName].actual.team].ambassador = newDude;

      saveState(myState, false);
      return `Le prochain ambassadeur pour ${teamName} est: <@${newDude}>`;
    }

    Object.keys(allTeams).forEach(team => {
      const nextTeam = getNextTeam(team, myState, allTeams);
      const nextDude = getNextDude(nextTeam, myState, allTeams);

      myState[team].last = myState[team].actual;
      myState[team].actual = {
        name: nextDude,
        team: nextTeam
      }
      myState[nextTeam].ambassador = nextDude;
    });

    const tempTeam = myState.supportDev.actual;

    myState.supportDev.actual = getNextSupportTeam(
        myState.supportDev.actual, myState.supportDev.last, allTeams);

    myState.supportDev.last = tempTeam;

    let response = `Semaine: du ${myState.from} au ${myState.to}\n`
        + 'Les nouveaux ambassadeurs sont:\n';

    Object.keys(allTeams).forEach(team => {
      response += `\tPour ${team} => <@${myState[team].actual.name}>\n`
    });

    response += `Et l'équipe ${myState.supportDev.actual} <#${transformTeamNameIntoCode(
        myState.supportDev.actual)}> sera <#C01DTA5TVG8>\n`;


    saveState(myState, true);
    return response;
  }
}
