const fs = require("fs");
const path = require("path");

const PREFIX = "[node workspace get package consumers]";
const EXIT_STATUS = { ERROR: 1, SUCCESS: 0 };

(function exec() {
  const targetDir = path.join(`${process.cwd()}`, `${process.argv[2]}`);
  if (!fs.existsSync(targetDir)) {
    console.error(`${PREFIX} directory ${targetDir} does not exist`);
    process.exit(EXIT_STATUS.ERROR);
  } else {
    try {
      const targetPkgJson = require(path.join(targetDir, "package.json"));
      const consumers = targetPkgJson.workspaces?.packages.filter((item) => item.indexOf("packages/") < 0);
      console.log(consumers.join("\n"));
    } catch (e) {
      console.error(`${PREFIX} ${e.message}`);
      process.exit(EXIT_STATUS.ERROR);
    }
  }
})();
