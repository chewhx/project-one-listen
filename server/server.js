require("dotenv").config();
const app = require("./express");

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    ` Server running in ${process.env.NODE_ENV} on ${PORT} `.green.bold.inverse
  );
});

module.exports = server;
