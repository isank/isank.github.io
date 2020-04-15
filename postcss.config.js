const tailwindcss = require("tailwindcss");
const purgecss = require("@fullhuman/postcss-purgecss");
const cssnano = require("cssnano");
const autoprefixer = require("autoprefixer");

const plugins = [autoprefixer, tailwindcss, cssnano({ preset: "default" })];

if (process.env.NODE_ENV === "production") {
  plugins.push(
    purgecss({
      content: ["./**/*.html"],
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
    })
  );
}

module.exports = {
  plugins,
};
