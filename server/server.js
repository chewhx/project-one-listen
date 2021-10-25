// Config
require("dotenv").config();
const config = process.env;

// Express Server
const app = require("./express");

// Mongoose
const mongoose = require("./mongoose");

// Express Server Port
const PORT = config.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(
    ` Server running in ${config.NODE_ENV} on ${PORT} `.green.bold.inverse
  );
});

// Exports
module.exports = server;
