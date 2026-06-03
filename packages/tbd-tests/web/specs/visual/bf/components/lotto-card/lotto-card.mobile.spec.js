const { getCardResults, getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const NavigationTabsListPO = require("@ppb/tbd-shared/components/NavigationTabsList/NavigationTabsList.po");
const { PebblePO, PebbleListPO, LottoCardPO } = require("../../../../../page-objects");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();
const navigationTabsListPO = new NavigationTabsListPO();
const lottoCardPO = new LottoCardPO(navigationTabsListPO.tabItems[0]);
const pebbleListPO = new PebbleListPO(lottoCardPO.content);
const luckyDipPebblePO = new PebblePO(pebbleListPO.pebbles[1]);

const MODULE_NAME = "lotto_card";
const SPORT_ID = "29125756";

const createRunner = (market, selectionId) => ({
  runnerURN: `ppb:sbkRunner:${market}/${selectionId}`,
  selectionId,
  name: `${selectionId}`,
  resultType: null,
});

const listRunners = (market) => Array.from({ length: 50 }, (_, i) => createRunner(market, i + 1));

const createMarket = (market, closedMarket) => ({
  __typename: "SportsbookMarket",
  urn: `ppb:sbkMarket:${market}`,
  name: "Standard bet",
  marketType: "STANDARD_BET",
  liveData: {
    urn: `ppb:sbkMarketLiveData:${market}`,
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

const listMarkets = Array.from({ length: 5 }, (_, i) => createMarket(i + 1, 3));

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
  __typename: "SportView",
  urn: `ppb:tbd:view:sport:${SPORT_ID}`,
  url: `lotteries/s-${SPORT_ID}`,
  title: null,
  canonicalUrl: `/lotteries/s-${SPORT_ID}`,
  sport: {
    __typename: "Sport",
    urn: `ppb:eventType:${SPORT_ID}`,
    name: "Lotteries",
    sportId: SPORT_ID,
  },
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
    {
      node: {
        __typename: "NavigationTabsList",
        urn: `ppb:tbd:card:navigationTabsList:aKdANhAAACEAf-Ca/s/${SPORT_ID}`,
        tabsTitle: {
          translated: "Lotteries",
        },
        full: {
          edges: [
            {
              node: {
                __typename: "NavigationTab",
                urn: `ppb:tbd:view:navigationTab:aKdAjxAAAB8Af-Er/s/${SPORT_ID}`,
                badgeText: null,
                tabTitle: {
                  translated: "Popular",
                },
                full: {
                  edges: [
                    {
                      node: {
                        ...LOTTO_CARD_MOCK,
                      },
                    },
                  ],
                },
                partials: {
                  partialEdges: [
                    {
                      node: {
                        __typename: "LottoCard",
                        urn: `ppb:tbd:card:lotto:aKdBBxAAACAAf-Hv/s/${SPORT_ID}`,
                      },
                    },
                  ],

                  __typename: "NavigationTabItems",
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "NavigationTab",
                urn: `ppb:tbd:view:navigationTab:aKdAjxAAAB8Af-Er/s/${SPORT_ID}`,
                badgeText: null,
                tabTitle: {
                  translated: "Popular",
                  translate: null,
                },
                tabViewLink: null,
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
        urn: `ppb:tbd:card:genericswitcher:sport:${SPORT_ID}`,
        __typename: "GenericSwitcherCard",
      },
    },
    {
      node: {
        urn: `ppb:tbd:card:navigationTabsList:aKdANhAAACEAf-Ca/s/${SPORT_ID}`,
        __typename: "NavigationTabsList",
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

describe("When a user visits the Lotteries page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getCardResults({ cards: [BFF_GENERIC_SWITCHER_MOCK] }));
    await mockService.mockHttpRequest(getCardResults({ cards: [LOTTO_CARD_MOCK] }));

    await browser.url(routes.getSportViewUrl(SPORT_ID));
    await browser.waitUntilDisplayed(lottoCardPO.content, "Lotto card content not displayed", 500);
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1604]_should_render_lotto_card`);
  });

  it("[PRPI-1604]_should_render_lotto_card", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1604]_should_render_lotto_card`)).toBe(0);
  });

  it("[PRPI-1605]_should_render_lotto_card_draws", async () => {
    await browser.waitUntilDisplayed(lottoCardPO.drawsContainer, "Lotto card draws container not displayed", 500);
    await lottoCardPO.drawsContainer.scrollIntoView();
    await browser.waitUntil(async () => await lottoCardPO.drawsContainer.isDisplayedInViewport(), {
      timeout: 1000,
      timeoutMsg: "Lotto card draws container not in viewport after scrolling to top",
    });
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1605]_should_render_lotto_card_draws`);

    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1605]_should_render_lotto_card_draws`)).toBe(0);
  });

  it("[PRPI-1606]_should_allow_selecting_5_numbers_on_pick_numbers", async () => {
    await browser.waitUntilDisplayed(
      lottoCardPO.lottoBallsContainer,
      "Lotto card lotto balls container not displayed",
      500,
    );

    const lottoBalls = await lottoCardPO.lottoBalls.getElement();
    for await (const ball of lottoBalls.slice(0, 5)) {
      await ball.waitForClickable();
      await ball.click();
    }

    await browser.waitUntilDisplayed(
      lottoCardPO.selectionsContainer,
      "Lotto card selections container not displayed",
      500,
    );
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1606]_should_allow_selecting_5_numbers_on_pick_numbers`);

    expect(
      await browser.checkScreen(`${MODULE_NAME}_[PRPI-1606]_should_allow_selecting_5_numbers_on_pick_numbers`),
    ).toBe(0);
  });

  it("[PRPI-1607]_should_render_lotto_card_lucky_dip", async () => {
    await luckyDipPebblePO.element.waitForClickable();
    await luckyDipPebblePO.element.click();

    await browser.waitUntilDisplayed(lottoCardPO.luckyDip, "Lotto card lucky dip container not displayed", 500);
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1607]_should_render_lotto_card_lucky_dip`);

    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1607]_should_render_lotto_card_lucky_dip`)).toBe(0);
  });

  it("[PRPI-1608]_should_select_5_numbers_on_lucky_dip", async () => {
    await luckyDipPebblePO.element.waitForClickable();
    await luckyDipPebblePO.element.click();

    await browser.waitUntilDisplayed(lottoCardPO.luckyDip, "Lotto card lucky dip container not displayed", 500);

    const quickPicks = await lottoCardPO.quickPicks;
    await quickPicks[4].waitForClickable();
    await quickPicks[4].click();

    await browser.waitUntilDisplayed(lottoCardPO.selectionsContainer);

    expect(await lottoCardPO.lottoSelections.length).toBeGreaterThanOrEqual(5);
  });
});
