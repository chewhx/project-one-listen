require("dotenv").config();
const { google } = require("googleapis");
const User = require("../mongoose/User");

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI } = process.env;

const createNewClient = (tokens) => {
  if (!tokens) return "No tokens attached";

  // create a new client with service keys
  const googleAuthClient = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    REDIRECT_URI
  );

  // attach tokens to client
  googleAuthClient.setCredentials(tokens);

  // return client with credentials for user
  return googleAuthClient;
};

const getNewClientTokens = (code) => {
  return googleAuthClient.getToken(code);
};

module.exports = { createNewClient, getNewClientTokens };
