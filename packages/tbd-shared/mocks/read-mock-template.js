/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const handlebars = require("handlebars");

// Recursive function to get all the files in sub-directories
const getAllFiles = function (dirPath) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = `${dirPath}/${file}`;

    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath);
    } else {
      const matches = /^([^.]+).(partial|partial-innerjson).hbs$/.exec(file);
      if (!matches) {
        return;
      }

      const name = matches[1];
      const template = fs.readFileSync(filePath, "utf8");

      handlebars.registerPartial(
        name,
        !file.includes("innerjson") ? template : template.replace(/["]/g, "\\$&").replace(/\n/g, ""),
      );
    }
  });
};

// Read and register Partials
const partialsDir = __dirname;
getAllFiles(partialsDir);

const readMockTemplate = (path, mockObject, compileOptions) => {
  const file = fs.readFileSync(path, "utf8");
  const template = handlebars.compile(file, compileOptions);
  const mockedTemplate = template(mockObject);

  try {
    if (!path.includes(".html.")) {
      JSON.parse(mockedTemplate);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Invalid JSON in handlebars template!", error, mockedTemplate);
  }

  return mockedTemplate;
};

module.exports = readMockTemplate;
