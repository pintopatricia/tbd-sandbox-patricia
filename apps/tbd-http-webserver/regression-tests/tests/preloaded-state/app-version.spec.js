const { getMockingService, bffController } = require("@ppb/bff-mocking-server-common");
const { buildPreferencesMock } = require("../mock-builders");

const { requestAccessControl, mockRequest } = getMockingService();
const { getAppContext, getAppVersion } = bffController;

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

  mockRequest(
    getAppVersion({
      url: "string",
      downloadUrl: "string",
      storeUrl: "string",
      versionCode: 1234,
      minVersionCode: 123,
      minOSVersion: "15",
      blackList: [{ versioncode: 122 }],
    }),
  );
}

describe("App Version", () => {
  let result;
  let windowVariablesPO;

  it("[SLBY-347] The app version should be present in the preloaded state", async () => {
    setup();
    result = await requestAccessControl({ loggedIn: false });
    windowVariablesPO = new WindowVariablesPO(result);

    expect(windowVariablesPO.preloadedState.entities.appversion).toEqual({
      android: {
        blackList: [
          {
            versioncode: 122,
          },
        ],
        downloadUrl: "string",
        minOSVersion: "15",
        minVersionCode: 123,
        storeUrl: "string",
        url: "string",
        versionCode: 1234,
      },
      ios: {
        blackList: [
          {
            versioncode: 122,
          },
        ],
        downloadUrl: "string",
        minOSVersion: "15",
        minVersionCode: 123,
        storeUrl: "string",
        url: "string",
        versionCode: 1234,
      },
    });
  });
});
