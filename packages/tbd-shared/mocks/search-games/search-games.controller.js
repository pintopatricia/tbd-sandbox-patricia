const readMockTemplate = require("../read-mock-template");

const PATH_REGEX = ".*search-games.*";

const getSearchGamesResponse = (mockObject) => {
  const templateResponse = readMockTemplate(`${__dirname}/data/search-games-mock.hbs`, mockObject);

  return {
    pathRegex: `${PATH_REGEX}`,
    response: templateResponse,
    method: "GET",
    statusCode: 200,
    delay: 0,
  };
};

module.exports = {
  getSearchGamesResponse,
};
