const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../mongoose/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      const { id: googleId, displayName: name, _json } = profile;
      const { email, picture: photo } = _json;
      const userExist = await User.findOne({ googleId: googleId });

      if (userExist) {
        return done(null, userExist);
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
          },
        });
        if (newUser) {
          console.log("new user created");
          return done(null, newUser);
        }
      }
      // ============
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});
