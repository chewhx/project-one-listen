const Mercury = require("@postlight/mercury-parser");
const fs = require("fs");
const path = require("path");
const slug = require("../utils/slug");

/**
 * For articles more than 5000 characters, it will be split up into parts of plain text in a folder. This is because Google Text-to-Speech API has a request limit of not more than 5000 characters per request.
 *
 * @param {String} url Article url to be synthesized to audio
 * @returns Local filepath to json or folder of the extracted texts
 */
async function mercuryParser(file) {
  try {
    console.log("Processing text...");

    // Declare path for 'parser' folder
    const parserDirPath = path.resolve(__dirname, "../temp", "parser");

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
    await file.save();
    // Check if char count exceeds limit of 5000
    const charCountExceeds = res.char_count >= 5000;

    // Check if 'parser' folder exists, otherwise create one
    if (!fs.existsSync(parserDirPath)) {
      fs.mkdirSync(parserDirPath);
    }

    // Check if articles has already been downloaded in form of json or folder,
    const fileExist = fs.existsSync(
      `${parserDirPath}/${file.metadata.slug}.json`
    );

    const dirExist = fs.existsSync(`${parserDirPath}/${file.metadata.slug}`);

    if (dirExist) {
      console.log("Article has already been downloaded.");
      file.filePath = `${parserDirPath}/${file.metadata.slug}`;
      await file.save();
      return true;
    }

    if (fileExist) {
      console.log("Article has already been downloaded.");
      file.filePath = `${parserDirPath}/${file.metadata.slug}.json`;
      await file.save();
      return true;
    }

    // If character count < 5000
    if (!charCountExceeds) {
      // Save response in temp folder
      fs.writeFileSync(
        `${parserDirPath}/${file.metadata.slug}.json`,
        JSON.stringify(res)
      );
      file.filePath = `${parserDirPath}/${file.metadata.slug}.json`;
      await file.save();
      return true;
    }

    // If character count >= 5000
    if (charCountExceeds) {
      // Create a folder in parser dir
      fs.mkdirSync(`${parserDirPath}/${file.metadata.slug}`, {
        recursive: true,
      });

      // Prep variables to execute split
      let i = 0;
      let contentArray = res.content.split(" ");
      let parts = Math.ceil(res.char_count / 4999);
      let start = 0;
      let mid = Math.ceil(contentArray.length / parts);
      let end = mid;

      // Split the text into chunks and save as individual plain text files
      while (i < parts) {
        i++;
        const chunk = contentArray.slice(start, end).join(" ");
        fs.writeFileSync(
          `${parserDirPath}/${file.metadata.slug}/${file.metadata.slug}-part${i}.txt`,
          JSON.stringify(chunk)
        );
        start = end;
        end += mid;
      }

      file.filePath = `${parserDirPath}/${file.metadata.slug}`;
      await file.save();
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = mercuryParser;
