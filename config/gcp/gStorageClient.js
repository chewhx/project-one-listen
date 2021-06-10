require("dotenv").config();
const { Storage } = require("@google-cloud/storage");

const { GCP_CLIENT_EMAIL, GCP_PRIVATE_KEY, GCP_PROJECT_ID } = process.env;

const gStorageClient = new Storage({
  credentials: {
    client_email: GCP_CLIENT_EMAIL,
    private_key: GCP_PRIVATE_KEY.replace(/\\n/gm, "\n"),
  },
  projectId: GCP_PROJECT_ID,
});

module.exports = gStorageClient;
