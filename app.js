const { App } = require('@slack/bolt');
const ENV = require('./resources/env');
const TEAMS = require('./resources/teams');
const STATE = require('./resources/state');

// Pour initialiser l'état des ambassadeurs depuis un fichier externe
let state = STATE;

// Initializes your app with your bot token and signing secret
const app = new App({
  token: ENV.conf.SLACK_BOT_TOKEN,
  signingSecret: ENV.conf.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: ENV.conf.SLACK_APP_TOKEN
});

/**
 * Qu'est ce que je veux ?
 *  /ambassadeurs
 *    Me donne la liste des ambassadeurs
 *
 *  /ambassadeurs next
 *    Me donne les prochains ambassadeurs
 *    + mets à jour les ambassadeur actuels
 *
 *  /ambassadeurs next <team name>
 *    Ma donne le prochain ambassadeur de l'équipe demandé
 *    + mets à jour les ambassadeurs actuels
 */

app.command('/ambassadeurs', async({command, ack, respond}) =>{
  // Acknowledge command request
  await ack();

  // Affichage des ambassadeurs actuels
  if(command.text === ''){
    let response = 'Les ambassadeurs actuels sont:\n';
    
    Object.keys(TEAMS).forEach(team => {
      response += `\tPour ${team} => ${state[team].actual.name}\n`
    });

    await respond(response);
    return;
  }

  let args = command.text.trim().split(" ");

  // Si un boug essaie /ambassadeurs next
  if(args.length === 1 && args[0] === 'next'){

    Object.keys(TEAMS).forEach(team => {
      nextTeam = getNextTeam(team, state);
      nextDude = getNextDude(nextTeam, state);

      state[team].last = state[team].actual;
      state[team].actual = {
        name: nextDude,
        team: nextTeam
      }
      state[nextTeam].ambassador = nextDude;
    });

    await respond(`Les nouveaux ambassadeurs sont:\n
    \tPour ITC => ${state.ITC.actual.name}\n
    \tPour BDL => ${state.BDL.actual.name}\n
    \tPour ACDC => ${state.ACDC.actual.name}`);
    return;
  }

  // Si un boug essaie /ambassadeurs next <team name>
  if(args.length === 2 && args[0] === 'next' && Object.keys(TEAMS).includes(args[1])){
    await respond(`Le prochain ambassadeur de ${args[1]} est: Tata`);
  } else {
    await respond(ENV.errors.ERROR_MESSAGE_TEAM);
  }

  // Si un boug essaie de faire de la merde
  await respond(ENV.errors.ERROR_MESSAGE_COMMAND);
  return;
});

/**
 * Je donne un <teamName> et je veux que ca me donne le prochain dude qui sera ambassadeur
 * Exemple:
 *  Si dans la team ITC c'est mlebeau qui est ambassadeur
 *  Alors je veux que le prochain dude soit tfleurant
 * @param {string} teamName 
 * @param {*} state 
 */
function getNextDude(teamName, state) {
  return TEAMS[teamName][(TEAMS[teamName].findIndex(dude => dude === state[teamName].ambassador) + 1) % TEAMS[teamName].length]
}

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
function getNextTeam(teamName, state) {
  const needToChange = state[teamName].actual.team === state[teamName].last.team;
  let teams = Object.keys(TEAMS);
  if(needToChange){
    return teams.find(team => team !== teamName && team !== state[teamName].actual.team);
  } else {
    return state[teamName].actual.team;
  }
}

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();
