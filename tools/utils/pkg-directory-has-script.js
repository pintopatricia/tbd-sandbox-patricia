const fs = require("fs");
const path = require("path");

const PREFIX = "[node package has script]";
const EXIT_STATUS = { ERROR: 1, TRUE: 0, FALSE: 3 };

(function exec() {
  const targetDir = path.join(`${process.cwd()}`, `${process.argv[2]}`);
  const scriptToAssert = process.argv[3];
  if (!fs.existsSync(targetDir)) {
    console.error(`${PREFIX} directory ${targetDir} does not exist`);
    process.exit(EXIT_STATUS.ERROR);
  } else {
    try {
      const targetPkgJson = require(path.join(targetDir, "package.json"));
      if (targetPkgJson.scripts[scriptToAssert]?.length > 0) {
        process.exit(EXIT_STATUS.TRUE);
      } else {
        console.warn(`${PREFIX} script "${scriptToAssert}" not found in "${targetPkgJson.name}"`);
        process.exit(EXIT_STATUS.FALSE);
      }
    } catch (e) {
      console.error(`${PREFIX} ${e.message}`);
      process.exit(EXIT_STATUS.ERROR);
    }
  }
})();
