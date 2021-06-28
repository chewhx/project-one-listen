const MongoResource = require("../../models/Resource");
const MongoUser = require("../../models/User");
const { parserEvent, synthEvent } = require("../../events");
const createError = require("http-errors");
const writeToBucket = require("../../services/gcp/writeToBucket");

//  ---------------------------------------------------------------------------------------
//  @desc     Get all resources
//  @route    GET  /resource
//  @access   Admin

exports.get_all_resources = async (req, res, next) => {
  try {
    const resources = await MongoResource.find({});
    res.status(200).json(resources);
  } catch (err) {
    next(err);
  }
};

//  ---------------------------------------------------------------------------------------
//  @desc     Get resource by id
//  @route    GET  /resource/:id
//  @access   Private

exports.get_resource = async (req, res, next) => {
  try {
    const resourceId = req.params.id;

    // Get resource by id
    const resource = await MongoResource.findById(resourceId);

    // Handle no resource
    if (!resource)
      throw createError(404, `No resource found with id ${resourceId}`);

    res.status(200).send(resource);
  } catch (err) {
    next(err);
  }
};

//  ---------------------------------------------------------------------------------------
//  @desc     Enqueue a resource for body text
//  @route    POST  /resource/text
//  @access   Private

exports.post_resource_text = async (req, res, next) => {
  try {
    // Declare variable beacuse they will not be set by mercury parser
    const slug = req.body.slug || Date.now();
    const title = req.body.title || `${Date.now()}-${req.user._id}`;
    const char_count = req.body.char_count || req.body.text.length;
    const word_count = req.body.word_count || req.body.text.split(" ").length;

    // Create resource
    const resource = await MongoResource.create({
      type: "Text",
      job: {
        queue: "Audio",
      },
      metadata: { slug },
      paths: {
        parser: `${req.user._id}/parser`,
        audio: `${req.user._id}/audio`,
      },
      owner: req.user._id,
    });

    // Save body text to google cloud as json
    const parserFilePath = `${resource.paths.parser}/${resource.metadata.slug}`;
    const object = {
      content: req.body.text,
      word_count,
      char_count,
      slug,
      title,
    };
    await writeToBucket.singleWrite(parserFilePath, JSON.stringify(object), {
      metadata: { contentType: "application/json" },
    });

    // Push file to user files array, and update limits
    const user = await MongoUser.findById(req.user._id);
    user.limits.perDayUsed += 1;
    user.limits.perMonthUsed += 1;
    user.files.owner.push(resource._id);
    await user.save();

    // Trigger synth event
    synthEvent.emit("start");
    res.status(201).send(resource);
  } catch (err) {
    next(err);
  }
};

//  ---------------------------------------------------------------------------------------
//  @desc     Enqueue a resource
//  @route    POST  /resource/url
//  @access   Private

exports.post_resource_url = async (req, res, next) => {
  try {
    // Create resource
    const resource = await MongoResource.create({
      type: "Article",
      sourceUrl: req.body.url,
      owner: req.user._id,
    });

    // Push file to user files array, and update limits
    const user = await MongoUser.findById(req.user._id);
    user.limits.perDayUsed += 1;
    user.limits.perMonthUsed += 1;
    user.files.owner.push(resource._id);
    await user.save();

    // Trigger parser event
    parserEvent.emit("start");
    res.status(201).send(resource);
  } catch (err) {
    next(err);
  }
};

//  ---------------------------------------------------------------------------------------
//  @desc     Upload article audio to gdrive
//  @route    POST  /file/upload/:fileId
//  @access   Private

// exports.upload_to_gdrive = async (req, res, next) => {
//   try {
//     // Get file from Mongo
//     const file = await MongoFile.findById(req.params.id);

//     // Get user google token
//     const { googleToken } = await MongoUser.findById(req.user._id).select(
//       "googleToken"
//     );

//     // Upload file to Google Drive
//     const uploadSuccess = await uploadToGoogleDrive(file, googleToken);

//     // If upload success
//     if (uploadSuccess) {
//       // Change file downloads to true
//       res.status(200).send(`File ${file.metadata.title} uploaded.`);
//     }
//     throw new MyError(500, "Error uploding to Google Drive");
//   } catch (err) {
//     next(err);
//   }
// };

//  ---------------------------------------------------------------------------------------
//  @desc     Edit artile details
//  @route    PUT  /:id
//  @access   Private

exports.edit_file = async (req, res, next) => {
  try {
    // Update file
    const file = await MongoResource.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );

    // Handle no file
    if (!file) throw createError(404, `No file found with id ${fileId}`);

    res.status(200).send(file);
  } catch (err) {
    next(err);
  }
};

//  ---------------------------------------------------------------------------------------
//  @desc     Delete a file
//  @route    DELETE  /file/:id
//  @access   Private

// exports.delete_file = async (req, res, next) => {
//   try {
//     // Pull from files array, decrease filesLength
//     await MongoUser.findByIdAndUpdate(
//       req.user._id,
//       {
//         $pull: { "files.owner": req.params.id },
//       },
//       { new: true }
//     );

//     // Find find from db
//     const file = await MongoFile.findById(req.params.id);

//     // Delete file from Google Cloud Storage
//     await deleteFileGStorage(file);

//     // Delete file from db
//     await file.remove();

//     res.status(200).send(`File ${req.params.id} deleted.`);
//   } catch (err) {
//     next(err);
//   }
// };
