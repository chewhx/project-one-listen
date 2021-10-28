const router = require("express").Router();

const { post_one } = require("../controllers/upload");

router.post("/", post_one);

module.exports = router;
