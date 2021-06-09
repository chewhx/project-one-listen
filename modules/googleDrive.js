require("dotenv").config();
const fs = require("fs");
const Stream = require("stream");
const { Storage } = require("@google-cloud/storage");
const { google } = require("googleapis");

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI,
  GCP_CLIENT_EMAIL,
  GCP_PRIVATE_KEY,
  GCP_PROJECT_ID,
} = process.env;

async function uploadToGoogleDrive(file, user) {
  try {
    // Create oAuth Client for Google Drive API with user credentials
    const oAuthClient = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      REDIRECT_URI
    );

    oAuthClient.setCredentials(user.googleToken);

    const drive = google.drive({ version: "v3", auth: oAuthClient });

    // Download file from GCloud Storage
    const bucket = new Storage({
      credentials: {
        client_email: GCP_CLIENT_EMAIL,
        private_key: GCP_PRIVATE_KEY.replace(/\\n/gm, "\n"),
      },
      projectId: GCP_PROJECT_ID,
    }).bucket("flashcard-6ec1f.appspot.com");

    const [res] = await bucket
      .file(`${file.user}/audio/${file.metadata.slug}`)
      .download();

    const read = new Stream.Readable({
      read() {},
    });

    read.push(res, "binary");
    read.push(null);

    drive.files.create(
      {
        requestBody: {
          name: `${file.metadata.slug}.mp3`,
          mimeType: "audio/mpeg",
        },
        media: {
          mimeType: "audio/mpeg",
          body: read,
        },
        fields: "id",
      },
      (err, file) => {
        if (!err) {
          return true;
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
}

module.exports = uploadToGoogleDrive;
