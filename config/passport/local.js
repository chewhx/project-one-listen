const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { hashPassword, matchPassword } = require("../../utils/password");
const User = require("../../models/User");
const logger = require("pino")({ prettyPrint: true });

passport.use(
  new LocalStrategy({ usernameField: "email" }, async function (
    username,
    password,
    done
  ) {
    // Check if user exists
    const userExist = await User.findOne({ email: username }).select(
      "password"
    );

    if (userExist) {
      // Check if password matches
      const isMatch = matchPassword(password, userExist.password);
      if (isMatch) {
        // Update user last login and limits
        userExist.lastLogin = new Date();
        await userExist.save();
        await userExist.resetLimits();
        const { _id, name, email, lastLogin } = userExist;
        return done(null, { _id, name, email, lastLogin });
      }
    }

    if (!userExist) {
      const newUser = await User.create({
        email: username,
        password: hashPassword(password),
        lastLogin: new Date(),
      });
      if (newUser) {
        logger.success(
          `passport LocalStrategy: ${newUser._id} - new user created`
        );
        const { _id, name, email, lastLogin } = newUser;
        return done(null, { _id, name, email, lastLogin });
      }
    }
    // ============
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    const { _id, name, email, lastLogin } = user;
    return done(null, { _id, name, email, lastLogin });
  });
});
