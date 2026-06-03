const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();

const EVENT_TYPE_ID = 1;

const BFF_VIEW_MOCK_ONE_CARD_SWIMLANE = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:1",
        cardGroupTitle: "Oddsboost",
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

const BFF_VIEW_MOCK_TWO_CARD_SWIMLANE = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:1",
        cardGroupTitle: "Oddsboost",
        full: {
          edges: [
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:924.2/2",
                title: "All teams to score in the UEFA Champions League (in 90 mins)",
                market: {
                  __typename: "SportsbookMarket",
                  urn: "ppb:sbkMarket:924.2",
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
                      runnerURN: "ppb:sbkRunner:924.2/2",
                      selectionId: 2,
                    },
                  ],

                  isOddsboostMarketType: true,
                },
                runner: {
                  runnerURN: "ppb:sbkRunner:924.2/2",
                },
                displayPreviousOdd: true,
              },
            },
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:924.3/3",
                title: "SMR - Zenit to beat Rotor Volograd",
                market: {
                  __typename: "SportsbookMarket",
                  urn: "ppb:sbkMarket:924.3",
                  name: "Daily OddsBoost",
                  marketType: "DAILY_POWER_PRICES",
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

                  isOddsboostMarketType: true,
                },
                runner: {
                  runnerURN: "ppb:sbkRunner:924.3/3",
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
      },
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
            decimalDisplayOdds: { decimalOdds: 1.3 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 1.2 },
            },
          ],
        },
      ],
    },
    {
      marketId: "924.3",
      runnerDetails: [
        {
          selectionId: "3",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.4 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 1.3 },
            },
          ],
        },
      ],
    },
  ],
};

const MODULE_NAME = "oddsboost-swimlane";

describe("Oddsboost markets swimlane", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_VIEW_MOCK_ONE_CARD_SWIMLANE.urn, { disableCSSAnimations: true }),
    );
  });

  describe("When the user is on sports view and there are more than one market available for Oddsboost And service is retrieving title", () => {
    beforeAll(async () => {
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK_TWO_CARD_SWIMLANE));
      await mockService.mockHttpRequest(
        getMarketPrices(SMP_MOCK_TWO_CARD_SWIMLANE, { ignoreRequestedMarketIdsMatch: true }),
      );
      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1494]_the_1st_and_2nd_oddsboost_cards_should_be_displayed_in_viewport_and_not_have_any_icon_visible`,
      );
    });

    it("[PRPI-1494]_the_1st_and_2nd_oddsboost_cards_should_be_displayed_in_viewport_and_not_have_any_icon_visible", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1494]_the_1st_and_2nd_oddsboost_cards_should_be_displayed_in_viewport_and_not_have_any_icon_visible`,
        ),
      ).toEqual(0);
    });
  });
});
