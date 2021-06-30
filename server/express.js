const path = require("path");
const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const cookieSession = require("cookie-session");
const app = express();
const passport = require("passport");

// Dev logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    secret: process.env.COOKIE_SECRET,
    httpOnly: true,
  })
);

// Passport (after cookie session)
require("../config/passport/local");
require("../config/passport/google");
app.use(passport.initialize());
app.use(passport.session());

// Static files
app.use(express.static(path.resolve(__dirname, "../client/build")));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    ` Server running in ${process.env.NODE_ENV} on ${PORT} `.green.bold.inverse
  );
});

module.exports = app;
