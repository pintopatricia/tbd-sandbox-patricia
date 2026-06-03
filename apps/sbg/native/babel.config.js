module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-boost/plugin",
      "babel-plugin-react-compiler",
      ["module:react-native-dotenv", { safe: true }],
      "react-native-worklets/plugin",
    ],
    env: {
      development: {
        plugins: [
          [
            "@ppb/gql-doc-loader/dist/babel",
            {
              config: [
                {
                  useDocumentId: false,
                  configFilePath: "../../../pql-manifest-sca.config.js",
                },
                {
                  useDocumentId: false,
                  configFilePath: "../../../pql-manifest-blh.config.js",
                },
                {
                  useDocumentId: false,
                  configFilePath: "../../../pql-manifest-catalogue.config.js",
                },
              ],
            },
          ],
        ],
      },
      production: {
        plugins: [
          [
            "@ppb/gql-doc-loader/dist/babel",
            {
              config: [
                {
                  useDocumentId: false,
                  configFilePath: "../../../pql-manifest-sca.config.js",
                },
                {
                  useDocumentId: false,
                  configFilePath: "../../../pql-manifest-blh.config.js",
                },
                {
                  useDocumentId: true,
                  configFilePath: "../../../pql-manifest-catalogue.config.js",
                },
              ],
            },
          ],
          ["transform-remove-console", { exclude: ["error", "warn"] }],
        ],
      },
    },
  };
};
