const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    sourceUrl: { type: String, default: "" },
    selfLink: { type: String, default: "" },
    selfPath: { type: String, default: "" },
    selfName: { type: String, default: "" },
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
  },
  { timestamps: true }
);

// fileSchema.statics.dequeue = function (jobQueue) {
//   return this.model.findOne({ queue: jobQueue });
// };

module.exports = new mongoose.model("File", fileSchema);
