const MongoFile = require("../config/mongoose/File");
const MongoUser = require("../config/mongoose/User");
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
    const quotaExceeded = user.files.length >= user.filesQuota;
    const dailyLimitsExceeded =
      user.limits.perDayUsed >= user.limits.perDayLimit;
    const monthlyLimitsExceeded =
      user.limits.perMonthUsed >= user.limits.perMonthLimit;

    // If quota exceeds, throw error
    if (quotaExceeded || dailyLimitsExceeded || monthlyLimitsExceeded) {
      throw Error(
        `${quotaExceeded && "Files quota exceeded."}  ${
          dailyLimitsExceeded && "Daily limits exceeded."
        } ${monthlyLimitsExceeded && "Monthly limits exceeded."}`
      );
    }

    // If quota and limits do not exceed
    if (!quotaExceeded && !dailyLimitsExceeded && !monthlyLimitsExceeded) {
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
      user.files.push(fileId);
      user.save();
    }
    res.redirect(`/user/${req.user._id}`);
  } catch (error) {
    console.log(error);
    res.status(400).render("error", { error, user: req.user });
  }
};

//  ---------------------------------------------------------------------------------------
//  @desc     Upload article audio to gdrive
//  @route    POST  /file/upload/:fileId
//  @access   Private

exports.upload_file = async (req, res) => {
  try {
    // Get file from Mongo
    const file = await MongoFile.findById(req.params.fileId);

    // Upload file to Google Drive
    const uploadSuccess = await uploadToGoogleDrive(file, req.user);

    // If upload success
    if (uploadSuccess) {
      // Change file downloads to true
      file.downloads.gDrive = true;
      await file.save();
      res.status(200).redirect(`/user/${req.user.id}`);
    }
    res.status(500);
  } catch (error) {
    res.render("error", { error });
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
        $pull: { files: req.params.fileId },
        $inc: { filesLength: -1 },
      },
      { new: true }
    );

    // Find find from db
    const file = await MongoFile.findById(req.params.fileId);

    // Delete file from Google Cloud Storage
    await deleteFileGStorage(file);

    // Delete file from db
    await file.remove();
    await file.save();

    res.redirect(303, `/user/${req.user._id}`);
  } catch (error) {
    res.render("error", { error, user: req.user });
  }
};
