const router = require("express").Router();

const MongoFile = require("../config/mongoose/File");
const MongoUser = require("../config/mongoose/User");

const private = require("../middlewares/private");
const slug = require("../utils/slug");

const { deleteFile } = require("../modules/googleStorage");

//  ---------------------------------------------------------------------------------------
//  @desc     Enqueue a file
//  @route    POST  /file
//  @access   Private

router.post("/", private, async (req, res) => {
  try {
    // Find user by id
    const user = await MongoUser.findById(req.user._id);

    // Check user quota
    const quotaExceeds = user.files.length >= user.filesQuota;

    // If quota exceeds, throw error
    if (quotaExceeds) {
      throw Error(
        `Files quota exceeded. Delete your current files to make space.`
      );
    }

    // If quote does not exceed
    if (!quotaExceeds) {
      // Add new file to db
      const { _id: fileId } = await MongoFile.create({
        sourceUrl: req.body.url,
        metadata: {
          title: "",
          slug: "",
          excerpt: "",
          wordCount: 0,
          charCount: 0,
        },
        filePath: "",
        fileName: "",
        user: req.user._id,
      });
      // Push file to user files array
      user.files.push(fileId);
      user.save();
    }
    res.redirect(`/user/${req.user._id}`);
  } catch (error) {
    console.log(error);
    res.status(400).render("error", { error, user: req.user });
  }
});

//  ---------------------------------------------------------------------------------------
//  @desc     Delete a file
//  @route    DELETE  /file/:fileId
//  @access   Private

router.delete("/:fileId", private, async (req, res) => {
  try {
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
