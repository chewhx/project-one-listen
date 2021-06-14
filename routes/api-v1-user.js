const router = require("express").Router();
const private = require("../middlewares/private");
const admin = require("../middlewares/admin");
const {
  get_user_profile,
  delete_user,
  get_all_user_profiles,
  edit_user,
} = require("../controllers/api-v1-user");

router.get("/", admin, get_all_user_profiles);
router.get("/:id", private, get_user_profile);
router.put("/:id", admin, edit_user);
router.delete("/:id", private, delete_user);


module.exports = router;
