const { BottomSheetPO } = require("../../../../../page-objects");
const { getGenericLayout, getGamingLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");
const { setCookie } = require("../../../../../helpers/cookie.util");

const bottomSheetPO = new BottomSheetPO();
const mockService = new MockService();

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

const BFF_GAMING_MOCK = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
  edges: [],
  partialEdges: [],
};

const INITIAL_STATE = {
  canUsePhoenixExchange: true,
  EXC_ALLOWED_JURISDICTION: { isActive: true },
  PRODUCT_SWITCHER: { isActive: true },
  defaultProduct: "exchange",
  loggedIn: "true",
  products: ["exchange", "sportsbook"],
};

const createMocks = async ({ cookies = [], initialState = {}, gamingView = false } = {}) => {
  if (gamingView) {
    await mockService.mockHttpRequest(getGamingLayout(BFF_GAMING_MOCK));
    await mockService.mockHttpRequest(await getIndexHTML(BFF_GAMING_MOCK.urn, initialState));
  } else {
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, initialState));
  }

  await browser.url(routes.getHomeViewUrl());

  await browser.deleteCookies(["phoenixEnabled"]);
  await browser.execute(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
  if (cookies.length) {
    await Promise.all(cookies.map(async (cookie) => setCookie(cookie.name, cookie.value)));
  }
  await browser.refresh();
};

describe("Exchange - Onboarding Bottom Sheet - Availability", () => {
  describe("when the user is logged in", () => {
    describe("and the account creation date is after 31 December 2026", () => {
      describe("and the EXC_ALLOWED_JURISDICTION throttle is OFF", () => {
        beforeAll(async () => {
          await createMocks({
            initialState: {
              ...INITIAL_STATE,
              canUsePhoenixExchange: "false",
              EXC_ALLOWED_JURISDICTION: { isActive: false },
              defaultProduct: "sportsbook",
            },
          });
        });

        it("[PRPI-12633]the onboarding bottom sheet should not be displayed", async () => {
          await browser.waitUntilNotDisplayed(bottomSheetPO.element, "Onboarding bottom sheet is still displayed");
        });
      });

      describe("and the EXC_ALLOWED_JURISDICTION throttle is ON", () => {
        describe("and when accessing exchange", () => {
          beforeAll(async () => {
            await createMocks({
              initialState: INITIAL_STATE,
            });
          });

          it("[PRPI-12634]the onboarding bottom sheet should be displayed", async () => {
            await browser.waitUntilDisplayed(bottomSheetPO.element, "Onboarding bottom sheet is not visible");
          });
        });

        describe("and when accessing sportsbook", () => {
          beforeAll(async () => {
            await createMocks({
              initialState: {
                ...INITIAL_STATE,
                defaultProduct: "sportsbook",
              },
            });
          });

          it("[PRPI-12635]the onboarding bottom sheet should be displayed", async () => {
            await browser.waitUntilDisplayed(bottomSheetPO.element, "Onboarding bottom sheet is not visible");
          });
        });

        describe("and when accessing gaming", () => {
          beforeAll(async () => {
            await createMocks({
              initialState: INITIAL_STATE,
              gamingView: true,
            });
          });

          it("[PRPI-12636]the onboarding bottom sheet should not be displayed", async () => {
            await browser.waitUntilNotDisplayed(bottomSheetPO.element, "Onboarding bottom sheet is still displayed");
          });
        });
      });
    });

    describe("and the user is not EXC eligible", () => {
      describe("and the account creation date is before 31 December 2026", () => {
        beforeAll(async () => {
          await createMocks({
            initialState: {
              ...INITIAL_STATE,
              canUsePhoenixExchange: "false",
            },
          });
        });

        it("[PRPI-12637]the onboarding bottom sheet should not be displayed", async () => {
          await browser.waitUntilNotDisplayed(bottomSheetPO.element, "Onboarding bottom sheet is still displayed");
        });
      });
    });
  });

  describe("when the user is logged out", () => {
    beforeAll(async () => {
      await createMocks({
        initialState: {
          ...INITIAL_STATE,
          loggedIn: "false",
        },
        cookies: [{ name: "phoenixEnabled", value: "true" }],
      });
    });

    it("[PRPI-9562] the onboarding bottom sheet should not be displayed", async () => {
      await browser.waitUntilNotDisplayed(bottomSheetPO.element, "Onboarding bottom sheet is still displayed");
    });
  });
});
