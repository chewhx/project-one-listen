const router = require("express").Router();
const authenticated = require("../middlewares/authenticated");
const authorised = require("../middlewares/authorised");
const private = require("../middlewares/private");
const mongoid = require("../middlewares/mongoid");

const controller = require("../controllers/user");

router.get("/", authorised, controller.get_one);
// router.get("/", authenticated, controller.get_all);
router.put("/:id", authorised, controller.edit_one);
// router.delete("/:id", /*admin*/ controller.delete_one);

module.exports = router;
