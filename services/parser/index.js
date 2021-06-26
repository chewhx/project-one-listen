const { Stream } = require("stream");
const Mercury = require("@postlight/mercury-parser");
const slug = require("../../utils/slug");
const bucket = require("../../config/gcp/bucket");
const logger = require("pino")({ prettyPrint: true });

const mercuryParser = async (resource) => {
  try {
    // Parse the text with Mercury
    const res = await Mercury.parse(resource.sourceUrl, {
      contentType: "text",
    });
    if (!res) throw Error;

    // Assign response meta to file
    resource.metadata.title = res.title;
    resource.metadata.slug = slug(res.title);
    resource.metadata.excerpt = res.excerpt;
    resource.metadata.wordCount = res.word_count;

    // Count characters and add to response
    res.char_count = res.content.length;
    resource.metadata.charCount = res.char_count;

    // Set default file paths for resource
    resource.paths.parser = `${resource.owner}/parser`;
    resource.paths.audio = `${resource.owner}/audio`;

    // Save resource at mongo level
    resource.save();

    // Create read stream to read res from mercury parser
    const readStream = new Stream.Readable({
      read() {},
    });

    // Create a write stream to write to cloud storage
    const writableStream = bucket
      .file(`${resource.paths.parser}/${resource.metadata.slug}`)
      .createWriteStream({ metadata: { contentType: "application/json" } });

    // Push res into readStream
    readStream.push(JSON.stringify(res));

    // Push null to end readStream
    readStream.push(null);
    // Pipe readStream into writeStream
    readStream
      .pipe(writableStream)
      .on("finish", () => logger.info(`File uploaded`))
      .on("error", (err) => console.log(err))
      .on("end", () => {
        writableStream.end();
      });

    return true;
  } catch (err) {
    logger.error(err);
    return false;
  }
};

module.exports = mercuryParser;
