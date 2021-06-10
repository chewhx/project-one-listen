const router = require("express").Router();
const private = require("../middlewares/private");
const {
  post_file,
  upload_file,
  delete_file,
} = require("../controllers/api-v1-file");

router.post("/", private, post_file);
router.post("/upload/:fileId", private, upload_file);
router.delete("/:fileId", private, delete_file);

module.exports = router;
