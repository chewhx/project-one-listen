require("dotenv").config();
const { EventEmitter } = require("events");
const speech = require("../services/synthesize");
const MongoResource = require("../api/v2/models/Resource");
const logger = require("pino")({ prettyPrint: true });

const synthEvent = new EventEmitter();

synthEvent["schedule"] = null;
synthEvent.on("start", async () => {
  logger.info("synthEvent start");
  let busy = false;
  try {
    // At intervals
    synthEvent.schedule = setInterval(async () => {
      if (busy) return;
      // Set indicator to true
      busy = true;
      // Dequeue from mongodb
      const resource = await MongoResource.findOne({ "job.queue": "Audio" });

      // If no queue items, emit stop
      if (!resource || resource === null) {
        synthEvent.emit("stop");
        synthEvent.schedule = null;
        return;
      }

      // Run parser and speech for resource
      await speech(resource);
      resource.job = {
        status: "Completed",
        queue: "None",
      };
      resource.selfLink = `https://storage.googleapis.com/${process.env.GCP_BUCKET}/${resource.owner}/audio/${resource.metadata.slug}`;
      await resource.save();

      // Set indicator to false
      busy = false;

      // Repeat
    }, 20000);
  } catch (err) {
    logger.error(err);
    resource.job.status = "Error";
    await resource.save();
  }
});

synthEvent.on("stop", () => {
  logger.info("synthEvent stop");
  clearInterval(synthEvent.schedule);
});

module.exports = synthEvent;
