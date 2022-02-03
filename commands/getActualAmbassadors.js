const {transformTeamNameIntoCode} = require(
    "../utils/transformTeamNameIntoSHIIIT");
const {initState} = require("../utils/googleSheet");

module.exports = {
  name: '',
  description: 'Ca c\'est pour avoir les ambassadeurs actuels',
  method: (state, allTeams) => {
    state = initState(true, state);

    let response = `Semaine: du ${state.from} au ${state.to}\n`
        + 'Les ambassadeurs actuels sont:\n';

    Object.keys(allTeams).forEach(team => {
      response += `\tPour ${team} => <@${state[team].actual.name}>\n`
    });

    response += `Et l'équipe <#${transformTeamNameIntoCode(state.supportDev.actual)}> sera <#C01DTA5TVG8>\n`;
    return response;
  }
}
