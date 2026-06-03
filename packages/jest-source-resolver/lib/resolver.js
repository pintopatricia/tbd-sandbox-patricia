const SOURCE_PACKAGES = ["@ppb/betslip-core"];

module.exports = (request, options) =>
  options.defaultResolver(request, {
    ...options,
    packageFilter: (pkg) => ({
      ...pkg,
      main: SOURCE_PACKAGES.find((packageName) => pkg.name && pkg.name.includes(packageName)) ? pkg.source : pkg.main,
    }),
  });
