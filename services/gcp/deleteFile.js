const bucket = require("../config/gcp/bucket");
const createError = require("http-errors");

const deleteFileGStorage = async (resource) => {
  // Delete mp3
  await bucket
    .file(`${resource.path.audio}/${resource.metadata.slug}`)
    .delete((err, res) => {
      if (err) {
        throw createError(500, err);
      }
    });
  // Delete json file
  await bucket
    .file(`${resource.path.parser}/${resource.metadata.slug}`)
    .delete((err, res) => {
      if (err) {
        throw createError(500, err);
      }
    });
};

module.exports = deleteFileGStorage;
