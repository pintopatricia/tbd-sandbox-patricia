const { getCardResults, getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const NavigationTabsListPO = require("@ppb/tbd-shared/components/NavigationTabsList/NavigationTabsList.po");
const { LottoCardPO, OptionListPO, CardGroupPO, PrimaryButtonPO, SnackbarPO } = require("../../../../../page-objects");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();
let navigationTabsListPO = new NavigationTabsListPO();
let lottoCardPO = new LottoCardPO(navigationTabsListPO.tabItems[0]);
const cardGroupPO = new CardGroupPO();
const primaryButton = new PrimaryButtonPO();

const SPORT_ID = "29125756";
const generateMarket = (number) => 924.19327025 + number;

const createRunner = (market, selectionId) => ({
  runnerURN: `ppb:sbkRunner:${market}/${selectionId}`,
  selectionId,
  name: `${selectionId}`,
  resultType: null,
});

const listRunners = (market) => Array.from({ length: 50 }, (_, i) => createRunner(market, i + 1));

const createMarket = (marketNumber, closedMarket) => ({
  __typename: "SportsbookMarket",
  urn: `ppb:sbkMarket:${generateMarket(marketNumber)}`,
  name: "Standard bet",
  marketType: "STANDARD_BET",
  liveData: {
    urn: `ppb:sbkMarket:${generateMarket(marketNumber)}`,
    sportsbookMarketStatus: marketNumber === closedMarket ? "SUSPENDED" : "OPEN",
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
  runners: listRunners(marketNumber),
});

const listMarkets = Array.from({ length: 5 }, (_, i) => createMarket(i, 3));

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
  marketIds: listMarkets.map((_, index) => 924.19327025 + index + 1),
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

const createSMPMock = (status) =>
  Array.from({ length: 5 }).map((_, index) => ({
    marketId: `${generateMarket(index)}`,
    marketStatus: status,
  }));

const SMP_MOCK_WITH_MARKETS_OPEN = {
  markets: createSMPMock("OPEN"),
};

const SMP_MOCK_WITH_MARKETS_SUSPENDED = {
  markets: createSMPMock("SUSPENDED"),
};

describe("When a user visits the Lotteries page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));

    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getCardResults({ cards: [LOTTO_CARD_MOCK] }));
    await mockService.mockHttpRequest(
      getMarketPrices(SMP_MOCK_WITH_MARKETS_OPEN, { ignoreRequestedMarketIdsMatch: true }),
    );

    await browser.url(routes.getSportViewUrl(SPORT_ID));
  });

  it("[PRPI-6731] should display the title as UK 49s", async () => {
    expect(await cardGroupPO.title.getText()).toBe("UK 49s");
  });

  it("[PRPI-6732] should display the lotto card with correct title and balls", async () => {
    expect(await lottoCardPO.title.getText()).toBe("Pick Up to 5 Numbers");
    expect(await lottoCardPO.lottoBalls.length).toBe(50);
  });

  it("[PRPI-6733] should select 5 numbers and display the add to betslip button", async () => {
    const lottoBalls = await (await lottoCardPO.lottoBalls).getElement();

    for await (const ball of lottoBalls.slice(0, 5)) {
      await ball.waitForClickable();
      await ball.click();
    }

    expect(await lottoCardPO.lottoSelections.length).toBe(5);

    const primaryButtonlabel = await primaryButton.label.getText();

    expect(primaryButtonlabel).toContain("Add to Betslip");
  });

  describe("when all markets are closed", () => {
    navigationTabsListPO = new NavigationTabsListPO();
    lottoCardPO = new LottoCardPO(navigationTabsListPO.tabItems[0]);
    const optionListPO = new OptionListPO(lottoCardPO.content);
    const snackbarPO = new SnackbarPO();

    beforeAll(async () => {
      await mockService.mockHttpRequest(
        getMarketPrices(SMP_MOCK_WITH_MARKETS_SUSPENDED, { ignoreRequestedMarketIdsMatch: true }),
      );
      await browser.tickFakeClock();
    });

    it("[PRPI-6734] should display all options as closed", async () => {
      const teste = await (await optionListPO.itemText).getElement();

      const optionTexts = await teste.map((item) => item.getText());

      for (const optionText of optionTexts) {
        expect(optionText).toBe("Draw Closed");
      }
    });

    it("[PRPI-6735] should display a snackbar notifying the user that all markets are closed", async () => {
      const snackbarTitle = await snackbarPO.title.getText();

      expect(snackbarTitle).toBe("Some of your selected draws have now closed");
    });
  });
});
