const { cwd } = require("node:process");
const { writeFile, mkdir } = require("fs").promises;

const PATH = `${cwd()}/reports/performance`;

async function writeNativePerfReport(result) {
  // Make sure path is created
  await mkdir(PATH, { recursive: true });

  // Using keys as CVS headers
  const headers = `${Object.keys(result).join(",")}`;

  // Original values are cumulative
  const values = `${Object.values(result)
    .map((val, i, list) => val - (list[i - 1] ?? 0))
    .join(",")}`;

  const content = `${headers}\n${values}`;

  // Create a CSV file
  await writeFile(`${PATH}/renders.csv`, content);
}

module.exports = {
  writeNativePerfReport,
};
