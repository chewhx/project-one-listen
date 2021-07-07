const router = require("express").Router();
const passport = require("passport");

const SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/drive.file",
];

//  ---------------------------------------------------------------------------------------
//  @desc     Log in with Local OAuth
//  @route    POST  /auth/local
//  @access   Public

router.post(
  "/local",
  passport.authenticate("local", { failureRedirect: "/login" }),
  async (req, res) => res.status(200).json(req.user)
);

//  ---------------------------------------------------------------------------------------
//  @desc     Log in with Google OAuth
//  @route    GET  /auth/google
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
//  @access   Public

router.get("/google/callback", passport.authenticate("google"), (req, res) => {
  res.redirect("/");
});

//  ---------------------------------------------------------------------------------------
//  @desc     Check user auth
//  @route    GET  /auth/user
//  @access   Public
router.get("/user", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      res.status(200).send(req.user);
    } else {
      throw Error;
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
