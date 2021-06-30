const bucket = require("../../config/gcp/bucket");
const splitText = require("../../utils/splitText");
const synth = require("./synth");
const bucketFileExists = require("../gcp/bucketFileExists");
const logger = require("pino")({ prettyPrint: true });
const writeToBucket = require("../gcp/writeToBucket");
const readFileFromBucket = require("../gcp/readFromBucket");
const createHttpError = require("http-errors");

async function googleSpeech(resource) {
  try {
    // Declare function MP3 file path
    const audioFilePath = `${resource.paths.audio}/${resource.metadata.slug}`;
    const parserFilePath = `${resource.paths.parser}/${resource.metadata.slug}`;

    // Check if audio file already exists
    const audioFileExists = await bucketFileExists(audioFilePath);

    if (audioFileExists) {
      logger.info(`${audioFilePath} audiofile already synthesized.`);
      return true;
    }

    // Read JSON from google cloud storage
    const { res, encoding } = await readFileFromBucket(parserFilePath);

    if (!res)
      throw createHttpError(
        500,
        `googleSpeech: json file ${parserFilePath} does not exist`
      );

    const json = JSON.parse(res.toString(encoding));

    // check character count
    const charCountExceeds = json.char_count >= 5000;

    // If charactouer count does not exceed
    if (!charCountExceeds) {
      // Extract content to be converted
      const { content } = json;

      // Synth text
      const audio = await synth(content);

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
