const { getAppContext } = require("@ppb/tbd-shared/mocks/app-context/app-context.controller");
const MockService = require("../../../helpers/mocking-service");
const { startApp } = require("../../../utils/urls");
const { alertTitleElement, alertButtonElement } = require("./app-update.ios.so");

const mockService = new MockService();

const currentVersion = process.env.STAGING_JOB_BUILD_NUMBER ? process.env.NATIVE_BUILD_NUMBER : 3000000;
const APP_UPDATE_MOCK = {
  versionCode: currentVersion + 1,
  minVersionCode: currentVersion - 1,
  storeUrl: "itms-apps://itunes.apple.com/app/id1586965469",
  countryCode: "IE",
};

describe("app update - suggest update", () => {
  describe("when suggest update is through store", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getAppContext(APP_UPDATE_MOCK));
      await startApp("home");
    });

    it("[PRPI-1685] should display suggest update", async () => {
      let title;

      await driver.waitUntil(async () => {
        title = await alertTitleElement("Update to new version?");
        return title.ELEMENT !== undefined;
      });

      expect(title).toBeDefined();
    });

    describe("when update button is clicked", () => {
      beforeAll(async () => {
        const button = await alertButtonElement("Update");
        driver.elementClick(button.ELEMENT);
      });

      // Currently, the app is not in the Store, so this test should be updated when app deployed.
      it("[PRPI-1687] should dismiss the Alert", async () => {
        let title;

        await driver.waitUntil(async () => {
          title = await alertTitleElement("Update your App");
          return title.error === "no such element";
        });

        expect(title.error).toBe("no such element");
      });
    });
  });
});
