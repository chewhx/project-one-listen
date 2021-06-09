const router = require("express").Router();
const MongoUser = require("../config/mongoose/User");
const MongoFile = require("../config/mongoose/File");
const uploadToGoogleDrive = require("../modules/googleDrive");
const private = require("../middlewares/private");

//  ---------------------------------------------------------------------------------------
//  @desc     User profile page
//  @route    GET  /user/:id
//  @access   Private

router.get("/:id", private, async (req, res) => {
  try {
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
//  @desc     Upload article audio to gdrive
//  @route    POST  /user/upload/:fileId
//  @access   Private

router.post("/upload/:fileId", private, async (req, res) => {
  try {
    const file = await MongoFile.findById(req.params.fileId);
    const uploadSuccess = await uploadToGoogleDrive(file, req.user);
    if (uploadSuccess) {
      res.status(200).redirect(`/user/${req.user.id}`);
    }
    res.status(500);
  } catch (error) {
    res.render("error", { error });
  }
});

module.exports = router;
