const schedule = require("node-schedule");
const logger = require("pino")({ prettyPrint: true });
const MongoFile = require("../config/mongoose/Resource");
const parseText = require("../modules/parseText");

// This scheduled job will pull the latest file from Mongo with queue: "Parser" and parse the sourceUrl
const parserScheduleRules = new schedule.RecurrenceRule();
parserScheduleRules.tz = "Asia/Singapore";
parserScheduleRules.second = 30;

let parserBusy = false;

const parserJob = schedule.scheduleJob(parserScheduleRules, async () => {
  if (parserBusy) return;
  // get a file on parser queue from mongo
  const file = await MongoFile.findOne({ "job.queue": "Parser" });
  if (!file) {
    logger.warn(
      `No file queued for text parsing. ${new Date().toLocaleString("en-SG", {
        dateStyle: "long",
        timeStyle: "long",
      })}`.yellow
    );
    return;
  }
  // set parserbusy to true
  parserBusy = true;
  // pass into mercury parser
  const parserSuccesss = await parseText(file);
  if (!parserSuccesss) {
    file.job.status = "Error";
  }
  // update mongo file
  file.job.queue = "Audio";
  await file.save();

  logger.info(
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
