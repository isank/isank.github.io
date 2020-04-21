module.exports = function (eleventyConfig) {
  let highlightJs = require("highlight.js");
  let markdownIt = require("markdown-it");
  let markdownOptions = {
    html: true,
    highlight: function (str, lang) {
      if (lang && highlightJs.getLanguage(lang)) {
        try {
          return highlightJs.highlight(lang, str).value;
        } catch (__) {}
      }

      return ""; // use external default escaping
    },
  };

  eleventyConfig.setLibrary("md", markdownIt(markdownOptions));

  eleventyConfig.addPassthroughCopy({ "css/processed": "css" });
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("js");
};
