const {
  getMyBetsLayout,
  getEventLayout,
  getBrowseLayout,
  getSportsLayout,
  getHomeLayoutWithViewLink,
  getCardResults,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const {
  GenericScreenSO,
  BrowseScreenSO,
  CardSO,
  PageHeaderSO,
  MyBetsHeaderSO,
  HeaderSO,
} = require("../../../../screen-objects");

const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp, openUrl } = require("../../../../helpers/urls");
const { getStartViewLinks } = require("../../../../helpers/view-link-start");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const browseScreenSO = new BrowseScreenSO();
const myBetsHeaderSO = new MyBetsHeaderSO();
const cardSO = new CardSO();
const headerSO = new HeaderSO();
const pageHeaderSO = new PageHeaderSO();

const EVENT_ID = "29682729";
const MARKET_ID = "1.160337355";

const BFF_MY_BETS_MOCK = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  filters: {
    orderType: {
      items: ["OPEN", "SETTLED"],
      defaultIndex: 0,
    },
    productType: {
      items: ["EXCHANGE", "SPORTSBOOK"],
      defaultIndex: 0,
    },
  },
  edges: [],
};

const BFF_BROWSE_MOCK = {
  __typename: "BrowseView",
  urn: "ppb:tbd:view:browse:sports",
  url: "browse/b-sports",
  edges: [
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:group:azmenu-quicklinks/cv/browse",
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
        ],
      },
    },
  ],
};

const BFF_MOCK_FOOTBALL = {
  urn: `ppb:tbd:view:sport:1`,
  title: "Sport page, well, kind off",
  edges: [],
  partialEdges: [],
};

const BFF_BROWSE_GAMING_MOCK = {
  urn: "ppb:tbd:view:browse:gaming",
  url: "/browse/browse:gaming",
  edges: [
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:azMenu:gaming",
        quickLinksTitle: null,
        links: [],
      },
    },
  ],
};

const BFF_EVENT_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223##MATCH_ODDS",
        typename: "MarketCard",
        cardTitle: "Match Odds",
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: `ppb:excMarket:${MARKET_ID}`,
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  name: "Wolves",
                  runnerURN: `ppb:excRunner:${MARKET_ID}/48044/0`,
                  selectionId: 48044,
                },
              ],
            },
            runners: [
              {
                runnerURN: `ppb:excRunner:${MARKET_ID}/48044/0`,
              },
            ],
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223##MATCH_ODDS",
        __typename: "MarketCard",
      },
    },
  ],
};

describe("Navigation - Deep linking", () => {
  // DETALHE: FICA COM UMA SCREEN DIFERENTE; PORQUE FICA LA COM OS LINKS
  const urls = ["football/s-1", "sport/competition/event/e-29682729", "browse/b-sports", "mybets/mybets-open"];
  const HOME_VIEW_LINKS = getStartViewLinks(urls);
  beforeAll(async () => {
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINKS));
  });
  describe("When an event view is opened with a deep link", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK_FOOTBALL));

      // Open random page to add a navigation stack
      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINKS });

      await browser.waitUntilEquals(pageHeaderSO.pageHeaderTitle, "Sport page, well, kind off");

      // Start the actual test
      await mockService.mockHttpRequest(getEventLayout(BFF_EVENT_MOCK));

      await openUrl(urls[1], { isViewLinkStartPage: !!HOME_VIEW_LINKS, nthViewLink: 1 });

      await browser.waitUntilDisplayed(genericScreenSO.element);
      await browser.waitUntilEquals(cardSO.title, "Match Odds");
    });

    it("[PRPI-2872] The event view should be rendered", async () => {
      expect(await cardSO.title.getText()).toBe("Match Odds");
    });

    it("[PRPI-2873] The back button should be displayed", async () => {
      expect(await headerSO.backButton.isDisplayed()).toBe(true);
    });
  });

  describe("When the Browse Screen is opened with a deep link", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getBrowseLayout(BFF_BROWSE_MOCK));
      await mockService.mockHttpRequest(getBrowseLayout(BFF_BROWSE_GAMING_MOCK));

      await openUrl(urls[2], { isViewLinkStartPage: !!HOME_VIEW_LINKS, nthViewLink: 2 });

      await browser.waitUntilEquals(browseScreenSO.title, "Browse");
    });

    it("[PRPI-2874] The Browse Screen should be rendered", async () => {
      expect(await browseScreenSO.title.getText()).toBe("Browse");
    });

    it("[PRPI-2875] The back button should not be displayed", async () => {
      expect(await headerSO.backButton.isDisplayed()).toBe(false);
    });
  });

  describe("When the My Bets Screen is opened with a deep link", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK));
      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));

      await openUrl(urls[3], { isViewLinkStartPage: !!HOME_VIEW_LINKS, nthViewLink: 3 });

      await browser.waitUntilEquals(myBetsHeaderSO.title, "My Bets");
    });

    it("[PRPI-2876] The My Bets Screen should be rendered", async () => {
      expect(await myBetsHeaderSO.title.getText()).toContain("My Bets");
    });

    it("[PRPI-2877] The back button should not be displayed", async () => {
      expect(await headerSO.backButton.isDisplayed()).toBe(false);
    });
  });
});
