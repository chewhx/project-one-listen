const schedule = require("node-schedule");
const MongoUser = require("../api/v2/models/User");

// This job will reset the daily user upload limits at 23:59:00

const dayRule = new schedule.RecurrenceRule();
dayRule.tz = "Asia/Singapore";
dayRule.hour = 23;
dayRule.minute = 59;
dayRule.second = 59;

const resetUserDayLimit = schedule.scheduleJob(dayRule, () => {
  MongoUser.updateMany({}, { "limits.perDayUsed": 0 })
    .then((res) =>
      console.log(
        `${String.fromCodePoint(0x2705)} Daily limits reset for ${
          res.nModified
        } of ${res.n} users. ${new Date().toLocaleDateString(
          "en-SG",
          { dateStyle: "long", timeStyle: "long" }
          // LocaleString options: https://www.w3schools.com/jsref/jsref_tolocalestring.asp
        )}`.yellow
      )
    )
    .catch((err) => {
      console.log(err);
      console.log(
        `${String.fromCodePoint(
          0x274c
        )} Error resetting daily limits for users ${new Date().toLocaleDateString(
          "en-SG",
          { dateStyle: "long", timeStyle: "long" }
        )}`.red
      );
    });
});

module.exports = resetUserDayLimit;
