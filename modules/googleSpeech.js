const gSpeechClient = require("../config/gcp/gSpeechClient");
const bucket = require("../config/gcp/bucket");
const splitText = require("../utils/splitText");

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

    const [response] = await gSpeechClient.synthesizeSpeech(request);
    return response.audioContent;
  } catch (error) {
    return error;
  }
}

async function googleSpeech(file) {
  try {
    console.log(`Synthesizing audio clip...`);

    // Declare function MP3 file path
    const FILEPATH = `${file.owner}/audio/${file.metadata.slug}`;

    // Check if audio file already exists
    const [audioFileExists] = await bucket.file(FILEPATH).exists();

    if (audioFileExists) {
      console.log("Audio file already downloaded.");

      await file.save();
      return true;
    }

    // Read JSON from google cloud storage
    const [res] = await bucket
      .file(`${file.owner}/parser/${file.metadata.slug}`)
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
