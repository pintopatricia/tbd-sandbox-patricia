const path = require("path");
const glob = require("glob");

const { svgrLoader } = require("./rspack-loaders");

const translations = glob.sync(`${process.cwd()}/translations-*.js`, { dotRelative: true }).reduce((acc, curr) => {
  return { ...acc, [path.basename(curr, ".js")]: curr };
}, {});

module.exports = {
  module: {
    rules: [
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: "asset/resource",
      },
      {
        test: /\.(jpe?g|png)$/i,
        type: "asset/resource",
      },
      {
        test: /\.svg$/,
        oneOf: [
          { resourceQuery: /url/, type: "asset/resource" },
          {
            use: [svgrLoader],
          },
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks(chunk) {
        // exclude entry points `translations-chunk`
        const exclusions = Object.keys(translations);

        return !exclusions.includes(chunk.name);
      },
      cacheGroups: {
        defaultVendors: {
          test: /(node_modules)\/(?!.*(react-dom|@ppb|@apollo))/,
          name(_, chunks) {
            const allChunksNames = chunks.map((item) => item.name).join("~");
            return `vendors~${allChunksNames}`;
          },
        },
        "vendors-react-dom": {
          test: /(node_modules)\/(react-dom)/,
          name(_, chunks) {
            const allChunksNames = chunks.map((item) => item.name).join("~");
            return `vendors-react-dom~${allChunksNames}`;
          },
        },
        "vendors-colors-tokens": {
          test: /(node_modules)\/(@ppb\/the-wall-design-tokens)/,
          name(_, chunks) {
            const allChunksNames = chunks.map((item) => item.name).join("~");
            return `vendors-colors-tokens~${allChunksNames}`;
          },
        },
        "vendors-apollo": {
          test: /(node_modules)\/(@apollo)/,
          name(_, chunks) {
            // Edge case where we have too many chunks
            if (chunks.length > 1) {
              const chunkNames = chunks.map((item) => item.name);
              const hash = require("crypto")
                .createHash("md5")
                .update(chunkNames.join("~"))
                .digest("hex")
                .substring(0, 8);
              return `vendors-apollo~${hash}`;
            }

            const allChunksNames = chunks.map((item) => item.name).join("~");
            return `vendors-apollo~${allChunksNames}`;
          },
        },
        "gaming-prize-machine-icons": {
          test: /tbd-components-gaming[\\/].*PrizeMachine[\\/]Icons/,
          name(module) {
            const match = module.resource?.match(/Icons[\\/]([^\\/]+)[\\/]/);
            return match?.[1] ?? "GamingPrizeMachineIcon";
          },
          chunks: "async",
          enforce: true,
        },
        "gaming-prize-machine-superspins-icons": {
          test: /tbd-components-gaming[\\/].*SuperSpins[\\/]Icons/,
          name(module) {
            const match = module.resource?.match(/Icons[\\/]([^\\/]+)[\\/]/);
            return match?.[1] ?? "SuperSpinsIcon";
          },
          chunks: "async",
          enforce: true,
        },
      },
    },
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".graphql", ".css", ".mjs"],
    mainFields: ["browser", "source", "module", "main"],
  },
};
