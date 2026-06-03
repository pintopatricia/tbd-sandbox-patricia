const path = require("path");
const glob = require("glob");

const { merge } = require("webpack-merge");
const rspack = require("@rspack/core");
const { WebpackManifestPlugin: RspackManifestPlugin } = require("rspack-manifest-plugin");
const { RsdoctorRspackPlugin } = require("@rsdoctor/rspack-plugin");
const common = require("./rspack.common.js");

const rootDir = path.resolve("../../../");

const translations = glob.sync(path.resolve("./translations-*.js"), { dotRelative: true }).reduce((acc, curr) => {
  return { ...acc, [path.basename(curr, ".js")]: curr };
}, {});

const browserslist = require("browserslist").loadConfig({
  path: "./",
});

const excludedModules = [
  {
    and: [
      /node_modules/,
      {
        not: [
          /node_modules[/\\]@ppb[/\\]the-wall-.*/,
          /node_modules[/\\]@ppb[/\\]tbd.*/,
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
  mode: "production",
  devtool: false,
  entry: {
    app: ["./tools/rspack/retry-chunk-patch.js", path.resolve("./client.tsx")],
    ...translations,
  },
  stats: {
    preset: "verbose",
    logging: false,
    loggingTrace: false,
  },
  context: rootDir,
  output: {
    path: path.resolve("./dist"),
    filename: "[name]-[contenthash].js",
    publicPath: "",
    assetModuleFilename: "[name][ext]",
  },
  ignoreWarnings: [/Conflicting order/],
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
              useDocumentId: true,
            },
          },
        ],
      },
      {
        test: /\.(j|t)s$/,
        exclude: excludedModules,
        loader: "builtin:swc-loader",
        options: {
          jsc: {
            parser: {
              syntax: "typescript",
            },
            transform: {
              react: {
                runtime: "automatic",
                development: false,
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
          jsc: {
            parser: {
              syntax: "typescript",
              tsx: true,
            },
            transform: {
              react: {
                runtime: "automatic",
                development: false,
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
    ],
  },
  optimization: {
    runtimeChunk: "single",
    concatenateModules: true,
    minimize: true,
    minimizer: [
      new rspack.SwcJsMinimizerRspackPlugin({
        compress: {
          unsafe_arrows: true,
        },
        format: {
          comments: false,
        },
      }),
      new rspack.LightningCssMinimizerRspackPlugin({
        minimizerOptions: {
          exclude: /node_modules(?![/\\](@ppb[/\\](the-wall-web)))/,
          targets: browserslist,
        },
      }),
    ],
  },
  plugins: [
    new rspack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
    process.env.RSDOCTOR &&
      new RsdoctorRspackPlugin({
        supports: {
          generateTileGraph: true,
        },
      }),
    new rspack.HtmlRspackPlugin({
      template: path.resolve("./index.html"),
      publicPath: "",
    }),
    new RspackManifestPlugin({
      writeToFileEmit: true,
    }),
    new rspack.CopyRspackPlugin({
      patterns: [
        {
          from: path.resolve("./assets/*"),
          to: "[name][ext]",
          globOptions: {
            ignore: [path.resolve("./assets/splunk-otel-web.js")], // Will be added through tbd-chef
          },
        },
        {
          from: path.resolve("./assets/**/*.png"),
          to: "[name][ext]",
        },
        {
          from: "./packages/tbd-store/clients/catalogue/extracted_queries_v*.json",
          to: "[name][ext]",
        },
      ],
    }),
    new rspack.SourceMapDevToolPlugin({
      filename: "sourcemaps/[file].map[query]",
      append: "\n//# sourceMappingURL=[url]",
    }),
  ],
  experiments: {
    css: true,
  },
});
