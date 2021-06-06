require("dotenv").config();
const textToSpeech = require("@google-cloud/text-to-speech");
const fs = require("fs");
const path = require("path");

const storageBucket = require("./googleStorage");

const { GCP_CLIENT_EMAIL, GCP_PRIVATE_KEY, GCP_PROJECT_ID } = process.env;

const client = new textToSpeech.TextToSpeechClient({
  credentials: {
    client_email: GCP_CLIENT_EMAIL,
    private_key: GCP_PRIVATE_KEY.replace(/\\n/gm, "\n"),
  },
  projectId: GCP_PROJECT_ID,
});

/**
 *
 * @param {String} filePath  File path of the file or folder containing texts to be synthesized
 * @returns Audioclip saved to 'downloads' folder under project root directory
 */

async function googleSpeech(filePath) {
  try {
    console.log("Synthesizing audio clip...");

    // Declare path to 'downloads' folder
    const downloadDirPath = path.resolve(__dirname, "../downloads");

    // Check if audio file already exists
    const audioFileExists = fs.existsSync(
      path.resolve(__dirname, "../downloads", `${path.basename(filePath)}.mp3`)
    );

    if (audioFileExists) {
      console.log("Audio file already downloaded.");
      return {
        succesS: false,
        filePath: `${downloadDirPath}/${path.basename(filePath, ".json")}.mp3`,
      };
    }

    // Check if file path is a file or directory: https://www.technicalkeeda.com/nodejs-tutorials/how-to-check-if-path-is-file-or-directory-using-nodejs

    const isDirectory = fs.statSync(filePath).isDirectory();
    const isFile = fs.statSync(filePath).isFile();

    if (isFile) {
      // Read JSON from file
      const parsedContent = JSON.parse(
        fs.readFileSync(filePath, { encoding: "utf-8" })
      );

      // Extract content to be converted
      const { content } = parsedContent;

      // Create a request
      const request = {
        input: { text: content },
        voice: {
          languageCode: "en-US",
          ssmlGender: "FEMALE",
          voiceName: "en-US-Standard-F",
        },
        audioConfig: { audioEncoding: "MP3" },
      };

      // Send request to synthesize speech
      const [response] = await client.synthesizeSpeech(request);

      // Write the response to one audio file
      fs.writeFileSync(
        `${downloadDirPath}/${path.basename(filePath, ".json")}.mp3`,
        response.audioContent,
        "binary"
      );
      console.log(
        `Audio download complete. ${new Date().toLocaleString("en-SG")}`
      );
      return {
        success: true,
        filePath: `${downloadDirPath}/${path.basename(filePath, ".json")}.mp3`,
      };
    }

    if (isDirectory) {
      // Read the files from the directory
      const filesInFilePath = fs.readdirSync(filePath);

      // Create write stream
      const write = fs.createWriteStream(
        `${downloadDirPath}/${path.basename(filePath, ".json")}.mp3`,
        { encoding: "binary" }
      );

      // For each file in the directory
      for (let file of filesInFilePath) {
        // Extract the text content
        if (path.extname(file) === ".txt") {
          const eachFilePath = path.resolve(
            __dirname,
            "../temp",
            "parser",
            path.basename(filePath),
            file
          );
          const content = fs.readFileSync(eachFilePath, { encoding: "utf-8" });

          // Create a request
          const request = {
            input: { text: content },
            voice: {
              languageCode: "en-US",
              ssmlGender: "FEMALE",
              voiceName: "en-US-Standard-F",
            },
            audioConfig: { audioEncoding: "MP3" },
          };

          // Send request to synthesize speech
          const [response] = await client.synthesizeSpeech(request);

          // Write the response to the writable stream
          write.write(response.audioContent);
        }
      }

      write.close();
      console.log(
        `Audio download complete. ${new Date().toLocaleString("en-SG")}`
      );
      return {
        success: true,
        filePath: `${downloadDirPath}/${path.basename(filePath, ".json")}.mp3`,
      };
    }
    throw Error;
  } catch (error) {
    console.log(error);
    return {
      success: false,
    };
  }
}

module.exports = googleSpeech;
