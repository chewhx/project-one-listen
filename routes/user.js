const router = require("express").Router();
const MongoUser = require("../config/mongoose/User");
const MongoFile = require("../config/mongoose/File");
const File = require("../config/classes/File");

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
    const user = await MongoUser.findById(req.user._id).populate("files");
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
//  @desc     Delete an article from user profile
//  @route    DELETE  /user/article/:fileId
//  @access   Private

router.delete("/article/:fileId", async (req, res) => {
  try {
    if (!req.isAuthenticated()) throw Error;
    const updatedUser = await MongoUser.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { files: req.params.fileId },
      },
      { new: true }
    );
    const updatedFile = await MongoFile.findByIdAndDelete(req.params.fileId);
    res.redirect(303, `/user/${req.user._id}`);
  } catch (error) {
    res.render("error", { error, user: req.user });
  }
});
module.exports = router;
