/* eslint-disable no-console */
/* eslint-disable no-undef */
const mockServer = require("mockserver-client");
const yargs = require("yargs/yargs")();

const { MOCKHOST, MOCKHOSTPORT, _, es } = yargs.parse(
  browser.capabilities["appium:optionalIntentArguments"] ||
    browser.capabilities.optionalIntentArguments ||
    browser.capabilities["appium:processArguments"]?.args ||
    browser.capabilities.processArguments?.args || { MOCKHOST: "localhost", MOCKHOSTPORT: "1084" },
);

// `--es MOCKHOST ${ipAddress} --es MOCKHOSTPORT ${port}`
// is parsed as
// { _: [ '192.168.3.8', 59284 ], es: [ 'MOCKHOST', 'MOCKHOSTPORT' ] }
const mockHost = MOCKHOST || _[es.indexOf("MOCKHOST")];
const mockHostPort = MOCKHOSTPORT || _[es.indexOf("MOCKHOSTPORT")];

const defaultResponseHeaders = [
  { name: "Content-Type", values: ["application/json; charset=utf-8"] },
  { name: "Cache-Control", values: ["no-cache, no-store"] },
];

let storedRequests = [];

function MockService() {
  const mockServiceHost = mockHost ?? "localhost";
  const mockServicePort = mockHostPort ?? 1084;

  const mockServerClient = mockServer.mockServerClient(mockServiceHost, mockServicePort);

  const getHttpMock = (props) => {
    let bodyObj;
    if (props.body && props.bodyType === "JSON") {
      bodyObj = {
        type: "JSON",
        json: props.body,
        matchType: "STRICT",
      };
    } else if (props.body && props.body.type === "JSON") {
      bodyObj = {
        type: "JSON",
        json: props.body.json,
        matchType: "STRICT",
      };
    } else if (props.body) {
      bodyObj = {
        type: "REGEX",
        regex: props.body || ".*",
      };
    } else {
      bodyObj = undefined;
    }
    return {
      priority: 1,
      httpRequest: {
        method: props.method || "GET",
        path: props.pathRegex || props.path,
        body: bodyObj,
        headers: {},
        ...(props.queryStringParametersRegex && { queryStringParameters: props.queryStringParametersRegex }),
      },
      httpResponse: {
        statusCode: props.statusCode || 200,
        body: props.response,
        delay: {
          timeUnit: "SECONDS",
          value: props.delay || 0,
        },
      },
    };
  };

  const mockHttpRequest = async (props) => {
    const response = getHttpMock(props);

    const { id: requestID } =
      storedRequests.find(({ id, ...request }) => JSON.stringify(request) === JSON.stringify(response.httpRequest)) ||
      {};

    mockServerClient.setDefaultHeaders(props.headers || defaultResponseHeaders);

    const mockedResponse = Object.assign(response, requestID && { id: requestID });
    const sendMockServerMessage = async (retry = 1) => {
      const maxRetries = 3;
      return mockServerClient.mockAnyResponse(mockedResponse).catch(async (error) => {
        console.error("mockServerClient.mockAnyResponse failed with error:", error);
        if (retry < maxRetries) return sendMockServerMessage(retry + 1);
        throw error;
      });
    };

    const sendMockServerCallbackMessage = async (retry = 1) => {
      const maxRetries = 3;

      try {
        return mockServerClient.mockWithCallback(
          mockedResponse.httpRequest,
          (httpRequest) => {
            try {
              if (
                httpRequest.body?.type === "JSON" &&
                httpRequest.body.json &&
                props.bodyMatcher(JSON.stringify(httpRequest.body.json))
              ) {
                return mockedResponse.httpResponse;
              }

              throw new Error(`Body matcher failure for ${httpRequest.path}`);
            } catch (error) {
              console.error("Returning 500 status code due to", error);

              return { statusCode: 500 };
            }
          },
          null,
          1,
          mockedResponse.id,
        );
      } catch (error) {
        console.error("mockServerClient.mockWithCallback failed with error:", error);

        if (retry < maxRetries) {
          return sendMockServerCallbackMessage(retry + 1);
        }

        throw error;
      }
    };

    const result =
      props.bodyMatcher && props.bodyType === "MATCHER"
        ? await sendMockServerCallbackMessage()
        : await sendMockServerMessage();

    const { id } = JSON.parse(result.body)[0];
    storedRequests.push({ id, ...response.httpRequest });
  };

  const resetRequests = async () => {
    storedRequests.forEach(async (storedRequest) => {
      const { id, ...tempStoredRequest } = storedRequest;
      const formatedResponse = getHttpMock(tempStoredRequest);

      await mockServerClient.clear(formatedResponse.httpRequest);
    });

    storedRequests.length = 0;
  };

  const clear = (mockController) => {
    storedRequests = storedRequests.reduce((acc, current) => {
      const { id, ...tempStoredRequest } = current;
      const newStoredRequest = JSON.stringify(tempStoredRequest);
      const paramRequest = JSON.stringify(getHttpMock(mockController).httpRequest);
      if (newStoredRequest !== paramRequest) acc.push(current);
      return acc;
    }, []);

    return mockServerClient.clear(getHttpMock(mockController));
  };

  /* API */
  this.mockHttpRequest = mockHttpRequest;
  this.resetRequests = resetRequests;
  this.getMockServerPort = () => mockServicePort;
  this.getMockServerHost = () => mockServiceHost;
  this.clear = clear;
}

module.exports = MockService;
