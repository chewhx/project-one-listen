const createHttpError = require("http-errors");
const isMongoId = require("validator/lib/isMongoId");

const mongoid = (req, res, next) => {
  if (isMongoId(req.params.id)) {
    next();
  } else {
    throw createHttpError(400, "Invalid id");
  }
};

module.exports = mongoid;
