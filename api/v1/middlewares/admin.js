const admin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    next();
  } else {
    throw new MyError(401, "Unauthorised. Admin only.");
  }
};

module.exports = admin;
