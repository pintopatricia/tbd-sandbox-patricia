const path = require("path");
const glob = require("glob");
const { merge } = require("webpack-merge");
const rspack = require("@rspack/core");
const ReactRefreshPlugin = require("@rspack/plugin-react-refresh");
const { WebpackManifestPlugin: RspackManifestPlugin } = require("rspack-manifest-plugin");
const common = require("./rspack.common.js");
const { postcssLoader } = require("./rspack-loaders");

const rootDir = path.resolve("../../../");

const translations = glob.sync(path.resolve("./translations-*.js"), { dotRelative: true }).reduce((acc, curr) => {
  return { ...acc, [path.basename(curr, ".js")]: curr };
}, {});

const browserslist = require("browserslist").loadConfig({
  path: "./",
});

const devServerWebsocketUrl = process.env.BUNDLER_WEBSOCKET_URL || "auto://localhost.betfair.com/ws";

const excludedModules = [
  {
    and: [
      /node_modules/,
      {
        not: [
          /node_modules[/\\]@ppb[/\\]the-wall-.*/,
          /node_modules[/\\]@ppb[/\\]tbd-.*/,
          /node_modules[/\\]@ppb[/\\]formatters/,
          /node_modules[/\\]@ppb[/\\]urn-codecs/,
          /node_modules[/\\]@ppb[/\\]betslip-core/,
          /node_modules[/\\]@ppb[/\\]etx-edit-orchestrator/,
          /node_modules[/\\]@ppb[/\\]chart-tools/,
        ],
      },
    ],
  },
];

const excludedCSSModules = [
  {
    and: [
      /global/,
      /node_modules/,
      {
        not: [/node_modules[/\\]@ppb[/\\](the-wall-|tbd).*/],
      },
    ],
  },
];

module.exports = merge(common, {
  name: "client",
  mode: "development",
  devtool: false,
  entry: {
    app: path.resolve("./client.tsx"),
    ...translations,
  },
  context: rootDir,
  output: {
    path: path.resolve("./dist"),
    pathinfo: false,
    publicPath: "",
    assetModuleFilename: "[name][ext]",
  },
  ignoreWarnings: [/Conflicting order/],
  devServer: {
    static: ["dist"],
    hot: true,
    host: "0.0.0.0",
    port: 9001,
    liveReload: false,
    allowedHosts: "all",
    client: {
      progress: true,
      overlay: false,
      webSocketURL: devServerWebsocketUrl,
    },
    devMiddleware: {
      publicPath: "",
    },
  },
  module: {
    rules: [
      {
        test: /clients\/sca\/.+\.graphql$/,
        use: [
          {
            loader: `${rootDir}/node_modules/@ppb/gql-doc-loader/dist/webpack`,
            options: {
              configFilePath: `${rootDir}/pql-manifest-sca.config.js`,
              useDocumentId: false,
            },
          },
        ],
      },
      {
        test: /clients\/blh\/.+\.graphql$/,
        use: [
          {
            loader: `${rootDir}/node_modules/@ppb/gql-doc-loader/dist/webpack`,
            options: {
              configFilePath: `${rootDir}/pql-manifest-blh.config.js`,
              useDocumentId: false,
            },
          },
        ],
      },
      {
        test: /clients\/catalogue\/.+\.graphql$/,
        use: [
          {
            loader: `${rootDir}/node_modules/@ppb/gql-doc-loader/dist/webpack`,
            options: {
              configFilePath: `${rootDir}/pql-manifest-catalogue.config.js`,
              useDocumentId: false,
            },
          },
        ],
      },
      {
        test: /\.(j|t)s$/,
        exclude: excludedModules,
        loader: "builtin:swc-loader",
        options: {
          sourceMap: true,
          jsc: {
            parser: {
              syntax: "typescript",
            },
            transform: {
              react: {
                runtime: "automatic",
                development: true,
                refresh: true,
              },
            },
          },
          env: {
            targets: browserslist,
            mode: "usage",
            coreJs: 3.37,
            modules: false,
          },
        },
      },
      {
        test: /\.(j|t)sx$/,
        loader: "builtin:swc-loader",
        exclude: excludedModules,
        options: {
          sourceMap: true,
          jsc: {
            parser: {
              syntax: "typescript",
              tsx: true,
            },
            transform: {
              react: {
                runtime: "automatic",
                development: true,
                refresh: true,
              },
            },
          },
          env: {
            targets: browserslist,
            mode: "usage",
            coreJs: 3.37,
            modules: false,
          },
        },
      },
      {
        test: /\.m?js$/,
        enforce: "pre",
        exclude: excludedModules,
        loader: "source-map-loader",
      },
      {
        test: /\.css$/,
        exclude: excludedCSSModules,
        type: "css/module",
        parser: {
          namedExports: false,
        },
        generator: {
          localIdentName: "[hash]-[local]",
        },
      },
      {
        // run postcss for css types and modules.json generation for TBD files only
        test: /\.css$/,
        exclude: [/global/, /node_modules/],
        use: [postcssLoader],
      },
    ],
  },
  optimization: {
    runtimeChunk: "single",
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
          from: path.resolve("./assets/*"),
          to: "[name][ext]",
        },
        {
          from: path.resolve("./assets/**/*.png"),
          to: "[name][ext]",
        },
      ],
    }),
  ],
  experiments: {
    css: true,
  },
});
