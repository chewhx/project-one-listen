const bucket = require("../../config/gcp/bucket");
const createHttpError = require("http-errors");

const checkFileExists = async (filePath) => {
  if (!filePath || typeof filePath !== "string")
    throw createHttpError(
      400,
      `checkFileExists: Invalid filePath: ${filePath}`
    );
  const [fileExists] = await bucket.file(filePath).exists();

  return fileExists;
};

module.exports = checkFileExists;
