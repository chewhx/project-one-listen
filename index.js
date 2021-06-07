require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const colors = require("colors");
const path = require("path");
const connectDb = require("./config/mongoose/connectDB");

// Start express app
const app = express();

// Connect to mongo
connectDb();

// View engine
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "public"));

const cookieSession = require("cookie-session");
const passport = require("passport");

express.static(path.resolve(__dirname, "public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(cookieSession({ maxAge: 24 * 60 * 60 * 1000, secret: "unicorn" }));
require("./config/passport/google");
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect(`/user/${req.user._id}`);
  } else {
    res.render("index", { user: req.user });
  }
});

//  ---------------------------------------------------------------------------------------
//  @desc     Users log out
//  @route    POST  /auth/logout
//  @access   Public

app.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

// ====================== Process queues ==============================

const { mercuryParser, googleSpeech, googleStorage } = require("./modules");

const MongoFile = require("./config/mongoose/File");

let parserBusy = false;
let audioBusy = false;
let storageBusy = false;

setInterval(async () => {
  if (parserBusy) return;
  // get a file on parser queue from mongo
  const file = await MongoFile.findOne({ queue: "Parser" });
  if (!file) return;
  // set parserbusy to true
  parserBusy = true;
  // pass into mercury parser
  const parserSuccesss = await mercuryParser(file);
  if (!parserSuccesss) {
    file.status = "Error";
  }
  // update mongo file
  file.queue = "Audio";
  await file.save();
  // set parserbusy to false
  parserBusy = false;
}, 3000);

setInterval(async () => {
  if (audioBusy) return;
  // get a file on parser queue from mongo
  const file = await MongoFile.findOne({ queue: "Audio" });
  if (!file) return;
  // set parserbusy to true
  audioBusy = true;
  // pass into mercury parser
  const audioSuccess = await googleSpeech(file);
  if (!audioSuccess) {
    file.status = "Error";
  }
  // update mongo file
  file.queue = "Storage";
  await file.save();
  // set parserbusy to false
  audioBusy = false;
}, 5000);

setInterval(async () => {
  if (storageBusy) return;
  // get a file on parser queue from mongo
  const file = await MongoFile.findOne({ queue: "Storage" });
  if (!file) return;
  // set storageBusy to true
  storageBusy = true;
  // pass into mercury parser
  const storageSuccess = await googleStorage(file);
  if (!storageSuccess) {
    file.status = "Error";
    await file.save();
  }
  // update mongo file
  if (storageSuccess) {
    file.status = "Completed";
    file.queue = "None";
    await file.save();
  }
  // set storageBusy to false
  storageBusy = false;
}, 1000);

// -====================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    ` Server running in ${process.env.NODE_ENV} on ${PORT} `.green.bold.inverse
  );
});
