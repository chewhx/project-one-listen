const router = require("express").Router();
const MongoUser = require("../config/mongoose/User");
const MongoFile = require("../config/mongoose/File");
const File = require("../config/classes/File");
const uploadToGoogleDrive = require("../modules/googleDrive");
const { deleteFile } = require("../modules/googleStorage");

//  ---------------------------------------------------------------------------------------
//  @desc     User profile page
//  @route    GET  /user/:id
//  @access   Private

router.get("/:id", async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      res.render("error", {
        error: "Please log in to proceed",
        user: req.user,
      });
    }
    const idMatch = req.user._id == req.params.id;
    const user = await MongoUser.findById(req.user._id).populate({
      path: "files",
      options: { sort: "-createdAt" },
    });
    if (req.isAuthenticated() && idMatch) {
      res.render("profile", { user });
    }
    if (!idMatch) {
      res.render("error", {
        error: `User ${id} does not exist`,
        user: req.user,
      });
    }
  } catch (error) {
    console.log(error);
    res.render("error", { error, user: req.user });
  }
});

//  ---------------------------------------------------------------------------------------
//  @desc     Enqueue an article
//  @route    POST  /user/article
//  @access   Private

router.post("/article", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      throw Error;
    }
    const file = new File(req.body.url);
    file.user = req.user._id;
    const { _id: fileId } = await MongoFile.create({
      ...file.mongo(),
    });
    file.id = fileId;
    // parserQueue.enqueue(file);
    const user = await MongoUser.findById(req.user._id);
    user.files.push(fileId);
    user.save();
    res.redirect(`/user/${req.user._id}`);
  } catch (error) {
    res.status(400).render("error", { error, user: req.user });
  }
});

//  ---------------------------------------------------------------------------------------
//  @desc     Upload article audio to gdrive
//  @route    POST  /user/article/upload/:fileId
//  @access   Private

router.post("/article/upload/:fileId", async (req, res) => {
  try {
    // console.log(req.user);
    // console.log(req.params.fileId);
    // res.status(200);
    const file = await MongoFile.findById(req.params.fileId);
    const uploadSuccess = await uploadToGoogleDrive(file, req.user);
    if (uploadSuccess) {
      res.status(200).redirect(`/user/${req.user.id}`);
    }
  } catch (error) {
    res.render("error", { error });
  }
});

//  ---------------------------------------------------------------------------------------
//  @desc     Delete an article from user profile
//  @route    DELETE  /user/article/:fileId
//  @access   Private

router.delete("/article/:fileId", async (req, res) => {
  try {
    if (!req.isAuthenticated()) throw Error;

    // Pull from files array, decrease filesLength
    await MongoUser.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { files: req.params.fileId },
        $inc: { filesLength: -1 },
      },
      { new: true }
    );

    // Find find from db
    const file = await MongoFile.findById(req.params.fileId);

    // Delete file from Google Cloud Storage
    await deleteFile(file);

    // Delete file from db
    await file.remove();
    await file.save();

    res.redirect(303, `/user/${req.user._id}`);
  } catch (error) {
    res.render("error", { error, user: req.user });
  }
});
module.exports = router;
