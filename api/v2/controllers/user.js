const MongoUser = require("../models/User");
const createHttpError = require("http-errors");

// ---------------------------------------------------------------------------------------
//  @desc     Get all users
//  @route    GET  /user
//  @access   Admin

exports.get_all = async (req, res, next) => {
  try {
    const users = await MongoUser.find({});
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------------------
//  @desc     Get details for one user
//  @route    GET  /user/:id
//  @access   Private

exports.get_one = async (req, res, next) => {
  try {
    if (req.user._id != req.params.id) {
      throw createHttpError("Not authorised");
    }

    const user = await MongoUser.findById(req.params.id).populate({
      path: "files.owner",
      options: { sort: "-createdAt" },
    });

    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

//  ---------------------------------------------------------------------------------------
//  @desc     Edit details for one user
//  @route    PUT /user/:id
//  @access   Admin

exports.edit_one = async (req, res, next) => {
  try {
    // Update user in Mongo
    const user = await MongoUser.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      throw createHttpError(404, `No user found with ${req.params.id}`);
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

//  ---------------------------------------------------------------------------------------
//  @desc     Delete user account and files
//  @route    DELETE  /user/:id
//  @access   Private

exports.delete_one = async (req, res, next) => {
  try {
    // Get user from Mongo
    const user = await MongoUser.findById(req.user._id);
    // Delete all files from user
    await MongoResource.deleteMany({ _id: { $in: user.files.owner } });
    // Delete user from mongo
    user.remove();
    // Logout user
    res.status(204).json({ message: `User ${req.params.id} deleted. ` });
    // Send email to confirm
  } catch (error) {
    next(err);
  }
};
