// preprocess-css.js
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');

module.exports = (css, options) => {
  const result = postcss([
    autoprefixer(options.autoprefixer),
  ]).process(css);
  return result.css;
};
