const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    photo: String,
    googleId: String,
    googleToken: {
      access_token: { type: String, select: false },
      refresh_token: { type: String, select: false },
      scope: { type: String, select: false },
      token_type: { type: String, select: false },
      id_token: { type: String, select: false },
      expiry_date: { type: Number, select: false },
    },
    limits: {
      perDayUsed: { type: Number, default: 0 },
      perDayLastReset: Date,
      perDayNextReset: Date,
      perDayLimit: { type: Number, default: 5 },
      perMonthUsed: { type: Number, default: 0 },
      perMonthLastReset: Date,
      perMonthNextReset: Date,
      perMonthLimit: { type: Number, default: 30 },
    },
    files: {
      ownerLimit: { type: Number, default: 10 },
      owner: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
      viewerLimit: { type: Number, default: 50 },
      viewer: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
    },
    downloads: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File",
        downloadedDate: Date,
      },
    ],
    lastLogin: Date,
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Date helpers
Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};

Date.prototype.addMonths = function (h) {
  this.setTime(this.getTime() + h * 30 * 24 * 60 * 60 * 1000);
  return this;
};

// Reset day and month limits on every post
userSchema.methods.resetLimits = async function () {
  const { perDayNextReset, perMonthNextReset } = this.limits;

  const currentDate = new Date();

  // Reset for:  perDayNextReset is equal to or less than current date
  if (perDayNextReset <= currentDate) {
    this.limits.perDayUsed = 0;
    this.limits.perDayLastReset = perDayNextReset;
    this.limits.perDayNextReset = currentDate.addHours(24);
  }

  // perMonthNextReset is equal to or less than current date
  if (perMonthNextReset <= currentDate) {
    this.limits.perMonthUsed = 0;
    this.limits.perMonthLastReset = perMonthNextReset;
    this.limits.perMonthNextReset = currentDate.addMonths(1);
  }

  await this.save();
};

const User = new mongoose.model("User", userSchema);

module.exports = User;
