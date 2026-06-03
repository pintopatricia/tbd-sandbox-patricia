const fs = require("fs");
const path = require("path");

const PREFIX = "[node package get name]";
const EXIT_STATUS = { ERROR: 1, SUCCESS: 0 };

(function exec() {
  const targetDir = path.join(`${process.cwd()}`, `${process.argv[2]}`);
  if (!fs.existsSync(targetDir)) {
    console.error(`${PREFIX} directory ${targetDir} does not exist`);
    process.exit(EXIT_STATUS.ERROR);
  } else {
    try {
      const targetPkgJson = require(path.join(targetDir, "package.json"));
      console.log(targetPkgJson.name);
      process.exit(EXIT_STATUS.SUCCESS);
    } catch (e) {
      console.error(`${PREFIX} ${e.message}`);
      process.exit(EXIT_STATUS.ERROR);
    }
  }
})();
