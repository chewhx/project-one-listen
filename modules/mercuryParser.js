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
async function mercuryParser(url) {
  try {
    console.log("Processing text...");

    // Parse the text with Mercury
    const res = await Mercury.parse(url, { contentType: "text" });
    if (!res) throw Error;

    // Slugify the title and add to response
    res.sluggedTitle = slug(res.title);

    // Count characsters and add to response
    res.char_count = res.content.length;

    // Check if char count exceeds limit of 5000
    const charCountExceeds = res.char_count >= 5000;

    // Declare path for 'parser' folder
    const parserDirPath = path.resolve(__dirname, "../temp", "parser");

    // Check if 'parser' folder exists, otherwise create one
    if (!fs.existsSync(parserDirPath)) {
      fs.mkdirSync(parserDirPath);
    }

    // Check if articles has already been downloaded in form of json or folder,
    if (
      fs.existsSync(`${parserDirPath}/${res.sluggedTitle}`) ||
      fs.existsSync(`${parserDirPath}/${res.sluggedTitle}.json`)
    ) {
      console.log("Article has already been downloaded.");
      return {
        success: true,
        filePath: `${parserDirPath}/${res.sluggedTitle}.json`,
        fileName: res.sluggedTitle,
      };
    }

    // If character count < 5000
    if (!charCountExceeds) {
      // Save response in temp folder
      fs.writeFileSync(
        `${parserDirPath}/${res.sluggedTitle}.json`,
        JSON.stringify(res)
      );
      return {
        success: true,
        filePath: `${parserDirPath}/${res.sluggedTitle}.json`,
        fileName: res.sluggedTitle,
      };
    }

    // If character count >= 5000
    if (charCountExceeds) {
      // Create a folder in parser dir
      fs.mkdirSync(`${parserDirPath}/${res.sluggedTitle}`, {
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
          `${parserDirPath}/${res.sluggedTitle}/${res.sluggedTitle}-part${i}.txt`,
          JSON.stringify(chunk)
        );
        start = end;
        end += mid;
      }

      return {
        success: true,
        filePath: `${parserDirPath}/${res.sluggedTitle}`,
        fileName: res.sluggedTitle,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
    };
  }
}

module.exports = mercuryParser;
