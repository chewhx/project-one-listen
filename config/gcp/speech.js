require("dotenv").config();
const textToSpeech = require("@google-cloud/text-to-speech");

const { GCP_CLIENT_EMAIL, GCP_PRIVATE_KEY, GCP_PROJECT_ID } = process.env;

const gSpeechClient = new textToSpeech.TextToSpeechClient({
  credentials: {
    client_email: GCP_CLIENT_EMAIL,
    private_key: GCP_PRIVATE_KEY.replace(/\\n/gm, "\n"),
  },
  projectId: GCP_PROJECT_ID,
});

module.exports = gSpeechClient;
