/* eslint-env node */
const path = require("path");

module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set("~", path.resolve(__dirname, "../view3d/src/"));
  }
};
