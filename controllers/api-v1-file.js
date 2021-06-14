const MongoFile = require("../config/mongoose/File");
const MongoUser = require("../config/mongoose/User");
const MyError = require("../config/myErrorClass");
const deleteFileGStorage = require("../modules/deleteFileGStorage");
const uploadToGoogleDrive = require("../modules/uploadToGoogleDrive");

//  ---------------------------------------------------------------------------------------
//  @desc     Get all files
//  @route    GET  /file
//  @access   Test

exports.get_all_files = async (req, res, next) => {
  try {
    const files = await MongoFile.find({});
    res.status(200).json(files);
  } catch (err) {
    next(err);
  }
};

//  ---------------------------------------------------------------------------------------
//  @desc     Get file by id
//  @route    GET  /file/:id
//  @access   Private

exports.get_file = async (req, res, next) => {
  try {
    const fileId = req.params.id;

    // Get file by id
    const file = await MongoFile.findById(fileId);

    // Handle no file
    if (!file) throw MyError(404, `No file found with id ${fileId}`);

    res.status(200).send(file);
  } catch (err) {
    next(err);
  }
};

//  ---------------------------------------------------------------------------------------
//  @desc     Enqueue a file
//  @route    POST  /file
//  @access   Private

exports.post_file = async (req, res, next) => {
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
      let message = "";
      if (fileLimitExceeded) message += "Files limit exceeded. ";
      if (dailyLimitsExceeded) message += "Daily limits exceeded. ";
      if (monthlyLimitsExceeded) message += "Monthly limits exceeded. ";

      throw MyError(400, message);
    }

    // If quota and limits do not exceed
    if (!fileLimitExceeded && !dailyLimitsExceeded && !monthlyLimitsExceeded) {
      // Add new file to db
      const file = await MongoFile.create({
        sourceUrl: req.body.url,
        kind: "Article",
        owner: req.user._id,
      });
      // Push file to user files array, and update limits
      user.limits.perDayUsed += 1;
      user.limits.perMonthUsed += 1;
      user.files.owner.push(file._id);
      user.save();
      res.status(201).send(file);
    }
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
    const file = await MongoFile.findById(req.params.id);

    // Get user google token
    const { googleToken } = await MongoUser.findById(req.user._id).select(
      "googleToken"
    );

    // Upload file to Google Drive
    const uploadSuccess = await uploadToGoogleDrive(file, googleToken);

    // If upload success
    if (uploadSuccess) {
      // Change file downloads to true
      res.status(200).send(`File ${file.metadata.title} uploaded.`);
    }
    throw new MyError(500, "Error uploding to Google Drive");
  } catch (err) {
    next(err);
  }
};

//  ---------------------------------------------------------------------------------------
//  @desc     Edit artile details
//  @route    PUT  /:id
//  @access   Private

exports.edit_file = async (req, res, next) => {
  try {
    // Update file
    const file = await MongoFile.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });

    // Handle no file
    if (!file) throw MyError(404, `No file found with id ${fileId}`);

    res.status(200).send(`File ${req.params.id} updated.`)
  } catch (err) {
    next(err);
  }
};

//  ---------------------------------------------------------------------------------------
//  @desc     Delete a file
//  @route    DELETE  /file/:id
//  @access   Private

exports.delete_file = async (req, res, next) => {
  try {
    // Pull from files array, decrease filesLength
    await MongoUser.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { "files.owner": req.params.id },
      },
      { new: true }
    );

    // Find find from db
    const file = await MongoFile.findById(req.params.id);

    // Delete file from Google Cloud Storage
    await deleteFileGStorage(file);

    // Delete file from db
    await file.remove();

    res.status(200).send(`File ${req.params.id} deleted.`);
  } catch (err) {
    next(err);
  }
};
