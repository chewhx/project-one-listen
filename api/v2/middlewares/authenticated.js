const createHttpError = require("http-errors");

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("From middleware auth: Auth");
    return next();
  }
  console.log("From middleware auth: No auth");
  req.session.returnTo = req.originalUrl;
  res.redirect("/auth/login");
};

module.exports = authenticated;
