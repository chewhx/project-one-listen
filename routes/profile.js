const router = require("express").Router();
const User = require("../config/mongoose/User");

//  ---------------------------------------------------------------------------------------
//  @desc     User profile page
//  @route    GET  /profile/:id
//  @access   Private

router.get("/:id", async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      res.render("error", { error: "none" });
    }
    const idMatch = req.user._id == req.params.id;
    const user = await User.findById(req.user._id).populate("files");
    if (req.isAuthenticated() && idMatch) {
      res.render("profile", { user });
    }
    if (!idMatch) {
      res.render("error", { error: "none" });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
