const MongoResource = require("../models/Resource");
// const MongoUser = require("../../../models/User");
// const { parserEvent, synthEvent } = require("../../../events");
const createError = require("http-errors");
// const writeToBucket = require("../../../services/gcp/writeToBucket");

const createResource = require("../services/createResource");
const postUserLimits = require("../services/postUserLimits");
//  ---------------------------------------------------------------------------------------
//  @desc     Get all resources
//  @route    GET  /api/v2/resource
//  @access   Admin

exports.get_all = async (req, res, next) => {
  try {
    const resources = await MongoResource.find({});
    res.status(200).json(resources);
  } catch (err) {
    next(err);
  }
};

//  ---------------------------------------------------------------------------------------
//  @desc     Get resource by id
//  @route    GET  /api/v2/resource/:id
//  @access   Private

exports.get_one = async (req, res, next) => {
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
//  @desc     Create a new resource (type=url,text)
//  @route    POST  /resource?type=
//  @access   Private

exports.post_one = async (req, res, next) => {
  try {
    // Create resource based on req.query.type
    const resource = await createResource(req);

    if (resource) {
      // Increment user limits
      await postUserLimits(req.user._id);
    }
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

exports.edit_one = async (req, res, next) => {
  try {
    // Update file
    const resource = await MongoResource.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );

    // Handle no resource
    if (!resource)
      throw createError(404, `No resource found with id ${resourceId}`);

    res.status(200).send(resource);
  } catch (err) {
    next(err);
  }
};

//  ---------------------------------------------------------------------------------------
//  @desc     Delete a resource
//  @route    DELETE  /resource/:id
//  @access   Private

exports.delete_one = async (req, res, next) => {
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
    const resource = await MongoResource.findById(req.params.id);

    // Delete file from Google Cloud Storage
    await deleteFileGStorage(resource);

    // Delete file from db
    await resource.remove();

    res.status(200).send(`Resource ${req.params.id} deleted.`);
  } catch (err) {
    next(err);
  }
};
