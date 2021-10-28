// Middlewares
const asyncHandler = require("../middlewares/asyncHandler");
const Mercury = require("@postlight/mercury-parser");
/* ------------------------ */
/*         POST              */
/* ------------------------ */
/*  @route    /upload                                                       
/*  @desc     Upload resource                                                 
/*  @access   Private                                                       
/* ------------------------ */

exports.post_one = asyncHandler(async (req, res, next) => {
  let result;
  if (req.body.url) {
    result = await Mercury.parse(req.body.url, {
      contentType: "text",
    });
    res.status(200).json({ success: true, data: result });
  }
});
