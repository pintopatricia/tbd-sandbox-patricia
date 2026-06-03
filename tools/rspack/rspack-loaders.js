const { generateCssModuleName, generateCssModulesMapping } = require("../generate-css-modules");

module.exports = {
  postcssLoader: {
    loader: `${__dirname}/../../node_modules/postcss-loader`,
    options: {
      postcssOptions: ({ resourcePath }) => ({
        plugins: [
          {
            postcssPlugin: "css-modules-mapping-plugin",
            Once: () => generateCssModulesMapping(resourcePath),
          },
          [
            "postcss-d-ts",
            {
              template: `${__dirname}/../../tools/rspack/css-template.d.ts`,
            },
          ],
        ],
      }),
    },
  },
  svgrLoader: {
    loader: `${__dirname}/../../node_modules/@svgr/webpack`,
    options: {
      svgoConfig: {
        plugins: {
          removeViewBox: false,
        },
      },
    },
  },
};
