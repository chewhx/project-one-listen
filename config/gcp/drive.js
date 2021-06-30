const oAuthClient = require("./oAuthClient");
const { google } = require("googleapis");

const gDrive = google.drive({ version: "v3", auth: oAuthClient });

module.exports = gDrive;
