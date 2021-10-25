const router = require("express").Router();
const authorised = require("../middlewares/authorised");
const controller = require("../controllers/podcast");

router.put("/", authorised, controller.put_podcast_for_user);
router.delete("/", authorised, controller.delete_podcast_for_user);

module.exports = router;
