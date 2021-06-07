require("dotenv").config();
const fs = require("fs");
const Stream = require("stream");
const { Storage } = require("@google-cloud/storage");
const textToSpeech = require("@google-cloud/text-to-speech");
const { GCP_CLIENT_EMAIL, GCP_PRIVATE_KEY, GCP_PROJECT_ID } = process.env;
const Mercury = require("@postlight/mercury-parser");
const { content } = require("googleapis/build/src/apis/content");

const storage = new Storage({
  credentials: {
    client_email: GCP_CLIENT_EMAIL,
    private_key: GCP_PRIVATE_KEY.replace(/\\n/gm, "\n"),
  },
  projectId: GCP_PROJECT_ID,
});

const bucket = storage.bucket("flashcard-6ec1f.appspot.com");

// folder.exists((err, exists) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(exists);
//   }
// });

const url =
  "https://www.channelnewsasia.com/news/singapore/exercise-mask-high-intensity-fitness-experts-advice-covid-19-14933524";

// gcsGetFile({ filePath: "parser/text.json" });

function gcsFileExist(file) {
  bucket.file(file.filePath).exists((err, exists) => {
    if (err) {
      console.log(err);
      return false;
    } else {
      console.log(exists);
      return true;
    }
  });
}

gcsuploadFile(
  "People with an underlying condition affecting their heart and lungs should be especially cautious when doing more intense exercises with a mask on, said Dr O'Muircheartaigh, who is also the medical director of Sports Medicine Lab."
);

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

function gcsGetFile(file) {
  // const writableStream = new Stream.Writable();
  // writableStream._write = (chunk, encoding, next) => {
  //   console.log(chunk);
  //   next();
  // };
  let box = [];
  bucket
    .file(file.filePath)
    .createReadStream()
    .on("error", function (err) {
      console.log(err);
    })
    .on("response", function (response) {
      // Server connected and responded with the specified status and headers.
    })
    .on("data", (data) => {
      box.push(data);
    })
    .on("end", function () {
      const contents = JSON.parse(Buffer.concat(box).toString());
      console.log(contents.title);
      // The file is fully downloaded.
    });
}

// (async () => {
//   const res = await Mercury.parse(url, { contentType: "text" });
//   const folder = bucket.file("parser/text.json");
//   folder.save(
//     JSON.stringify(res),
//     {
//       metadata: {
//         contentType: "text/json",
//       },
//     },
//     (err) => {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log("uploaded");
//       }
//     }
//   );
// })();
