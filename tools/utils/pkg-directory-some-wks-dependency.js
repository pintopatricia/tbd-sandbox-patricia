const fs = require("fs");
const path = require("path");

const PREFIX = "[node package has depedency]";
const EXIT_STATUS = { ERROR: 1, TRUE: 0, FALSE: 3 };

(function exec() {
  const targetDir = path.join(`${process.cwd()}`, `${process.argv[2]}`);
  const [, , , ...dependenciesToAssert] = process.argv;
  if (!fs.existsSync(targetDir)) {
    console.error(`${PREFIX} directory ${targetDir} does not exist`);
    process.exit(EXIT_STATUS.ERROR);
  } else {
    try {
      const targetPkgJson = require(path.join(targetDir, "package.json"));
      const hasSomeDep = dependenciesToAssert.some((dep) => {
        if (targetPkgJson.dependencies && targetPkgJson.dependencies[dep]?.length > 0) {
          return targetPkgJson.dependencies[dep] === "workspace:*";
        } else {
          console.warn(`${PREFIX} dependency "${dep}" not found in "${targetPkgJson.name}"`);
          return false;
        }
      });

      process.exit(hasSomeDep ? EXIT_STATUS.TRUE : EXIT_STATUS.FALSE);
    } catch (e) {
      console.error(`${PREFIX} ${e.message}`);
      process.exit(EXIT_STATUS.ERROR);
    }
  }
})();
