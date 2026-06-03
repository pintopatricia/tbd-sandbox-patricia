const { getAppContext, getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { BottomSheetSO } = require("../../../../screen-objects");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");

const mockService = new MockService();
const bottomSheetSO = new BottomSheetSO();

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  bottomBar: {
    tiles: [
      {
        tileType: "HOME",
        viewLink: {
          viewUrn: "ppb:tbd:view:generic:home",
          viewUrl: "",
        },
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
        viewLink: {
          viewUrn: "ppb:tbd:view:gaming:1",
          viewUrl: "casino/gm-1",
        },
      },
    ],

    hasProductSwitcher: true,
  },
  edges: [],
  partialEdges: [],
};

const setup = async ({
  isExcAllowedJurisdictionThrottleActive = true,
  phoenixMigratedUser = false,
  accountOpenDate,
  loggedIn = true,
  selectedDefaultProduct = "EXCHANGE",
} = {}) => {
  await mockService.mockHttpRequest(
    getAppContext({
      throttles: {
        PRODUCT_SWITCHER_NATIVE: { isActive: true },
        EXC_ALLOWED_JURISDICTION: { isActive: isExcAllowedJurisdictionThrottleActive },
      },
      accountOpenDate,
      phoenixMigratedUser,
      loggedIn,
      selectedDefaultProduct,
    }),
  );

  await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
  await startApp("home", { shouldTerminateAppBeforeStart: true });
};

describe("Exchange - Onboarding Bottom Sheet - Availability", () => {
  describe("when the user is logged in", () => {
    describe("and the account creation date is after 31 December 2026", () => {
      describe("and the EXC_ALLOWED_JURISDICTION throttle is OFF", () => {
        beforeAll(async () => {
          await setup({
            accountOpenDate: "2027-01-01T00:00:00.000Z",
            isExcAllowedJurisdictionThrottleActive: false,
            selectedDefaultProduct: "SPORTSBOOK",
          });
        });

        it("[PRPI-12633]the onboarding bottom sheet should not be displayed", async () => {
          await browser.waitUntilNotDisplayed(bottomSheetSO.element, "Onboarding bottom sheet is still displayed");
        });
      });

      describe("and the EXC_ALLOWED_JURISDICTION throttle is ON", () => {
        describe("and when accessing exchange", () => {
          beforeAll(async () => {
            await setup({ accountOpenDate: "2027-01-01T00:00:00.000Z" });
          });

          it("[PRPI-12634]the onboarding bottom sheet should be displayed", async () => {
            await browser.waitUntilDisplayed(bottomSheetSO.element, "Onboarding bottom sheet is not visible");
          });
        });

        describe("and when accessing sportsbook", () => {
          beforeAll(async () => {
            await setup({
              accountOpenDate: "2027-01-01T00:00:00.000Z",
              selectedDefaultProduct: "SPORTSBOOK",
            });
          });

          it("[PRPI-12635]the onboarding bottom sheet should be displayed", async () => {
            await browser.waitUntilDisplayed(bottomSheetSO.element, "Onboarding bottom sheet is not visible");
          });
        });
      });
    });

    describe("and the user is not EXC eligible", () => {
      describe("and the account creation date is before 31 December 2026", () => {
        beforeAll(async () => {
          await setup({
            accountOpenDate: "2026-12-30T23:59:59.999Z",
            isExcAllowedJurisdictionThrottleActive: true,
          });
        });

        it("[PRPI-12637] the onboarding bottom sheet should not be displayed", async () => {
          await browser.waitUntilNotDisplayed(bottomSheetSO.element, "Onboarding bottom sheet is still displayed");
        });
      });
    });
  });

  describe("when the user is logged out", () => {
    beforeAll(async () => {
      await setup({ loggedIn: "false", isExcAllowedJurisdictionThrottleActive: true });
    });

    it("[PRPI-9562] the onboarding bottom sheet should not be displayed", async () => {
      await browser.waitUntilNotDisplayed(bottomSheetSO.element, "Onboarding bottom sheet is still displayed");
    });
  });
});
