/* eslint-disable no-console */
const requests = [];
function MockService() {
  const mockFonts = async (fontsMocks) => {
    if (fontsMocks && fontsMocks.length) {
      fontsMocks.forEach(async (controller) => {
        const key = controller.pathRegex + controller.method;

        if (requests[key]) requests[key].restore();

        requests[key] = await browser.mock(controller.pathRegex, {
          method: controller.method || "GET",
        });

        requests[key].respond(controller.response, {
          statusCode: controller.statusCode || 200,
          headers: controller.headers || {
            "Content-Type": ["font/woff2"],
            Server: ["motorx"],
            "Accept-Ranges": ["bytes"],
          },
          fetchResponse: false,
        });
      });
      global.setMockedFonts(true);
    }
  };

  const clearAllMocks = () => {
    Object.values(requests).forEach((request) => {
      if (request) {
        request.restore();
      }
    });
  };

  const clearEndpoint = (endpoint) => {
    requests[endpoint].restore();
  };

  const mockHttpRequest = async ({
    bodyType,
    bodyMatcher,
    body,
    method,
    pathRegex,
    headers,
    response,
    queryStringParametersPuppeteer,
    statusCode,
    delay,
  }) => {
    const reg = bodyType === "JSON" ? body : new RegExp(body);
    const key = pathRegex + method + (body || queryStringParametersPuppeteer || "");

    if (requests[key]) requests[key].restore();

    const queryString = queryStringParametersPuppeteer ? queryStringParametersPuppeteer.toString() : "";

    requests[key] = await browser.mock(new RegExp(pathRegex + queryString), {
      method: method || "GET",
      postData: (data) => {
        if (data) {
          let dataJson;
          try {
            dataJson = JSON.parse(data);
          } catch (e) {
            // TODO: change this to a throw error (only here because of MAX request being broken)
            return true;
          }

          if (bodyType === "MATCHER" && method === "POST" && typeof bodyMatcher === "function") {
            try {
              return bodyMatcher(data);
            } catch (e) {
              console.error(`Controller with path ${pathRegex} has failed payload post data body matching`, data, e);
              console.warn("Rejecting request");

              return false;
            }
          }

          // qa env for bff
          if (dataJson.documentId) return reg.test(data);

          // localhost for bff
          if (dataJson.query && body) {
            const newDataJson = { ...dataJson, query: dataJson.query.substring(0, 150) };
            return reg.test(JSON.stringify(newDataJson));
          }

          // other services

          // When we want to compare full JSON object as body
          if (bodyType === "JSON") {
            const regSanitized = JSON.stringify(JSON.parse(reg));
            const dataSanitized = JSON.stringify(JSON.parse(data));
            return regSanitized === dataSanitized;
          }

          return reg.test(data);
        }

        return true;
      },
    });

    const params = {
      statusCode: statusCode || 200,
      headers: headers || {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-cache, no-store",
      },
      fetchResponse: false,
    };

    if (delay) {
      requests[key].respond(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(response), delay);
          }),
        params,
      );
    } else {
      requests[key].respond(response, params);
    }

    return requests[key];
  };

  const blockThirdPartyRequests = async () => {
    const key = "thirdPartyRequests";

    requests[key] = await browser.mock("https://www.googletagmanager.com/**");
    await requests[key].abort("BlockedByClient");

    global.setBlockedThirdPartyRequests(true);
  };

  const waitForMockToBeCalled = async (mockObject, timeout = 5000) => {
    await browser.waitUntil(async () => mockObject.matches.length >= 1, {
      timeout,
      timeoutMsg: `Mock for URL:${mockObject.url} was not called within ${timeout / 1000} seconds`,
    });
  };

  /* API */
  this.mockFonts = mockFonts;
  this.clearAllMocks = clearAllMocks;
  this.mockHttpRequest = mockHttpRequest;
  this.clearEndpoint = clearEndpoint;
  this.blockThirdPartyRequests = blockThirdPartyRequests;
  this.waitForMockToBeCalled = waitForMockToBeCalled;
}

module.exports = MockService;
