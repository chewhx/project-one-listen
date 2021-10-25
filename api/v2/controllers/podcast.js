const asyncHandler = require("../middlewares/asyncHandler");
const MongoPodcast = require("../models/Podcast");
const MongoUser = require("../models/User");

/* ------------------------ */
/*         PUT              */
/* ------------------------ */
/*  @route    /podcast
/*  @desc     Edit podcast feed for one user         
/* ------------------------ */

exports.put_podcast_for_user = asyncHandler(async (req, res, next) => {
  const podcastsUpdate = await MongoUser.findOneAndUpdate(
    {
      user: req.user.sub,
    },
    { $push: { podcasts: { ...req.body } } },
    {
      new: true,
    }
  );
  res.status(200).json({ success: true, data: podcastsUpdate });
});

/* ------------------------ */
/*         DELETE           */
/* ------------------------ */
/*  @route    /podcast
/*  @desc     Delete podcast item for one user         
/* ------------------------ */

exports.delete_podcast_for_user = asyncHandler(async (req, res, next) => {
  const { podcasts } = await MongoUser.findOne({ user: req.user.sub });

  const filteredPodcasts = podcasts.filter(
    ({ feed }) => feed !== req.body.feed
  );

  const podcastsUpdate = await MongoUser.findOneAndUpdate(
    {
      user: req.user.sub,
    },
    { podcasts: filteredPodcasts },
    {
      new: true,
    }
  );
  res.status(200).json({ success: true, data: podcastsUpdate });
});
