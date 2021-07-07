const router = require("express").Router();
const authenticated = require("../middlewares/authenticated");
const private = require("../middlewares/private");
const mongoid = require("../middlewares/mongoid");

const {
  get_all,
  get_one,
  edit_one,
  delete_one,
} = require("../controllers/user");

router.get("/", /* admin */ get_all);
router.get("/:id", mongoid, authenticated, private, get_one);
router.put("/:id", authenticated, private, edit_one);
router.delete("/:id", /*admin*/ delete_one);

module.exports = router;
