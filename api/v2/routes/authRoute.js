const router = require("express").Router();
const passport = require("passport");

const SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/drive.file",
];

router.post("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
});

router.post(
  "/local",
  passport.authenticate("local", { failureRedirect: "/login" }),
  async (req, res) => res.status(200).json(req.user)
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: SCOPES,
    accessType: "offline",
    // Set access to offline to get refresh token: https://stackoverflow.com/questions/21942290/passport-node-js-not-returning-refresh-token
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", (req, res) => {
    res.status(200);
  })
);

module.exports = router;
