const MongoUser = require("../../models/User");
const createHttpError = require("http-errors");

const checkUserLimits = async (req, res, next) => {
  const user = await MongoUser.findById(req.user._id);

  const userLimitsExceed = user.checkLimits();

  if (userLimitsExceed) {
    throw createHttpError(400, `User limits exceeded`);
  }

  next();
};

module.exports = checkUserLimits;
