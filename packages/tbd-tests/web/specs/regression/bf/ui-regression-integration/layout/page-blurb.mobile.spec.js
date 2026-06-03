const { MarketPromoPO } = require("../../../../../page-objects");
const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();
const marketPromoPO = new MarketPromoPO();

const BOTTOM_BAR_PROPERTY = {
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
        viewUrl: "mybets/myBets-open",
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
};

const VIEW_PARTIAL_EDGES = [
  {
    node: {
      __typename: "BlurbCard",
      urn: "ppb:tbd:card:blurb:Z-1uQRAAAB8AZ8lB/s/1",
    },
  },
];

const BLURB_LINK = "https://casino.betfair.com/c/daily-jackpot";

const BLURB_CARD = {
  __typename: "BlurbCard",
  urn: "ppb:tbd:card:blurb:Z-1uQRAAAB8AZ8lB/s/1",
  blurb: {
    isCollapsed: false,
    title: { name: "Take a shot at the Daily Jackpot" },
    description: {
      name: "The Daily Jackpots are progressive jackpots that can occur on any eligible slot at any time between 8-11 pm.",
    },
    supplementaryInfo: {
      label: { name: "Play Here !!!" },
      viewLink: { viewUrl: BLURB_LINK },
    },
  },
};

const BFF_MOCK_GENERIC_VIEW = {
  urn: "ppb:tbd:view:generic:home",
  bottomBar: BOTTOM_BAR_PROPERTY,
  edges: [{ node: BLURB_CARD }],
  partialEdges: VIEW_PARTIAL_EDGES,
};

describe("Page Blurb", () => {
  describe("When the homepage has a 'page blurb' with 'expand/collapse' control", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK_GENERIC_VIEW.urn));
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK_GENERIC_VIEW));
      await browser.url(routes.getGenericViewUrl("home"));
      await browser.waitUntilDisplayed(marketPromoPO.element);
    });

    it("[PRPI-5185] and the user clicks on 'collapse chevron' the blurb is collapsed", async () => {
      await marketPromoPO.element.click();

      expect(await marketPromoPO.description.isDisplayed()).toBe(false);
    });

    it("[PRPI-5186] and the user clicks 'expand chevron' the blurb is expanded", async () => {
      await marketPromoPO.element.click();

      expect(await marketPromoPO.description.isDisplayed()).toBe(true);
    });

    it("[PRPI-5187] and the user clicks on blurb link it opens on a new tab", async () => {
      await marketPromoPO.termsButtonPromoContainer.click();
      await browser.switchWindow(BLURB_LINK);

      expect(await browser.getUrl()).toContain(BLURB_LINK);
    });
  });
});
