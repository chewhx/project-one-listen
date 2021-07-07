const router = require("express").Router();
const authenticated = require("../middlewares/authenticated");
const private = require("../middlewares/private");
const userlimits = require("../middlewares/userlimits");

const {
  get_all,
  get_one,
  post_one,
  edit_one,
  delete_one,
} = require("../controllers/resource");

router.get("/", get_all);
router.get("/:id", authenticated, get_one);
router.post("/", authenticated, private, userlimits, post_one);
router.put("/:id", edit_one);
router.delete("/:id", delete_one);

module.exports = router;
