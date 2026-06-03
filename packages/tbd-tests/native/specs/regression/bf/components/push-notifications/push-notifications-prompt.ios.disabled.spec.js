const { getAppContext } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { NotificationPromptSO } = require("../../../../../screen-objects");
const MockService = require("../../../../../mock-essentials/mocking-service");

const { startApp } = require("../../../../../helpers/urls");

const mockService = new MockService();

const notificationPromptSO = new NotificationPromptSO();

describe("Push Notifications initial prompt", () => {
  describe("When the user open the app for the first time", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getAppContext());
      await startApp("home");
    });

    it("[PRPI-3302] the push notification prompt should not be shown", async () => {
      expect(await notificationPromptSO.bellIconContainer.isDisplayed()).toBe(false);
    });
  });
});
