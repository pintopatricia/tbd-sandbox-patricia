const { getAppContext, getCardResults, getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { startApp } = require("../../../../../helpers/urls");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { PebbleSO, PebbleListSO, LottoCardSO } = require("../../../../../screen-objects");

const mockService = new MockService();
const lottoCardSO = new LottoCardSO();
const pebbleListSO = new PebbleListSO(lottoCardSO.element);
const luckyDipPebbleSO = new PebbleSO(pebbleListSO.pebbleListElements[1]);

const SPORT_ID = "29125756";
const MODULE_NAME = "lotto_card";

const createRunner = (market, selectionId) => ({
  runnerURN: `ppb:sbkRunner:${market}/${selectionId}`,
  selectionId,
  name: `${selectionId}`,
  resultType: null,
});

const listRunners = (market) => Array.from({ length: 20 }, (_, i) => createRunner(market, i + 1));

const createMarket = (market, closedMarket) => ({
  __typename: "SportsbookMarket",
  urn: `ppb:sbkMarket:${market}`,
  name: "Standard bet",
  marketType: "STANDARD_BET",
  liveData: {
    urn: `ppb:sbkMarket:${market}`,
    sportsbookMarketStatus: market === closedMarket ? "CLOSED" : "OPEN",
    __typename: "SportsbookMarketLiveData",
  },
  hierarchy: {
    sportevent: {
      __typename: "SportsEvent",
      urn: "ppb:event:34821743",
      name: "Main",
      openDate: "2025-10-14T11:49:00.000Z",
    },
    __typename: "EventCompetitionHierarchy",
  },
  runners: listRunners(market),
});

const listMarkets = Array.from({ length: 4 }, (_, i) => createMarket(i + 1, 3));

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
  urn: `ppb:tbd:card:lotto:aKdBBxAAACAAf-Hv/s/${SPORT_ID}`,
  shouldShowCompetitionName: true,
  competition: {
    __typename: "Competition",
    urn: "ppb:competition:12239602",
    name: "UK 49s",
  },
  lottoMarkets: listMarkets,
  marketIds: listMarkets.map((_, i) => String(i + 1)),
  winAvgOdds: listOdds,
};

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:generic:home`,
  edges: [
    {
      node: {
        __typename: "GenericSwitcherCard",
        urn: `ppb:tbd:card:genericswitcher:sport:${SPORT_ID}`,
        filterTitle: {
          translated: null,
          translate: {
            key: "I18N.SWITCHER.SPORT.TITLE",
          },
        },
        selectedViewLink: {
          label: "Lotteries",
          viewLink: {
            viewUrn: `ppb:tbd:view:sport:${SPORT_ID}`,
            viewUrl: `lotteries/s-${SPORT_ID}`,
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        urn: `ppb:tbd:card:genericswitcher:sport:${SPORT_ID}`,
        __typename: "GenericSwitcherCard",
      },
    },
    {
      node: {
        __typename: "LottoCard",
        urn: `ppb:tbd:card:lotto:aKdBBxAAACAAf-Hv/s/${SPORT_ID}`,
      },
    },
  ],
};

const BFF_GENERIC_SWITCHER_MOCK = {
  __typename: "GenericSwitcherCard",
  urn: `ppb:tbd:card:genericswitcher:sport:${SPORT_ID}`,
  filterTitle: {
    translated: null,
    translate: {
      key: "I18N.SWITCHER.SPORT.TITLE",
    },
  },
  selectedViewLink: {
    label: "Lotteries",
    viewLink: {
      viewUrn: `ppb:tbd:view:sport:${SPORT_ID}`,
      viewUrl: `lotteries/s-${SPORT_ID}`,
    },
  },
};

describe("When a user visits the Lotteries screen (Native)", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext());
    await mockService.mockHttpRequest(getGenericLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getCardResults({ cards: [BFF_GENERIC_SWITCHER_MOCK] }));
    await mockService.mockHttpRequest(getCardResults({ cards: [LOTTO_CARD_MOCK] }));

    await startApp("home");

    await browser.waitUntilDisplayed(lottoCardSO.element, "Lotto Card not displayed");
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4919]_should_render_lotto_card_and_draws`);
  });

  it("[PRPI-4919]_should_render_lotto_card_and_draws", async () => {
    expect(
      (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4919]_should_render_lotto_card_and_draws`)).misMatchPercentage,
    ).toEqual(0);
  });

  it("[PRPI-4920]_should_render_lotto_selections_and_betslip_button", async () => {
    await browser.waitUntilDisplayed(lottoCardSO.lottoBallsContainer);

    const lottoBalls = await lottoCardSO.lottoBalls.getElement();
    for await (const ball of lottoBalls.slice(0, 5)) {
      await browser.waitUntilClickableNative(ball);
      await ball.click();
      await browser.pause(100);
    }

    await browser.waitUntilDisplayed(lottoCardSO.selectionsContainer);
    await browser.waitUntil(async () => (await lottoCardSO.lottoSelections.length) === 5);

    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4920]_should_render_lotto_selections_and_betslip_button`);

    expect(
      (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4920]_should_render_lotto_selections_and_betslip_button`))
        .misMatchPercentage,
    ).toEqual(0);
  });

  it("[PRPI-4921]_should_render_lotto_card_lucky_dip", async () => {
    await browser.waitUntilClickableNative(luckyDipPebbleSO.element);
    await luckyDipPebbleSO.element.click();
    await browser.waitUntilDisplayed(lottoCardSO.luckyDip);

    await browser.waitUntilClickableNative(lottoCardSO.clearAll);
    await lottoCardSO.clearAll.click();

    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4921]_should_render_lotto_card_lucky_dip`);

    expect(
      (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4921]_should_render_lotto_card_lucky_dip`)).misMatchPercentage,
    ).toEqual(0);
  });

  it("[PRPI-4922]_should_select_5_numbers_on_lucky_dip", async () => {
    await browser.waitUntil(async () => (await lottoCardSO.quickPicks.length) === 5);

    await browser.waitUntilClickableNative(lottoCardSO.quickPicks[4]);
    await lottoCardSO.quickPicks[4].click();

    await browser.waitUntilDisplayed(lottoCardSO.selectionsContainer);

    expect(await lottoCardSO.lottoSelections.length).toBeGreaterThanOrEqual(5);
  });
});
