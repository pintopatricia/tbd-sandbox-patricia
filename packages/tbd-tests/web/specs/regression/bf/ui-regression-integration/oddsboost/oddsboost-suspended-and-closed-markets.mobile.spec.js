const {
  HighlightedSelectionCardPO,
  SportPagePO,
  ScrollableSwimlanePO,
  SportsbookBetButtonPO,
} = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;

const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

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
                badge: "ODDSBOOST",
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

const SMP_MOCK_SUSPENDED = {
  markets: [
    {
      marketId: "924.1",
      marketStatus: "SUSPENDED",
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

const SMP_MOCK_OPEN_NO_SELECTION = {
  markets: [
    {
      marketId: "924.1",
      marketStatus: "OPEN",
      runnerDetails: [],
    },
  ],
};

const SMP_MOCK_CLOSED = {
  markets: [{ marketId: "924.1", noMarketInfo: true }],
};

describe("Oddsboost suspended and closed markets", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
  });

  describe("When the user is on sports view and there is an Oddsboost market suspended", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_SUSPENDED, { ignoreRequestedMarketIdsMatch: true }));
      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
      await browser.waitUntilEquals(oddsboostBetButtonPO.odd, "-");
    });

    it("[PRPI-7206] the bet button should present no odd", async () => {
      expect(await oddsboostBetButtonPO.odd.getText()).toEqual("-");
    });

    describe("And the Oddsboost market change to open", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_OPEN, { ignoreRequestedMarketIdsMatch: true }));
        await browser.tickFakeClock();
        await browser.waitUntilEquals(oddsboostBetButtonPO.odd, "1.2");
      });

      it("[PRPI-7207] the bet button should present odd", async () => {
        expect(await oddsboostBetButtonPO.odd.getText()).toEqual("1.2");
      });

      describe("And SMP stops returning the selection", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(
            getMarketPrices(SMP_MOCK_OPEN_NO_SELECTION, { ignoreRequestedMarketIdsMatch: true }),
          );
          await browser.tickFakeClock();
          await browser.waitUntilContainsClass(oddsboostCard.element, HighlightedSelectionCardPO.states.closed);
        });

        it("[PRPI-7208] the oddsboost card should be disabled", async () => {
          expect(await browser.containsClass(oddsboostCard.element, HighlightedSelectionCardPO.states.closed)).toBe(
            true,
          );
        });

        it("[PRPI-7209] the bet button should present no odd", async () => {
          expect(await oddsboostBetButtonPO.odd.getText()).toEqual("-");
        });
      });
    });
  });

  describe("When the user is on sports view and there is an Oddsboost market closed", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_OPEN, { ignoreRequestedMarketIdsMatch: true }));
      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
      await browser.waitUntilEquals(oddsboostBetButtonPO.odd, "1.2");
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_CLOSED, { ignoreRequestedMarketIdsMatch: true }));
      await browser.tickFakeClock();
      await browser.waitUntilDisplayed(oddsboostSwimlanePO.element);
      await browser.waitUntilContainsClass(oddsboostCard.element, HighlightedSelectionCardPO.states.closed);
    });

    it("[PRPI-7210] the oddsboost card should be disabled", async () => {
      expect(await browser.containsClass(oddsboostCard.element, HighlightedSelectionCardPO.states.closed)).toBe(true);
    });

    it("[PRPI-7211] the bet button should present no odd", async () => {
      expect(await oddsboostBetButtonPO.odd.getText()).toEqual("-");
    });
  });
});
