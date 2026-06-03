const { CompetitionPagePO, ScrollableSwimlanePO, HighlightedLinkCardPO } = require("../../../../../page-objects");

const { getCompetitionsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const competitionPagePO = new CompetitionPagePO();
const outrightsSwimlanePO = new ScrollableSwimlanePO(competitionPagePO.scrollableSwimlanes[0]);
const firstCard = new HighlightedLinkCardPO(outrightsSwimlanePO.highlightedLinkCards[0]);
const secondCard = new HighlightedLinkCardPO(outrightsSwimlanePO.highlightedLinkCards[1]);
const thirdCard = new HighlightedLinkCardPO(outrightsSwimlanePO.highlightedLinkCards[2]);

const mockService = new MockService();

const COMPETITION_ID = 2608550;

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:competition:${COMPETITION_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: `ppb:tbd:card:group:topOutrightMarketsByCompetition:${COMPETITION_ID}`,
        cardGroupTitle: "Outright Markets",
        full: {
          edges: [
            {
              node: {
                __typename: "MarketViewLinkCard",
                urn: "ppb:tbd:card:marketViewLink:1.171749809",
                market: {
                  __typename: "ExchangeMarket",
                  name: "Will the Premier League begin by 12th of Sept?",
                  urn: "ppb:excMarket:1.171749809",
                },
                viewLink: {
                  viewUrn: "ppb:tbd:view:market:1.171749809",
                  viewUrl: routes.getMarketViewUrl("1.171749809"),
                },
                badge: "CUP",
              },
            },
            {
              node: {
                __typename: "MarketViewLinkCard",
                urn: "ppb:tbd:card:marketViewLink:1.171809946",
                market: {
                  __typename: "ExchangeMarket",
                  name: "Next Bournemouth Manager",
                  urn: "ppb:excMarket:1.171809946",
                },
                viewLink: {
                  viewUrn: "ppb:tbd:view:market:1.171809946",
                  viewUrl: routes.getMarketViewUrl("1.171809946"),
                },
                badge: "CUP",
              },
            },
            {
              node: {
                __typename: "MarketViewLinkCard",
                urn: "ppb:tbd:card:marketViewLink:1.171816074",
                market: {
                  __typename: "ExchangeMarket",
                  name: "Next Watford Manager",
                  urn: "ppb:excMarket:1.171816074",
                },
                viewLink: {
                  viewUrn: "ppb:tbd:view:market:1.171816074",
                  viewUrl: routes.getMarketWithoutEventViewUrl("1.171816074"),
                },
                badge: "CUP",
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "MarketViewLinkCard",
                urn: "ppb:tbd:card:marketViewLink:1.171749809",
              },
            },
            {
              node: {
                __typename: "MarketViewLinkCard",
                urn: "ppb:tbd:card:marketViewLink:1.171809946",
              },
            },
            {
              node: {
                __typename: "MarketViewLinkCard",
                urn: "ppb:tbd:card:marketViewLink:1.171816074",
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
        urn: `ppb:tbd:card:group:topOutrightMarketsByCompetition:${COMPETITION_ID}`,
      },
    },
  ],
};

describe("Outrights and Specials markets swimlane", () => {
  describe("When the user is on competition page and there are Outrights and Specials markets available", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
      await mockService.mockHttpRequest(getCompetitionsLayout(BFF_VIEW_MOCK));
      await browser.url(routes.getCompetitionViewUrl(COMPETITION_ID));
      await browser.waitUntilDisplayed(outrightsSwimlanePO.element);
      await browser.waitUntilDisplayed(firstCard.element);
    });

    it("[PRPI-6267] the swimlane for\xA0Outrights and Specials markets should be displayed", async () => {
      expect(await outrightsSwimlanePO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-6268] the swimlane for\xA0Outrights and Specials markets should have a title:'Outright Markets'", async () => {
      expect(await outrightsSwimlanePO.title.getText()).toBe("Outright Markets");
    });

    it("[PRPI-6269] the swimlane for\xA0Outrights and Specials markets should display 3 cards", async () => {
      expect(await outrightsSwimlanePO.highlightedLinkCards.length).toBe(3);
    });

    it("[PRPI-6270] the 1st and the 2nd cards should be displayed on viewport", async () => {
      expect(await firstCard.element.isDisplayedInViewport()).toBe(true);
      expect(await secondCard.element.isDisplayedInViewport()).toBe(true);
      expect(await thirdCard.element.isDisplayedInViewport()).toBe(false);
    });

    it("[PRPI-6271] the 1st card should display an icon", async () => {
      expect(await firstCard.icon.isDisplayed()).toBe(true);
    });

    it("[PRPI-6272] the 1st card should display the market name:'Will the Premier League begin by 12th of Sept?'", async () => {
      expect(await firstCard.label.getText()).toBe("Will the Premier League begin by 12th of Sept?");
    });

    it("[PRPI-6273] the 1st card\xA0should have a link to the market page:'market:1.171749809'", async () => {
      expect(await firstCard.element.getAttribute("href")).toContain(routes.getMarketViewUrl("1.171749809"));
    });

    it("[PRPI-6274] the 1st card\xA0should display an arrow", async () => {
      expect(await firstCard.arrow.isDisplayed()).toBe(true);
    });

    it("[PRPI-6275] the 3rd card\xA0should have a link to the market page without event name:'market:1.171816074'", async () => {
      expect(await thirdCard.element.getAttribute("href")).toContain(
        routes.getMarketWithoutEventViewUrl("1.171816074"),
      );
    });
  });
});
