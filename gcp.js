require("dotenv").config();
const fs = require("fs");
const Stream = require("stream");
const { Storage } = require("@google-cloud/storage");
const textToSpeech = require("@google-cloud/text-to-speech");
const { GCP_CLIENT_EMAIL, GCP_PRIVATE_KEY, GCP_PROJECT_ID } = process.env;
const Mercury = require("@postlight/mercury-parser");
const slug = require("./utils/slug");
const { Writable } = require("stream");
const { Console } = require("console");

const bucket = new Storage({
  credentials: {
    client_email: GCP_CLIENT_EMAIL,
    private_key: GCP_PRIVATE_KEY.replace(/\\n/gm, "\n"),
  },
  projectId: GCP_PROJECT_ID,
}).bucket("flashcard-6ec1f.appspot.com");

async function gcsFileExist(file) {
  const [exists] = await bucket
    .file(`${file.user}/parser/${file.metadata.slug}`)
    .exists();
  console.log(exists);

  // ((err, exists) => {
  //   if (err) {
  //     console.log(err);
  //     return false;
  //   } else {
  //     console.log(exists);
  //     return true;
  //   }
  // });
}

async function gcsuploadFile(content) {
  try {
    const gcsWritable = bucket.file("parser/audio.mp3").createWriteStream({
      metadata: {
        contentType: "audio/mpeg",
      },
    });

    const { GCP_CLIENT_EMAIL, GCP_PRIVATE_KEY, GCP_PROJECT_ID } = process.env;

    const client = new textToSpeech.TextToSpeechClient({
      credentials: {
        client_email: GCP_CLIENT_EMAIL,
        private_key: GCP_PRIVATE_KEY.replace(/\\n/gm, "\n"),
      },
      projectId: GCP_PROJECT_ID,
    });

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

    const readable = new Stream.Readable({
      read() {},
    });

    // Send request to synthesize speech
    client.synthesizeSpeech(request).then((res) => {
      gcsWritable._write(res[0].audioContent, "binary", (err) =>
        console.log(err)
      );
      gcsWritable.end(() => console.log("end"));
      // readable.push(res[0].audioContent);
      // console.log(res);
      // readable.pipe(gcsWritable);
      // readable.on("error", (err) => console.log(err));
      // readable.on("finish", () => {
      //   console.log("file uploaded");
      // });
      // gcsWritable.on("finish", () => {
      //   console.log("file1 uploaded");
      // });
    });
  } catch (error) {
    console.log(error);
  }
}

async function gcsGetFile(file) {
  // let content = [];
  // const write = new Writable({
  //   write() {},
  // });

  // download parsed content from google cloud storage bucket
  const [res] = await bucket
    .file(`${file.user}/parser/${file.metadata.slug}`)
    .download();

  const json = JSON.parse(res.toString());

  // check character count
  const charCountExceeds = json.char_count >= 5000;

  //  charCountExceeds = false, send text for synth

  //  charCountExceeds = true, split text into chunks and send for synth

  // (err, content) => {
  //   if (err) console.log(err);
  //   console.log(content.toString());
  // }

  // read
  //   .on("error", function (err) {
  //     console.log(err);
  //   })
  //   .on("response", function (response) {
  //     // Server connected and responded with the specified status and headers.
  //   })
  //   .on("data", (chunk) => write.write(chunk))
  //   .on("end", function () {
  //     write.end();
  //     // console.log(write._writableState);
  //     console.log("Json read finish");
  //     let box;
  //     for (let each of write._writableState.buffered) {
  //       content.push(each.chunk);
  //     }
  //     content = Buffer.concat(content);
  //     console.log(JSON.parse(content.toString()));
  //   })
  //   .pipe(write);
}

gcsFileExist({
  sourceUrl:
    "https://www.nytimes.com/2021/06/06/insider/new-york-mayor-candidates-videos.html",
  metadata: {
    title: "",
    slug: "hsbc-says-asia-pacific-ceo-peter-wong-to-retire",
    excerpt: "",
    wordCount: 0,
    charCount: 0,
  },
  filePath:
    "/Users/chewhx/github/project-audio-articles/downloads/hsbc-says-asia-pacific-ceo-peter-wong-to-retire.mp3",
  fileName:
    "-news-business-hsbc-says-asia-pacific-ceo-peter-wong-to-retire-14965358",
  fileLink:
    "https://storage.googleapis.com/flashcard-6ec1f.appspot.com/hsbc-says-asia-pacific-ceo-peter-wong-to-retire.mp3",
  status: "Completed",
  user: "60b7a045e340385fe319fbc8",
  queue: "None",
});
