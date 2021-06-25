const schedule = require("node-schedule");
const logger = require("pino")({ prettyPrint: true });
const MongoResource = require("../config/mongoose/Resource");
const forwardLinkScheduleRules = new schedule.RecurrenceRule();
forwardLinkScheduleRules.tz = "Asia/Singapore";
forwardLinkScheduleRules.second = 55;

const forwardJob = schedule.scheduleJob(forwardLinkScheduleRules, async () => {
  const resources = await MongoResource.find({ sent: false });

  if (!resources.length) return false;

  return resources;
});

module.exports = forwardJob;
