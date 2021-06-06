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

async function googleStorage(filePath) {
  try {
    const destFileName = path.basename(filePath);

    const res = await bucket.upload(filePath, {
      destination: destFileName,
    });
    const { bucket: fileBucket, name: fileName } = res[0].metadata;
    console.log(`${filePath} uploaded to google cloud storage`);
    fs.writeFileSync("./data.json", JSON.stringify(res), { encoding: "utf-8" });
    console.log(`https://storage.cloud.google.com/${fileBucket}/${fileName}`);
    return true;
    // return `https://storage.cloud.google.com/${metadata.bucket}/${metadata.name}`;
  } catch (error) {
    console.log(error);
    return false;
  }
}


module.exports = googleStorage;
