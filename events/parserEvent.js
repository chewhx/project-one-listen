const { EventEmitter } = require("events");
const parser = require("../services/parser");
const MongoResource = require("../models/Resource");
const logger = require("pino")({ prettyPrint: true });
const synthEvent = require("./synthEvent");

const parserEvent = new EventEmitter();

parserEvent["schedule"] = null;
parserEvent.on("start", () => {
  let busy = false;
  // At intervals
  parserEvent.schedule = setInterval(async () => {
    if (busy) return;
    // Set indicator to true
    busy = true;
    // Dequeue from mongodb
    const resource = await MongoResource.findOne({ "job.queue": "Parser" });

    // If no queue items, emit stop
    if (!resource || resource === null) {
      parserEvent.emit("stop");
      parserEvent.schedule = null;
      return;
    }

    // Run parser and speech for resource
    await parser(resource);
    resource.job.queue = "Audio";
    await resource.save();

    if (!synthEvent.schedule) {
      synthEvent.emit("start");
    }

    // Set indicator to false
    busy = false;

    // Repeat
  }, 6000);
});

parserEvent.on("stop", () => {
  logger.info("parserEvent stop");
  clearInterval(parserEvent.schedule);
});

module.exports = parserEvent;
