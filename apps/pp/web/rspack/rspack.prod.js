const { merge } = require("webpack-merge");
const prodCommon = require("../../../../tools/rspack/rspack.prod.js");

module.exports = merge(prodCommon, {});
