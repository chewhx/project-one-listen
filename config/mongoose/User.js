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
    filesQuota: { type: Number, default: 10 },
    files: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("User", userSchema);
