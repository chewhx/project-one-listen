const router = require("express").Router();
const passport = require("passport");
const User = require("../config/mongoose/User");

const SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/drive.file",
];

//  ---------------------------------------------------------------------------------------
//  @desc     Log in with Google OAuth
//  @route    POST  /auth/google
//  @access   Public

router.get(
  "/google",
  passport.authenticate("google", {
    scope: SCOPES,
    accessType: "offline",
    // Set access to offline to get refresh token: https://stackoverflow.com/questions/21942290/passport-node-js-not-returning-refresh-token
  })
);

//  ---------------------------------------------------------------------------------------
//  @desc     Google OAuth redirect
//  @route    GET  /auth/google/callback
//  @access   Private

router.get(
  "/google/callback",
  passport.authenticate("google"),
  async (req, res) => {
    const userExist = await User.findOne({ googleId: req.user.googleId });

    if (!userExist.googleToken.access_token) {
      const { tokens: googleToken } = await getNewToken(req.query.code);
      userExist.googleToken = googleToken;
      await userExist.save();
    }

    res.redirect("/");
  }
);

module.exports = router;
