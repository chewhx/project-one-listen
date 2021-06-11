const router = require("express").Router();
const private = require("../middlewares/private");
const {
  get_user_profile,
  get_user_uploads,
  delete_user
} = require("../controllers/api-v1-user");

router.get("/:id", private, get_user_uploads);
router.get("/:id/profile", private, get_user_profile);
router.delete("/:id", private, delete_user);

module.exports = router;
