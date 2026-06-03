const readMockTemplate = require("../read-mock-template");

const PATH_REGEX = ".*graphql.*";

const getScaResponse = (mockObject) => {
  const templateResponse = readMockTemplate(`${__dirname}/data/sca-mock.hbs`, mockObject);

  return {
    pathRegex: `${PATH_REGEX}`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
  };
};

module.exports = {
  getScaResponse,
};
