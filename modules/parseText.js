const { Readable } = require("stream");
const logger = require("pino")({ prettyPrint: true });
const Mercury = require("@postlight/mercury-parser");
const slug = require("../utils/slug");
const bucket = require("../config/gcp/bucket");

async function parseText(file) {
  try {
    // Logget
    logger.info(`Running text parser`);

    // Parse the text with Mercury
    const res = await Mercury.parse(file.sourceUrl, { contentType: "text" });
    if (!res) throw Error;

    // Assign response meta to file
    file.metadata.title = res.title;
    file.metadata.slug = slug(res.title);
    file.metadata.excerpt = res.excerpt;
    file.metadata.wordCount = res.word_count;
    // Count characters and add to response
    res.char_count = res.content.length;
    file.metadata.charCount = res.char_count;
    // await file.save();

    // Save the res in google cloud storage
    const read = new Readable({
      read() {},
    });

    const write = bucket
      .file(`${file.metadata.parserPath}/${file.metadata.slug}`)
      .createWriteStream({ metadata: { contentType: "application/json" } });

    read.push(JSON.stringify(res));
    read.push(null);
    read
      .pipe(write)
      .on("finish", () =>
        logger.info(`${file.metadata.slug} uploaded to Google Cloud Storage`)
      )
      .on("error", (err) => console.log(err));
    read.on("end", () => {
      write.end();
    });

    return true;
  } catch (err) {
    logger.error(err);
    return false;
  }
}

module.exports = parseText;
