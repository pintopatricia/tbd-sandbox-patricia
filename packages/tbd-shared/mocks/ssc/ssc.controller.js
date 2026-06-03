// eslint-disable-next-line @typescript-eslint/no-require-imports
const readMockTemplate = require("../read-mock-template");

const DEFAULT_SSC_HEADER_CSS_DATA = {
  pathRegex: `.*ssc/fake.css`,
  response: `.header{
    height: 85px;
    background: var(--header-background-primary-colour);
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }`,
};

// Classic Header still uses V1.0 :')
const getSSCv1Content = (mockObject = {}) => {
  const templateResponse = readMockTemplate(`${__dirname}/data/ssc-header-mock.hbs`, mockObject);

  return {
    pathRegex: `.*api/v1.0/content`,
    response: templateResponse,
    method: "POST",
    statusCode: 200,
  };
};

const getSSCHeaderCSS = (responseData = DEFAULT_SSC_HEADER_CSS_DATA) => ({
  pathRegex: responseData.pathRegex,
  response: responseData.response,
  method: "GET",
  headers: { "Content-Type": "text/css; charset=utf-8" },
  statusCode: 200,
});

module.exports = {
  getSSCv1Content,
  getSSCHeaderCSS,
};
