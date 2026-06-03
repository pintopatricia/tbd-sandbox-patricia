const { readdirSync, statSync, readFileSync } = require("fs");
const handlebars = require("handlebars");

const { registerPartial, compile } = handlebars;

// Recursive function to get all the files in sub-directories
function getAllFiles(dirPath) {
  const files = readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = `${dirPath}/${file}`;

    if (statSync(filePath).isDirectory()) {
      getAllFiles(filePath);
    } else {
      const matches = /^([^.]+).(partial|partial-innerjson).hbs$/.exec(file);
      if (!matches) {
        return;
      }

      const name = matches[1];
      const template = readFileSync(filePath, "utf8");

      registerPartial(
        name,
        !file.includes("innerjson") ? template : template.replace(/["]/g, "\\$&").replace(/\n/g, ""),
      );
    }
  });
}

// Read and register Partials
const partialsDir = __dirname;
getAllFiles(partialsDir);

const readMockTemplate = (filePath, mockObject) => {
  const file = readFileSync(filePath, "utf8");
  const template = compile(file);
  const mockedTemplate = template(mockObject);

  try {
    if (!filePath.includes(".html.")) {
      JSON.parse(mockedTemplate);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Invalid JSON in handlebars template!", error);
  }

  return mockedTemplate;
};

module.exports = { readMockTemplate };
