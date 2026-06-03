const readMockTemplate = require("../read-mock-template");

const PATH = ".*api/tbd/app-context.*";

const getAppContext = (mockObject) => {
  const template = readMockTemplate(`${__dirname}/data/app-context-mock.hbs`, mockObject);

  return {
    pathRegex: `${PATH}`,
    response: template,
    method: "GET",
    statusCode: 200,
    delay: 0,
  };
};

const getHTTPError = () => ({
  pathRegex: `${PATH}`,
  response: "",
  method: ".*",
  statusCode: 500,
  delay: 0,
});

const getTerritoryBlocked = () => ({
  pathRegex: `${PATH}`,
  response: "",
  method: ".*",
  statusCode: 403,
  delay: 0,
});

module.exports = {
  getAppContext,
  getHTTPError,
  getTerritoryBlocked,
};
