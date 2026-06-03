const { merge } = require("webpack-merge");
const devCommon = require("../../../../tools/rspack/rspack.dev.js");

module.exports = merge(devCommon, {
  devServer: {
    client: {
      webSocketURL: "auto://localhost.betfair.com/ws",
    },
  },
});
