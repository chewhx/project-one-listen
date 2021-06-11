const { Readable } = require("stream");
const Mercury = require("@postlight/mercury-parser");
const slug = require("../utils/slug");
const bucket = require("../config/gcp/bucket");

/**
 * For articles more than 5000 characters, it will be split up into parts of plain text in a folder. This is because Google Text-to-Speech API has a request limit of not more than 5000 characters per request.
 *
 * @param {String} url Article url to be synthesized to audio
 * @returns Local filepath to json or folder of the extracted texts
 */
async function mercuryParser(file) {
  try {
    // Log
    console.log(`Starting parser for ${file.sourceUrl}`);

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

    // Check if articles has already been downloaded in form of json or folder,
    // const fileExists = await bucket
    //   .file(`/${file.user}/parser/${file.metadata.slug}`)
    //   .exists();

    // if (fileExists) {
    //   console.log("Article has already been downloaded.");
    //   file.filePath = `${parserDirPath}/${file.metadata.slug}`;
    //   await file.save();
    //   return true;
    // }

    // Save the res in google cloud storage
    const read = new Readable({
      read() {},
    });

    const write = bucket
      .file(`${file.user}/parser/${file.metadata.slug}`)
      .createWriteStream({ metadata: { contentType: "application/json" } });

    read.push(JSON.stringify(res));
    read.push(null);
    read
      .pipe(write)
      .on("finish", () => console.log("file uploaded"))
      .on("error", (err) => console.log(err));
    read.on("end", () => {
      write.end();
    });
    // read.on("data", (chunk) => console.log(chunk));

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = mercuryParser;
