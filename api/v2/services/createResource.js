const createHttpError = require("http-errors");
const MongoResource = require("../models/Resource");
const isURL = require("validator/lib/isURL");
const writeToBucket = require("../../../services/gcp/writeToBucket");

const createResource = async (req) => {
  const types = ["url", "text"];

  // Check if req.query contains type
  if (!req.query.type || !types.includes(req.query.type))
    throw createHttpError(
      400,
      "Please specify resource type of 'url' or 'text'."
    );

  // Url type
  if (req.query.type === "url") {
    // Check request has valid url
    if (isURL(req.body.url)) {
      // Create resource
      const resource = await MongoResource.create({
        type: "Article",
        sourceUrl: req.body.url,
        owner: req.user._id,
      });

      // Return resource
      return resource;
    }
  }

  if (req.query.type == "text") {
    if (typeof req.body.text === "string") {
      // Declare metadata because they will not be set by mercury parser
      const slug = req.body.slug || Date.now();
      const title = req.body.title || `${Date.now()}-${req.user._id}`;
      const char_count = req.body.char_count || req.body.text.length;
      const word_count = req.body.word_count || req.body.text.split(" ").length;
      // Create resource
      const resource = await MongoResource.create({
        type: "Text",
        job: {
          queue: "Audio",
        },
        metadata: { slug },
        paths: {
          parser: `${req.user._id}/parser`,
          audio: `${req.user._id}/audio`,
        },
        owner: req.user._id,
      });

      // Save body text to google cloud as json
      const parserFilePath = `${resource.paths.parser}/${resource.metadata.slug}`;
      const object = {
        content: req.body.text,
        word_count,
        char_count,
        slug,
        title,
      };
      await writeToBucket.singleWrite(parserFilePath, JSON.stringify(object), {
        metadata: { contentType: "application/json" },
      });

      // Return resource
      return resource;
    }
  }
};

module.exports = createResource;
