const { getAppContext } = require("@ppb/tbd-shared/mocks/app-context/app-context.controller");
const MockService = require("../../../helpers/mocking-service");
const { startApp } = require("../../../utils/urls");
const { alertTitleElement, alertButtonElement, playStoreElement } = require("./app-update.android.so");

const mockService = new MockService();

const currentVersion = process.env.BUILD_NUMBER ? process.env.BUILD_NUMBER : 3000;

describe("app update - blacklisted version", () => {
  describe("when current version is blacklisted", () => {
    beforeAll(async () => {
      const appContextMock = {
        blacklistedVersionCode: currentVersion,
        storeUrl: "https://play.google.com/store/apps/details?id=com.betfair.tbd.release",
      };

      await mockService.mockHttpRequest(getAppContext(appContextMock));
      await startApp("home");
    });

    it("[PRPI-1677] should display force update", async () => {
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

      it("[PRPI-1678] should go to Play Store", async () => {
        let playStoreLayout;

        await driver.waitUntil(async () => {
          playStoreLayout = await playStoreElement();
          return playStoreLayout.ELEMENT !== undefined;
        });

        expect(playStoreLayout).toBeDefined();
      });

      // describe("when back button clicked", () => {
      //   beforeAll(async () => {
      //     await driver.back();
      //   });

      //   it("[1026724] should display force update again", async () => {
      //     let title;

      //     await driver.waitUntil(async () => {
      //       title = await alertTitleElement("Update your App");
      //       return title.ELEMENT !== undefined;
      //     });

      //     expect(title).toBeDefined();
      //   });
      // });
    });
  });
});
