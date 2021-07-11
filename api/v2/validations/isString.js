const createHttpError = require("http-errors")

module.exports = (content) => {
  if (typeof content === "string") {
    return true
  } else {
    throw createHttpError(400, "Body text is not valid string.")
  }
}