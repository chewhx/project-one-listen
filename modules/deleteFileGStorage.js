const gStorageClient = require("../config/gcp/gStorageClient");
const bucket = gStorageClient.bucket("flashcard-6ec1f.appspot.com");

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

module.exports = deleteFileGStorage