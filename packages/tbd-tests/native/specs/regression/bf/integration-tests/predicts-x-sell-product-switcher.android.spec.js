const { getAppContext, getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { BottomBarSO, PredictsLoadingSO } = require("../../../../screen-objects");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");

const mockService = new MockService();
const predictsLoadingSO = new PredictsLoadingSO();

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  bottomBar: {
    tiles: [
      {
        tileType: "HOME",
        viewLink: { viewUrn: "ppb:tbd:view:generic:home", viewUrl: "" },
      },
      {
        tileType: "BROWSE",
        viewLink: {
          viewUrn: "ppb:tbd:view:browse:sports",
          viewUrl: "browse/b-sports",
        },
      },
      {
        tileType: "MY_BETS",
        viewLink: {
          viewUrn: "ppb:tbd:view:myBets:open",
          viewUrl: "mybets/mybets-open",
        },
      },
      {
        tileType: "GAMING",
        viewLink: { viewUrn: "ppb:tbd:view:gaming:1", viewUrl: "casino/gm-1" },
      },
    ],

    hasProductSwitcher: true,
  },
  edges: [],
  partialEdges: [],
};

const setup = async ({
  isEnablePredictsThrottleActive = true,
  isExcAllowedJurisdictionThrottleActive = false,
  selectedExchangeDefaultMode = "PREDICTS",
  loggedIn = "false",
  phoenixMigratedUser = false,
  dismissOnboarding = false,
} = {}) => {
  await mockService.mockHttpRequest(
    getAppContext({
      throttles: {
        PRODUCT_SWITCHER_NATIVE: { isActive: true },
        EXC_ALLOWED_JURISDICTION: { isActive: isExcAllowedJurisdictionThrottleActive },
        ENABLE_PREDICTS: { isActive: isEnablePredictsThrottleActive },
      },
      loggedIn,
      phoenixMigratedUser,
      selectedExchangeDefaultMode,
    }),
  );

  await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
  await startApp("home", { shouldTerminateAppBeforeStart: true, dismissOnboarding });

  await BottomBarSO.switcher.waitForDisplayed({ timeout: 30000 });
};

describe("Predicts - X-Sell Button - Product Switcher", () => {
  describe("when the user is logged out", () => {
    describe("and the ENABLE_PREDICTS throttle is ON", () => {
      describe("and the exchangeDefaultMode preference is PREDICTS", () => {
        beforeAll(async () => {
          await setup();

          await browser.waitUntilEquals(BottomBarSO.switcherLabel, "Predicts");
        });

        it("[PRPI-12727]should display the Predicts product switcher button", async () => {
          expect(await BottomBarSO.switcher.isDisplayed()).toBe(true);
        });

        describe("and when clicking on the Predicts product switcher button", () => {
          beforeAll(async () => {
            await BottomBarSO.switcher.click();
          });

          it("[PRPI-12729]should open the Predicts loading screen", async () => {
            await predictsLoadingSO.element.waitForDisplayed({
              timeout: 15000,
              timeoutMsg: "Predicts loading screen did not open",
            });
          });
        });
      });

      describe("and the exchangeDefaultMode preference is DEFAULT", () => {
        beforeAll(async () => {
          await setup({ selectedExchangeDefaultMode: "DEFAULT" });
        });

        it("[PRPI-12730]should show 'Exchange' as the product switcher title", async () => {
          await browser.waitUntilEquals(BottomBarSO.switcherLabel, "Exchange");
        });
      });
    });

    describe("and the ENABLE_PREDICTS throttle is OFF", () => {
      beforeAll(async () => {
        await setup({ isEnablePredictsThrottleActive: false });
      });

      it("[PRPI-12731]should show 'Exchange' as the product switcher title", async () => {
        await browser.waitUntilEquals(BottomBarSO.switcherLabel, "Exchange");
      });
    });
  });

  describe("when the user is logged in with Phoenix exchange access", () => {
    beforeAll(async () => {
      await setup({
        loggedIn: "true",
        phoenixMigratedUser: true,
        isExcAllowedJurisdictionThrottleActive: true,
        dismissOnboarding: true,
      });
    });

    it("[PRPI-12732]should show 'Exchange' as the product switcher title", async () => {
      await browser.waitUntilEquals(BottomBarSO.switcherLabel, "Exchange");
    });
  });
});
