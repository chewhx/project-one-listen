const MongoUser = require("../models/User");
const createHttpError = require("http-errors");

const userlimits = async (req, res, next) => {
  const user = await MongoUser.findById(req.user._id);

  const userLimitsExceed = user.checkLimits();

  if (userLimitsExceed) {
    throw createHttpError(400, `User limits exceeded`);
  } else {
    next();
  }
};

module.exports = userlimits;
