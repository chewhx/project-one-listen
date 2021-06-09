const private = (req, res, next, err) => {
  if (req.isAuthenticated()) {
    next();
  }
  res.status(400).render("error", { error: "Unauthorised", user: req.user });
};

module.exports = private;
