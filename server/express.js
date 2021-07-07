const path = require("path");
const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const passport = require("passport");

const app = express();

// Dev logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(require("./session"));

// Passport (after session)
require("../config/passport/local");
require("../config/passport/google");
app.use(passport.initialize());
app.use(passport.session());

// Static files
app.use(express.static(path.resolve(__dirname, "../client/build")));

// Routes
app.use("/api/v2/auth", require("../api/v2/routes/authRoute"));
app.use("/api/v2/user", require("../api/v2/routes/userRoute"));
app.use("/api/v2/resource", require("../api/v2/routes/resourceRoute"));

// Handle logout
app.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
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
