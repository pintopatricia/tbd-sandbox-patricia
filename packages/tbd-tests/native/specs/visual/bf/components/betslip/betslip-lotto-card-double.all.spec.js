const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const {
  getCardResults,
  getAppContext,
  getGenericLayout,
  getMarkets,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const {
  SportsbookPlacePanelSO,
  LottoCardSO,
  PrimaryButtonSO,
  BetControlsSO,
  CurrencyNumberInputFieldSO,
  SportsbookReceiptPanelSO,
  GenericScreenSO,
} = require("../../../../../screen-objects");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const addStake = require("../../../../../helpers/add-stake");

const MODULE_NAME = "betslip_lotto_card";

const genericScreenSO = new GenericScreenSO();
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
  edges: [],
  partialEdges: [
    {
      node: {
        urn: `ppb:tbd:card:lotto:aKdBBxAAACAAf-Hv/s/${EVENT_TYPE_ID}`,
        __typename: "LottoCard",
      },
    },
  ],
};

const ONE_LINE_BET_LEG_2 = {
  marketId: FIRST_MARKET_ID,
  selectionId: SECOND_SELECTION_ID,
};

const ONE_LINE_BET_LEG_3 = {
  marketId: FIRST_MARKET_ID,
  selectionId: THIRD_SELECTION_ID,
};

const ONE_LINE_BET_DOUBLE = {
  legCombinations: [
    {
      runners: [ONE_LINE_BET_LEG_2, ONE_LINE_BET_LEG_3],
      legType: "ONE_LINE_BET",
    },
  ],

  averageOdds: 4.2,
  winAverageOdds: 4.2,
  betType: "DOUBLE",
};

const ONE_LINE_BET_DOUBLE_ODDS = {
  runner: ONE_LINE_BET_LEG_2,
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 4.2 },
    },
    decimalDisplayOdds: { decimalOdds: 4.2 },
  },
};

const SIB_DOUBLE_MOCK = {
  betCombinations: [ONE_LINE_BET_DOUBLE],
  runnerOdds: [ONE_LINE_BET_DOUBLE_ODDS],
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

const SPB_DOUBLE_MOCK = {
  result: [
    {
      totalStake: 1.0,
      runners: [
        {
          runner: {
            marketId: FIRST_MARKET_ID,
            selectionId: SECOND_SELECTION_ID,
          },
          odds: oddsSPBMock(54, 53, 1),
          winOdds: oddsSPBMock(54, 53, 1),
        },
        {
          runner: {
            marketId: FIRST_MARKET_ID,
            selectionId: THIRD_SELECTION_ID,
          },
          odds: oddsSPBMock(54, 53, 1),
          winOdds: oddsSPBMock(54, 53, 1),
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [
              {
                runner: {
                  marketId: FIRST_MARKET_ID,
                  selectionId: SECOND_SELECTION_ID,
                },
              },
              {
                runner: {
                  marketId: FIRST_MARKET_ID,
                  selectionId: THIRD_SELECTION_ID,
                },
              },
            ],
          },
          legType: "ONE_LINE_BET",
          winOdds: oddsSPBMock(54, 53, 1),
          ...oddsSPBMock(54, 53, 1),
        },
      ],

      totalPotentialWin: 54.0,
      betPrice: oddsSPBMock(54.0, 53, 1),
    },
  ],
};

const GET_MARKETS_MOCK = {
  markets: [...markets],
};

describe("Betslip - Lotto Card Double Selection", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext());
    await mockService.mockHttpRequest(getGenericLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getCardResults({ cards: [LOTTO_CARD_MOCK] }));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_DOUBLE_MOCK, { ignoreLegsOrder: true }));
    await mockService.mockHttpRequest(getMarkets(GET_MARKETS_MOCK));

    await startApp("home");

    await browser.waitUntilDisplayed(genericScreenSO.element);
    await browser.waitUntilDisplayed(lottoCardSO.element, "Lotto Card not displayed");
  });

  describe("when adding a selection to the Betslip", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(lottoCardSO.lottoBallsContainer, "Lotto balls container not displayed");

      const lottoBalls = await lottoCardSO.lottoBalls.getElement();
      await browser.waitUntilClickableNative(lottoBalls[1]);
      await lottoBalls[1].click();
      await browser.pause(100); //ensure not being clicking at same time
      await browser.waitUntilClickableNative(lottoBalls[2]);
      await lottoBalls[2].click();

      await browser.waitUntilDisplayed(lottoCardSO.selectionsContainer);
      await browser.waitUntil(async () => (await lottoCardSO.lottoSelections.length) === 2);
      await browser.waitUntilClickableNative(primaryButton.element);
      await primaryButton.element.click();

      await browser.waitUntilDisplayed(placePanelSO.element, "Sportsbook betslip not displayed");
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-4879]_should_see_betslip_open_with_double_one_line_bets`,
      );
    });

    it("[PRPI-4879]_should_see_betslip_open_with_double_one_line_bets", async () => {
      expect(
        (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4879]_should_see_betslip_open_with_double_one_line_bets`))
          .misMatchPercentage,
      ).toEqual(0);
    });
  });

  describe("when placing the bet", () => {
    beforeAll(async () => {
      await addStake(sportsbookStakeInputSO, "1");
      await mockService.mockHttpRequest(getPlaceBet(SPB_DOUBLE_MOCK));
      await browser.waitUntilClickableNative(placeButtonSO.element);
      await placeButtonSO.element.click();
      await browser.waitUntilDisplayed(sportsbookReceiptPanelSO.element);
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4880]_should_see_betreceipt_with_double_one_line_bets`);
    });

    it("[PRPI-4880]_should_see_betreceipt_with_double_one_line_bets", async () => {
      expect(
        (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4880]_should_see_betreceipt_with_double_one_line_bets`))
          .misMatchPercentage,
      ).toEqual(0);
    });
  });
});
