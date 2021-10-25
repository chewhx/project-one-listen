// Modules
const createHttpError = require("http-errors");
// Events
const { parserEvent, synthEvent } = require("../../../events");
// Models
const MongoResource = require("../models/Resource");
const MongoUser = require("../models/User");
// Services
const deleteFromBucket = require("../../../services/gcp/file/delete");
const gcp = require("../../../services/gcp");
const createResource = require("../services/createResource");
const postUserLimits = require("../services/postUserLimits");
// Middlewares
const asyncHandler = require("../middlewares/asyncHandler");

//  --------------------------------------------------------------------------------------
//  @desc     Get all resources
//  @route    GET  /api/v2/resource
//  @access   Admin

exports.get_all = asyncHandler(async (req, res) => {
  const resources = await MongoResource.find({});
  res.status(200).json(resources);
});

//  ---------------------------------------------------------------------------------------
//  @desc     Get resource by id
//  @route    GET  /api/v2/resource/:id
//  @access   Private

exports.get_one = asyncHandler(async (req, res, next) => {
  const resourceId = req.params.id;

  // Get resource by id
  const resource = await MongoResource.findById(resourceId);

  // Handle no resource
  if (!resource)
    throw createHttpError(404, `No resource found with id ${resourceId}`);

  res.status(200).send(resource);
});

//  ---------------------------------------------------------------------------------------
//  @desc     Create a new resource (type=url,text)
//  @route    POST  /api/v2/resource
//  @query    type=url,text
//  @access   Private

exports.post_one = asyncHandler(async (req, res, next) => {
  // Create resource based on query and return the resource
  const resource = await createResource(req);

  // Increment user limits
  if (resource) {
    const user = await MongoUser.findById(req.user._id);
    await user.postLimits(resource._id);
  }

  // Start parser event for url if not yet started
  if ((resource.type = "Article" && parserEvent.schedule === null)) {
    parserEvent.emit("start");
  }

  // Start synth event for text if not yet started
  if ((resource.type = "Text" && synthEvent.schedule === null)) {
    synthEvent.emit("start");
  }

  res.status(201).json(resource);
});

//  ---------------------------------------------------------------------------------------
//  @desc     Edit artile details
//  @route    PUT  /api/v2/resource/:id
//  @access   Private

exports.edit_one = asyncHandler(async (req, res, next) => {
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
    throw createHttpError(404, `No resource found with id ${resourceId}`);

  res.status(200).send(resource);
});

//  ---------------------------------------------------------------------------------------
//  @desc     Delete a resource
//  @route    DELETE  /api/v2/resource
//  @access   Private

exports.delete_one = asyncHandler(async (req, res, next) => {
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

  if (resource.selfLink) {
    // Delete file from Google Cloud Storage
    await gcp.file.delete(resource.paths.parser + "/" + resource.metadata.slug);
    await deleteFromBucket(resource.paths.audio + "/" + resource.metadata.slug);
  }

  // Delete file from db
  await resource.remove();

  res.status(204).json({});
});
