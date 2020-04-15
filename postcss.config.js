const tailwindcss = require("tailwindcss");
const purgecss = require("@fullhuman/postcss-purgecss");
const cssnano = require("cssnano");
const autoprefixer = require("autoprefixer");

const plugins = [autoprefixer, tailwindcss, cssnano({ preset: "default" })];

if (process.env.NODE_ENV === "prod") {
  plugins.push(
    purgecss({
      content: ["./**/*.html"],
      whitelistPatterns: [/markdown$/],
      whitelistPatternsChildren: [/markdown$/],
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
    })
  );
}

module.exports = {
  plugins,
};
