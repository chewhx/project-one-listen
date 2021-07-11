const { Stream } = require("stream");
const bucket = require("../../../config/gcp/bucket");
const logger = require("pino")({ prettyPrint: true });
const createHttpError = require("http-errors");

exports.singleWrite = async (filePath, res, options) => {
  // Guard clause
  if (!filePath || !res)
    throw createHttpError(500, `writeToBucket: Invalid filePath or response.`);

  // Create read stream to read res
  const readStream = new Stream.Readable({
    read() {},
  });

  // Create a write stream to write to cloud storage
  const writableStream = bucket
    .file(filePath)
    .createWriteStream(options || null);

  // Push res into readStream
  readStream.push(res);

  // Push null to end readStream
  readStream.push(null);
  // Pipe readStream into writeStream
  readStream
    .pipe(writableStream)
    .on("finish", () => logger.info(`File uploaded: ${filePath}`))
    .on("error", (err) => console.log(err))
    .on("end", () => {
      writableStream.end();
    });
};

exports.multipleWrite = async (filePath, chunks, fn, options) => {
  // Guard clause
  if (
    !filePath ||
    typeof filePath !== "string" ||
    !chunks ||
    !chunks.length ||
    !fn
  )
    throw createHttpError(
      500,
      `writeToBucket-multipleWrite: Invalid filePath or chunks or fn.`
    );

  // Create read stream to read res from mercury parser
  const readStream = new Stream.Readable({
    read() {},
  });

  // Create a write stream to write to cloud storage
  const writableStream = bucket
    .file(filePath)
    .createWriteStream(options || null);

  // Run fn on each chunk to get res
  for (let each of chunks) {
    const res = await fn(each);
    // push response to read stream
    readStream.push(res);
  }
  // Push null to end readStream
  readStream.push(null);
  // Pipe readStream into writeStream
  readStream
    .pipe(writableStream)
    .on("finish", () => logger.info(`File uploaded: ${filePath}`))
    .on("error", (err) => console.log(err))
    .on("end", () => {
      writableStream.end();
    });
};

// const synth = require("../speech/synth");

// const chunks = [
//   "IN the year 1878 I took my degree of Doctor of Medicine of the University of London, and proceeded to Netley to go through the course prescribed for surgeons in the army. Having completed my studies there, I was duly attached to the Fifth Northumberland Fusiliers as Assistant Surgeon.",
//   "The regiment was stationed in India at the time, and before I could join it, the second Afghan war had broken out. On landing at Bombay, I learned that my corps had advanced through the passes, and was already deep in the enemy’s country. I followed, however, with many other officers who were in the same situation as myself, and succeeded in reaching Candahar in safety, where I found my regiment, and at once entered upon my new duties.",
//   "The campaign brought honours and promotion to many, but for me it had nothing but misfortune and disaster. I was removed from my brigade and attached to the Berkshires, with whom I served at the fatal battle of Maiwand. There I was struck on the shoulder by a Jezail bullet, which shattered the bone and grazed the subclavian artery. I should have fallen into the hands of the murderous Ghazis had it not been for the devotion and courage shown by Murray, my orderly, who threw me across a pack-horse, and succeeded in bringing me safely to the British lines.",
// ];

// writeToBucket.multipleWrite("undefined/multipleWrite", chunks, synth, {
//   metadata: { contentType: "audio/mpeg" },
// });
