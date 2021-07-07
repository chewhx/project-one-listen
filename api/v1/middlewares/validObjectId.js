const createHttpError = require("http-errors");
const ObjectId = require("mongoose").Types.ObjectId;

const validMongoObjectId = (req, res, next) => {
  const validObjectId = ObjectId.isValid(req.params.id);
  if (!validObjectId) throw createHttpError(400, `Invalid resource id`);
  next();
};

module.exports = validMongoObjectId;
