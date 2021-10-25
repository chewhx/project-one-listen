// Load environment variables from .env
require("dotenv").config();
const config = process.env;

// Load passport and strategy
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");

// Configure passport to use Auth0
passport.use(
  new Auth0Strategy(
    {
      domain: config.AUTH0_DOMAIN,
      clientID: config.AUTH0_CLIENT_ID,
      clientSecret: config.AUTH0_CLIENT_SECRET,
      callbackURL:
        config.AUTH0_CALLBACK_URL || "http://localhost:5000/auth/callback",
    },
    function (accessToken, refreshToken, extraParams, profile, done) {
      // accessToken is the token to call Auth0 API (not needed in the most cases)
      // extraParams.id_token has the JSON Web Token
      // profile has all the information from the user
      return done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
