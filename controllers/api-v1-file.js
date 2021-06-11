const MongoFile = require("../config/mongoose/File");
const MongoUser = require("../config/mongoose/User");
const MyError = require("../config/myErrorClass");
const deleteFileGStorage = require("../modules/deleteFileGStorage");
const uploadToGoogleDrive = require("../modules/uploadToGoogleDrive");

//  ---------------------------------------------------------------------------------------
//  @desc     Enqueue a file
//  @route    POST  /file
//  @access   Private

exports.post_file = async (req, res) => {
  try {
    // Find user by id
    const user = await MongoUser.findById(req.user._id);

    // Check user quotas, daily and monthly limits
    const fileLimitExceeded = user.files.owner.length >= user.files.ownerLimit;
    const dailyLimitsExceeded =
      user.limits.perDayUsed >= user.limits.perDayLimit;
    const monthlyLimitsExceeded =
      user.limits.perMonthUsed >= user.limits.perMonthLimit;

    // If quota exceeds, throw error
    if (fileLimitExceeded || dailyLimitsExceeded || monthlyLimitsExceeded) {
      throw Error(
        `${fileLimitExceeded && "Files quota exceeded."}  ${
          dailyLimitsExceeded && "Daily limits exceeded."
        } ${monthlyLimitsExceeded && "Monthly limits exceeded."}`
      );
    }

    // If quota and limits do not exceed
    if (!fileLimitExceeded && !dailyLimitsExceeded && !monthlyLimitsExceeded) {
      // Add new file to db
      const { _id: fileId } = await MongoFile.create({
        sourceUrl: req.body.url,
        metadata: {
          title: "",
          slug: "",
          excerpt: "",
          wordCount: 0,
          charCount: 0,
        },
        filePath: "",
        fileName: "",
        user: req.user._id,
      });
      // Push file to user files array, and update limits
      user.limits.perDayUsed += 1;
      user.limits.perMonthUsed += 1;
      user.files.owner.push(fileId);
      user.save();
    }
    res.redirect(`/user/${req.user._id}`);
  } catch (err) {
    next(err);
  }
};

//  ---------------------------------------------------------------------------------------
//  @desc     Upload article audio to gdrive
//  @route    POST  /file/upload/:fileId
//  @access   Private

exports.upload_to_gdrive = async (req, res, next) => {
  try {
    // Get file from Mongo
    const file = await MongoFile.findById(req.params.fileId);

    // Get user google token
    const user = await MongoUser.findById(req.user._id);

    // Upload file to Google Drive
    const uploadSuccess = await uploadToGoogleDrive(file, user);

    // If upload success
    if (uploadSuccess) {
      // Change file downloads to true
      res.status(200).redirect(`/user/${req.user.id}`);
    }
    throw new MyError(500, "Error uploding to Google Drive");
  } catch (err) {
    next(err);
  }
};

//  ---------------------------------------------------------------------------------------
//  @desc     Delete a file
//  @route    DELETE  /file/:fileId
//  @access   Private

exports.delete_file = async (req, res) => {
  try {
    // Pull from files array, decrease filesLength
    await MongoUser.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { "files.owner": req.params.fileId },
      },
      { new: true }
    );

    // Find find from db
    const file = await MongoFile.findById(req.params.fileId);

    // Delete file from Google Cloud Storage
    await deleteFileGStorage(file);

    // Delete file from db
    await file.remove();

    res.redirect(303, `/user/${req.user._id}`);
  } catch (error) {
    res.render("error", { error, user: req.user });
  }
};
