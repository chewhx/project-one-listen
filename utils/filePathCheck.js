const createHttpError = require("http-errors");

const filePathCheck = (filePath) => {
  const regexMatch = filePath.match(/^(.+)\/([^\/]+)$/g);

  if (!filePath || typeof filePath !== "string" || !regexMatch) {
    throw createHttpError(500, `Invalid filePath`);
  }
};

module.exports = filePathCheck;
