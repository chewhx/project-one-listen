const router = require("express").Router();
const private = require("../middlewares/private");
const {
  get_all_files,
  get_file,
  post_file,
  upload_to_gdrive,
  edit_file,
  delete_file,
} = require("../controllers/api-v1-file");

router.get("/all", get_all_files);
router.get("/:id", private, get_file)
router.post("/", private, post_file);
router.post("/upload/:id", private, upload_to_gdrive);
router.put("/:id", edit_file)
router.delete("/:id", private, delete_file);


module.exports = router;
