const {
  HighlightedSelectionCardPO,
  SportPagePO,
  ScrollableSwimlanePO,
  SportsbookBetButtonPO,
} = require("../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;

const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const { getCustomerBehaviourService } = require("../../../../mock-essentials/controllers/cbs/cbs-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();

const sportPagePO = new SportPagePO();
const oddsOnThatSwimlanePO = new ScrollableSwimlanePO(sportPagePO.scrollableSwimlanes[0]);
const oddsOnThatFirstCard = new HighlightedSelectionCardPO(oddsOnThatSwimlanePO.scrollItems[0]);
const oddsOnThatFirstCardBetButtonPO = new SportsbookBetButtonPO(oddsOnThatFirstCard.button);

const EVENT_TYPE_ID = 1;

const BFF_VIEW_MOCK_ONE_CARD_SWIMLANE = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:1",
        cardGroupTitle: "OddsOnThat",
        full: {
          edges: [
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:924.1/1",
                title: "Any uncapped player to start Stephen Kenny first game in charge",
                market: {
                  __typename: "SportsbookMarket",
                  urn: "ppb:sbkMarket:924.1",
                  name: "Stephen Kenny Ireland Specials",
                  marketType: "PRE_MATCH_COMBO_-_FEATURED",
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

                  isOddsboostMarketType: false,
                },
                runner: {
                  runnerURN: "ppb:sbkRunner:924.1/1",
                },
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

const BFF_VIEW_MOCK_TWO_CARD_SWIMLANE = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:1",
        cardGroupTitle: "OddsOnThat",
        full: {
          edges: [
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:924.2/2",
                title: "Any uncapped player to start Stephen Kenny first game in charge",
                market: {
                  __typename: "SportsbookMarket",
                  urn: "ppb:sbkMarket:924.2",
                  name: "Stephen Kenny Ireland Specials",
                  marketType: "PRE_MATCH_COMBO_-_FEATURED",
                  hierarchy: {
                    __typename: "EventHierarchy",
                    sportevent: {
                      urn: `ppb:event:12345`,
                    },
                  },
                  runners: [
                    {
                      runnerURN: "ppb:sbkRunner:924.2/2",
                      selectionId: 2,
                    },
                  ],

                  isOddsboostMarketType: false,
                },
                runner: {
                  runnerURN: "ppb:sbkRunner:924.2/2",
                },
              },
            },
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:924.3/3",
                title: "To manage an English professional club before December 31st 2022",
                market: {
                  __typename: "SportsbookMarket",
                  urn: "ppb:sbkMarket:924.3",
                  name: "Stephen Kenny Ireland Specials",
                  marketType: "PRE_MATCH_COMBO_-_FEATURED",
                  hierarchy: {
                    __typename: "EventHierarchy",
                    sportevent: {
                      urn: `ppb:event:12345`,
                    },
                  },
                  runners: [
                    {
                      runnerURN: "ppb:sbkRunner:924.3/3",
                      selectionId: 3,
                    },
                  ],

                  isOddsboostMarketType: false,
                },
                runner: {
                  runnerURN: "ppb:sbkRunner:924.3/3",
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:924.2/2",
              },
            },
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:924.3/3",
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
        title: "OddsOnThat",
      },
    },
  ],
};

const SMP_MOCK_ONE_CARD_SWIMLANE = {
  markets: [
    {
      marketId: "924.1",
      runnerDetails: [
        {
          selectionId: "1",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
          },
        },
      ],
    },
  ],
};

const SMP_MOCK_TWO_CARD_SWIMLANE = {
  markets: [
    {
      marketId: "924.2",
      runnerDetails: [
        {
          selectionId: "2",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
          },
        },
      ],
    },
    {
      marketId: "924.3",
      runnerDetails: [
        {
          selectionId: "3",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
          },
        },
      ],
    },
  ],
};

const MODULE_NAME = "oddsonthat-swimlane";

describe("OddsOnThat markets swimlane", () => {
  describe("When the user is on sports view and there is only one market available for OddsOnThat", () => {
    beforeAll(async () => {
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_VIEW_MOCK_ONE_CARD_SWIMLANE.urn, { disableCSSAnimations: true }),
      );
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK_ONE_CARD_SWIMLANE));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_ONE_CARD_SWIMLANE));
      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));

      await browser.waitUntilDisplayed(oddsOnThatFirstCardBetButtonPO.odd);
      await browser.waitUntilEquals(oddsOnThatSwimlanePO.title, "OddsOnThat");
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1488]_the_card_should_fit_the_swimlane_width`);
    });

    it("[PRPI-1488]_the_card_should_fit_the_swimlane_width", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1488]_the_card_should_fit_the_swimlane_width`)).toEqual(0);
    });
  });

  describe("When the user is on sports view and there are more than one market available for OddsOnThat", () => {
    beforeAll(async () => {
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_VIEW_MOCK_TWO_CARD_SWIMLANE.urn, { disableCSSAnimations: true }),
      );
      await mockService.mockHttpRequest(getCustomerBehaviourService());
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK_TWO_CARD_SWIMLANE));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_TWO_CARD_SWIMLANE));
      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
      await browser.waitUntilEquals(oddsOnThatSwimlanePO.title, "OddsOnThat");
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1489]_the_1st_and_2nd_oddsonthat_cards_should_be_displayed_in_viewport`,
      );
    });

    it("[PRPI-1489]_the_1st_and_2nd_oddsonthat_cards_should_be_displayed_in_viewport", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1489]_the_1st_and_2nd_oddsonthat_cards_should_be_displayed_in_viewport`,
        ),
      ).toEqual(0);
    });
  });
});
