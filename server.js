require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const colors = require("colors");
const path = require("path");

const connectDb = require("./config/mongoose/connectDb");
const cookieSession = require("cookie-session");
const passport = require("passport");

const errorHandler = require("./middlewares/errorHandler");

// Start express app
const app = express();

// Connect to mongo
connectDb();

// View engine
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "public"));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dev logger
app.use(morgan("dev"));

// Passport and cookie sessions
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    secret: process.env.COOKIE_SECRET,
    httpOnly: true,
  })
);
require("./config/passport/google");
app.use(passport.initialize());
app.use(passport.session());

// Static files
app.use(express.static(path.join(__dirname, "./client/build")));

// Schedule jobs
require("./schedules/parser");
require("./schedules/synthesizer");
require("./schedules/resetDayLimits");
require("./schedules/resetMonthLimits");

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/api-v1-user"));
app.use("/file", require("./routes/api-v1-file"));

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect(`http://localhost:5000/profile/${req.user._id}`);
  }
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

//  ---------------------------------------------------------------------------------------
//  @desc     Error page
//  @route    GET  /error
//  @access   Public
app.get("/error", (req, res) => {
  res.render("error", { error: "Hi", user: req.user });
});

//  ---------------------------------------------------------------------------------------
//  @desc     Users log out
//  @route    POST  /logout
//  @access   Public

app.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

//  ---------------------------------------------------------------------------------------
//  @desc     All other pages and 404
//  @route    GET  /*
//  @access   Public
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    ` Server running in ${process.env.NODE_ENV} on ${PORT} `.green.bold.inverse
  );
});
