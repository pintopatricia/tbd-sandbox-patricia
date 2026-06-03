const { getAppContext, getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { StatusLabelSO } = require("../../../../screen-objects");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");

const mockService = new MockService();
const statusLabelSO = new StatusLabelSO();

// Onboarding bottom sheet only appears on first fresh install. State persists
// across shouldTerminateAppBeforeStart restarts, so dismissing it again on
// subsequent setups hangs waiting for an element that never appears.
let onboardingDismissed = false;

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
  phoenixMigratedUser = true,
  accountOpenDate = "2025-01-01T00:00:00.000Z",
  loggedIn = true,
  selectedExchangeDefaultProduct = "NEME",
  dismissOnboarding = true,
  canUsePhoenixExchange = true,
} = {}) => {
  await mockService.mockHttpRequest(
    getAppContext({
      throttles: {
        PRODUCT_SWITCHER_NATIVE: {
          isActive: true,
        },
        ENABLE_PREDICTS: { isActive: false },
        EXC_ALLOWED_JURISDICTION: { isActive: isExcAllowedJurisdictionThrottleActive },
      },
      loggedIn,
      selectedExchangeDefaultProduct,
      phoenixMigratedUser,
      accountOpenDate,
      canUsePhoenixExchange,
    }),
  );

  await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
  await startApp("home", {
    shouldTerminateAppBeforeStart: true,
    dismissOnboarding: dismissOnboarding && !onboardingDismissed,
  });
  onboardingDismissed = true;
};

describe("Exchange - X-Sell Button - Product Switcher", () => {
  describe("when the EXC_ALLOWED_JURISDICTION throttle is ON", () => {
    describe("and the user is logged in", () => {
      describe("and is exchange eligible", () => {
        describe("and the exchangeDefaultProduct preference is NEME", () => {
          beforeAll(async () => {
            await setup();
          });

          it("[PRPI-8366] the exchange x-sell button should display the new label", async () => {
            expect(await statusLabelSO.element.isDisplayed()).toBe(true);
            expect(await statusLabelSO.text.getText()).toBe("NEW");
          });
        });

        describe("and the exchangeDefaultProduct preference is EMS", () => {
          beforeAll(async () => {
            await setup({ selectedExchangeDefaultProduct: "EMS" });
          });

          it("[PRPI-8367]the exchange x-sell button should NOT display the new label", async () => {
            expect(await statusLabelSO.element.isExisting()).toBe(false);
          });
        });

        describe("and the exchangeDefaultProduct preference is not set", () => {
          beforeAll(async () => {
            await setup({ selectedExchangeDefaultProduct: "UNASSIGNED" });
          });

          it("[PRPI-8368] the exchange x-sell button should NOT display the new label", async () => {
            expect(await statusLabelSO.element.isExisting()).toBe(false);
          });
        });
      });

      describe("and is NOT exchange eligible", () => {
        describe("and the account creation date is >= 31 December 2026", () => {
          beforeAll(async () => {
            await setup({
              dismissOnboarding: true,
              phoenixMigratedUser: false,
              accountOpenDate: "2026-12-31T00:00:00.000Z",
            });
          });

          it("[PRPI-12638]the exchange x-sell button should display the new label", async () => {
            expect(await statusLabelSO.element.isDisplayed()).toBe(true);
            expect(await statusLabelSO.text.getText()).toBe("NEW");
          });
        });

        describe("and the account creation date is < 31 December 2026", () => {
          beforeAll(async () => {
            await setup({ phoenixMigratedUser: false, accountOpenDate: "2026-12-30T00:00:00.000Z" });
          });

          it("[PRPI-8370] the exchange x-sell button should not display the new label", async () => {
            expect(await statusLabelSO.element.isExisting()).toBe(false);
          });
        });
      });
    });

    describe("and the user is logged out", () => {
      describe("and the phoenixEnabled cookie is not set", () => {
        beforeAll(async () => {
          await setup({ loggedIn: false, phoenixMigratedUser: false });
        });

        it("[PRPI-8371] the exchange x-sell button should not display the new label", async () => {
          expect(await statusLabelSO.element.isExisting()).toBe(false);
        });
      });
    });
  });

  describe("when the EXC_ALLOWED_JURISDICTION throttle is OFF", () => {
    describe("and the user is logged in", () => {
      describe("and is exchange eligible", () => {
        beforeAll(async () => {
          await setup({ isExcAllowedJurisdictionThrottleActive: false });
        });

        it("[PRPI-8369] the exchange x-sell button should not display the new label", async () => {
          expect(await statusLabelSO.element.isExisting()).toBe(false);
        });
      });

      describe("and is NOT exchange eligible, but the account creation date is >= 31 December 2026", () => {
        beforeAll(async () => {
          await setup({
            isExcAllowedJurisdictionThrottleActive: false,
            phoenixMigratedUser: false,
            accountOpenDate: "2026-12-31T00:00:00.000Z",
          });
        });

        it("[PRPI-12644] the exchange x-sell button should not display the new label", async () => {
          expect(await statusLabelSO.element.isExisting()).toBe(false);
        });
      });
    });

    describe("and the user is logged out", () => {
      beforeAll(async () => {
        await setup({ loggedIn: false, isExcAllowedJurisdictionThrottleActive: false });
      });

      it("[PRPI-8372] the exchange x-sell button should not display the new label", async () => {
        expect(await statusLabelSO.element.isExisting()).toBe(false);
      });
    });
  });
});
