const Stream = require("stream");
const gStorageClient = require("../config/gcp/gStorageClient");
const gDrive = require("../config/gcp/gDrive");

async function uploadToGoogleDrive(file, user) {
  try {
    // Set bucket for Google Cloud Storage
    const bucket = gStorageClient.bucket("flashcard-6ec1f.appspot.com");

    // Set credentials for GDrive
    gDrive.setCredentials(user.googleToken);

    // Download audio from bucket
    const [res] = await bucket
      .file(`${file.user}/audio/${file.metadata.slug}`)
      .download();

    const read = new Stream.Readable({
      read() {},
    });

    read.push(res, "binary");
    read.push(null);

    const response = await gDrive.files.create({
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
