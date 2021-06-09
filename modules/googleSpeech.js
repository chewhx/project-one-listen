require("dotenv").config();
const textToSpeech = require("@google-cloud/text-to-speech");
const { Storage } = require("@google-cloud/storage");
const splitText = require("../utils/splitText");

const { GCP_CLIENT_EMAIL, GCP_PRIVATE_KEY, GCP_PROJECT_ID } = process.env;

const speechClient = new textToSpeech.TextToSpeechClient({
  credentials: {
    client_email: GCP_CLIENT_EMAIL,
    private_key: GCP_PRIVATE_KEY.replace(/\\n/gm, "\n"),
  },
  projectId: GCP_PROJECT_ID,
});

const bucket = new Storage({
  credentials: {
    client_email: GCP_CLIENT_EMAIL,
    private_key: GCP_PRIVATE_KEY.replace(/\\n/gm, "\n"),
  },
  projectId: GCP_PROJECT_ID,
}).bucket("flashcard-6ec1f.appspot.com");

async function synthText(textContent) {
  try {
    if (!textContent || typeof textContent !== "string") return undefined;
    const request = {
      input: { text: textContent },
      voice: {
        languageCode: "en-US",
        ssmlGender: "FEMALE",
        voiceName: "en-US-Standard-F",
      },
      audioConfig: { audioEncoding: "MP3" },
    };

    const [response] = await await speechClient.synthesizeSpeech(request);
    return response.audioContent;
  } catch (error) {
    return error;
  }
}

/**
 *
 * @param {String} filePath  File path of the file or folder containing texts to be synthesized
 * @returns Audioclip saved to 'downloads' folder under project root directory
 */

async function googleSpeech(file) {
  try {
    console.log(`Synthesizing audio clip...`);

    // Declare function MP3 file path
    const FILEPATH = `${file.user}/audio/${file.metadata.slug}`;

    // Check if audio file already exists
    const [audioFileExists] = await bucket.file(FILEPATH).exists();

    if (audioFileExists) {
      console.log("Audio file already downloaded.");
      file.filePath = FILEPATH;
      await file.save();
      return true;
    }

    // Read JSON from google cloud storage
    const [res] = await bucket
      .file(`${file.user}/parser/${file.metadata.slug}`)
      .download();

    const json = JSON.parse(res.toString());

    // check character count
    const charCountExceeds = json.char_count >= 5000;

    // create write stream for google cloud storage
    const gcsWritable = bucket.file(FILEPATH).createWriteStream({
      metadata: {
        contentType: "audio/mpeg",
      },
    });

    //  charCountExceeds = false, send text for synth

    if (!charCountExceeds) {
      // Extract content to be converted
      const { content } = json;

      // Synth text
      const audio = await synthText(content);

      // Write the response to google cloud storage

      const uploadRes = gcsWritable._write(audio, "binary");

      gcsWritable.end(() =>
        console.log(
          `Audio download complete. ${new Date().toLocaleString("en-SG")}`
        )
      );

      file.filePath = FILEPATH;
      await file.save();
      return true;
    }

    //  charCountExceeds = true, split text into chunks and send for synth

    if (charCountExceeds) {
      // split text into chunks and append to array
      const { content, char_count } = json;
      const chunks = splitText(content, char_count);

      for (let each of chunks) {
        const audio = await synthText(each);
        gcsWritable._write(audio, "binary", (err) => {
          if (err) console.log(err);
        });
      }

      gcsWritable.end(() =>
        console.log(
          `charCountExceeds end \n Audio download complete. ${new Date().toLocaleString(
            "en-SG"
          )}`
        )
      );
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = googleSpeech;
