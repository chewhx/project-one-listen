const MongoUser = require("../config/mongoose/User");
const MongoFile = require("../config/mongoose/File");


exports.get_user = async (req, res) => {
  try {
    // Make sure user and req params id matches
    const idMatch = req.user._id == req.params.id;

    // Get user from Mongo
    const user = await MongoUser.findById(req.user._id).populate({
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
      res.render("profile", { user });
    }
  } catch (error) {
    console.log(error);
    res.render("error", { error, user: req.user });
  }
};

