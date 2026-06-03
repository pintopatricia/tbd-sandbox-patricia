const { readFile } = require("fs").promises;
const { cwd } = require("node:process");
const perfTestAndReport = require("../services/perf-reporting-service");

(async () => {
  const { requests } = JSON.parse(await readFile(`${cwd()}/performance-report/journeys/latest.json`));

  await perfTestAndReport("latest", requests);
})();
