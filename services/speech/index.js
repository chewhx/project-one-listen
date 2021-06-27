const bucket = require("../../config/gcp/bucket");
const splitText = require("../../utils/splitText");
const synth = require("./synth");
const bucketFileExists = require("./bucketFileExists");
const logger = require("pino")({ prettyPrint: true });
const writeToBucket = require("../parser/writeToBucket");

async function googleSpeech(resource) {
  try {
    // Declare function MP3 file path
    const audioFilePath = `${resource.path.audio}/${resource.metadata.slug}`;

    // Check if audio file already exists
    const audioFileExists = await bucketFileExists(audioFilePath);

    if (audioFileExists) {
      logger.info(`${audioFilePath} audiofile already synthesized.`);

      await resource.save();
      return true;
    }

    // Read JSON from google cloud storage
    const [res] = await bucket.file(audioFilePath).download();

    const json = JSON.parse(res.toString());

    // check character count
    const charCountExceeds = json.char_count >= 5000;

    // If charactouer count does not exceed
    if (!charCountExceeds) {
      // Extract content to be converted
      const { content } = json;

      // Synth text
      const audio = await synthText(content);

      // Write the response to google cloud storage
      await writeToBucket.singleWrite(audioFilePath, audio, {
        metadata: { contentType: "audio/mpeg" },
      });

      return true;
    }

    //  charCountExceeds = true, split text into chunks and send for synth

    if (charCountExceeds) {
      // split text into chunks and append to array
      const { content, char_count } = json;
      const chunks = splitText(content, char_count);

      await writeToBucket.multipleWrite(audioFilePath, chunks, synth, {
        metadata: { contentType: "audio/mpeg" },
      });

      return true;
    }
  } catch (err) {
    logger.error(err);
    return false;
  }
}

module.exports = googleSpeech;
