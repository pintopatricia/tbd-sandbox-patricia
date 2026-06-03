// eslint-disable-next-line @typescript-eslint/no-require-imports
const readMockTemplate = require("../read-mock-template");

const PATH_REGEX = ".*graphql.*";

const getBlhResponse = (mockObject) => {
  const templateResponse = readMockTemplate(`${__dirname}/data/blh-mock.hbs`, mockObject);

  return {
    pathRegex: `${PATH_REGEX}`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
  };
};

module.exports = {
  getBlhResponse,
};
