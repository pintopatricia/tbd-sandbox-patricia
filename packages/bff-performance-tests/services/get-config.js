const { cwd } = require("node:process");
const { cloneAndRemoveTimestamps } = require("./mock-timestamp-cleaner");
const { disableAndClearCaches, toUncachedRequest, fillCaches } = require("./mock-replay-request");
const { getMockServerClientInstance, onMockServerReset } = require("./mockserver-client-instance");

function getTitle(requests) {
  if (requests.length > 1) {
    return "Page Landing Requests";
  }

  const {
    request: { body },
  } = requests[0];

  if (!body) {
    return "Access Control";
  }

  const parsedBody = JSON.parse(body);

  if (!parsedBody.documentId && parsedBody.operations) {
    const opNames = parsedBody.operations.map(
      ({ operationName, variables }) => `${operationName} ${JSON.stringify(variables.urn)}`,
    );
    return `BFF ${opNames.join(", ")}`;
  }

  return `BFF ${parsedBody.documentId.replace(/#.*/, "")} ${JSON.stringify(parsedBody.variables.urn)}`;
}

module.exports = (url) => {
  const mockServerClient = getMockServerClientInstance(url);

  return {
    mockServerClient,
    autocannonBaseConfig: {
      bailout: 1,
      pipelining: 1, // browser sends 1 requests over same TCP socket
      excludeErrorStats: false,
      connections: 50,
      amount: 10000, // max of total requests
      timeout: 120,
    },
    reportPath: `${cwd()}/performance-report`,
    correlationIdHeaderName: "x-uuid",
    getCorrelationIdForRequest: (journeyName, requestIndex) =>
      `prf-test-${process.env.BUILD_NUMBER || new Date().toISOString()}-${journeyName}-req-${requestIndex}`,
    onMockServerReset: () => onMockServerReset(mockServerClient),
    toUncachedRequest,
    defaultMockDelay: 25,
    removeTimestampsFn: cloneAndRemoveTimestamps,
    clearBackendCacheForRequest: disableAndClearCaches,
    fillBackendCacheForRequest: fillCaches,
    mockserverIgnoreFilter: { path: "!/sampling" },
    getTitleForLoadTestResult: getTitle,
    replaceHostHeadersOnForwardRequest: {
      "pphbf.prd.internal": {
        replace: ["www.betfair.com"],
        socketAddress: { host: "pphbf.prd.internal", port: 80, scheme: "HTTP" },
      },
      "mypromos.skybetservices.com": {
        socketAddress: { host: "pphsbg.prd.internal", port: 80, scheme: "HTTP" },
      },
    },
  };
};
