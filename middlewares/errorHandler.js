const errorHandler = (err, req, res, next) => {
  const error = {};

  error.statusCode = err.statusCode || err.status;
  error.message = err.message;
  console.error(err);

  res
    .status(error.statusCode || err.statusCode || err.status || 500)
    .render("error", { error, user: req.user });
};

module.exports = errorHandler;
