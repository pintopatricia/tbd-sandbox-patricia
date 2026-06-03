const { getBrowseLayout, getAppContext } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { BottomBarSO, BrowseScreenSO } = require("../../../../screen-objects");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");

const mockService = new MockService();

const browseScreenSO = new BrowseScreenSO();

const BFF_BROWSE_MOCK = {
  urn: "ppb:tbd:view:browse:sports",
  edges: [
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:group:azmenu-quicklinks/cv/browse",
        quickLinksTitle: null,
        links: [
          {
            label: "Football",
            viewLink: {
              viewUrn: "ppb:tbd:view:sport:1",
              viewUrl: "football/s-1",
            },
            target: null,
            icon: null,
          },
          {
            label: "Horse Racing",
            viewLink: {
              viewUrn: "ppb:tbd:view:sport:7",
              viewUrl: "horse-racing/s-7",
            },
            target: null,
            icon: null,
          },
        ],
      },
    },
  ],
};

describe("Browse Screen", () => {
  describe("When the user is at the Browse screen", () => {
    describe("And throttle browseCasinoThrottles is ON", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          getAppContext({
            throttles: {
              BROWSE_CASINO_ANDROID: {
                isActive: true,
              },
              BROWSE_CASINO_IOS: {
                isActive: true,
              },
            },
          }),
        );
        await mockService.mockHttpRequest(getBrowseLayout(BFF_BROWSE_MOCK));
        await startApp("home");
        await browser.waitUntilDisplayed(BottomBarSO.browse);
        await browser.waitUntilClickableNative(BottomBarSO.browse);
        await BottomBarSO.browse.click();
        await browser.waitUntilDisplayed(browseScreenSO.element);
        await browser.waitUntilDisplayed(browseScreenSO.title);
        await browser.waitUntilArrayLength(browseScreenSO.tabTitlesList, (length) => length === 2);
      });

      it("[PRPI-2869] The screen title should be shown: 'Browse'", async () => {
        expect(await browseScreenSO.title.getText()).toBe("Browse");
      });

      it("[PRPI-2870] The 'Sports' tab should be visible", async () => {
        expect(await browseScreenSO.tabTitlesList[0].getText()).toBe("Sports");
      });

      it("[PRPI-2871] The 'Casino' tab should be visible", async () => {
        expect(await browseScreenSO.tabTitlesList[1].getText()).toBe("Casino");
      });
    });
  });
});
