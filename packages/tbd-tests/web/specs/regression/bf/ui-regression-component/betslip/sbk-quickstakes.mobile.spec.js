const { CurrencyNumberInputFieldPO, QuickStakesPO, BetControlsPO } = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getGenericLayout, getMarkets } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const quickStakesPO = new QuickStakesPO();
const controlsPO = new BetControlsPO();
const currencyInputPO = new CurrencyNumberInputFieldPO(controlsPO.currencyInput);
const mockService = new MockService();

const EVENT_ID = 1;
const MARKET_ID = "924.1";

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  edges: [
    {
      node: {
        urn: `ppb:tbd:card:${EVENT_ID}##MATCH_ODDS`,
        title: "Match Odds",
        displayRunners: {
          sportsbook: {
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
                  runnerURN: `ppb:sbkRunner:${MARKET_ID}/1337`,
                  selectionId: 1337,
                  name: "Wolves",
                },
              ],
            },
            runners: [{ runnerURN: `ppb:sbkRunner:${MARKET_ID}/1337` }],
          },
        },
      },
    },
  ],

  partialEdges: [{ node: { urn: `ppb:tbd:card:${EVENT_ID}##MATCH_ODDS`, __typename: "MarketCard" } }],
};

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_ID,
          selectionId: 1337,
        },
      ],
    },
  ],

  betMaxStake: 1000,
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: MARKET_ID,
    selectionId: 1337,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SMP_MOCK = {
  markets: [
    {
      marketId: MARKET_ID,
      runnerDetails: [
        {
          selectionId: "1337",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
  ],
};

const IMPLY_BETS_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const BFF_ENSURE_MARKETS_MOCK = {
  markets: [
    {
      __typename: "SportsbookMarket",
      urn: "ppb:sbkMarket:924.1",
      runners: [
        {
          runnerURN: "ppb:sbkRunner:924.1/1337",
          selectionId: 1337,
        },
      ],
    },
  ],
};

const buildBetslipDeeplink = (selections) => {
  const betsParam = selections.reduce(
    (acc, { marketId, selectionId }) => `${acc === "" ? acc : `${acc};`}${marketId}%7C${selectionId}`,
    "",
  );

  return `?bets=${betsParam}`;
};

const initialSelections = [
  {
    marketId: "924.1",
    selectionId: 1337,
  },
];

describe("Populate Betslip", () => {
  describe("with one selection", () => {
    beforeAll(async () => {
      const qs = buildBetslipDeeplink(initialSelections);
      const url = `${routes.getHomeViewUrl()}${qs}`;
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_MOCK.urn, {
          appCommands: [
            {
              name: "CMD/LOAD_SBK_BETSLIP",
              args: {
                selections: initialSelections.map(({ marketId, selectionId }) => ({
                  marketUrn: `ppb:sbkMarket:${marketId}`,
                  runnerUrn: `ppb:sbkRunner:${marketId}/${selectionId}`,
                })),
              },
            },
          ],

          currentUrl: qs,
        }),
      );
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarkets(BFF_ENSURE_MARKETS_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getImplyBetsResponse(IMPLY_BETS_MOCK));

      await browser.url(url);
      await browser.waitUntilDisplayed(quickStakesPO.element);
    });

    it("[PRPI-5620] the betslip should open with the quick stakes component", async () => {
      expect(await quickStakesPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-5621] the quick stakes component should have 4 buttons", async () => {
      expect(await quickStakesPO.quickStake.length).toBe(4);
    });

    it("[PRPI-5622] the quick stake button should have the defined values", async () => {
      expect(await quickStakesPO.quickStake[0].getText()).toBe("+ $5");
      expect(await quickStakesPO.quickStake[1].getText()).toBe("+ $10");
      expect(await quickStakesPO.quickStake[2].getText()).toBe("+ $20");
      expect(await quickStakesPO.quickStake[3].getText()).toBe("+ $50");
    });

    describe("and the user clicks on the first quick stake button", () => {
      beforeAll(async () => {
        await quickStakesPO.quickStake[0].waitForClickable();
        await quickStakesPO.quickStake[0].click();
      });

      it("[PRPI-5623] the stake input field should be populated with the correspondent value", async () => {
        expect(await currencyInputPO.numberField.getValue()).toBe("5");
      });

      describe("and the user clicks again on the same quick stake button", () => {
        beforeAll(async () => {
          await quickStakesPO.quickStake[0].waitForClickable();
          await quickStakesPO.quickStake[0].click();
        });

        it("[PRPI-5624] the stake value should be incremented", async () => {
          expect(await currencyInputPO.numberField.getValue()).toBe("10");
        });
      });
    });
  });
});
