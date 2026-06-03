const {
  SportPagePO,
  ScrollableSwimlanePO,
  SportsbookBetButtonPO,
  HighlightedSelectionCardPO,
} = require("../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;

const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();

const sportPagePO = new SportPagePO();
const oddsboostSwimlanePO = new ScrollableSwimlanePO(sportPagePO.scrollableSwimlanes[0]);
const oddsboostCard = new HighlightedSelectionCardPO(oddsboostSwimlanePO.highlightedSelectionCards[0]);
const oddsboostBetButtonPO = new SportsbookBetButtonPO(oddsboostCard.sportsbookBetButton);

const EVENT_TYPE_ID = 1;

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:1",
        cardGroupTitle: "Oddsboost",
        titleImage: "ODDSBOOST",
        full: {
          edges: [
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:924.1/1",
                title: "All teams to score in the UEFA Champions League (in 90 mins)",
                market: {
                  __typename: "SportsbookMarket",
                  urn: "ppb:sbkMarket:924.1",
                  name: "Friday Featured OddsBoosts",
                  marketType: "DAILY_POWER_PRICES",
                  hierarchy: {
                    __typename: "EventHierarchy",
                    sportevent: {
                      urn: `ppb:event:12345`,
                    },
                  },
                  runners: [
                    {
                      runnerURN: "ppb:sbkRunner:924.1/1",
                      selectionId: 1,
                    },
                  ],

                  isOddsboostMarketType: true,
                },
                runner: {
                  runnerURN: "ppb:sbkRunner:924.1/1",
                },
                displayPreviousOdd: true,
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:924.1/1",
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
        urn: "ppb:tbd:cardgroup:swimlane:1",
      },
    },
  ],
};

const SMP_MOCK_OPEN = {
  markets: [
    {
      marketId: "924.1",
      marketStatus: "OPEN",
      runnerDetails: [
        {
          selectionId: "1",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 1.1 },
            },
          ],
        },
      ],
    },
  ],
};

const SMP_MOCK_CLOSED = {
  markets: [{ marketId: "924.1", noMarketInfo: true }],
};

const MODULE_NAME = "oddsboost_closed_market";

describe("Oddsboost closed market", () => {
  describe("When the user is on sports view and there is a football Oddsboost market closed", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_OPEN));
      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
      await browser.waitUntilDisplayed(oddsboostBetButtonPO.element);
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_CLOSED));
      await browser.tickFakeClock();
      await browser.waitUntilContainsClass(oddsboostCard.element, HighlightedSelectionCardPO.states.closed);
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1490]_the_oddsboost_card_should_be_disabled`);
    });

    it("[PRPI-1490]_the_oddsboost_card_should_be_disabled", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1490]_the_oddsboost_card_should_be_disabled`)).toEqual(0);
    });
  });
});
