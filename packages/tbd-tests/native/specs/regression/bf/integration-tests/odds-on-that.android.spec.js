const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getEventLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const { MarketExtendedCardSO, RunnerSO, ShowMoreSO, BetDetailsSO } = require("../../../../screen-objects");

const mockService = new MockService();
const marketExtendedCardCardSO = new MarketExtendedCardSO();
// collapsed
const firstRunner = new RunnerSO(marketExtendedCardCardSO.runners[0]);
const fourthRunner = new RunnerSO(marketExtendedCardCardSO.runners[3]);
// expanded
const fifthRunner = new RunnerSO(marketExtendedCardCardSO.runners[4]);
const sixthRunner = new RunnerSO(marketExtendedCardCardSO.runners[5]);
const showMoreSO = new ShowMoreSO();
const selectionSO = new BetDetailsSO();

const MARKET_ID = 924.1;

const createRunners = () =>
  [
    "Each Team to Have 2+ Corners in Each Half",
    "Both teams to score & 3+ corners for each team & 2+ cards for each team",
    "Each Team 2+ Shots on Target in each Half",
    "Leicester to Win, Leicester Most Shots On Target and Leicester Most Corners",
    "Leicester to Win; Leicester Most Corners and Leeds Most Cards",
    "Leeds to Have 2 or More Cards in Each Half",
  ].map((name, i) => ({
    __typename: "Runner",
    runnerURN: `ppb:sbkRunner:${MARKET_ID}/${i + 1}`,
    name,
    selectionId: i + 1,
    handicap: 0,
    resultType: null,
  }));

const BFF_VIEW_MOCK = {
  urn: "ppb:tbd:view:event:1",
  sportevent: {
    urn: "ppb:event:1",
    eventId: 1,
    name: "Wolves v Man Utd",
  },
  edges: [
    {
      node: {
        __typename: "PebbleCardGroup",
        urn: "ppb:tbd:cardgroup:pebble:marketTemplateEvent:batista/e/1",
        pebbleCardGroupTitle: { translated: "OddsOnThat" },
        selectedItemUrn: `ppb:tbd:card:marketExtended:${MARKET_ID}|4`,
        full: {
          edges: [
            {
              name: "OddsOnThat -1",
              node: {
                __typename: "MarketExtendedCard",
                urn: `ppb:tbd:card:marketExtended:${MARKET_ID}|4`,
                numberOfItemsToDisplay: 4,
                name: "OddsOnThat - Featured",
                marketType: "PRE_MATCH_COMBO_-_FEATURED",
                noLiveData: true,
                displayRunners: {
                  exchange: null,
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.1",
                      name: "OddsOnThat - Featured",
                      marketType: "PRE_MATCH_COMBO_-_FEATURED",
                      noLiveData: true,
                      runners: createRunners(),
                    },
                    runners: createRunners(),
                  },
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              name: "OddsOnThat -1",
              node: {
                __typename: "MarketExtendedCard",
                urn: `ppb:tbd:card:marketExtended:${MARKET_ID}|4`,
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
        __typename: "PebbleCardGroup",
        urn: "ppb:tbd:cardgroup:pebble:marketTemplateEvent:batista/e/1",
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.1",
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 2,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 3,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 3.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 4,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 4.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 4 },
          },
        },
        {
          selectionId: 5,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 5.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 6,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 6.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
  ],
};

describe("OddsOnThat", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getEventLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse({}));
    const url = "sport/competition/event/e-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilEquals(firstRunner.runnerName, "Each Team to Have 2+ Corners in Each Half");
  });

  it("[PRPI-3077] the oddsonthat market should be displayed", async () => {
    expect(await marketExtendedCardCardSO.element.isDisplayed()).toBe(true);
  });

  describe("When the user clicks on show more", () => {
    beforeAll(async () => {
      await browser.waitUntilClickableNative(showMoreSO.element);
      await showMoreSO.element.click();
      await browser.waitUntilDisplayed(fifthRunner.element);
    });

    it("[PRPI-3078] the card should expand and display the rest of the runners", async () => {
      expect(await fourthRunner.runnerName.getText()).toBe(
        "Leicester to Win, Leicester Most Shots On Target and Leicester Most Corners",
      );

      expect(await fifthRunner.runnerName.getText()).toBe(
        "Leicester to Win; Leicester Most Corners and Leeds Most Cards",
      );

      expect(await sixthRunner.runnerName.getText()).toBe("Leeds to Have 2 or More Cards in Each Half");
    });
  });

  describe("when the user clicks on a price available", () => {
    beforeAll(async () => {
      await firstRunner.sbkBetButtons[0].click();
      await browser.waitUntilDisplayed(selectionSO.element);
    });

    it("[PRPI-3079] The betslip should be displayed", async () => {
      expect(await selectionSO.element).not.toBeNull();
    });
  });
});
