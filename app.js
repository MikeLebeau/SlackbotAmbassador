const axios = require('axios').default;
const {App} = require('@slack/bolt');
const ENV = require('./resources/env');
const TEAMS = require('./resources/teams');
const STATE = require('./resources/state');
const {google} = require("googleapis");
const {transformNameIntoCode} = require("./utils/transformUsernameIntoCode");
const {whereComeFromThisDude} = require("./utils/whereComeFromThisDude");
const {getNextTeam} = require("./utils/getNextTeam");
const {getNextDude} = require("./utils/getNextDude");
const {getHelp} = require("./utils/getHelp");
const {transformTeamNameIntoCode, transformCodeIntoTeamName} = require(
    "./utils/transformTeamNameIntoSHIIIT");
const {getNextSupportTeam} = require("./utils/getNextSupportTeam");

let localState = Object.seal({
  from: undefined,
  to: undefined,
  supportDev: {
    actual: undefined,
    last: undefined,
  },
  ITC: {
    ambassador: undefined,
    actual: {
      name: undefined,
      team: undefined,
    },
    last: {
      name: undefined,
      team: undefined,
    }
  },
  BDL: {
    ambassador: undefined,
    actual: {
      name: undefined,
      team: undefined,
    },
    last: {
      name: undefined,
      team: undefined,
    }
  },
  ACDC: {
    ambassador: undefined,
    actual: {
      name: undefined,
      team: undefined,
    },
    last: {
      name: undefined,
      team: undefined,
    }
  }
});

