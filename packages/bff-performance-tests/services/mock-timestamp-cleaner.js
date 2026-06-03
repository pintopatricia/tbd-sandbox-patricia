// eslint-disable-next-line no-template-curly-in-string
const JSON_UNIT_ANY_STRING = "${json-unit.any-string}";

// eslint-disable-next-line no-template-curly-in-string
const JSON_UNIT_ANY_NUMBER = "${json-unit.any-number}";

// eslint-disable-next-line no-template-curly-in-string
const JSON_UNIT_REGEX = "${json-unit.regex}";

// https://stackoverflow.com/a/35478115
const STRING_TO_ESCAPED_REGEX = /[|\\{}()[\]^$+*?."]/g;

// e.g.: 2022-08-23T07:00:00\+0000
const CSL_DATE_REGEX = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}..\d{4}/g;

const isCSLRequest = (httpRequest) => httpRequest.body?.json?.queries;

function cloneAndRemoveTimestamps(httpRequest) {
  const cleanHttpRequest = JSON.parse(JSON.stringify(httpRequest));
  // FACET
  if (cleanHttpRequest.body?.json?.params?.filter?.marketStartingBefore) {
    // eslint-disable-next-line no-param-reassign
    cleanHttpRequest.body.json.params.filter.marketStartingBefore = JSON_UNIT_ANY_STRING;
  }

  // FACET
  if (cleanHttpRequest.body?.json?.params?.filter?.marketStartingAfter) {
    // eslint-disable-next-line no-param-reassign
    cleanHttpRequest.body.json.params.filter.marketStartingAfter = JSON_UNIT_ANY_STRING;
  }

  // LPS
  if (cleanHttpRequest.body?.json?.timestamp) {
    // eslint-disable-next-line no-param-reassign
    cleanHttpRequest.body.json.timestamp = JSON_UNIT_ANY_NUMBER;
  }

  // SER
  if (cleanHttpRequest.queryStringParameters?.afterDate) {
    // eslint-disable-next-line no-param-reassign
    cleanHttpRequest.queryStringParameters.afterDate = [".*"];
  }

  // FBO
  if (cleanHttpRequest.queryStringParameters?.latestStartTimeBefore) {
    // eslint-disable-next-line no-param-reassign
    cleanHttpRequest.queryStringParameters.latestStartTimeBefore = [".*"];
  }

  // FBR
  if (cleanHttpRequest.queryStringParameters?.settledAfter) {
    // eslint-disable-next-line no-param-reassign
    cleanHttpRequest.queryStringParameters.settledAfter = [".*"];
  }

  if (isCSLRequest(cleanHttpRequest)) {
    cleanHttpRequest.body.json.queries = httpRequest.body.json.queries.map(({ urn, filter }) => ({
      urn,
      filter: `${JSON_UNIT_REGEX}${filter
        .replace(STRING_TO_ESCAPED_REGEX, "\\$&")
        .replace(/\n/g, "\\n")
        .replace(CSL_DATE_REGEX, ".*")}`,
    }));
  }
  return cleanHttpRequest;
}

module.exports = {
  cloneAndRemoveTimestamps,
};
