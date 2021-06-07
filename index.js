require("dotenv").config();
const fs = require("fs"); //*
const axios = require("axios"); //*
const url = require("url");
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
app.use("/action", require("./routes/action"));
app.use("/profile", require("./routes/profile"));

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect(`/profile/${req.user._id}`);
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

const {
  File,
  parserQueue,
  audioQueue,
  parserNode,
  audioNode,
  storageQueue,
  storageNode,
} = require("./config/classes");
const { mercuryParser, googleSpeech, googleStorage } = require("./modules");

const MongoFile = require("./config/mongoose/File");

setInterval(async () => {
  while (parserQueue.length > 0 && parserNode.length === null) {
    // dequeue from parser queue
    const file = parserQueue.dequeue();
    // push to parserNode
    parserNode.push(file);
    // pass into mercury parser
    const parserSuccesss = await mercuryParser(file);
    if (!parserSuccesss) {
      file.status = "Error";
    }
    // update mongo file
    const updatedMongoFile = await MongoFile.findByIdAndUpdate(
      file.id,
      {
        ...file.mongo(),
      },
      { new: true }
    );
    // pop from parserNode
    parserNode.pop();
    // enqueue to audioQueue
    audioQueue.enqueue(file);
  }
}, 3000);

setInterval(async () => {
  while (audioQueue.length > 0 && audioNode.length === null) {
    // dequeue from audio queue
    const file = audioQueue.dequeue();
    // push to audio node
    audioNode.push(file);
    // pass file into google speech
    const synthSuccess = await googleSpeech(file);
    if (!synthSuccess) {
      file.status = "Error";
    }
    // update mongo file
    const updatedMongoFile = await MongoFile.findByIdAndUpdate(
      file.id,
      { fileLink: file.fileLink, filePath: file.filePath },
      { new: true }
    );
    // pop from audio node
    audioNode.pop();
    // enqueue to storageQueue
    storageQueue.enqueue(file);
  }
}, 2000);

setInterval(async () => {
  while (storageQueue.length > 0 && storageNode.length === null) {
    // dequeue from storage queue
    const file = storageQueue.dequeue();
    // push to storage node
    storageNode.push(file);
    // pass file into google speech
    const uploadSuccess = await googleStorage(file);
    if (!uploadSuccess) {
      file.status = "Error";
    } else {
      file.status = "Completed";
    }
    // update mongo file
    const updatedMongoFile = await MongoFile.findByIdAndUpdate(
      file.id,
      {
        status: file.status,
      },
      { new: true }
    );
    // pop from storage node
    storageNode.pop();
  }
}, 1000);

// -====================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    ` Server running in ${process.env.NODE_ENV} on ${PORT} `.green.bold.inverse
  );
});

// const googleSpeech = require("./modules/googlespeech");
// const parser = require("./modules/mercuryparser");

// /**
//  * 1. Create a service account and project in Google Cloud Console
//  * 2. Download the credentials to the service account and rename it to "key.json"
//  * 3. Place the "keys.json" under /config folder
//  * 4. Run 'npm run start https://www.exampleurl.com/1999/01/01/dotcom'
//  *
//  * @param {String} url Article url to be synthesized to audio
//  * @returns Audioclip saved to 'downloads' folder under project root directory
//  */

// async function app(url) {
//   try {
//     const filePath = await parser(url);
//     await googleSpeech(filePath);
//   } catch (error) {
//     if (error.code === "ERR_INVALID_URL") {
//       console.error(
//         "Error: To run the program, input 'npm run start (url)'.\n"
//       );
//       return;
//     }
//     console.log(error);
//     return;
//   }
// }

// if (typeof process.argv[2] === "string") {
//   app(process.argv[2]);
// }
