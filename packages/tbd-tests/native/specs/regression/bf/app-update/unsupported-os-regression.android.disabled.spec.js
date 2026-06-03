const { getAppContext } = require("@ppb/tbd-shared/mocks/app-context/app-context.controller");
const MockService = require("../../../helpers/mocking-service");
const { startApp } = require("../../../utils/urls");
const { alertTitleElement, alertButtonElement, applicationViewElement } = require("./app-update.android.so");

const mockService = new MockService();

describe("app update - unsupported OS", () => {
  describe("when the device OS is unsupported", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getAppContext({ minOSVersion: "99" }));
      await startApp("home");
    });

    it("[PRPI-1688] should display unsupported alert", async () => {
      let title;

      await driver.waitUntil(async () => {
        title = await alertTitleElement("Version not supported");
        return title.ELEMENT !== undefined;
      });

      expect(title).toBeDefined();
    });

    describe("when dismiss button is clicked", () => {
      beforeAll(async () => {
        const button = await alertButtonElement("DISMISS");
        driver.elementClick(button.ELEMENT);
      });

      it("[PRPI-1689] should close the app", async () => {
        let applicationView;

        await driver.waitUntil(async () => {
          applicationView = await applicationViewElement();
          return applicationView.error === "no such element";
        });

        expect(applicationView.error).toBe("no such element");
      });
    });
  });
});
