const createHttpError = require("http-errors");

const private = (req, res, next) => {
  if (req.user._id == req.params.id) {
    next();
  } else {
    throw createHttpError(400, "Not authorised");
  }
};

module.exports = private;
