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
  }
  res.render("index", { user: req.user });
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
} = require("./config/classes");

setInterval(() => {
  while (parserQueue.length > 0 && parserNode.length === null) {
    // get a file from parser queue

    // pass into mercury parser
    return;
  }
}, 3000);

setInterval(() => {
  while (audioQueue.length > 0 && audioNode.length === null) {
    const file = audioQueue.dequeue();
    audioNode.push(file);
    const userId = file.value;
    axios
      .get(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then(({ data }) => {
        console.log(`json user downloaded - ${userId}`);
        fs.appendFileSync("./userIds.json", JSON.stringify(data), {
          encoding: "utf-8",
        });
        audioNode.pop();
        console.log(`json user written - ${userId}`);
      })
      .catch((err) => console.log(err));
  }
}, 2000);

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
