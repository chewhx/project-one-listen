const MongoUser = require("../config/mongoose/User");
const MongoFile = require("../config/mongoose/File");

//  ---------------------------------------------------------------------------------------
//  @desc     User files page
//  @route    GET  /user/:id
//  @access   Private

exports.get_user_uploads = async (req, res) => {
  try {
    // Make sure user and req params id matches
    const idMatch = req.user._id == req.params.id;

    // Get user from Mongo
    const { files } = await MongoUser.findById(req.user._id).populate({
      path: "files.owner",
      options: { sort: "-createdAt" },
    });

    if (!idMatch) {
      res.render("error", {
        error: `Unauthorised`,
        user: req.user,
      });
    }

    if (idMatch) {
      res.render("files", { files: files.owner, user: req.user });
    }
  } catch (error) {
    console.log(error);
    res.render("error", { error, user: req.user });
  }
};

//  ---------------------------------------------------------------------------------------
//  @desc     User profile page
//  @route    GET  /user/:id/profile
//  @access   Private

exports.get_user_profile = async (req, res, next) => {
  try {
    if (req.user._id != req.params.id) {
      throw Error("Not authorised");
    }

    // Get user from Mongo
    const user = await MongoUser.findById(req.user._id);

    res.render("profile", { user });
  } catch (err) {
    next(err);
  }
};

//  ---------------------------------------------------------------------------------------
//  @desc     Delete user account and files
//  @route    DELETE  /user/:id
//  @access   Private

exports.delete_user = async (req, res) => {
  try {
    // Get user from Monogo
    const user = await MongoUser.findById(req.user._id);
    // Delete all files from user
    await MongoFile.deleteMany({ _id: { $in: user.files.owner } });
    // Delete user from mongo
    user.remove();
    // Logout user
    res.redirect(303, "/logout");
    // Send email to confirm
  } catch (error) {
    next(err);
  }
};
