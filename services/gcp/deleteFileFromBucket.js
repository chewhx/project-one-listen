const bucket = require("../config/gcp/bucket");
const filePathCheck = require("../../utils/filePathCheck");
const createError = require("http-errors");

const deleteFileFromBucket = async (filePath) => {
  filePathCheck(filePath);

  await bucket.file(filePath).delete((err, res) => {
    if (err) {
      throw createError(500, err);
    }
  });
};

module.exports = deleteFileFromBucket;
