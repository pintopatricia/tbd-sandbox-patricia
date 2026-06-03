const {
  AppPO,
  EventPagePO,
  MinimizedPO,
  SportsbookPlacePanelPO,
  CardPO,
  FreeBetsPO,
  BetslipDrawerPO,
  RunnerPO,
  SportsbookMarketPO,
  BetsSummaryPO,
} = require("../../../../../../page-objects");
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;

const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");

const mockService = new MockService();

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const sportsbookMarketPO = new SportsbookMarketPO(firstCardPO.sportsbookMarket);
const firstRunnerSportsbookPO = new RunnerPO(sportsbookMarketPO.runnerList[0]);
const sportsbookMinimizedPO = new MinimizedPO();
const betslipDrawerPO = new BetslipDrawerPO();
const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const singleBetsSummaryPO = new BetsSummaryPO(sportsbookPlacePanelPO.element);
const freeBetsPO = new FreeBetsPO();

const EVENT_ID = "29359895";
const MARKET_ID = "924.193270252";
const SELECTION_ID = 48044;

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    sport: {
      name: "Football",
      urn: "ppb:eventType:1",
    },
    name: "Wolves v Man Utd",
  },
  edges: [
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:29436223:MATCH_ODDS",
        cardTitle: "Match Odds",
        displayRunners: {
          sportsbook: {
            runners: [
              {
                runnerURN: `ppb:sbkRunner:${MARKET_ID}/${SELECTION_ID}`,
              },
              {
                runnerURN: `ppb:sbkRunner:${MARKET_ID}/58805`,
              },
              {
                runnerURN: `ppb:sbkRunner:${MARKET_ID}/48351`,
              },
            ],

            market: {
              __typename: "SportsbookMarket",
              urn: `ppb:sbkMarket:${MARKET_ID}`,
              noLiveData: true,
              name: "Match Odds",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "Wolves v Man Utd",
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  runnerURN: `ppb:sbkRunner:${MARKET_ID}/${SELECTION_ID}`,
                  selectionId: SELECTION_ID,
                  name: "Wolves",
                },
                {
                  runnerURN: `ppb:sbkRunner:${MARKET_ID}/58805`,
                  selectionId: 58805,
                  name: "The Draw",
                },
                {
                  runnerURN: `ppb:sbkRunner:${MARKET_ID}/48351`,
                  selectionId: 48351,
                  name: "Man Utd",
                },
              ],
            },
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:29436223:MATCH_ODDS",
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: MARKET_ID,
      runnerDetails: [
        {
          runnerOdds: {
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
            decimalDisplayOdds: { decimalOdds: 1.1 },
          },
          selectionId: `${SELECTION_ID}`,
        },
        {
          noOdds: true,
          selectionId: "48351",
        },
      ],
    },
  ],
};

const FIRST_SINGLE_WITH_BONUS = {
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_ID,
          selectionId: SELECTION_ID,
        },
      ],
    },
  ],

  winAverageOdds: 1.2,
  winAvgOdds: {
    decimalDisplayOdds: { decimalOdds: 1.2 },
    trueOdds: {
      decimalOdds: { decimalOdds: 1.2 },
    },
  },
  averageOdds: 1.2,
  hasBonusMoney: true,
};

const FIRST_SINGLE_ODDS = {
  runner: {
    marketId: MARKET_ID,
    selectionId: SELECTION_ID,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SIB_WITH_BONUS_MOCK = {
  betCombinations: [FIRST_SINGLE_WITH_BONUS],
  hasBonusMoney: true,
  runnerOdds: [FIRST_SINGLE_ODDS],
};

const SUCCESSFUL_WAS_REQUEST = [{ walletName: "MAIN", amount: "123" }];

describe("SBK Freebets - Bet Place Panel Toggle Behaviour (singles)", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getWallets(SUCCESSFUL_WAS_REQUEST));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_WITH_BONUS_MOCK));

    await browser.url(routes.getEventViewUrl(EVENT_ID));
    await browser.waitUntil(
      AppPO.sportsbookRunnerBetButtonHasPrice({
        market: eventPagePO.markets[0],
        price: 1.1,
      }),
    );
  });

  describe("when a user with bonus opens betslip", () => {
    beforeAll(async () => {
      await firstRunnerSportsbookPO.sportsbookBetButton.waitForClickable();
      await firstRunnerSportsbookPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Sportsbook betslip not displayed");
    });

    it("[PRPI-8095] the Balance After Bet should be the same as the main wallet", async () => {
      expect(await singleBetsSummaryPO.leftSegmentLabel.getText()).toBe("Balance After Bet");
      expect(await singleBetsSummaryPO.leftSegmentValue.getText()).toBe("$123.00");
    });

    it("[PRPI-8096] the bonus component should be displayed", async () => {
      expect(await freeBetsPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-8097] the bonus should not be selected", async () => {
      expect(await freeBetsPO.input.isSelected()).toBe(false);
    });

    describe("when a user selects bonus", () => {
      beforeAll(async () => {
        await freeBetsPO.activateBonus("Use Free Bet Balance");
      });

      it("[PRPI-8098] the Balance After Bet should be N/A", async () => {
        expect(await singleBetsSummaryPO.leftSegmentValue.getText()).toBe("N/A");
      });

      it("[PRPI-8099] the bonus should be selected", async () => {
        expect(await freeBetsPO.input.isSelected()).toBe(true);
      });

      describe("when a user collapses and expands the betslip", () => {
        beforeAll(async () => {
          await betslipDrawerPO.header.waitForClickable();
          await betslipDrawerPO.header.click();
          await browser.waitUntilDisplayed(sportsbookMinimizedPO.element, "Minimized betslip not displayed");

          await sportsbookMinimizedPO.element.waitForClickable();
          await sportsbookMinimizedPO.element.click();
          await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Sportsbook betslip not displayed");
        });

        it("[PRPI-8100] the bonus should be selected", async () => {
          expect(await freeBetsPO.input.isSelected()).toBe(true);
        });
      });
    });
  });
});
