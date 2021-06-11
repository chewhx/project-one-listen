const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    photo: String,
    googleId: String,
    googleToken: {
      access_token: String,
      refresh_token: String,
      scope: String,
      token_type: String,
      id_token: String,
      expiry_date: Number,
    },
    limits: {
      perDayUsed: Number,
      perDayLimit: { type: Number, default: 5 },
      perMonthUsed: Number,
      perMonthLimit: { type: Number, default: 30 },
    },
    filesLimit: { type: Number, default: 10 },
    files: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("User", userSchema);

const obj = {
  name: String,
  email: String,
  photo: String,
  googleId: String,
  googleToken: {
    access_token: String,
    refresh_token: String,
    scope: String,
    token_type: String,
    id_token: String,
    expiry_date: Number,
  },
  limits: {
    perDayUsed: Number,
    perDayLastReset: Date,
    perDayNextReset: Date,
    perDayLimit: { type: Number, default: 5 },
    perMonthUsed: Number,
    perMonthLastReset: Date,
    perMonthNextReset: Date,
    perMonthReset: Date,
    perMonthLimit: { type: Number, default: 30 },
  },
  files: {
    ownerLimit: { type: Number, default: 10 },
    owner: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
    viewerLimit: { type: Number },
    viewer: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
  },
  downloads: [
    { type: mongoose.Schema.Types.ObjectId, ref: "File", downloadedDate: Date },
  ],
  lastLogin: Date,
};
