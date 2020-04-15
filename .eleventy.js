module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "css/processed": "css" });
  eleventyConfig.addPassthroughCopy("assets");
};
