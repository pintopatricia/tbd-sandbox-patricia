const { getMockingService, bffController } = require("@ppb/bff-mocking-server-common");
const { buildPreferencesMock } = require("../mock-builders");
const { requestAccessControl, mockRequest } = getMockingService();
const { getAppContext } = bffController;

const WindowVariablesPO = require("../../page-objects/window-variables.po");

function setup() {
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

describe("Product Cluster", () => {
  let result;
  let windowVariablesPO;

  beforeEach(() => {
    setup();
  });

  it("[RUIVO-674] PRODUCT_CLUSTER should be present in the environment config", async () => {
    result = await requestAccessControl({ loggedIn: false });
    windowVariablesPO = new WindowVariablesPO(result);

    expect(windowVariablesPO.environment.PRODUCT_CLUSTER).toBeDefined();
  });

  it("[RUIVO-674] PRODUCT_CLUSTER should be one of the valid cluster identifiers", async () => {
    result = await requestAccessControl({ loggedIn: false });
    windowVariablesPO = new WindowVariablesPO(result);

    expect(["SBK", "EXC"]).toContain(windowVariablesPO.environment.PRODUCT_CLUSTER);
  });

  it("[RUIVO-674] PRODUCT_CLUSTER should be SBK for the Sportsbook strand", async () => {
    result = await requestAccessControl({ loggedIn: false });
    windowVariablesPO = new WindowVariablesPO(result);

    expect(windowVariablesPO.environment.PRODUCT_CLUSTER).toEqual("SBK");
  });
});
