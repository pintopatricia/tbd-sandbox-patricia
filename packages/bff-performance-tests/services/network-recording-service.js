const BrowserRequestsRecorder = require("@automock-loadtester/browser-requests-recorder").default;
const { resetMockServer } = require("./mockserver-client-instance");

// iPhone 12 Pro height must be set
// because this affects network requests (vertical + horizontal scroll)
const WIDTH = 390;
const HEIGHT = 844;

module.exports = {
  getInstance: async () => {
    await resetMockServer(browser.options.baseUrl);
    await browser.setWindowSize(WIDTH, HEIGHT);

    const networkRecording = await BrowserRequestsRecorder.getInstance({
      browser,
      requestMatcher: (params) => params.request.url.includes("bff-gql/v"),
      // TODO webserver not ready to be tested
      // must forward the reset LRU cache header to BFF in order to have correct behaviour
      // || (params.type === "Document" && params.request.url.includes(browser.options.baseUrl)),
    });

    return networkRecording;
  },
};
