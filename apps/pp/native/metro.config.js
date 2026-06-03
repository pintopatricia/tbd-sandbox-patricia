/**
 * Metro configuration for React Native
 * https://reactnative.dev/docs/metro
 *
 * @format
 */
const { getDefaultConfig } = require("expo/metro-config");
const { mergeConfig } = require("@react-native/metro-config");
const path = require("path");
const watchFolders = [
  path.resolve(__dirname + "/../../../packages"),
  path.resolve(__dirname + "/../../../node_modules"),
];

const defaultConfig = getDefaultConfig(__dirname);
const {
  resolver: { sourceExts, assetExts },
} = defaultConfig;

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  // disabling lazy loading because there's an issue with Dynamic imports in latest Metro version
  // see: https://github.com/facebook/metro/issues?q=is%3Aissue+Dynamic+import
  server: {
    rewriteRequestUrl: (url) => url.replace("&lazy=true", "&lazy=false"),
  },
  transformer: {
    babelTransformerPath: require.resolve("./metro-transformer"),
    assetPlugins: ["expo-asset/tools/hashAssetFiles"],
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    resolveRequest: (context, moduleImport, platform) => {
      // FIXME: Not needed after RN 0.79 or Metro 0.82
      if (moduleImport.match(/@ppb\/tbd-components-(.*)\/components/)) {
        return context.resolveRequest(
          {
            ...context,
            unstable_enablePackageExports: true,
          },
          moduleImport,
          platform,
        );
      }

      // Fall back to normal resolution for everything else.
      return context.resolveRequest(context, moduleImport, platform);
    },
    blacklistRE:
      /(.*the-wall-native\/node_modules\/.*|.*ios\/build\/.*|.*ios\/tbd_native\/Resources\/GamesOnDemandResources\/.*)$/,
    assetExts: assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...sourceExts, "svg", "mjs"],
    extraNodeModules: new Proxy(
      {},
      {
        get: (_, name) => path.join(process.cwd(), `../../../node_modules/${name}`),
      },
    ),
  },
  watchFolders,
};

/**
 * In React Native 0.72, maintainers changed the config loading setup for Metro in React Native CLI.
 * The base React Native Metro config is now explicitly required and extended here in the project's Metro
 * config file, giving full control over the final config.
 */
module.exports = mergeConfig(getDefaultConfig(__dirname), config);
