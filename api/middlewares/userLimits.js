const MongoUser = require("../../models/User");
const createHttpError = require("http-errors");

const checkUserLimits = async (req, res, next) => {
  try {
    const user = await MongoUser.findById(req.user._id);

    const userLimitsExceed = user.checkLimits();

    if (userLimitsExceed) {
      throw createHttpError(400, `User limits exceeded`);
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = checkUserLimits;
