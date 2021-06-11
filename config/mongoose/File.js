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

// fileSchema.statics.dequeue = function (jobQueue) {
//   return this.model.findOne({ queue: jobQueue });
// };

module.exports = new mongoose.model("File", fileSchema);

const file = {
  sourceUrl: { type: String, default: "" },
  privateOnly: { type: Boolean, default: true },
  kind: { type: String, enum: ["Article"] },
  selfLink: { type: String, default: "" },
  resourcePath: { type: String, default: "" },
  resourceName: { type: String, default: "" },
  metadata: {
    title: { type: String, default: "" },
    slug: { type: String, default: "" },
    excerpt: { type: String, default: "" },
    wordCount: { type: Number, default: 0 },
    charCount: { type: Number, default: 0 },
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
};
