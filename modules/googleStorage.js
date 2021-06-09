require("dotenv").config();
const { Storage } = require("@google-cloud/storage");
const { GCP_CLIENT_EMAIL, GCP_PRIVATE_KEY, GCP_PROJECT_ID } = process.env;

const storage = new Storage({
  credentials: {
    client_email: GCP_CLIENT_EMAIL,
    private_key: GCP_PRIVATE_KEY.replace(/\\n/gm, "\n"),
  },
  projectId: GCP_PROJECT_ID,
});

const bucket = storage.bucket("flashcard-6ec1f.appspot.com");

exports.deleteFile = async (file) => {
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
