// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");

const images = {
  png: { path: "/data/mock.png", contentType: "image/png" },
  svg: { path: "/data/usa.svg", contentType: "image/svg+xml" },
};

const getMockedImage = ({ path = ".*mockedImage.*", imageType = "png" }, statusCode = 200) => {
  const img = images[imageType];
  const templateResponse = fs.readFileSync(`${__dirname}${img.path}`, "binary");

  return {
    pathRegex: path,
    response: templateResponse,
    method: "GET",
    headers: [{ name: "Content-Type", values: [img.contentType] }],
    statusCode,
    delay: 0,
  };
};

const getMockedImagePuppeteer = ({ path = ".*mockedImage.*", imageType = "png" }) => {
  const img = images[imageType];

  return {
    pathRegex: path,
    response: `${__dirname}${img.path}`,
    method: "GET",
    headers: { "Content-Type": img.contentType },
    statusCode: 200,
  };
};

const getMockedNotFoundImageErrorPuppeteer = ({ path = ".*mockedImage.*" }) => ({
  pathRegex: path,
  response: ``,
  method: "GET",
  headers: {},
  statusCode: 404,
});

module.exports = {
  getMockedImage,
  getMockedImagePuppeteer,
  getMockedNotFoundImageErrorPuppeteer,
};
