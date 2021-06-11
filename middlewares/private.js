const MyError = require("../config/myErrorClass");

const private = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    throw new MyError(401, "Unauthorised");
  }
};

module.exports = private;
