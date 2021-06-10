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
      path: "files",
      options: { sort: "-createdAt" },
    });

    if (!idMatch) {
      res.render("error", {
        error: `Unauthorised`,
        user: req.user,
      });
    }

    if (idMatch) {
      res.render("files", { files, user: req.user });
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

exports.get_user_profile = async (req, res) => {
  try {
    // Make sure user and req params id matches
    const idMatch = req.user._id == req.params.id;

    // Get user from Mongo
    const user = await MongoUser.findById(req.user._id);

    if (!idMatch) {
      res.render("error", {
        error: `Unauthorised`,
        user: req.user,
      });
    }

    if (idMatch) {
      res.render("profile", { user: req.user });
    }
  } catch (error) {
    console.log(error);
    res.render("error", { error, user: req.user });
  }
};
