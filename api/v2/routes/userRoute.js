const router = require("express").Router();
const authenticated = require("../middlewares/authenticated");
const private = require("../middlewares/private");
const mongoid = require("../middlewares/mongoid");

const controller = require("../controllers/user");

router.get("/", /* admin */ controller.get_all);
router.get("/:id", mongoid, authenticated, private, controller.get_one);
router.put("/:id", authenticated, private, controller.edit_one);
router.delete("/:id", /*admin*/ controller.delete_one);

module.exports = router;
