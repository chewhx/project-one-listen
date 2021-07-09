const schedule = require("node-schedule");
const MongoUser = require("../api/v2/models/User");

// This job will reset the monthly user upload limits on the 28th of every month at 23:59:59

const monthRule = new schedule.RecurrenceRule();
monthRule.tz = "Asia/Singapore";
monthRule.month = 28;
monthRule.hour = 23;
monthRule.minute = 59;
monthRule.second = 59;

const resetUserMonthLimit = schedule.scheduleJob(monthRule, () => {
  MongoUser.updateMany({}, { "limits.perMonthUsed": 0 })
    .then((res) =>
      console.log(
        `${String.fromCodePoint(0x2705)} Monthly limits reset for ${
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
        )} Error resetting monthly limits for users ${new Date().toLocaleDateString(
          "en-SG",
          { dateStyle: "long", timeStyle: "long" }
        )}`.red
      );
    });
});

module.exports = resetUserMonthLimit;
