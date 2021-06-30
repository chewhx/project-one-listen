const slug = require("../../utils/slug");

const updateResourceMeta = async (resource, res) => {
  // Assign response meta to file
  resource.metadata.title = res.title;
  resource.metadata.slug = slug(res.title);
  resource.metadata.excerpt = res.excerpt;
  resource.metadata.wordCount = res.word_count;

  // Count characters and add to response
  res.char_count = res.content.length;
  resource.metadata.charCount = res.char_count;

  // Set default file paths for resource
  resource.paths.parser = `${resource.owner}/parser`;
  resource.paths.audio = `${resource.owner}/audio`;

  // Save resource at mongo level
  await resource.save();
};

module.exports = updateResourceMeta;
