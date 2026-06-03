const fs = require("fs");
const path = require("path");

const extractJsonData = (filePathString) => {
  const filePath = path.resolve(process.cwd(), filePathString);
  try {
    // Read and parse the JSON file
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const jsonData = JSON.parse(fileContent);

    return jsonData;
  } catch (error) {
    return null;
  }
};

module.exports = {
  extractJsonData,
};