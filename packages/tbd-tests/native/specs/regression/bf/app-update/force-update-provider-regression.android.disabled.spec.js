const { getAppContext } = require("@ppb/tbd-shared/mocks/app-context/app-context.controller");
const MockService = require("../../../helpers/mocking-service");
const { startApp } = require("../../../utils/urls");
const { alertButtonElement, alertTitleElement } = require("./app-update.android.so");

const mockService = new MockService();

const currentVersion = process.env.BUILD_NUMBER ? process.env.BUILD_NUMBER : 3000;
const APP_UPDATE_MOCK = {
  versionCode: currentVersion + 2,
  minVersionCode: currentVersion + 1,
  downloadUrl: "https://assets.cdnppb.net/static/android/betfair-rebuild-v0.1.125.apk",
  countryCode: "PT",
};

describe("app update - force update", () => {
  afterAll(async () => {
    const button = await alertButtonElement("Done");

    driver.elementClick(button.ELEMENT);
    driver.removeApp("com.betfair.sportsbook");
  });

  describe("when force update is not possible through store", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getAppContext(APP_UPDATE_MOCK));
      await startApp("home");
    });

    it("[PRPI-1680] should display force update", async () => {
      let title;

      await driver.waitUntil(async () => {
        title = await alertTitleElement("Update your App");
        return title.ELEMENT !== undefined;
      });

      expect(title).toBeDefined();
    });
  });
});
