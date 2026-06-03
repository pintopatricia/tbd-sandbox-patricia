const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getCardResults, getAppContext, getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const {
  SportsbookPlacePanelSO,
  LottoCardSO,
  PrimaryButtonSO,
  BetControlsSO,
  CurrencyNumberInputFieldSO,
  SportsbookReceiptPanelSO,
} = require("../../../../../screen-objects");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const addStake = require("../../../../../helpers/add-stake");

const MODULE_NAME = "betslip_lotto_card";

const lottoCardSO = new LottoCardSO();
const placePanelSO = new SportsbookPlacePanelSO();
const primaryButton = new PrimaryButtonSO();

const controlsSO = new BetControlsSO(placePanelSO.element);
const sportsbookStakeInputSO = new CurrencyNumberInputFieldSO(controlsSO.currencyInput);
const sportsbookReceiptPanelSO = new SportsbookReceiptPanelSO();
const placeButtonSO = new PrimaryButtonSO(placePanelSO.place);

const mockService = new MockService();

const EVENT_TYPE_ID = 29125756;
const FIRST_MARKET_ID = "924.1";
const FIRST_SELECTION_ID = 1;
const SECOND_SELECTION_ID = 2;
const THIRD_SELECTION_ID = 3;

const createRunner = (selectionId) => ({
  runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/${selectionId}`,
  selectionId,
  name: `${selectionId}`,
  resultType: null,
});

const listRunners = () => Array.from({ length: 5 }, (_, i) => createRunner(i + 1));

const markets = [
  {
    __typename: "SportsbookMarket",
    urn: `ppb:sbkMarket:${FIRST_MARKET_ID}`,
    name: "Standard bet",
    marketType: "STANDARD_BET",
    liveData: {
      urn: `ppb:sbkMarket:${FIRST_MARKET_ID}`,
      sportsbookMarketStatus: "OPEN",
      __typename: "SportsbookMarketLiveData",
    },
    hierarchy: {
      sportevent: {
        __typename: "SportsEvent",
        urn: "ppb:event:34821743",
        name: "Main",
        openDate: "2027-10-14T11:49:00.000Z",
      },
      __typename: "EventCompetitionHierarchy",
    },
    runners: listRunners(),
  },
];

const listOdds = Array.from({ length: 5 }).map((_, index) => ({
  decimalDisplayOdds: {
    decimalOdds: (index + 1) * 10 + 1,
  },
  fractionalDisplayOdds: {
    numerator: (index + 1) * 10,
    denominator: 1,
  },
}));

const LOTTO_CARD_MOCK = {
  __typename: "LottoCard",
  urn: `ppb:tbd:card:lotto:aKdBBxAAACAAf-Hv/s/${EVENT_TYPE_ID}`,
  shouldShowCompetitionName: true,
  competition: {
    __typename: "Competition",
    urn: "ppb:competition:12239602",
    name: "UK 49s",
  },
  lottoMarkets: markets,
  marketIds: [FIRST_MARKET_ID],
  winAvgOdds: listOdds,
};

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:generic:home`,
  edges: [
    {
      node: {
        ...LOTTO_CARD_MOCK,
      },
    },
    {
      node: {
        __typename: "EventMarketCard",
        urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
        title: "",
        sportevent: {
          name: "Main",
          competition: {
            name: "UK 49s",
            sport: {
              sportId: 29125756,
            },
          },
        },
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              marketType: "STANDARD_BET",
              bettingType: "WIN",
              urn: "ppb:sbkMarket:924.1",
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.1/1",
                  selectionId: 1,
                  name: "1",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.1/2",
                  selectionId: 2,
                  name: "2",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.1/3",
                  selectionId: 3,
                  name: "3",
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:sbkRunner:924.1/1" },
              { runnerURN: "ppb:sbkRunner:924.1/2" },
              { runnerURN: "ppb:sbkRunner:924.1/3" },
            ],
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "LottoCard",
        urn: `ppb:tbd:card:lotto:aKdBBxAAACAAf-Hv/s/${EVENT_TYPE_ID}`,
      },
    },
    {
      node: {
        __typename: "EventMarketCard",
        urn: "ppb:tbd:card:eventPrimaryMarket:29359896",
      },
    },
  ],
};

const ONE_LINE_BET_LEG_1 = {
  marketId: FIRST_MARKET_ID,
  selectionId: FIRST_SELECTION_ID,
};

const ONE_LINE_BET_SINGLE = {
  legCombinations: [
    {
      runners: [ONE_LINE_BET_LEG_1],
      legType: "ONE_LINE_BET",
    },
  ],

  averageOdds: 2.1,
  winAverageOdds: 2.1,
  betType: "SINGLE",
};

