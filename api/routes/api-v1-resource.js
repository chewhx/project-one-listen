const router = require("express").Router();
const private = require("../middlewares/private");
const validUrl = require("../middlewares/validUrl");
const userLimits = require("../middlewares/userLimits");

const {
  get_all_resources,
  get_resource,
  post_resource_text,
  post_resource_url,
  upload_to_gdrive,
  edit_file,
  delete_file,
} = require("../controllers/api-v1-resource");

router.get("/", get_all_resources);
router.post("/url", private, validUrl, userLimits, post_resource_url);
router.post("/text", post_resource_text);
router.get("/:id", private, get_resource);
router.put("/:id", private, edit_file);
// router.post("/upload/:id", private, upload_to_gdrive)
// router.delete("/:id", private, delete_file);

module.exports = router;
