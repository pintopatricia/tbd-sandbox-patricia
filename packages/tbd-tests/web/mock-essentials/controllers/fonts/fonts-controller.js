const { readFileSync } = require("fs");

const fontTypes = {
  bold: "noto-sans-latin-700-normal",
  regular: "noto-sans-latin-400-normal",
};

const getFont = (font) => {
  const templateResponse = readFileSync(`${__dirname}/data/${font}.woff2`, "binary");

  return {
    pathRegex: `.*${font}.*`,
    response: templateResponse,
    method: "GET",
    statusCode: 200,
    headers: { "Content-Type": ["font/woff2"], "Accept-Ranges": ["bytes"], Server: ["motorx"] },
  };
};

const getMockFonts = () => Object.keys(fontTypes).map((key) => getFont(fontTypes[key]));

module.exports ={
  getMockFonts,
};
