const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { BottomBarPO, PredictsPO } = require("../../../../../page-objects");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");
const { setCookie } = require("../../../../../helpers/cookie.util");

const bottomBarPO = new BottomBarPO();
const predictsPO = new PredictsPO();
const mockService = new MockService();

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

const createMocks = async ({ cookies = [], initialState = {} } = {}) => {
  const url = routes.getHomeViewUrl();

  await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
  await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, initialState));
  await browser.url(url);

  await browser.deleteCookies(["phoenixEnabled"]);
  await browser.execute(() => localStorage.setItem("wasExchangeOnboardingShown", "true"));

  if (cookies.length) {
    await Promise.all(cookies.map(async (cookie) => setCookie(cookie.name, cookie.value)));
  }

  await browser.refresh();

  await browser.waitUntilDisplayed(bottomBarPO.element, "Bottom bar was not displayed");
};

describe("Predicts - X-Sell Button - Product Switcher", () => {
  describe("when the user is logged out", () => {
    describe("and the ENABLE_PREDICTS throttle is ON", () => {
      describe("and the exchangeDefaultMode preference is PREDICTS", () => {
        beforeAll(async () => {
          await createMocks({
            initialState: {
              ENABLE_PREDICTS: { isActive: true },
              PRODUCT_SWITCHER: { isActive: true },
              products: ["sportsbook", "games"],
              exchangeDefaultMode: "PREDICTS",
              loggedIn: "false",
            },
          });

          await bottomBarPO.productSwitcherTile.waitForDisplayed();
        });

        it("[PRPI-12727]should display the Predicts product switcher button", async () => {
          expect(await bottomBarPO.productSwitcherTile.isDisplayed()).toBe(true);
        });

        it("[PRPI-12728]should show 'Predicts' as the product switcher title", async () => {
          expect(await bottomBarPO.productSwitcherTitle.getText()).toBe("Predicts");
        });

        describe("and when clicking on the Predicts product switcher button", () => {
          beforeAll(async () => {
            await bottomBarPO.productSwitcherTile.waitForClickable();
            await bottomBarPO.productSwitcherTile.click();
          });

          it("[PRPI-12729]should open the Predicts loading screen", async () => {
            await predictsPO.loadingScreen.waitForDisplayed({
              timeoutMsg: "Predicts loading screen did not open",
            });
          });
        });
      });

      describe("and the exchangeDefaultMode preference is DEFAULT", () => {
        beforeAll(async () => {
          await createMocks({
            initialState: {
              ENABLE_PREDICTS: { isActive: true },
              PRODUCT_SWITCHER: { isActive: true },
              products: ["sportsbook", "games"],
              exchangeDefaultMode: "DEFAULT",
              loggedIn: "false",
            },
          });
        });

        it("[PRPI-12730]should show 'Exchange' as the product switcher title", async () => {
          expect(await bottomBarPO.productSwitcherTitle.getText()).toBe("Exchange");
        });
      });
    });

    describe("and the ENABLE_PREDICTS throttle is OFF", () => {
      beforeAll(async () => {
        await createMocks({
          initialState: {
            ENABLE_PREDICTS: { isActive: false },
            PRODUCT_SWITCHER: { isActive: true },
            products: ["sportsbook", "games"],
            exchangeDefaultMode: "predicts",
            loggedIn: "false",
          },
        });
      });

      it("[PRPI-12731]should show 'Exchange' as the product switcher title", async () => {
        expect(await bottomBarPO.productSwitcherTitle.getText()).toBe("Exchange");
      });
    });
  });

  describe("when the user is logged in with Phoenix exchange access", () => {
    beforeAll(async () => {
      await createMocks({
        initialState: {
          canUsePhoenixExchange: true,
          ENABLE_PREDICTS: { isActive: true },
          PRODUCT_SWITCHER: { isActive: true },
          products: ["sportsbook", "games"],
          exchangeDefaultMode: "predicts",
          loggedIn: "true",
        },
      });
    });

    it("[PRPI-12732]should show 'Exchange' as the product switcher title", async () => {
      expect(await bottomBarPO.productSwitcherTitle.getText()).toBe("Exchange");
    });
  });
});
