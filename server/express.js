const path = require("path");
const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");

const app = express();
require("../config/passport/auth0");

/* ----------DEV LOGGER-----------*/
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/* -------------CORS--------------*/
app.use(cors());

/* ----------BODY PARSER-----------*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ----------STATIC FILES-----------*/
app.use(express.static(path.resolve(__dirname, "../client/build")));

// Session
// config express-session
const sess = {
  secret: process.env.COOKIE_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
};

if (app.get("env") === "production") {
  // Use secure cookies in production (requires SSL/TLS)
  sess.cookie.secure = true;

  // Uncomment the line below if your application is behind a proxy (like on Heroku)
  // or if you're encountering the error message:
  // "Unable to verify authorization request state"
  // app.set('trust proxy', 1);
}

app.use(session(sess));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", require("../api/v2/routes/authRoute"));
app.use("/api/v2/user", require("../api/v2/routes/userRoute"));
app.use("/api/v2/podcast", require("../api/v2/routes/podcastRoute"));
app.use("/api/v2/upload", require("../api/v2/routes/uploadRoute"));
// app.use("/api/v2/resource", require("../api/v2/routes/resourceRoute"));
/* GET user profile. */
// app.get(
//   "/user",
//   require("../api/v2/middlewares/authenticated"),
//   (req, res, next) => {
//     const { _raw, _json, ...userProfile } = req.user;
//     res.status(200).send({
//       userProfile,
//       _json,
//     });
//   }
// );

const axios = require("axios");
app.get("/api/v2/rss", async (req, res, next) => {
  console.log(req.query.url);
  const { data } = await axios.get(req.query.url);
  res.status(200).send(data);
});

// Handle "/"
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

// Handle "*"
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

// Error handler
app.use(require("./error"));

module.exports = app;
