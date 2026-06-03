const { PrimaryButtonPO, ExchangeOnboardingBottomSheetPO } = require("../../../../../page-objects");
const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();

const exchangeOnboardingBottomSheetPO = new ExchangeOnboardingBottomSheetPO();
const exploreButtonPO = new PrimaryButtonPO(exchangeOnboardingBottomSheetPO.content);

const wasExchangeOnboardingShown = "wasExchangeOnboardingShown";

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  edges: [],
  partialEdges: [],
  bottomBar: {
    tiles: [
      {
        tileType: "HOME",
        viewLink: {
          viewUrn: "ppb:tbd:view:generic:home",
          viewUrl: routes.getHomeViewUrl(),
        },
      },
      {
        tileType: "BROWSE",
        viewLink: {
          viewUrn: "ppb:tbd:view:browse:sports",
          viewUrl: routes.getBrowseViewUrl(),
        },
      },
      {
        tileType: "MY_BETS",
        viewLink: {
          viewUrn: "ppb:tbd:view:mybets:open",
          viewUrl: routes.getMyBetsViewUrl("open"),
        },
      },
      {
        tileType: "GAMING",
        viewLink: {
          viewUrn: "ppb:tbd:view:gaming:1",
          viewUrl: routes.getGamingViewUrl("1"),
        },
      },
    ],

    hasProductSwitcher: true,
  },
};

const INITIAL_STATE = {
  canUsePhoenixExchange: true,
  EXC_ALLOWED_JURISDICTION: { isActive: true },
  PRODUCT_SWITCHER: { isActive: true },
  defaultProduct: "exchange",
  loggedIn: "true",
  products: ["exchange", "sportsbook"],
};

const createMocks = async ({ initialState = {} } = {}) => {
  await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
  await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, initialState));

  await browser.url(routes.getHomeViewUrl());

  await browser.waitUntilDisplayed(exchangeOnboardingBottomSheetPO.element, "Onboarding bottom sheet is not visible");
};

describe("Exchange - Onboarding Bottom Sheet", () => {
  describe("when a logged in user is EXC eligible, and the EXC_ALLOWED_JURISDICTION throttle is ON", () => {
    describe("and when accessing exchange", () => {
      beforeAll(async () => {
        await createMocks({
          initialState: INITIAL_STATE,
        });
      });

      it("[PRPI-9548] the onboarding bottom sheet should display a title", async () => {
        expect(await exchangeOnboardingBottomSheetPO.headerTitle.getText()).toBe("The Exchange has evolved");

        expect(await browser.execute((key) => localStorage.getItem(key), wasExchangeOnboardingShown)).toBeNull();
      });

      it("[PRPI-9549] the onboarding bottom sheet should display the dismiss and explore buttons", async () => {
        expect(await exchangeOnboardingBottomSheetPO.closeButton.isDisplayedInViewport()).toBe(true);
        expect(await exploreButtonPO.label.getText()).toBe("Explore now");
      });

      it("[PRPI-9550] the onboarding bottom sheet should display an image", async () => {
        expect(await exchangeOnboardingBottomSheetPO.image.isDisplayedInViewport()).toBe(true);
      });

      it("[PRPI-9551] the onboarding bottom sheet should display a description", async () => {
        expect(await exchangeOnboardingBottomSheetPO.description.getText()).toBe(
          "Faster. Simpler. Switch seamlessly between Sportsbook and Exchange in one app. You can set your default anytime in Settings & Details.",
        );
      });

      describe("and when refreshing the page", () => {
        beforeAll(async () => {
          await browser.refresh();
        });

        it("[PRPI-9552] the onboarding bottom sheet should still be displayed", async () => {
          await browser.waitUntilDisplayed(
            exchangeOnboardingBottomSheetPO.element,
            "Onboarding bottom sheet is not visible after refresh",
          );

          expect(await browser.execute((key) => localStorage.getItem(key), wasExchangeOnboardingShown)).toBeNull();
        });

        describe("and when clicking on the dismiss button", () => {
          beforeAll(async () => {
            await exchangeOnboardingBottomSheetPO.closeButton.waitForClickable();
            await exchangeOnboardingBottomSheetPO.closeButton.click();
          });

          it("[PRPI-9553] the onboarding bottom sheet should no longer be displayed", async () => {
            await browser.waitUntilNotDisplayed(
              exchangeOnboardingBottomSheetPO.element,
              "Onboarding bottom sheet is still displayed",
            );

            expect(await browser.execute((key) => localStorage.getItem(key), wasExchangeOnboardingShown)).toBe(
              JSON.stringify(true),
            );
          });

          describe("and when refreshing the page again", () => {
            beforeAll(async () => {
              await browser.refresh();
            });

            it("[PRPI-9554] the onboarding bottom sheet should not be displayed", async () => {
              await browser.waitUntilNotDisplayed(
                exchangeOnboardingBottomSheetPO.element,
                "Onboarding bottom sheet is still displayed",
              );

              expect(await browser.execute((key) => localStorage.getItem(key), wasExchangeOnboardingShown)).toBe(
                JSON.stringify(true),
              );
            });
          });
        });
      });
    });

    describe("and when accessing sportsbook", () => {
      beforeAll(async () => {
        await browser.execute(() => localStorage.clear());
        await createMocks({
          initialState: {
            ...INITIAL_STATE,
            defaultProduct: "sportsbook",
          },
        });
      });

      it("[PRPI-9555] the onboarding bottom sheet should be displayed", async () => {
        await browser.waitUntilDisplayed(
          exchangeOnboardingBottomSheetPO.element,
          "Onboarding bottom sheet is not visible",
        );

        expect(await browser.execute((key) => localStorage.getItem(key), wasExchangeOnboardingShown)).toBeNull();
      });

      describe("and when clicking on the explore button", () => {
        beforeAll(async () => {
          await exploreButtonPO.label.waitForClickable();
          await exploreButtonPO.label.click();
        });

        it("[PRPI-9556] the onboarding bottom sheet should no longer be displayed", async () => {
          await browser.waitUntilNotDisplayed(
            exchangeOnboardingBottomSheetPO.element,
            "Onboarding bottom sheet is still displayed",
          );

          expect(await browser.execute((key) => localStorage.getItem(key), wasExchangeOnboardingShown)).toBe(
            JSON.stringify(true),
          );
        });

        describe("and when refreshing the page", () => {
          beforeAll(async () => {
            await browser.refresh();
          });

          it("[PRPI-9557] the onboarding bottom sheet should not be displayed", async () => {
            await browser.waitUntilNotDisplayed(
              exchangeOnboardingBottomSheetPO.element,
              "Onboarding bottom sheet is still displayed",
            );

            expect(await browser.execute((key) => localStorage.getItem(key), wasExchangeOnboardingShown)).toBe(
              JSON.stringify(true),
            );
          });
        });
      });
    });
  });
});
