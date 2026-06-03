const { getLatest } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../helpers/mocking-service");
const { startApp } = require("../../../utils/urls");
const { alertTitleElement, alertButtonElement, playStoreElement } = require("./app-update.android.so");

const mockService = new MockService();

const currentVersion = process.env.BUILD_NUMBER ? process.env.BUILD_NUMBER : 3000;

const APP_UPDATE_MOCK = {
  versionCode: currentVersion + 2,
  minVersionCode: currentVersion + 1,
  storeUrl: "https://play.google.com/store/apps/details?id=com.betfair.tbd.release",
  countryCode: "IE",
};

describe("app update - force update", () => {
  describe("when force update is through store", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getLatest(APP_UPDATE_MOCK));
      await startApp("home");
    });

    it("[PRPI-1681] should display force update", async () => {
      let title;

      await driver.waitUntil(async () => {
        title = await alertTitleElement("Update your App");
        return title.ELEMENT !== undefined;
      });

      expect(title).toBeDefined();
    });

    describe("when update button is clicked", () => {
      beforeAll(async () => {
        const button = await alertButtonElement("UPDATE");
        driver.elementClick(button.ELEMENT);
      });

      it("[PRPI-1682] should go to Play Store", async () => {
        let playStoreLayout;

        await driver.waitUntil(async () => {
          playStoreLayout = await playStoreElement();
          return playStoreLayout.ELEMENT !== undefined;
        });

        expect(playStoreLayout).toBeDefined();
      });

      describe("when back button clicked", () => {
        beforeAll(async () => {
          await driver.back();
        });

        it("[PRPI-1683] should display force update again", async () => {
          let title;

          await driver.waitUntil(async () => {
            title = await alertTitleElement("Update your App");
            return title.ELEMENT !== undefined;
          });

          expect(title).toBeDefined();
        });
      });
    });
  });
});
