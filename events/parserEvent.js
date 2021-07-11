const { EventEmitter } = require("events");
const MongoResource = require("../api/v2/models/Resource");
const logger = require("pino")({ prettyPrint: true });
const synthEvent = require("./synthEvent");

const Mercury = require("@postlight/mercury-parser");
const gcp = require("../services/gcp");
const slug = require("../utils/slug");

const parserEvent = new EventEmitter();

parserEvent["schedule"] = null;

parserEvent.on("start", async () => {
  logger.info("parserEvent start");
  let busy = false;
  try {
    // At intervals
    parserEvent.schedule = setInterval(async () => {
      if (busy) return;
      // Set indicator to true
      busy = true;
      // Dequeue from mongodb
      let resource = await MongoResource.findOne({ "job.queue": "Parser" });

      // If no queue items, emit stop
      if (!resource || resource === null) {
        parserEvent.emit("stop");
        parserEvent.schedule = null;
        return;
      }

      // Run mercury parser to get text
      const res = await Mercury.parse(resource.sourceUrl, {
        contentType: "text",
      });

      // Update resource metadata
      resource.metadata = {
        title: res.title,
        slug: slug(res.title),
        excerpt: res.excerpt,
        wordCount: res.word_count,
        charCount: res.content.length,
      };

      resource.paths = {
        parser: `${resource.owner}/parser`,
        audio: `${resource.owner}/audio`,
      };

      resource.job = {
        status: "Processing",
        queue: "Audio",
      };

      await resource.save();

      // Save mercury results to gcp as json file
      // Set json file content char_count for reference by synth event
      res.char_count = res.content.length;
      await gcp.file.write.singleWrite(
        `${resource.paths.parser}/${resource.metadata.slug}`,
        JSON.stringify(res),
        {
          metadata: { contentType: "application/json" },
        }
      );

      // Emit synth event is it has not started
      if (!synthEvent.schedule) {
        synthEvent.emit("start");
      }

      // Set indicator to false
      busy = false;

      // Repeat every 6 seconds
    }, 6000);
  } catch (err) {
    logger.error(err);
    resource.job.status = "Error";
    await resource.save();
  }
});

parserEvent.on("stop", () => {
  logger.info("parserEvent stop");
  clearInterval(parserEvent.schedule);
});

module.exports = parserEvent;
