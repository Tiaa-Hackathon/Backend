const removeMarkdown = require("markdown-to-txt");

const isValidPostBody = (markdown) => {
  return removeMarkdown.markdownToTxt(markdown).length;
};

module.exports = isValidPostBody;
