class MyError extends Error {
  constructor(statusCode, message, ...params) {
    super(...params);

    this.stack = new Error().stack;
    this.statusCode = statusCode || 500;
    this.message = message || "Server Error";
  }
}

module.exports = MyError;