// Initializes your app with your bot token and signing secret
const app = new App({
  token: ENV.SLACK_BOT_TOKEN,
  signingSecret: ENV.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: ENV.SLACK_APP_TOKEN
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

app.command('/ambassadeurs', async ({command, ack, respond}) => {
  // Acknowledge command request
  await ack();

  // Affichage des ambassadeurs actuels
  if (command.text === '') {
    let response = 'Les ambassadeurs actuels sont:\n';

    Object.keys(TEAMS).forEach(team => {
      response += `\tPour ${team} => <@${localState[team].actual.name}>\n`
    });

    response += `Et l'équipe <#${localState.supportDev.actual}> sera <#C01DTA5TVG8>\n`

    await respond(response);
    return;
  }

  let args = command.text.trim().split(" ");

  // Si un boug essaie /ambassadeurs help
  if (args.length === 1 && args[0] === 'help') {
    await respond(getHelp());
    return;
  }

  // Ca c'est pour moi et mes tests
  if (args.length === 1 && args[0] === 'test') {

    // await GOOGLE_API.get(ENV.SPREADSHEET_ID, 'A1');

    await respond(`Alors alors ? Ca marche ?`);
    return;
  }

  // Si un boug essaie /ambassadeurs next
  if (args.length === 1 && args[0] === 'next') {

    Object.keys(TEAMS).forEach(team => {
      const nextTeam = getNextTeam(team, localState, TEAMS);
      const nextDude = getNextDude(nextTeam, localState, TEAMS);

      localState[team].last = localState[team].actual;
      localState[team].actual = {
        name: nextDude,
        team: nextTeam
      }
      localState[nextTeam].ambassador = nextDude;
    });

    localState.supportDev.last = localState.supportDev.actual;
    localState.supportDev.actual = getNextSupportTeam(transformCodeIntoTeamName(localState.supportDev.actual), TEAMS);

    let response = 'Les nouveaux ambassadeurs sont:\n';
    Object.keys(TEAMS).forEach(team => {
      response += `\tPour ${team} => <@${localState[team].actual.name}>\n`
    });
    response += `Et l'équipe ${localState.supportDev.actual} <#${localState.supportDev.actual}> sera <#C01DTA5TVG8>\n`
    await respond(response);
    return;
  }

  // Si un boug essaie /ambassadeurs next <team name>
  if (args.length === 2 && args[0] === 'next' && Object.keys(TEAMS).includes(
      args[1])) {
    const teamName = args[1];
    const newDude = getNextDude(localState[teamName].actual.team, localState, TEAMS);
    const textResponse = `Le prochain ambassadeur pour ${teamName} est: <@${newDude}>`;

    // Mise à jour du localState
    localState[teamName].actual.user = newDude;
    localState[localState[teamName].actual.team].ambassador = newDude;

    await respond(textResponse);
    // await app.client.chat.postMessage({
    //   channel: command.channel_id,
    //   text: textResponse,
    // });
    return;
  }

  // Si un boug essaie de faire de la merde
  await respond(`
    Hahaha tu t'es loupé gros naze! Bouge pas jsuis là pour toi...\n
    ${getHelp()}
  `);
});

function initState(isOnline) {
  if (isOnline) {
    const mySpreadsheet = google.sheets({
      version: 'v4',
      auth: 'AIzaSyAl2Ewy-Npt9u27stiCgoBImkvrJsHg3Zc'
    });

    mySpreadsheet.spreadsheets.values.get({
          spreadsheetId: ENV.SPREADSHEET_ID,
          range: 'Feuille 1!C2:F3',
        },
        (err, res) => {
          if (err) {
            console.error();
            throw ('The API returned an error. =>' + err);
          }

          let sheetValue = res.data.values;

          if (sheetValue.length === 0) {
            throw 'No data found.';
          }

          // First row is for the actual ambassadors
          // Ouuuuuais c'est tout degueu de faire comme ca mais osef je veux release là jpp couzin
          localState['ACDC'].actual = {
            name: transformNameIntoCode(`${sheetValue[0][0]}`),
            team: whereComeFromThisDude(transformNameIntoCode(`${sheetValue[0][0]}`), TEAMS),
          }

          localState[whereComeFromThisDude(
              transformNameIntoCode(`${sheetValue[0][0]}`), TEAMS)].ambassador = transformNameIntoCode(
              `${sheetValue[0][0]}`);

          localState['BDL'].actual = {
            name: transformNameIntoCode(`${sheetValue[0][1]}`),
            team: whereComeFromThisDude(transformNameIntoCode(`${sheetValue[0][1]}`), TEAMS),
          }
          localState[whereComeFromThisDude(
              transformNameIntoCode(`${sheetValue[0][1]}`), TEAMS)].ambassador = transformNameIntoCode(
              `${sheetValue[0][1]}`, TEAMS);

          localState['ITC'].actual = {
            name: transformNameIntoCode(`${sheetValue[0][2]}`, TEAMS),
            team: whereComeFromThisDude(transformNameIntoCode(`${sheetValue[0][2]}`), TEAMS),
          }
          localState[whereComeFromThisDude(
              transformNameIntoCode(`${sheetValue[0][2]}`), TEAMS)].ambassador = transformNameIntoCode(
              `${sheetValue[0][2]}`, TEAMS);

          localState.supportDev.actual = transformTeamNameIntoCode(sheetValue[0][3]);

          localState['ACDC'].last = {
            name: transformNameIntoCode(`${sheetValue[1][0]}`, TEAMS),
            team: whereComeFromThisDude(transformNameIntoCode(`${sheetValue[1][0]}`), TEAMS),
          }

          localState['BDL'].last = {
            name: transformNameIntoCode(`${sheetValue[1][1]}`, TEAMS),
            team: whereComeFromThisDude(transformNameIntoCode(`${sheetValue[1][1]}`), TEAMS),
          }

          localState['ITC'].last = {
            name: transformNameIntoCode(`${sheetValue[1][2]}`, TEAMS),
            team: whereComeFromThisDude(transformNameIntoCode(`${sheetValue[1][2]}`), TEAMS),
          }

          localState.supportDev.actual = transformTeamNameIntoCode(sheetValue[1][3]);
        });
  } else {
    localState = STATE;
  }
}

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  initState(true);

  console.log('⚡️ Bolt app is running!');
})();
