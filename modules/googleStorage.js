require("dotenv").config();
const fs = require("fs");
const path = require("path");
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

async function googleStorage(file) {
  try {
    const destFileName = file.metadata.slug;

    const res = await bucket.upload(file.filePath, {
      destination: destFileName,
    });
    const { bucket: fileBucket, name: fileName } = res[0].metadata;
    console.log(`${file.filePath} uploaded to google cloud storage`);
    fs.writeFileSync("./data.json", JSON.stringify(res), { encoding: "utf-8" });
    file.fileLink = `https://storage.cloud.google.com/${fileBucket}/${fileName}`;
    console.log(`https://storage.cloud.google.com/${fileBucket}/${fileName}`);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = googleStorage;
