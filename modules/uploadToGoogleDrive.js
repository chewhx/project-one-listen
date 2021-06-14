const Stream = require("stream");
const bucket = require("../config/gcp/bucket");
const oAuthClient = require("../config/gcp/oAuthClient");
const { google } = require("googleapis");

async function uploadToGoogleDrive(file, googleToken) {
  try {
    // Set user credentials and auth for GDrive
    oAuthClient.setCredentials(googleToken);

    const drive = google.drive({
      version: "v3",
      auth: oAuthClient,
    });

    // Download audio from bucket
    const [res] = await bucket
      .file(`${file.user}/audio/${file.metadata.slug}`)
      .download();

    const read = new Stream.Readable({
      read() {},
    });

    read.push(res, "binary");
    read.push(null);

    const response = await drive.files.create({
      requestBody: {
        name: `${file.metadata.slug}.mp3`,
        mimeType: "audio/mpeg",
      },
      media: {
        mimeType: "audio/mpeg",
        body: read,
      },
      fields: "id",
    });
    console.log(response.status);
    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = uploadToGoogleDrive;
