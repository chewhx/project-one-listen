require("dotenv").config();
const { URL } = require("url");
const { Telegraf } = require("telegraf");
const logger = require("pino")({ prettyPrint: true });
const connectDb = require("./config/mongoose/connectDb");
const mongoResource = require("./config/mongoose/Resource");
const colors = require("colors");

require("./schedules/parser");
require("./schedules/synthesizer");

const schedule = require("node-schedule");

const forwardLinkScheduleRules = new schedule.RecurrenceRule();
forwardLinkScheduleRules.tz = "Asia/Singapore";
forwardLinkScheduleRules.second = [5, 15, 25, 45, 55];

const bot = new Telegraf(process.env.BOT_TOKEN);

const forwardJob = schedule.scheduleJob(forwardLinkScheduleRules, async () => {
  const resources = await mongoResource.find({ sent: false });

  if (!resources.length) return false;

  for (let each of resources) {
    each.sent = true;
    each.save();
    bot.telegram.sendAudio(each.chatId, each.selfLink);
    return;
  }
});

bot.command("start", async (ctx) => {
  console.log(ctx.update.message.from);
});
bot.command("parse", async (ctx) => {
  try {
    // Extract url from user message
    const url = ctx.update.message.text.split(" ")[1];
    // Check validity of url
    const isUrl = url.match(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g
    );
    // If url is not valid, log error and warn user
    if (!isUrl) {
      logger.error("User invalid url");
      ctx.reply(`🚨 Error: please input a valid url`);
      return;
    }
    // Get user info
    const chatId = ctx.update.message.from.id;
    // Create file entry in db
    const resource = await mongoResource.create({
      sourceUrl: url,
      job: {
        status: "Processing",
        queue: "Parser",
      },
      metadata: {
        parserPath: `${ctx.update.message.from.id}/parser`,
        audioPath: `${ctx.update.message.from.id}/audio`,
      },
      chatId: Number(chatId),
    });

    // If !file created, throw error
    if (!resource) {
      throw Error;
    }

    // Feedback to user
    ctx.reply(
      `✅ Url uploaded. The audio file will be sent to you when it's ready.`
    );
    return;
  } catch (err) {
    logger.error(err);
    ctx.reply(`Server Error.`);
    return;
  }
});

bot.command("send", (ctx) => {
  ctx.telegram.sendAudio(
    ctx.chat.id,
    "https://storage.googleapis.com/flashcard-6ec1f.appspot.com/telegram/audio/singapore-to-accelerate-covid-vaccination-progr"
  );
});

const launch = () => {
  console.log("Telegram bot launched.".cyan);
  bot.launch();
  connectDb();
};

launch();

module.exports = bot;
