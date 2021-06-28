const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Article", "Text"] },
    sourceUrl: { type: String, default: "" },
    selfLink: { type: String, default: "" },
    metadata: {
      title: { type: String, default: "" },
      slug: { type: String, default: "" },
      excerpt: { type: String, default: "" },
      wordCount: { type: Number, default: 0 },
      charCount: { type: Number, default: 0 },
    },
    paths: {
      parser: { type: String, default: "" },
      audio: { type: String, default: "" },
    },
    job: {
      status: {
        type: String,
        default: "Processing",
        enum: ["Completed", "Error", "Processing", "Editing"],
      },
      queue: {
        type: String,
        default: "Parser",
        enum: ["Parser", "Audio", "None"],
      },
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Resource", resourceSchema);
