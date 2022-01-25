const {App} = require('@slack/bolt');
const fs = require('fs');
const ENV = require('./resources/env');
const TEAMS = require('./resources/teams');
const {initState} = require("./utils/googleSheet");

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

let ALL_AVAILABLE_COMMANDS = {};


app.command('/ambassadeurs', async ({command, ack, respond}) => {
  // Acknowledge command request
  await ack();

  const allCommandPart = command.text.trim().split(" ");
  const commandName = allCommandPart[0];
  const commandArgs = allCommandPart.slice(1);

  if (Object.keys(ALL_AVAILABLE_COMMANDS).includes(commandName)) {
    if (commandName === 'help') {
      await respond(
          ALL_AVAILABLE_COMMANDS['help'].method(ALL_AVAILABLE_COMMANDS));
      return;
    }

    await respond(
        ALL_AVAILABLE_COMMANDS[commandName].method(localState, TEAMS, commandArgs));
    return;
  }

  // Si un boug essaie de faire de la merde
  await respond(`
  Hahaha tu t'es loupé gros naze! Bouge pas jsuis là pour toi...
  ${ALL_AVAILABLE_COMMANDS['help'].method(ALL_AVAILABLE_COMMANDS)}
  `);
});

function loadAllCommands() {
  const allFileName = fs.readdirSync('commands/');
  allFileName.forEach(fileName => {
    // Le ptit split('.')[0] a la fin c'est un moyen pas foufou pour enlever le `.js` du nom du fichier
    const tempShit = require(`./commands/${fileName.split('.')[0]}`);

    ALL_AVAILABLE_COMMANDS[tempShit.name] = tempShit;
    console.log(`COMMAND LOADED: ${tempShit.name} `);
  });
}

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  loadAllCommands();
  initState(true, localState);

  console.log('⚡️ Bolt app is running!');
})();
