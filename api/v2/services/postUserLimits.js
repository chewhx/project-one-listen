const createHttpError = require("http-errors");
const MongoUser = require("../models/User");
const logger = require("pino")({ prettyPrint: true });

const postUserLimits = async (userId) => {
  try {
    const user = await MongoUser.findById(userId);
    user.limits.perDayUsed += 1;
    user.limits.perMonthUsed += 1;
    user.files.owner.push(resource._id);
    await user.save();
    return true;
  } catch (err) {
    createHttpError(500, `Error updating user limits.`);
  }
};

module.exports = postUserLimits;
