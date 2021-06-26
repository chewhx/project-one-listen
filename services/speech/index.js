const bucket = require("../../config/gcp/bucket");
const splitText = require("../../utils/splitText");
const synth = require("./synth");

async function googleSpeech(resource) {
  try {
    // Declare function MP3 file path
    const FILEPATH = `${resource.path.audio}/${resource.metadata.slug}`;

    // Check if audio file already exists
    const [audioFileExists] = await bucket.file(FILEPATH).exists();

    if (audioFileExists) {
      console.log("Audio file already downloaded.");

      await resource.save();
      return true;
    }

    // Read JSON from google cloud storage
    const [res] = await bucket
      .file(`${resource.path.parser}/${resource.metadata.slug}`)
      .download();

    const json = JSON.parse(res.toString());

    // check character count
    const charCountExceeds = json.char_count >= 5000;

    // create write stream for google cloud storage
    const writableStream = bucket.file(FILEPATH).createWriteStream({
      metadata: {
        contentType: "audio/mpeg",
      },
    });

    //  charCountExceeds = false, send text for synth

    if (!charCountExceeds) {
      // Extract content to be converted
      const { content } = json;

      // Synth text
      const audio = await synthText(content);

      // Write the response to google cloud storage

      writableStream
        ._write(audio, "binary")
        .on("error", (err) => console.log(err))
        .end(() =>
          console.log(
            `Audio download complete. ${new Date().toLocaleString("en-SG")}`
          )
        );

      await resource.save();
      return true;
    }

    //  charCountExceeds = true, split text into chunks and send for synth

    if (charCountExceeds) {
      // split text into chunks and append to array
      const { content, char_count } = json;
      const chunks = splitText(content, char_count);

      for (let each of chunks) {
        const audio = await synth(each);
        writableStream
          ._write(audio, "binary")
          .on("error", (err) => console.log(err));
      }

      writableStream.end(() =>
        console.log(
          `charCountExceeds end \n Audio download complete. ${new Date().toLocaleString(
            "en-SG"
          )}`
        )
      );
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = googleSpeech;
