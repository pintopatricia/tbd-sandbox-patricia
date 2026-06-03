const { getAppContext } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const BetfairTerritoryBlockingPageSO = require("@ppb/tbd-shared/components/TerritoryBlockingPage/BetfairTerritoryBlockingPage.native.so");
const { startApp } = require("../../../../helpers/urls");
const MockService = require("../../../../mock-essentials/mocking-service");

const mockService = new MockService();
const territoryBlockingPageSO = new BetfairTerritoryBlockingPageSO();

const EXPECTED_TITLE = "Under Maintenance";
const EXPECTED_MESSAGE =
  "This app is not currently available in your country, while we work on that please use this link to access the Betfair website.";
const EXPECTED_INFO = "Betfair - Mobile Web";

describe("Territory Blocking", () => {
  describe("When the user opens the app on a blocked country", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getAppContext({}, { statusCode: 403 }));
      await startApp("home");
      await browser.waitUntilEquals(territoryBlockingPageSO.title, EXPECTED_TITLE);
    });

    it("[PRPI-2640] The territory blocking screen should be displayed", async () => {
      expect(await territoryBlockingPageSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-2641] should display the logo", async () => {
      expect(await territoryBlockingPageSO.logo.isDisplayed()).toBe(true);
    });

    it("[PRPI-2642] should display the title with the expected label", async () => {
      expect(await territoryBlockingPageSO.title.getText()).toEqual(EXPECTED_TITLE);
    });

    it("[PRPI-2643] should display the message with the expected label", async () => {
      expect(await territoryBlockingPageSO.message.getText()).toEqual(EXPECTED_MESSAGE);
    });

    it("[PRPI-2644] should display the info with the expected label", async () => {
      expect(await territoryBlockingPageSO.info.getText()).toEqual(EXPECTED_INFO);
    });

    it("[PRPI-2645] should display the help icon", async () => {
      expect(await territoryBlockingPageSO.helpIcon.isDisplayed()).toBe(true);
    });
  });
});
