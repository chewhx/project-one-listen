const { Stream } = require("stream");
const Mercury = require("@postlight/mercury-parser");
const updateResourceMeta = require("./updateResourceMeta");
const writeToBucket = require("../gcp/writeToBucket");
const logger = require("pino")({ prettyPrint: true });

const mercuryParser = async (resource) => {
  try {
    // Parse the text with Mercury
    const res = await Mercury.parse(resource.sourceUrl, {
      contentType: "text",
    });
    if (!res) throw Error;

    // Update metadata for resource
    await updateResourceMeta(resource, res);

    // Declare filePath
    const parserFilePath = `${resource.paths.parser}/${resource.metadata.slug}`;

    // Write res to google cloud storage as json
    await writeToBucket.singleWrite(parserFilePath, JSON.stringify(res), {
      metadata: { contentType: "application/json" },
    });

    return true;
  } catch (err) {
    logger.error(err);
    resource.job.status = "Error";
    await resource.save();
    return false;
  }
};

module.exports = mercuryParser;
