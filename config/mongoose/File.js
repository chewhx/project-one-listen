const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    sourceUrl: String,
    metadata: {
      title: String,
      slug: String,
      excerpt: String,
      wordCount: Number,
      charCount: Number,
    },
    filePath: String,
    fileName: String,
    fileLink: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      default: "Processing",
      enum: ["Completed", "Error", "Processing"],
    },
    queue: {
      type: String,
      default: "Parser",
      enum: ["Parser", "Audio", "None"],
    },
    downloads: {
      direct: { type: Boolean, default: false },
      gDrive: { type: Boolean, default: false },
      email: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("File", fileSchema);
