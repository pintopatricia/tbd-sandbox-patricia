const {
  SportsbookPlacePanelPO,
  LottoCardPO,
  PrimaryButtonPO,
  BetControlsPO,
  CurrencyNumberInputFieldPO,
  SportsbookReceiptPanelPO,
} = require("../../../../page-objects");
const NavigationTabsListPO = require("@ppb/tbd-shared/components/NavigationTabsList/NavigationTabsList.po");
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getSportsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { addStake } = require("../../../../helpers/betslip.util");

const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const MODULE_NAME = "betslip_lotto_card";

const navigationTabsListPO = new NavigationTabsListPO();
const lottoCardPO = new LottoCardPO(navigationTabsListPO.tabItems[0]);
const placePanelPO = new SportsbookPlacePanelPO();
const primaryButton = new PrimaryButtonPO();

const controlsPO = new BetControlsPO(placePanelPO.element);
const sportsbookStakeInputPO = new CurrencyNumberInputFieldPO(controlsPO.currencyInput);
const sportsbookReceiptPanelPO = new SportsbookReceiptPanelPO();
const placeButtonPO = new PrimaryButtonPO(placePanelPO.place);

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
        __typename: "GenericSwitcherCard",
        urn: `ppb:tbd:card:genericswitcher:sport:${EVENT_TYPE_ID}`,
        filterTitle: {
          translated: null,
          translate: {
            key: "I18N.SWITCHER.SPORT.TITLE",
          },
        },
        selectedViewLink: {
          label: "Lotteries",
          viewLink: {
            viewUrn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
            viewUrl: `lotteries/s-${EVENT_TYPE_ID}`,
          },
        },
      },
    },
    {
      node: {
        __typename: "NavigationTabsList",
        urn: `ppb:tbd:card:navigationTabsList:aKdANhAAACEAf-Ca/s/${EVENT_TYPE_ID}`,
        tabsTitle: {
          translated: "Lotteries",
        },
        full: {
          edges: [
            {
              node: {
                __typename: "NavigationTab",
                urn: `ppb:tbd:view:navigationTab:aKdAjxAAAB8Af-Er/s/${EVENT_TYPE_ID}`,
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
                },
                partials: {
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
                urn: `ppb:tbd:view:navigationTab:aKdAjxAAAB8Af-Er/s/${EVENT_TYPE_ID}`,
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
        urn: `ppb:tbd:card:genericswitcher:sport:${EVENT_TYPE_ID}`,
        __typename: "GenericSwitcherCard",
      },
    },
    {
      node: {
        urn: `ppb:tbd:card:navigationTabsList:aKdANhAAACEAf-Ca/s/${EVENT_TYPE_ID}`,
        __typename: "NavigationTabsList",
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

const BFF_GENERIC_SWITCHER_MOCK = {
  __typename: "GenericSwitcherCard",
  urn: `ppb:tbd:card:genericswitcher:sport:${EVENT_TYPE_ID}`,
  filterTitle: {
    translated: null,
    translate: {
      key: "I18N.SWITCHER.SPORT.TITLE",
    },
  },
  selectedViewLink: {
    label: "Lotteries",
    viewLink: {
      viewUrn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
      viewUrl: `lotteries/s-${EVENT_TYPE_ID}`,
    },
  },
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

describe("Betslip - Lotto Card", () => {
  describe("when adding a selection to the Betslip", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
      await mockService.mockHttpRequest(getCardResults({ cards: [BFF_GENERIC_SWITCHER_MOCK] }));
      await mockService.mockHttpRequest(getCardResults({ cards: [LOTTO_CARD_MOCK] }));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));

      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
      await browser.waitUntilDisplayed(lottoCardPO.content);
      await browser.waitUntilDisplayed(lottoCardPO.lottoBallsContainer);

      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_DOUBLE_MOCK, { ignoreLegsOrder: true }));

      await browser.tickFakeClock();

      const lottoBalls = await (await lottoCardPO.lottoBalls).getElement();

      await lottoBalls[1].waitForClickable();
      await lottoBalls[1].click();
      await lottoBalls[2].waitForClickable();
      await lottoBalls[2].click();
      await browser.waitUntilDisplayed(lottoCardPO.selectionsContainer);

      await primaryButton.element.waitForClickable();
      await primaryButton.element.click();

      await browser.waitUntilDisplayed(placePanelPO.element, "Sportsbook betslip not displayed", 500);
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1221]_should_see_betslip_open_with_double_one_line_bets`,
      );
    });

    it("[PRPI-1221]_should_see_betslip_open_with_double_one_line_bets", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1221]_should_see_betslip_open_with_double_one_line_bets`),
      ).toBeLessThanOrEqual(0.001);
    });
  });

  describe("when placing the bet", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getPlaceBet(SPB_DOUBLE_MOCK));
      await addStake(sportsbookStakeInputPO, "1");
      await placeButtonPO.element.waitForClickable();
      await placeButtonPO.element.click();
      await browser.waitUntilDisplayed(sportsbookReceiptPanelPO.element, 500);
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1222]_should_see_betreceipt_with_double_one_line_bets`);
    });

    it("[PRPI-1222]_should_see_betreceipt_with_double_one_line_bets", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1222]_should_see_betreceipt_with_double_one_line_bets`),
      ).toBeLessThanOrEqual(0.001);
    });
  });
});
