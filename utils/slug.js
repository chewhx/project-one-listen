const slugify = require("slugify");

const slugifyOptions = {
  replacement: "-",
  remove: /[0-9]/,
  lower: true,
  strict: true,
};

function createSlug(unsluggedText) {
  return slugify(unsluggedText.slice(0, 50), slugifyOptions);
}

module.exports = createSlug;
