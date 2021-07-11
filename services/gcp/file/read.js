const bucket = require("../../../config/gcp/bucket");
const createHttpError = require("http-errors");
const filePathCheck = require("../../../utils/filePathCheck");

const readFileFromBucket = async (filePath) => {
  // Check file path
  filePathCheck(filePath);

  // Get file object, and file metadata
  const metadata = await bucket.file(filePath).getMetadata();

  // If file object or metadata does not exist, throw error
  if (!metadata)
    throw createHttpError(
      404,
      `readFileFromBucket: ${filePath} does not exist.`
    );

  let encoding = "utf-8";
  switch (metadata[0]["contentType"]) {
    case "audio/mpeg":
      encoding = "binary";
    default:
      null;
  }

  // Download file from bucket
  const [res] = await bucket.file(filePath).download();

  return { res, encoding };
};

module.exports = readFileFromBucket;
