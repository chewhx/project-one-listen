const MongoResource = require("../models/Resource");
const gcp = require("../../../services/gcp");
const isUrl = require("../validations/isUrl");

module.exports = async ({ query, body, user } = req) => {
  if (query.type === "url") return urlResource();
  if (query.type === "text") return textResource();

  async function urlResource() {
    // Validate body url
    if (isUrl(body.url)) {
      // Create resource
      const resource = await MongoResource.create({
        type: "Article",
        sourceUrl: body.url,
        owner: user._id,
      });

      // Return resource
      return resource;
    }
  }

  async function textResource() {
    // Declare metadata because they will not be set by mercury parser
    const slug = body.slug || String(Date.now());
    const title = body.title || `${Date.now()}-${user._id}`;
    const char_count = body.char_count || body.text.length;
    const word_count = body.word_count || body.text.split(" ").length;
    // Create resource
    const resource = await MongoResource.create({
      type: "Text",
      job: {
        queue: "Audio",
      },
      metadata: {
        slug,
        title,
        excerpt: body.text.slice(0, 50),
        charCount: char_count,
        wordCount: word_count,
      },
      paths: {
        parser: `${user._id}/parser`,
        audio: `${user._id}/audio`,
      },
      owner: user._id,
    });

    // Save body text to google cloud as json
    const parserFilePath = `${resource.paths.parser}/${resource.metadata.slug}`;
    const object = {
      content: String(body.text),
      word_count,
      char_count,
      slug,
      title,
    };
    await gcp.file.write.singleWrite(parserFilePath, JSON.stringify(object), {
      metadata: { contentType: "application/json" },
    });

    // Return resource
    return resource;
  }
};

// const createResource = async (req) => {
//   const types = ["url", "text"];

//   // Check if req.query contains type
//   if (!req.query.type || !types.includes(req.query.type))
//     throw createHttpError(
//       400,
//       "Please specify resource type of 'url' or 'text'."
//     );

//   // Url type
//   if (req.query.type === "url") {
//     // Check request has valid url
//     if (isURL(req.body.url)) {
//       // Create resource
//       const resource = await MongoResource.create({
//         type: "Article",
//         sourceUrl: req.body.url,
//         owner: req.user._id,
//       });

//       // Return resource
//       return resource;
//     }
//   }

//   if (req.query.type == "text") {
//     if (typeof req.body.text === "string") {
//       // Declare metadata because they will not be set by mercury parser
//       const slug = req.body.slug || String(Date.now());
//       const title = req.body.title || `${Date.now()}-${req.user._id}`;
//       const char_count = req.body.char_count || req.body.text.length;
//       const word_count = req.body.word_count || req.body.text.split(" ").length;
//       // Create resource
//       const resource = await MongoResource.create({
//         type: "Text",
//         job: {
//           queue: "Audio",
//         },
//         metadata: {
//           slug,
//           title,
//           excerpt: req.body.text.slice(0, 50),
//           charCount: char_count,
//           wordCount: word_count,
//         },
//         paths: {
//           parser: `${req.user._id}/parser`,
//           audio: `${req.user._id}/audio`,
//         },
//         owner: req.user._id,
//       });

//       // Save body text to google cloud as json
//       const parserFilePath = `${resource.paths.parser}/${resource.metadata.slug}`;
//       const object = {
//         content: req.body.text,
//         word_count,
//         char_count,
//         slug,
//         title,
//       };
//       await writeToBucket.singleWrite(parserFilePath, JSON.stringify(object), {
//         metadata: { contentType: "application/json" },
//       });

//       // Return resource
//       return resource;
//     }
//   }
// };

// module.exports = createResource;
