const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../../api/v2/models/User");
const logger = require("pino")({ prettyPrint: true });

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.REDIRECT_URI,
    },
    async function (accessToken, refreshToken, profile, done) {
      const { id: googleId, displayName: name, _json } = profile;
      const { email, picture: photo } = _json;
      const userExist = await User.findOne({ googleId: googleId });

      if (userExist) {
        userExist.googleToken = {
          access_token: accessToken,
          refresh_token: refreshToken,
          scope:
            "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive.file openid https://www.googleapis.com/auth/userinfo.email",
          token_type: "Bearer",
          expiry_date: Date.now() + 1000 * 60 * 60,
        };
        userExist.lastLogin = new Date();
        await userExist.save();
        await userExist.resetLimits();
        const { _id, name, email, photo, googleId, lastLogin } = userExist;
        return done(null, { _id, name, email, photo, googleId, lastLogin });
      }
      // ============
      if (!userExist) {
        const newUser = await User.create({
          name,
          email,
          photo,
          googleId,
          googleToken: {
            refresh_token: refreshToken,
            access_token: accessToken,
            scope:
              "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive.file openid https://www.googleapis.com/auth/userinfo.email",
            token_type: "Bearer",
            expiry_date: Date.now() + 1000 * 60 * 60,
          },
          lastLogin: new Date(),
        });
        if (newUser) {
          logger.success(
            `passport GoogleStrategy: ${newUser._id} - new user created`
          );
          const { _id, name, email, photo, googleId, lastLogin } = newUser;
          return done(null, { _id, name, email, photo, googleId, lastLogin });
        }
      }
      // ============
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    const { _id, name, email, photo, googleId, lastLogin } = user;
    done(null, { _id, name, email, photo, googleId, lastLogin });
  });
});
