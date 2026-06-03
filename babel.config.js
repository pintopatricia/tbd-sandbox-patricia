module.exports = function config(api) {
  api.cache(true);
  const presets = [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: 3,
        // https://developers.google.com/web/fundamentals/performance/optimizing-javascript/tree-shaking#keeping_babel_from_transpiling_es6_modules_to_commonjs_modules
        modules: false,
      },
    ],
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript",
  ];
  const plugins = [];

  return {
    presets,
    plugins,
  };
};
