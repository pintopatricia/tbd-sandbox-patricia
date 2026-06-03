const path = require("path");
const { resolveConfig, transform: svgTransform } = require("@svgr/core");
const expoTransformer = require("@expo/metro-config/babel-transformer");

// Routes non-SVG files through Expo's babel-transformer instead of the stock
// RN one that react-native-svg-transformer hardcodes. The Expo transformer
// passes `metroSourceType` to babel-preset-expo via `caller`, which is what
// keeps `@babel/plugin-transform-runtime` from extracting helpers as
// top-level `require()` calls in `js/script` polyfills (e.g.
// `expo/virtual/streams.js`). Without that signal Hermes crashes at startup
// with `Property 'require' doesn't exist`.

const SVGR_DEFAULTS = {
  native: true,
  plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
  svgoConfig: {
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            inlineStyles: { onlyMatchedOnce: false },
            removeViewBox: false,
            removeUnknownsAndDefaults: false,
            convertColors: false,
          },
        },
      },
    ],
  },
};

module.exports.transform = async ({ src, filename, options }) => {
  if (filename.endsWith(".svg")) {
    const cfg = (await resolveConfig(path.dirname(filename))) ?? {};
    const svgrConfig = { ...SVGR_DEFAULTS, ...cfg };

    return expoTransformer.transform({
      src: await svgTransform(src, svgrConfig),
      filename,
      options,
    });
  }

  return expoTransformer.transform({ src, filename, options });
};
