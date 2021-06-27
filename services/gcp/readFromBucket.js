const createHttpError = require("http-errors");
const bucket = require("../../config/gcp/bucket");
const filePathCheck = require("../../utils/filePathCheck");
const { Stream } = require("stream");

const readFileFromBucket = async (filePath) => {
  // Check file path
  filePathCheck(filePath);

  // Get file object, and file metadata
  const metadata = await bucket.file(filePath).getMetadata();

  // If file object or metadata does not exist, throw error
  if (!metadata)
    throw createHttpError(
      404,
      `readFileFromBucket: ${filePath} does not exist.`
    );

  let encoding = "utf-8";
  switch (metadata["contentType"]) {
    case "audio/mpeg":
      encoding = "binary";
    default:
      null;
  }
  // create a write stream
  const writeStream = new Stream.Writable({
    write() {},
  });

  writeStream.setDefaultEncoding(encoding);

  // Create readable stream from file object and pipe to write stream
  bucket
    .file(filePath)
    .createReadStream()
    .on("pipe", () => {
      console.log("piping");
    })
    .on("error", (err) => logger.error(err))
    .on("end", function () {
      writeStream.end();
      return writeStream;
    })
    .pipe(writeStream);
};

readFileFromBucket(
  "undefined/parser/canada-shaken-by-new-discovery-of-unmarked-gra"
).then((response) => console.log(response));

module.exports = readFileFromBucket;
