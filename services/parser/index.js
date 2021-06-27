const { Stream } = require("stream");
const Mercury = require("@postlight/mercury-parser");
const updateResourceMeta = require("./updateResourceMeta");
const writeToBucket = require("./writeToBucket");
const logger = require("pino")({ prettyPrint: true });

// 1. parse the article
// 2. update resource details
// 3. write json file to google cloud storage

const mercuryParser = async (resource) => {
  try {
    // Parse the text with Mercury
    const res = await Mercury.parse(resource.sourceUrl, {
      contentType: "text",
    });
    if (!res) throw Error;

    // Declare filePath
    const parserFilePath = `${resource.paths.parser}/${resource.metadata.slug}`;
    // Update metadata for resource
    await updateResourceMeta(resource, res);

    // Write res to google cloud storage as json
    await writeToBucket.singleWrite(parserFilePath, res, {
      metadata: { contentType: "application/json" },
    });

    return true;
  } catch (err) {
    logger.error(err);
    return false;
  }
};

module.exports = mercuryParser;
