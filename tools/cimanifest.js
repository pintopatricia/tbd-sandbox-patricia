/* eslint-disable */
const fs = require("fs");
const productNameFromArgs = process.argv[2];
console.log("The manifest is being generated for the product with name:", productNameFromArgs);

const specFile = productNameFromArgs + ".spec";
let folder;

switch (true) {
  case specFile.includes("tbdsbg"):
    folder = "sbg";
    break;
  case specFile.includes("tbdpp"):
    folder = "pp";
    break;
  case specFile.includes("tbdps"):
    folder = "ps";
    break;
  default:
    folder = "bf";
}

const specPath = `apps/${folder}/${specFile}`;
/*
specFile - From the mobile-site repo. tbd-mobile-site.spec, tbdsbg-mobile-site.spec, tbd-native.spec or tbdsbg-native.spec
specPath - the path for the given the mobile-site repo
manifest - Generated on CI
*/
const options = {
  specFile,
  specPath,
  manifest: "metadata.txt",
};

function retrieveRpmDependencies(specFile) {
  const requiresRegex = new RegExp(/Requires:(.*)/g);
  const requires = specFile.match(requiresRegex);
  const dependencies = requires
    .map(function (req) {
      return req.slice(9).split(",");
    })
    .reduce(function (acc, req) {
      return acc.concat(req);
    }, [])
    .reduce(function (acc, req) {
      const dependencyData = req
        .replace(">=", "|")
        .replace("<=", "|")
        .replace("=", "|")
        .split("|")
        .map(function (dep) {
          return dep.trim();
        });
      acc[dependencyData[0]] = dependencyData[1];
      return acc;
    }, {});
  return dependencies;
}
(function init() {
  console.log("Reading spec file...");
  const specFile = fs.readFileSync(options.specPath, "utf8");
  console.log("Gathering dependencies...");
  const dependencies = retrieveRpmDependencies(specFile);
  console.log(`Reading current manifest - ${options.manifest}...`);
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(options.manifest, "utf8"));
  } catch (e) {
    console.error(`${options.manifest} not found! Exiting...`);
    process.exit(1);
  }
  console.log(`Writing dependencies from spec file on manifest...`);
  manifest[productNameFromArgs].dependencies = dependencies;
  console.log(`Writing manifest - ${options.manifest}...`);
  fs.writeFileSync(options.manifest, JSON.stringify(manifest, undefined, 2));
})();
