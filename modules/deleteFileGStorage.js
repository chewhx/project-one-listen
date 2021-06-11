const bucket = require("../config/gcp/bucket");

const deleteFileGStorage = async (file) => {
  try {
    // Delete mp3
    bucket
      .file(`${file.user}/audio/${file.metadata.slug}`)
      .delete((err, res) => {
        if (!err) {
          console.log("file deleted from gcs");
        }
      });
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = deleteFileGStorage;
