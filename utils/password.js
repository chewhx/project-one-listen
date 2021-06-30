const crypto = require("crypto");

exports.hashPassword = (plainTextPw) => {
  return crypto
    .pbkdf2Sync(plainTextPw, process.env.PASSWORD_SECRET, 100, 48, "sha512")
    .toString("hex");
};

exports.matchPassword = (plainTextPw, storedPw) => {
  const hashed = crypto
    .pbkdf2Sync(plainTextPw, process.env.PASSWORD_SECRET, 100, 48, "sha512")
    .toString("hex");
  return hashed === storedPw;
};
