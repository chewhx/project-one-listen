const errorHandler = (err, req, res, next) => {
  const error = {};

  error.statusCode = err.statusCode || err.status;
  error.message = err.message;
  console.log(err);

  res
    .status(error.statusCode || err.statusCode || err.status || 500)
    .send(error.message || "Server error");
};

module.exports = errorHandler;
