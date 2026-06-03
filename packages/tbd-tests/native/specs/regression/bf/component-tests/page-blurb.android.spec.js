const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { MarketPromoSO, ActionLinkSO } = require("../../../../screen-objects");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");

const mockService = new MockService();
const marketPromoSO = new MarketPromoSO();
const termsConditionsButtonSO = new ActionLinkSO(marketPromoSO.termsAndConditionsButton);

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

const VIEW_PARTIAL_EDGES = [
  {
    node: {
      __typename: BLURB_CARD.__typename,
      urn: BLURB_CARD.urn,
    },
  },
];

const BFF_MOCK_GENERIC_VIEW = {
  urn: "ppb:tbd:view:generic:home",
  bottomBar: BOTTOM_BAR_PROPERTY,
  edges: [{ node: BLURB_CARD }],
  partialEdges: VIEW_PARTIAL_EDGES,
};

describe("Page Blurb", () => {
  describe("When the homepage has a 'page blurb' with 'expand/collapse' control", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK_GENERIC_VIEW));
      await startApp("home");
      await browser.waitUntilDisplayed(marketPromoSO.element);
      await browser.waitUntilEquals(marketPromoSO.title, BLURB_CARD.blurb.title.name);
    });

    it("[PRPI-2416] and the user clicks on 'collapse chevron' the blurb is collapsed", async () => {
      await marketPromoSO.element.click();
      await browser.waitUntilNotDisplayed(marketPromoSO.description);

      expect(await marketPromoSO.description.isDisplayed()).toBe(false);
    });

    it("[PRPI-2417] and the user clicks 'expand chevron' the blurb is expanded", async () => {
      await marketPromoSO.element.click();
      await browser.waitUntilDisplayed(marketPromoSO.description);

      expect(await marketPromoSO.description.isDisplayed()).toBe(true);
    });

    it("[PRPI-2418] and has the correct navigation text", async () => {
      await browser.waitUntilClickableNative(termsConditionsButtonSO.element, "Link not clickable");

      expect(await termsConditionsButtonSO.text.getText()).toContain("Play Here !!!");
    });
  });
});
