require("dotenv").config();
const Auth0ManagementClient = require("auth0").ManagementClient;
const { AUTH0_DOMAIN, AUTH0_CLIENT_SECRET, AUTH0_CLIENT_ID } = process.env;

const auth0Manager = new Auth0ManagementClient({
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID,
  clientSecret: AUTH0_CLIENT_SECRET,
});

module.exports = auth0Manager;
