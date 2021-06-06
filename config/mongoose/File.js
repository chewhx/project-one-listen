const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    sourceUrl: String,
    filePath: String,
    fileName: String,
    fileLink: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["Completed", "Error", "Processing"] },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("File", fileSchema);
