const MockServerClient = require("@pedrorfernandes/mockserver-client").mockServerClient;
const { overrideMockServerHost, mockServerPort } = require("../conf/conf");

const mockserverClients = {};

function getMockServerClientInstance(url) {
  const { hostname } = new URL(url);

  const host = overrideMockServerHost || hostname.replace("ie1", "ie2");

  console.log(`getMockServerClientInstance(): ${host}:${mockServerPort}`);

  const mockServerClient = mockserverClients[host] ? mockserverClients[host] : MockServerClient(host, mockServerPort);
  mockserverClients[host] = mockServerClient;

  return mockServerClient;
}

async function onMockServerReset(mockServerClient) {
  // TODO add remaining services that require a modified Host header
  // missing so far: WMS
  await mockServerClient.mockAnyResponse([
    {
      httpRequest: { method: "GET", path: "/sampling" },
      httpResponse: {
        statusCode: 200,
        reasonPhrase: "OK",
        headers: { "Content-Type": ["application/json"] },
        body: {
          strategyType: "RATE_LIMITING",
          rateLimitingSampling: { maxTracesPerSecond: 5 },
          operationSampling: {
            defaultSamplingProbability: 0.001,
            defaultLowerBoundTracesPerSecond: 0,
            perOperationStrategies: [
              { operation: "/health", probabilisticSampling: { samplingRate: 0 } },
              { operation: "/webping", probabilisticSampling: { samplingRate: 0 } },
              { operation: "/ping", probabilisticSampling: { samplingRate: 0 } },
              { operation: "/metrics", probabilisticSampling: { samplingRate: 0 } },
            ],
            defaultUpperBoundTracesPerSecond: 0,
          },
        },
      },
    },
    {
      priority: -1000, // automock-loadtester/orchestrator has -1 as the disable proxied reqs during a test
      httpRequest: {
        headers: { Host: "mypromos.skybetservices.com" },
        path: "/api/customisedPromotions/*",
      },
      httpOverrideForwardedRequest: {
        requestOverride: { socketAddress: { host: "pphsbg.prd.internal", port: 80, scheme: "HTTP" } },
      },
    },
    {
      priority: -1000, // automock-loadtester/orchestrator has -1 as the disable proxied reqs during a test
      httpRequest: { headers: { Host: "pphbf.prd.internal" } },
      httpOverrideForwardedRequest: {
        requestModifier: { headers: { replace: { Host: ["www.betfair.com"] } } },
        requestOverride: { socketAddress: { host: "pphbf.prd.internal", port: 80, scheme: "HTTP" } },
      },
    },
  ]);
}

async function resetMockServer(url) {
  const mockServerClient = getMockServerClientInstance(url);

  await mockServerClient.reset();
  await onMockServerReset(mockServerClient);

  console.log("Mockserver was reset");
}

module.exports = {
  getMockServerClientInstance,
  resetMockServer,
  onMockServerReset,
};