const ONE_LINE_BET_SINGLE_ODDS = {
  runner: ONE_LINE_BET_LEG_1,
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2.1 },
    },
    decimalDisplayOdds: { decimalOdds: 2.1 },
  },
};

const SIB_SINGLE_MOCK = {
  betCombinations: [ONE_LINE_BET_SINGLE],
  runnerOdds: [ONE_LINE_BET_SINGLE_ODDS],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: FIRST_MARKET_ID,
      runnerDetails: [
        {
          selectionId: FIRST_SELECTION_ID,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.1 },
            fractionalDisplayOdds: { numerator: 2, denominator: 1 },
          },
        },
        {
          selectionId: SECOND_SELECTION_ID,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 4.2 },
            fractionalDisplayOdds: { numerator: 4, denominator: 1 },
          },
        },
        {
          selectionId: THIRD_SELECTION_ID,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 8.4 },
            fractionalDisplayOdds: { numerator: 8, denominator: 1 },
          },
        },
      ],
    },
  ],
};

const oddsSPBMock = (decimal, numerator, denominator) => ({
  trueOdds: {
    decimalOdds: {
      decimalOdds: decimal,
    },
    fractionalOdds: {
      numerator,
      denominator,
    },
  },
  decimalDisplayOdds: {
    decimalOdds: decimal,
  },
  fractionalDisplayOdds: {
    numerator,
    denominator,
  },
});

const SPB_SINGLE_MOCK = {
  result: [
    {
      totalStake: 1.0,
      runners: [
        {
          runner: {
            marketId: FIRST_MARKET_ID,
            selectionId: FIRST_SELECTION_ID,
          },
          odds: oddsSPBMock(2.1, 2, 1),
          winOdds: oddsSPBMock(2.1, 2, 1),
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [
              {
                runner: {
                  marketId: FIRST_MARKET_ID,
                  selectionId: FIRST_SELECTION_ID,
                },
              },
            ],
          },
          legType: "ONE_LINE_BET",
          winOdds: oddsSPBMock(2.1, 2, 1),
          ...oddsSPBMock(2.1, 2, 1),
        },
      ],

      totalPotentialWin: 7.0,
      betPrice: oddsSPBMock(7.0, 7, 1),
    },
  ],
};

describe("Betslip - Lotto Card Single Selection", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext());
    await mockService.mockHttpRequest(getGenericLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getCardResults({ cards: [LOTTO_CARD_MOCK] }));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));

    await startApp("home");
    await browser.waitUntilDisplayed(lottoCardSO.element, "Lotto Card not displayed");
  });

  describe("when adding a selection to the Betslip", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_SINGLE_MOCK, { ignoreLegsOrder: true }));

      await browser.waitUntilDisplayed(lottoCardSO.lottoBallsContainer);
      const lottoBalls = await lottoCardSO.lottoBalls.getElement();
      await browser.waitUntilClickableNative(lottoBalls[0]);
      await lottoBalls[0].click();
      await browser.waitUntilDisplayed(lottoCardSO.selectionsContainer);
      await browser.waitUntil(async () => (await lottoCardSO.lottoSelections.length) === 1);
      await browser.waitUntilClickableNative(primaryButton.element);
      await primaryButton.element.click();

      await browser.waitUntilDisplayed(placePanelSO.element, "Sportsbook betslip not displayed");
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4881]_should_see_betslip_open_with_single_one_line_bet`);
    });

    it("[PRPI-4881]_should_see_betslip_open_with_single_one_line_bet", async () => {
      expect(
        (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4881]_should_see_betslip_open_with_single_one_line_bet`))
          .misMatchPercentage,
      ).toEqual(0);
    });
  });

  describe("when placing the bet", () => {
    beforeAll(async () => {
      await addStake(sportsbookStakeInputSO, "1");
      await mockService.mockHttpRequest(getPlaceBet(SPB_SINGLE_MOCK));
      await browser.waitUntilClickableNative(placeButtonSO.element);
      await placeButtonSO.element.click();
      await browser.waitUntilDisplayed(sportsbookReceiptPanelSO.element);
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4882]_should_see_betreceipt_with_single_one_line_bet`);
    });

    it("[PRPI-4882]_should_see_betreceipt_with_single_one_line_bet", async () => {
      expect(
        (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4882]_should_see_betreceipt_with_single_one_line_bet`))
          .misMatchPercentage,
      ).toEqual(0);
    });
  });
});
