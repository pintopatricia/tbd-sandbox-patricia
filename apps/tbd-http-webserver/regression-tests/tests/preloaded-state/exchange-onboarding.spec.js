const { getMockingService, buildUserDataExpectation, bffController } = require("@ppb/bff-mocking-server-common");
const { buildPreferencesMock } = require("../mock-builders");
const { requestAccessControl, mockRequest } = getMockingService();
const { getAppContext } = bffController;

const WindowVariablesPO = require("../../page-objects/window-variables.po");

function setup() {
  mockRequest(buildUserDataExpectation({ accountID: 123 }));
  mockRequest(
    getAppContext({
      userdetails: {
        jurisdiction: {
          jurisdiction: "international",
        },
        productExclusions: [],
      },
      activeExperiments: [],
      preferences: buildPreferencesMock(),
      throttles: [],
      brandSettings: [],
      pollcadences: null,
      registration: [],
    }),
  );
}

describe("Exchange Onboarding", () => {
  let result;
  let windowVariablesPO;

  describe("When a logged in user request land without exc=true param", () => {
    it("[1181409] The exchangeEnabled should be false", async () => {
      setup();
      result = await requestAccessControl({ loggedIn: true });
      windowVariablesPO = new WindowVariablesPO(result);

      expect(windowVariablesPO.preloadedState.boot.exchangeEnabled).toEqual(false);
    });
  });

  describe("When a logged in user request land with exc=true param", () => {
    it("[1181409] The exchangeEnabled should be true", async () => {
      setup();
      result = await requestAccessControl({ loggedIn: true, baseHref: "betting/?exc=true" });
      windowVariablesPO = new WindowVariablesPO(result);

      expect(windowVariablesPO.preloadedState.boot.exchangeEnabled).toEqual(true);
    });
  });
});
