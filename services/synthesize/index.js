const splitText = require("../../utils/splitText");
const logger = require("pino")({ prettyPrint: true });
const gcp = require("../gcp");
const createHttpError = require("http-errors");

async function googleSpeech(resource) {
  // Declare function MP3 file path
  const audioFilePath = `${resource.paths.audio}/${resource.metadata.slug}`;
  const parserFilePath = `${resource.paths.parser}/${resource.metadata.slug}`;

  // Check if audio file already exists
  const audioFileExists = await gcp.file.exist(audioFilePath);

  if (audioFileExists) {
    logger.info(`${audioFilePath} audiofile already synthesized.`);
    return true;
  }

  // Read JSON from google cloud storage
  const { res, encoding } = await gcp.file.read(parserFilePath);

  if (!res)
    throw createHttpError(
      500,
      `googleSpeech: json file ${parserFilePath} does not exist`
    );

  const json = JSON.parse(res.toString(encoding));

  // check character count
  const charCountExceeds = resource.metadata.charCount >= 5000;

  // If charactouer count does not exceed
  if (!charCountExceeds) {
    // Extract content to be converted
    const { content } = json;

    // Synth text
    const audio = await gcp.speech(content);

    // Write the response to google cloud storage
    await gcp.file.write.singleWrite(audioFilePath, audio, {
      metadata: { contentType: "audio/mpeg" },
    });

    return true;
  }

  //  charCountExceeds = true, split text into chunks and send for synth

  if (charCountExceeds) {
    // split text into chunks and append to array
    const { content } = json;
    const chunks = splitText(content, 4500);

    await gcp.file.write.multipleWrite(audioFilePath, chunks, gcp.speech, {
      metadata: { contentType: "audio/mpeg" },
    });

    return true;
  }
}

module.exports = googleSpeech;
