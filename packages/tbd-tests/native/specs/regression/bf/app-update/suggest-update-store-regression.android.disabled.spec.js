const { getAppContext } = require("@ppb/tbd-shared/mocks/app-context/app-context.controller");
const MockService = require("../../../helpers/mocking-service");
const { startApp } = require("../../../utils/urls");
const { alertTitleElement, alertButtonElement, playStoreElement } = require("./app-update.android.so");

const mockService = new MockService();

const currentVersion = process.env.BUILD_NUMBER ? process.env.BUILD_NUMBER : 3000;
const APP_UPDATE_MOCK = {
  versionCode: currentVersion + 1,
  minVersionCode: currentVersion - 1,
  storeUrl: "https://play.google.com/store/apps/details?id=com.betfair.tbd.release",
  countryCode: "IE",
};

describe("app update - suggest update", () => {
  afterAll(async () => {
    await driver.back();
  });

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
        const button = await alertButtonElement("UPDATE");
        driver.elementClick(button.ELEMENT);
      });

      it("[PRPI-1686] should go to Play Store", async () => {
        let playStoreLayout;

        await driver.waitUntil(async () => {
          playStoreLayout = await playStoreElement();
          return playStoreLayout.ELEMENT !== undefined;
        });

        expect(playStoreLayout).toBeDefined();
      });
    });
  });
});
