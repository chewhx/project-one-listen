const mongoose = require("mongoose");

const podcastSchema = new mongoose.Schema(
  {
    title: String,
    feed: String,
    image: String,
    tags: Array,
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("Podcast", podcastSchema);
