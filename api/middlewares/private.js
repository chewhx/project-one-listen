const createError = require("http-errors");

const private = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    throw createError(401, "Unauthorised");
  }
};

module.exports = private;
