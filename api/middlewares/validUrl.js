const createHttpError = require("http-errors");

const validBodyUrl = (req, res, next) => {
  const { url } = req.body;

  if (!url) throw createHttpError(400, `Request body does not contain url`);
  const isValidUrl = url.match(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g
  );

  if (!isValidUrl) throw createHttpError(400, `Input is not a valid url`);

  next();
};

module.exports = validBodyUrl;
