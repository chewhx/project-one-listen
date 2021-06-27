const { EventEmitter } = require("events");
const util = require("util");
const MongoResource = require("../models/Resource");

require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(`Connected: ${conn.connection.host}`);
};

connectDB();

const job = new EventEmitter();

job["schedule"] = null;
job.on("start-parser", () => {
  let queue = ["60d559622d387f4a6f830eea", "60d55fa26baba34f8e4b4b51"];
  let busy = false;
  this.schedule = setInterval(async () => {
    if (busy) return;
    if (queue.length == 0) {
      clearInterval(this);
      return;
    }
    busy = true;
    const resource = await MongoResource.findById(queue.shift());
    console.log(resource.sourceUrl);
    busy = false;
  }, 1000 * 3);
});

job.on("stop-parser", () => {
  clearInterval(this.schedule);
});

job.emit("start-parser");

setTimeout(() => {
  console.log("new emit");
  job.emit("start-parser");
}, 1000 * 8);
