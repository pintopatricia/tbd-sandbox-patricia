const { HeaderPO, BottomBarPO } = require("../../../../../page-objects");
const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const mockService = new MockService();
const headerPO = new HeaderPO();
const bottomBarPO = new BottomBarPO();

const BOTTOM_BAR = {
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
        viewUrl: "browse/browse:sports",
      },
    },
    {
      tileType: "MY_BETS",
      viewLink: {
        viewUrn: "ppb:tbd:view:myBets:open",
        viewUrl: routes.getMyBetsViewUrl("open"),
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
};

const BFF_HOME_VIEW_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  edges: [],
  bottomBar: BOTTOM_BAR,
};

describe("Product Redirect", () => {
  describe("When user enters on homepage and have sportsbook on products", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_HOME_VIEW_MOCK.urn, {
          products: ["sportsbook"],
          PRODUCT_SWITCHER: { isActive: true },
        }),
      );
      await mockService.mockHttpRequest(getGenericLayout(BFF_HOME_VIEW_MOCK));
      await browser.url(routes.getHomeViewUrl());
      await browser.waitUntilDisplayed(await headerPO.element);
      await browser.waitUntilDisplayed(await bottomBarPO.element);
    });

    it("[PRPI-7459] The xsell button should display Exchange", async () => {
      expect(await bottomBarPO.tiles[4].getText()).toBe("Exchange");
    });
  });

  describe("When user enters on homepage and have exchange on products", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_HOME_VIEW_MOCK.urn, {
          products: ["exchange"],
          PRODUCT_SWITCHER: { isActive: true },
        }),
      );
      await mockService.mockHttpRequest(getGenericLayout(BFF_HOME_VIEW_MOCK));
      await browser.url(routes.getHomeViewUrl());
      await browser.waitUntilDisplayed(await headerPO.element);
      await browser.waitUntilDisplayed(await bottomBarPO.element);
    });

    it("[PRPI-7460] The xsell button should display Sportsbook", async () => {
      expect(await bottomBarPO.tiles[4].getText()).toBe("Sportsbook");
    });
  });
});
