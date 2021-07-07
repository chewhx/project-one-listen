require("dotenv").config();
const session = require("express-session");
const store = require("connect-mongo");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

module.exports = session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: true,
  store: store.create({
    mongoUrl: process.env.MONGODB_URI,
    mongoOptions: options,
  }),
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
  httpOnly: true,
});
