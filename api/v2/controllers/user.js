// Modules
const createHttpError = require("http-errors");
// Models
const MongoUser = require("../models/User");
const MongoPodcast = require("../models/Podcast");
// Middlewares
const asyncHandler = require("../middlewares/asyncHandler");

// Clients
const auth0Manager = require("../../../config/auth0Manager");

// ---------------------------------------------------------------------------------------
//  @desc     Get all users
//  @route    GET  /user
//  @access   Admin

// exports.get_all = asyncHandler(async (req, res, next) => {
//   res.status(200).send(req.user._json);
// });

/* ------------------------ */
/*         GET              */
/* ------------------------ */
/*  @route    /user                                                       
/*  @desc     Get user details                                                    
/*  @access   Private                                                       
/* ------------------------ */

exports.get_one = asyncHandler(async (req, res, next) => {
  let user = await MongoUser.findOne({ user: req.user.sub });

  if (!user) {
    user = await MongoUser.create({ user: req.params.id, podcasts: [] });
  }

  res.status(200).json({ success: true, data: user });
});

/* ------------------------ */
/*         PUT              */
/* ------------------------ */
/*  @route    /user/:id
/*  @desc     Edit details for one user         
/*  @access   Admin
/* ------------------------ */

exports.edit_one = asyncHandler(async (req, res, next) => {
  const userUpdated = await auth0Manager.updateUserMetadata(
    { id: req.params.id },
    { ...req.body }
  );

  if (!userUpdated) {
    throw createHttpError(404, `No user found with ${req.params.id}`);
  }
  res.status(200).json(userUpdated);
});

/* ------------------------ */
/*        DELETE            */
/* ------------------------ */
/*  @route    /user/:id    
/*  @desc     Delete user account and files                  
/*  @access   Admin
/* ------------------------ */

exports.delete_one = asyncHandler(async (req, res, next) => {
  // Get user from Mongo
  const user = await MongoUser.findById(req.user._id);
  // Delete all files from user
  await MongoResource.deleteMany({ _id: { $in: user.files.owner } });
  // Delete user from mongo
  user.remove();
  // Logout user
  res.status(204).json({ message: `User ${req.params.id} deleted. ` });
  // Send email to confirm
});
