const createHttpError = require("http-errors");
const { isURL } = require("validator");

module.exports = (string) => {
  if (isURL(string)) {
    return true;
  }
  throw createHttpError(400, "Invalid url.");
};
