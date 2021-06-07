const router = require("express").Router();
const MongoUser = require("../config/mongoose/User");
const MongoFile = require("../config/mongoose/File");
const {
  createNewClient,
  getNewClientTokens,
} = require("../config/gcp/oAuthClient");
const { mercuryParser, googleStorage, googleSpeech } = require("../modules");
const {
  File,
  parserQueue,
  audioQueue,
  parserNode,
  audioNode,
} = require("../config/classes");

//  ---------------------------------------------------------------------------------------
//  @desc     Post to add new url to parser queue
//  @route    POST  /action/enqueue
//  @access   Public

router.post("/enqueue", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      throw Error;
    }
    const file = new File(req.body.url);
    const { _id: fileId } = await MongoFile.create({
      fileName: file.fileName,
      user: req.user._id,
      status: "Processing",
      queue: "Parser",
    });
    file.id = fileId;
    parserQueue.enqueue(file);
    const user = await MongoUser.findById(req.user._id);
    user.files.push(fileId);
    user.save();
    console.log(parserQueue);
    res.redirect(`/profile/${req.user._id}`);
  } catch (error) {
    res.status(400).render("error", { error });
  }
});

//  ---------------------------------------------------------------------------------------
//  @desc     Synthesize audio for given url
//  @route    POST  /action/synthesize
//  @access   Public

// router.post("/synthesize", async (req, res) => {
//   try {
//     if (!req.isAuthenticated()) {
//       throw Error;
//     }

//     if (!req.body.url) {
//       res.render("error", { error: "Please input a valid url" });
//     }

//     // Parse url
//     const { fileName, filePath } = await mercuryParser(req.body.url);

//     // Synth audio
//     const { success, filePath: audioFilePath } = await googleSpeech(filePath);

//     // Upload to cloud storage
//     const fileLink = await googleStorage(audioFilePath);

//     // Add file metadata to mongo
//     const newFile = await File.create({
//       fileName,
//       filePath: audioFilePath,
//       fileLink,
//       user: req.user._id,
//     });
//     if (!newFile) throw Error;

//     const user = await User.findById(req.user._id);
//     user.files.push(newFile._id);
//     user.save();
//     // Redirect to page with download

//     res.redirect(`/profile/${req.user._id}`);
//   } catch (error) {
//     console.log(error);
//     res.render("error", { error });
//   }
// });

//  ---------------------------------------------------------------------------------------
//  @desc     Upload url for parse and synthesize
//  @route    POST  /action/upload?url=url
//  @access   Public

// router.post("/upload", async (req, res) => {
//   try {
//     if (req.isAuthenticated()) {
//       // find user google tokens
//       const { googleToken } = await User.findOne({
//         googleId: req.user.googleId,
//       });

//       // attached to oauth client
//       const client = createNewClient(googleToken);

//       // parse text to get filepath
//       const filePath = await mercuryParser(req.query.url);

//       // synthesize audio with filePath
//       const isSynthesized = await googleSpeech(filePath);

//       // upload to user gdrive with client

//       if (isSynthesized) {
//         res.render("good");
//       }
//     }
//     res.render("error");
//   } catch (error) {
//     res.render("error");
//     console.log(error);
//   }
// });

module.exports = router;
