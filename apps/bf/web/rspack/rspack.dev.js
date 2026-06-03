const { mergeWithCustomize } = require("webpack-merge");
const devCommon = require("../../../../tools/rspack/rspack.dev.js");
const path = require("path");
const glob = require("glob");
const rspack = require("@rspack/core");
const ReactRefreshPlugin = require("@rspack/plugin-react-refresh");
const { WebpackManifestPlugin: RspackManifestPlugin } = require("rspack-manifest-plugin");

const translations = glob
  .sync(path.resolve("./config/bf/translations/translations-*.js"), { dotRelative: true })
  .reduce((acc, curr) => {
    return { ...acc, [path.basename(curr, ".js")]: curr };
  }, {});

const customMerge = mergeWithCustomize({
  customizeArray: (_, b, key) => {
    if (key === "plugins") {
      return [...b];
    }
  },
});

module.exports = customMerge(devCommon, {
  entry: {
    ...translations,
  },
  plugins: [
    new rspack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development"),
      },
    }),
    new ReactRefreshPlugin(),
    new rspack.HtmlRspackPlugin({
      filename: "index.html",
      template: path.resolve("./index.html"),
      publicPath: "",
    }),
    new rspack.ProgressPlugin((percentage, message) => {
      console.info(`[rspack] ${message} ${Math.floor(percentage * 100)}%`);
    }),
    new rspack.EvalSourceMapDevToolPlugin({
      module: true,
    }),
    new RspackManifestPlugin({
      writeToFileEmit: true,
    }),
    new rspack.CopyRspackPlugin({
      patterns: [
        {
          from: path.resolve("./config/bf/assets/*"),
          to: "[name][ext]",
        },
        {
          from: path.resolve("./config/bf/assets/**/*.png"),
          to: "[name][ext]",
        },
      ],
    }),
  ],
});
