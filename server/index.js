require("dotenv").config();
require("./mongoose");
require("./express");
require("./server");



// Error handler
// const errorHandler = (err, req, res, next) => {
//   const error = {};

//   error.statusCode = err.statusCode || err.status;
//   error.message = err.message;
//   console.error(err);

//   res
//     .status(error.statusCode || err.statusCode || err.status || 500)
//     .send(error.message || "Server error");
// };

// app.use(errorHandler);
