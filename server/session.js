require("dotenv").config();
const config = process.env;
const session = require("express-session");

const sess = {
  secret: config.COOKIE_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
};

module.exports = session({
  secret: config.COOKIE_SECRET,
  resave: false,
  saveUninitialized: true,
  store: store.create({
    mongoUrl: config.MONGODB_URI,
    mongoOptions: options,
  }),
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
  httpOnly: true,
});
