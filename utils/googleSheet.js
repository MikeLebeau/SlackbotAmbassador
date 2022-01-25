const ENV = require("../resources/env");
const {whereComeFromThisDude} = require("./whereComeFromThisDude");
const TEAMS = require("../resources/teams");
const STATE = require("../resources/state");
const {google} = require("googleapis");

// Find here => https://stackoverflow.com/questions/48242812/google-sheets-jwt-client-with-service-account
const spreadShit = google.sheets({
  version: 'v4',
  auth: new google.auth.JWT(
      ENV.GOOGLE_API_MAIL,
      null,
      ENV.GOOGLE_API_KEY,
      ["https://www.googleapis.com/auth/spreadsheets"]
  )
});

module.exports = {
  initState: (isOnline, state) => {
    if (isOnline) {
      /**
       * Voila un ptit mapping pour bien recup les info
       *
       *    || Du | Au  | AC DC | BDL | ITC | Support Dev
       * 0  || 0  | 1   | 2     | 3   | 4   | 5
       * 1  || 0  | 1   | 2     | 3   | 4   | 5
       *
       * du coup sheetValue[row][column]
       * donc la row 0 est pour les ambassadeurs actuels
       * et la row 1 est pour les ambassadeur precedent
       *
       */
      spreadShit.spreadsheets.values.get({
            spreadsheetId: ENV.SPREADSHEET_ID,
            range: 'Feuille 1!A2:F3',
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

            state['from'] = `${sheetValue[0][0]}`;
            state['to'] = `${sheetValue[0][1]}`;

            state.supportDev.actual = sheetValue[0][5];
            state.supportDev.last = sheetValue[1][5];

            // First row is for the actual ambassadors
            state['ACDC'].actual = {
              name: `${sheetValue[0][2]}`,
              team: whereComeFromThisDude(`${sheetValue[0][2]}`, TEAMS),
            }

            state['BDL'].actual = {
              name: `${sheetValue[0][3]}`,
              team: whereComeFromThisDude(`${sheetValue[0][3]}`, TEAMS)
            }

            state['ITC'].actual = {
              name: `${sheetValue[0][4]}`,
              team: whereComeFromThisDude(`${sheetValue[0][4]}`, TEAMS)
            }


            state[whereComeFromThisDude(
                `${sheetValue[0][2]}`,
                TEAMS)].ambassador = `${sheetValue[0][2]}`;

            state[whereComeFromThisDude(
                `${sheetValue[0][3]}`,
                TEAMS)].ambassador = `${sheetValue[0][3]}`;

            state[whereComeFromThisDude(
                `${sheetValue[0][4]}`,
                TEAMS)].ambassador = `${sheetValue[0][4]}`;


            state['ACDC'].last = {
              name: `${sheetValue[1][2]}`,
              team: whereComeFromThisDude(`${sheetValue[1][2]}`, TEAMS)
            }

            state['BDL'].last = {
              name: `${sheetValue[1][3]}`,
              team: whereComeFromThisDude(`${sheetValue[1][3]}`, TEAMS)
            }

            state['ITC'].last = {
              name: `${sheetValue[1][4]}`,
              team: whereComeFromThisDude(`${sheetValue[1][4]}`, TEAMS)
            }
          });
    } else {
      state = STATE;
    }

    return state;
  },

  saveState: (state, needNewLine) => {
    const requestUpdateAddLine = {
      spreadsheetId: ENV.SPREADSHEET_ID,
      resource: {
        includeSpreadsheetInResponse: false,
        responseRanges: [],
        responseIncludeGridData: false,
        requests: [
          {
            insertDimension: {
              range: {
                sheetId: 0,
                dimension: 'ROWS',
                startIndex: 1,
                endIndex: 2
              },
              inheritFromBefore: false
            },
          }
        ]
      }
    };

    const requestUpdate = {
      spreadsheetId: ENV.SPREADSHEET_ID,
      range: 'Feuille 1!A2:F2',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        majorDimension: "ROWS",
        values: [
          [
            state.from,
            state.to,
            state.ACDC.actual.name,
            state.BDL.actual.name,
            state.ITC.actual.name,
            state.supportDev.actual
          ],
        ]
      }
    };

    try {
      if (needNewLine) {
        spreadShit.spreadsheets.batchUpdate(requestUpdateAddLine).then(
            () => {
              console.log('Add a line to spreadshit');
              spreadShit.spreadsheets.values.update(requestUpdate).then(
                  () => console.log('Update new line'))
            }
        );
      } else {
        spreadShit.spreadsheets.values.update(requestUpdate).then(
            () => console.log('Update new line'));
      }
    } catch (err) {
      console.error(err);
    }
  }
}
