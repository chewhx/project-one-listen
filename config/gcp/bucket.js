require("dotenv").config();
const { Storage } = require("@google-cloud/storage");

const { GCP_CLIENT_EMAIL, GCP_PRIVATE_KEY, GCP_PROJECT_ID, GCP_BUCKET } =
  process.env;

const bucket = new Storage({
  credentials: {
    client_email: GCP_CLIENT_EMAIL,
    private_key: GCP_PRIVATE_KEY.replace(/\\n/gm, "\n"),
  },
  projectId: GCP_PROJECT_ID,
}).bucket(GCP_BUCKET);

module.exports = bucket;

