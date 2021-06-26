const schedule = require("node-schedule");
const MongoFile = require("../mongoose/File");
const googleSpeech = require("../modules/googleSpeech");

// This scheduled job will pull the latest file from Mongo with queue: "Audio" and synthesize the text content into audio
const audioScheduleRules = new schedule.RecurrenceRule();
audioScheduleRules.tz = "Asia/Singapore";
audioScheduleRules.minute = [
  0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40,
  42, 44, 46, 48, 50, 52, 54, 56, 58,
];

let audioBusy = false;

const audioJob = schedule.scheduleJob(audioScheduleRules, async () => {
  if (audioBusy) return;
  // get a file on parser queue from mongo
  const file = await MongoFile.findOne({
    "job.queue": "Audio",
  });
  if (!file) {
    console.log(
      `No file queued for googleSpeech. ${new Date().toLocaleString("en-SG", {
        dateStyle: "long",
        timeStyle: "long",
      })}`.yellow
    );
    return;
  }
  // set parserbusy to true
  audioBusy = true;
  // pass into mercury parser
  const audioSuccess = await googleSpeech(file);
  if (!audioSuccess) {
    file.job.status = "Error";
  }
  // update mongo file
  file.job.queue = "None";
  file.job.status = "Completed";
  file.selfLink = `https://storage.googleapis.com/flashcard-6ec1f.appspot.com/${file.owner}/audio/${file.metadata.slug}`;

  await file.save();

  console.log(
    `Audio file ${file.metadata.slug} synthesized. ${new Date().toLocaleString(
      "en-SG",
      {
        dateStyle: "long",
        timeStyle: "long",
      }
    )}`.yellow
  );
  // set parserbusy to false
  audioBusy = false;
});

module.exports = audioJob;
