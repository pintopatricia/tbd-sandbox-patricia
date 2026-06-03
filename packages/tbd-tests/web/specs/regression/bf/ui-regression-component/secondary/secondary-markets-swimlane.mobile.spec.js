const { EventPagePO, ScrollableSwimlanePO, HighlightedLinkCardPO } = require("../../../../../page-objects");
const { getEventLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const eventPagePO = new EventPagePO();

const scrollableSwimlanePO = new ScrollableSwimlanePO(eventPagePO.scrollableSwimlanes[0]);
const firstSwimlaneFirstHighlightedLinkCardPO = new HighlightedLinkCardPO(scrollableSwimlanePO.highlightedLinkCards[0]);
const secondSwimlanePO = new ScrollableSwimlanePO(eventPagePO.scrollableSwimlanes[1]);
const secondSwimlaneFirstHighlightedLinkCardPO = new HighlightedLinkCardPO(secondSwimlanePO.highlightedLinkCards[0]);

const mockService = new MockService();

const EVENT_ID = "12345678";

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {},
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:goalscorerMarkets:1",
        cardGroupTitle: "Goalscorer Markets",
        partials: {
          edges: [
            {
              node: {
                __typename: "MarketViewLinkCard",
                urn: "ppb:tbd:card:marketViewLink:924.11111",
              },
            },
            {
              node: {
                __typename: "MarketViewLinkCard",
                urn: "ppb:tbd:card:marketViewLink:924.22222",
              },
            },
            {
              node: {
                __typename: "MarketViewLinkCard",
                urn: "ppb:tbd:card:marketViewLink:1.33333",
              },
            },
            {
              node: {
                __typename: "MarketViewLinkCard",
                urn: "ppb:tbd:card:marketViewLink:924.44444",
              },
            },
            {
              node: {
                __typename: "MarketViewLinkCard",
                urn: "ppb:tbd:card:marketViewLink:924.55555",
              },
            },
            {
              node: {
                __typename: "MarketViewLinkCard",
                urn: "ppb:tbd:card:marketViewLink:924.66666",
              },
            },
            {
              node: {
                __typename: "MarketViewLinkCard",
                urn: "ppb:tbd:card:marketViewLink:924.77777",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "MarketViewLinkCard",
                urn: "ppb:tbd:card:marketViewLink:924.11111",
                viewLink: {
                  viewUrn: "ppb:tbd:views:marketview:924.11111",
                  viewUrl: routes.getMarketViewUrl("924.11111"),
                },
                market: {
                  __typename: "SportsbookMarket",
                  name: "SBK Goalscorer Market I",
                  urn: "ppb:tbd:entities:sportsbookmarkets:924.11111",
                },
              },
            },
            {
              node: {
                __typename: "MarketViewLinkCard",
                urn: "ppb:tbd:card:marketViewLink:924.22222",
                viewLink: {},
                market: {
                  __typename: "SportsbookMarket",
                  name: "SBK Goalscorer Market II",
                  urn: "ppb:tbd:entities:sportsbookmarkets:924.22222",
                },
              },
            },
            {
              node: {
                __typename: "MarketViewLinkCard",
                urn: "ppb:tbd:card:marketViewLink:1.33333",
                viewLink: {},
                market: {
                  __typename: "ExchangeMarket",
                  name: "EXC Goalscorer Market III",
                  urn: "ppb:tbd:entities:exchangemarkets:1.33333",
                },
              },
            },
            {
              node: {
                __typename: "MarketViewLinkCard",
                urn: "ppb:tbd:card:marketViewLink:924.44444",
                viewLink: {},
                market: {
                  __typename: "SportsbookMarket",
                  name: "SBK Goalscorer Market IV",
                  urn: "ppb:tbd:entities:sportsbookmarkets:924.44444",
                },
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:halfTimeMarkets:2",
        cardGroupTitle: "First Half Goals",
        partials: {
          edges: [
            {
              node: {
                __typename: "MarketViewLinkCard",
                urn: "ppb:tbd:card:marketViewLink:1.00000",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "MarketViewLinkCard",
                urn: "ppb:tbd:card:marketViewLink:1.00000",
                market: {
                  __typename: "ExchangeMarket",
                  name: "First Half Exchange Market",
                  urn: "ppb:tbd:entities:exchangemarkets:1.00000",
                },
              },
            },
          ],
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:goalscorerMarkets:1",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:halfTimeMarkets:2",
      },
    },
  ],
};

const FETCH_MORE_CARDS_MOCK = {
  cards: [
    {
      __typename: "MarketViewLinkCard",
      urn: "ppb:tbd:card:marketViewLink:924.55555",
      market: {
        __typename: "SportsbookMarket",
        name: "Goalscorer Sportsbook Market V",
        urn: "ppb:tbd:entities:sportsbookmarkets:924.55555",
      },
    },
    {
      __typename: "MarketViewLinkCard",
      urn: "ppb:tbd:card:marketViewLink:924.66666",
      market: {
        __typename: "SportsbookMarket",
        name: "Goalscorer Sportsbook Market VI",
        urn: "ppb:tbd:entities:sportsbookmarkets:924.66666",
      },
    },
    {
      __typename: "MarketViewLinkCard",
      urn: "ppb:tbd:card:marketViewLink:924.77777",
      market: {
        __typename: "SportsbookMarket",
        name: "Goalscorer Sportsbook Market VII",
        urn: "ppb:tbd:entities:sportsbookmarkets:924.77777",
      },
    },
  ],
};

describe("Given I am on a Football Event Page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
    await mockService.mockHttpRequest(getEventLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getCardResults(FETCH_MORE_CARDS_MOCK));
    await browser.url(routes.getEventViewUrl(EVENT_ID));
    await browser.waitUntilEquals(scrollableSwimlanePO.title, "Goalscorer Markets");
    await browser.waitUntilDisplayed(firstSwimlaneFirstHighlightedLinkCardPO.element);
    await browser.waitUntilDisplayed(secondSwimlaneFirstHighlightedLinkCardPO.element);
  });

  it("[PRPI-7523] Then I should see a first secondary market swimlane with 'Goalscorer Markets' title", async () => {
    expect(await scrollableSwimlanePO.title.getText()).toBe("Goalscorer Markets");
  });

  it("[PRPI-7524] And I should see a Secondary Market Card", async () => {
    expect(await firstSwimlaneFirstHighlightedLinkCardPO.element.isDisplayed()).toBe(true);
  });

  it("[PRPI-7525] And that card should have the label 'SBK Goalscorer Market I'", async () => {
    expect(await firstSwimlaneFirstHighlightedLinkCardPO.label.getText()).toBe("SBK Goalscorer Market I");
  });

  it("[PRPI-7526] And that card should be link to the market", async () => {
    expect(await firstSwimlaneFirstHighlightedLinkCardPO.element.getAttribute("href")).toContain(
      routes.getMarketViewUrl("924.11111"),
    );
  });

  it("[PRPI-7527] Then I should see the second market secondary swimlane with 'First Half Goals' title", async () => {
    expect(await secondSwimlanePO.title.getText()).toBe("First Half Goals");
  });

  it("[PRPI-7528] And I should see a swimlane with one market card", async () => {
    expect(await secondSwimlanePO.highlightedLinkCards.length).toBe(1);
  });

  it("[PRPI-8379] And I should see a second Secondary Market Card", async () => {
    expect(await secondSwimlaneFirstHighlightedLinkCardPO.element.isDisplayed()).toBe(true);
  });

  it("[PRPI-7529] And that card should have the label 'Half-time Exchange Market'", async () => {
    expect(await secondSwimlaneFirstHighlightedLinkCardPO.label.getText()).toBe("First Half Exchange Market");
  });

  describe("When the user scrolls to the last card", () => {
    beforeAll(async () => {
      // scroll with behavior smooth so useLazyLoading triggers the request for next 4 items
      await scrollableSwimlanePO.scrollItems[5].scrollIntoView({ behavior: "smooth", inline: "start" });
      await browser.waitUntilInViewport(scrollableSwimlanePO.scrollItems[6], "7th element not in viewport");
    });

    it("[PRPI-7530] Then I should see a total of 7 viewLinkCards on that swimlane", async () => {
      expect(await scrollableSwimlanePO.scrollItems.length).toBe(7);
    });

    it("[PRPI-7531] Then I should see the sixth and seventh cards (info not fetched by the scroll)", async () => {
      expect(await scrollableSwimlanePO.scrollItems[5].isDisplayedInViewport()).toBe(true);
      expect(await scrollableSwimlanePO.scrollItems[6].isDisplayedInViewport()).toBe(true);
    });
  });
});
