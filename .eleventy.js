module.exports = function (eleventyConfig) {
  let highlightJs = require("highlight.js");
  let markdownIt = require("markdown-it");
  let markdownOptions = {
    html: true,
    highlight: function (str, lang) {
      if (lang && highlightJs.getLanguage(lang)) {
        try {
          return (
            '<pre class="hljs"><code>' +
            highlightJs.highlight(lang, str, true).value +
            "</code></pre>"
          );
          // let c = highlightJs.highlight(lang, str).value;
          // console.log(c);
          // return c;
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
