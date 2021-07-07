const createHttpError = require("http-errors");

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    throw createHttpError(400, "Not authorised");
  }
};

module.exports = authenticated;
