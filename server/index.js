require("dotenv").config();
require("./mongoose");
const app = require("./express");

// Routes
app.use("/auth", require("../api/routes/auth"));
app.use("/user", require("../api/routes/api-v1-user"));
app.use("/api/v1/resource", require("../api/routes/api-v1-resource"));

// app.get("/", (req, res) => {
//   if (req.isAuthenticated()) {
//     res.redirect(`http://localhost:5000/profile/${req.user._id}`);
//   }
//   res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
// });

//  ---------------------------------------------------------------------------------------
//  @desc     Users log out
//  @route    POST  /logout
//  @access   Public

app.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

//  ---------------------------------------------------------------------------------------
//  @desc     All other pages and 404
//  @route    GET  /*
//  @access   Public
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});
