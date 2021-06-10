const router = require("express").Router();
const private = require("../middlewares/private");
const { get_user } = require("../controllers/api-v1-user");

//  ---------------------------------------------------------------------------------------
//  @desc     User profile page
//  @route    GET  /user/:id
//  @access   Private

router.get("/:id", private, get_user);

module.exports = router;
