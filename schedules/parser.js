const schedule = require("node-schedule");
const MongoFile = require("../config/mongoose/File");
const mercuryParser = require("../modules/mercuryParser");

// This scheduled job will pull the latest file from Mongo with queue: "Parser" and parse the sourceUrl
const parserScheduleRules = new schedule.RecurrenceRule();
parserScheduleRules.tz = "Asia/Singapore";
parserScheduleRules.second = 30;

let parserBusy = false;

const parserJob = schedule.scheduleJob(parserScheduleRules, async () => {
  if (parserBusy) return;
  // get a file on parser queue from mongo
  const file = await MongoFile.findOne({ queue: "Parser" });
  if (!file) {
    console.log(
      `No file queued for mercuryParser. ${new Date().toLocaleString("en-SG", {
        dateStyle: "long",
        timeStyle: "long",
      })}`.yellow
    );
    return;
  }
  // set parserbusy to true
  parserBusy = true;
  // pass into mercury parser
  const parserSuccesss = await mercuryParser(file);
  if (!parserSuccesss) {
    file.status = "Error";
  }
  // update mongo file
  file.queue = "Audio";
  await file.save();

  console.log(
    `Text file ${file.metadata.slug} parsed. ${new Date().toLocaleString(
      "en-SG",
      {
        dateStyle: "long",
        timeStyle: "long",
      }
    )}`.yellow
  );
  // set parserbusy to false
  parserBusy = false;
});

module.exports = parserJob;
