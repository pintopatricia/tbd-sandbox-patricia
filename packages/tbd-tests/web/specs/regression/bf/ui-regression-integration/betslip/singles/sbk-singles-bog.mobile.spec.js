const {
  MinimizedPO,
  SportPagePO,
  SportsbookReceiptPanelPO,
  SinglesCardPO,
  SinglePO,
  CardPO,
  BetslipDrawerPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  PrimaryButtonPO,
  CurrencyNumberInputFieldPO,
  BetDetailsPO,
  BetControlsPO,
  SportsbookPlacePanelPO,
} = require("../../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const EventMarketCardPO = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.po");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");

const sportPagePO = new SportPagePO();
const firstEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[0]);
const secondEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[1]);
const firstMatchOddsCard = new CardPO(firstEventMarketCardPO.market);
const secondMatchOddsCard = new CardPO(secondEventMarketCardPO.market);
const firstSbkMarketPO = new InlineSportsbookMarketPO(firstMatchOddsCard.inlineSportsbookMarket);
const secondSbkMarketPO = new InlineSportsbookMarketPO(secondMatchOddsCard.inlineSportsbookMarket);
const firstSbkRunnerPO = new SportsbookBetButtonPO(firstSbkMarketPO.betButtons[0]);
const secondSbkRunnerPO = new SportsbookBetButtonPO(secondSbkMarketPO.betButtons[0]);
const sportsbookMinimizedBetslipPO = new MinimizedPO();
const betslipDrawerPO = new BetslipDrawerPO();
const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const multiplePlaceButtonPO = new PrimaryButtonPO(sportsbookPlacePanelPO.place);
const singlePlacePanelBetDetailsPO = new BetDetailsPO(sportsbookPlacePanelPO.element);
const singlesCardsPO = new SinglesCardPO(sportsbookPlacePanelPO.element);
const firstSinglePO = new SinglePO(singlesCardsPO.singles[0]);
const secondSinglePO = new SinglePO(singlesCardsPO.singles[1]);
const firstSingleControlsPO = new BetControlsPO(firstSinglePO.element);
const secondSingleControlsPO = new BetControlsPO(secondSinglePO.element);
const firstSingleStakePO = new CurrencyNumberInputFieldPO(firstSingleControlsPO.currencyInput);
const secondSingleStakePO = new CurrencyNumberInputFieldPO(secondSingleControlsPO.currencyInput);
const firstSingleBetDetailsPO = new BetDetailsPO(firstSinglePO.element);
const secondSingleBetDetailsPO = new BetDetailsPO(secondSinglePO.element);
const receiptPanelPO = new SportsbookReceiptPanelPO();
const firstSingleReceiptBetDetailsPO = new BetDetailsPO(receiptPanelPO.singles[0]);
const secondSingleReceiptBetDetailsPO = new BetDetailsPO(receiptPanelPO.singles[1]);

const mockService = new MockService();

const EVENT_TYPE_ID = 1;

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.1",
      guaranteedPriceAvailable: true,
      runnerDetails: [
        {
          selectionId: "1",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "2",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "3",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: "924.2",
      guaranteedPriceAvailable: true,
      runnerDetails: [
        {
          selectionId: "4",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "5",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "6",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
  ],
};

const BFF_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        cardGroupTitle: "League",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
                title: "Team A vs Team B",
                fixture: {
                  urn: "ppb:fixture:29359895",
                  home: {
                    name: "Team B",
                  },
                  away: {
                    name: "Team A",
                  },
                },
                sportevent: {
                  name: "Team A vs Team B ",
                  urn: "ppb:event:29359895",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.1",
                      noLiveData: true,
                      marketType: "MATCH_ODDS_90",
                      name: "Match Odds 90",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team B v Team A",
                          urn: "ppb:event:29359895",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.1/1",
                          selectionId: 1,
                          name: "Team B",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/2",
                          selectionId: 2,
                          name: "Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/3",
                          selectionId: 3,
                          name: "Team A",
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
        viewAll: {
          icon: null,
          label: "View All",
          viewLink: { viewUrn: "ppb:tbd:view:external:external", viewUrl: "https://betfair.com" },
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
        cardGroupTitle: "League 2",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359896",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359896",
                title: "Team A 2 vs Team B 2",
                fixture: {
                  urn: "ppb:fixture:29359896",
                  home: {
                    name: "Team B 2",
                  },
                  away: {
                    name: "Team A 2",
                  },
                },
                sportevent: {
                  name: "Team A 2 vs Team B 2",
                  urn: "ppb:event:29359896",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.2",
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team B 2 v Team A 2",
                          urn: "ppb:event:29359896",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.2/4",
                          selectionId: 4,
                          name: "Team B 2",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.2/5",
                          selectionId: 5,
                          name: "Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.2/6",
                          selectionId: 6,
                          name: "Team A 2",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.2/4" },
                      { runnerURN: "ppb:sbkRunner:924.2/5" },
                      { runnerURN: "ppb:sbkRunner:924.2/6" },
                    ],
                  },
                },
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
        urn: "ppb:tbd:card:group:topEventsInSport:1",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
      },
    },
  ],
};

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.1",
          selectionId: 1,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
};

const FIRST_SINGLE_ODDS_MOCK = {
  availablePriceTypes: ["LIVE_PRICE", "GUARANTEED_PRICE"],
  runner: {
    marketId: "924.1",
    selectionId: 1,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.1,
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.2",
          selectionId: 4,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
};

const SECOND_SINGLE_ODDS_MOCK = {
  availablePriceTypes: ["LIVE_PRICE", "GUARANTEED_PRICE"],
  runner: {
    marketId: "924.2",
    selectionId: 4,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.1,
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const DOUBLE_MOCK = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    {
      betType: "DOUBLE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      numLines: 1,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 2.4,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 2.4 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const SPB_MOCK = {
  result: [
    {
      runners: [
        {
          runner: {
            marketId: "924.1",
            selectionId: 1,
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [
              {
                runner: {
                  marketId: "924.1",
                  selectionId: 1,
                },
              },
            ],
          },
          winOdds: { decimalDisplayOdds: { decimalOdds: 2.5 } },
        },
      ],

      totalStake: 0.12,
      totalPotentialWin: 2.5,
      betPrice: { decimalDisplayOdds: { decimalOdds: 2.5 } },
      originalTotalPotentialWin: 2,
      originalBetPrice: { decimalDisplayOdds: { decimalOdds: 2 } },
    },
    {
      runners: [
        {
          runner: {
            marketId: "924.2",
            selectionId: 4,
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [
              {
                runner: {
                  marketId: "924.2",
                  selectionId: 4,
                },
              },
            ],
          },
          winOdds: { decimalDisplayOdds: { decimalOdds: 2.5 } },
        },
      ],

      totalStake: 0.12,
      totalPotentialWin: 2,
      betPrice: { decimalDisplayOdds: { decimalOdds: 2 } },
    },
  ],
};

describe("Betslip - BOG", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
    await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
    await browser.waitUntilDisplayed(sportPagePO.actionLink[0]);
    await browser.waitUntilEquals(firstSbkRunnerPO.odd, "1.1");
  });

  describe("When the betslip place panel is opened with 1 selection that has BOG", () => {
    beforeAll(async () => {
      await firstSbkRunnerPO.sportsbookBetButton.waitForClickable();
      await firstSbkRunnerPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Selection hasn't been added");
      await browser.waitUntilDisplayed(
        singlePlacePanelBetDetailsPO.bog,
        "BOG signposting wasn't displayed in single place panel",
      );
    });

    it("[PRPI-8106] The bet details should display with BOG signposting", async () => {
      expect(await singlePlacePanelBetDetailsPO.bog.isDisplayed()).toBe(true);
    });
  });

  describe("When I add a second selection with BOG to the betslip", () => {
    beforeAll(async () => {
      await betslipDrawerPO.header.waitForClickable();
      await betslipDrawerPO.header.click();
      await browser.waitUntilNotDisplayed(sportsbookPlacePanelPO.element, "Singles panel hasn't been minimized");

      await secondSbkRunnerPO.sportsbookBetButton.scrollIntoView({
        block: "center",
      });
      await browser.waitUntilDisplayed(secondSbkRunnerPO.sportsbookBetButton, "Second runner bet button not visible");

      await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
      await secondSbkRunnerPO.sportsbookBetButton.waitForClickable();
      await secondSbkRunnerPO.sportsbookBetButton.click();

      await browser.waitUntilDisplayed(sportsbookMinimizedBetslipPO.counter);
      await browser.waitUntil(
        async () => {
          const title = await sportsbookMinimizedBetslipPO.counter.getText();

          return title.includes("2");
        },
        {
          timeoutMsg: "2 Leg multiple was not combined",
        },
      );

      await sportsbookMinimizedBetslipPO.element.waitForClickable();
      await sportsbookMinimizedBetslipPO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Multiples panel hasn't been expanded");

      await secondSingleBetDetailsPO.element.scrollIntoView({
        block: "center",
      });
      await browser.waitUntilDisplayed(secondSingleBetDetailsPO.element, "Second single not visible");

      await browser.waitUntilDisplayed(firstSingleBetDetailsPO.bog, "BOG signposting wasn't displayed in first single");
      await browser.waitUntilDisplayed(
        secondSingleBetDetailsPO.bog,
        "BOG signposting wasn't displayed in second single",
      );
    });

    it("[PRPI-8107] The first single bet details should display the ninety minute icon", async () => {
      expect(await firstSingleBetDetailsPO.ninetyMinIcon.isDisplayed()).toBe(true);
    });

    it("[PRPI-8108] The second single bet details should not display the ninety minute icon", async () => {
      expect(await secondSingleBetDetailsPO.ninetyMinIcon.isDisplayed()).toBe(false);
    });

    it("[PRPI-8109] The first single bet details should display with BOG signposting", async () => {
      expect(await firstSingleBetDetailsPO.bog.isDisplayed()).toBe(true);
    });

    it("[PRPI-8110] The second single bet details should display with BOG signposting", async () => {
      expect(await secondSingleBetDetailsPO.bog.isDisplayed()).toBe(true);
    });
  });

  describe("When I place both bets", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK));

      await firstSingleStakePO.element.scrollIntoView({ block: "center" });
      await firstSingleStakePO.setValue(1);

      await secondSingleStakePO.element.scrollIntoView({ block: "center" });
      await secondSingleStakePO.setValue(2);

      await multiplePlaceButtonPO.element.waitForClickable();
      await multiplePlaceButtonPO.element.click();
      await browser.waitUntilDisplayed(receiptPanelPO.element, "Receipt panel wasn't displayed");
    });

    it("[PRPI-8111] The first single bet receipt should display the ninety minute icon", async () => {
      expect(await firstSingleReceiptBetDetailsPO.ninetyMinIcon.isDisplayed()).toBe(true);
    });

    it("[PRPI-8112] The second single bet receipt should not display the ninety minute icon", async () => {
      expect(await secondSingleReceiptBetDetailsPO.ninetyMinIcon.isDisplayed()).toBe(false);
    });

    it("[PRPI-8113] The first single bet receipt should display with BOG signposting", async () => {
      expect(await firstSingleReceiptBetDetailsPO.bog.isDisplayed()).toBe(true);
    });

    it("[PRPI-8114] The second single bet receipt should display with BOG signposting", async () => {
      expect(await secondSingleReceiptBetDetailsPO.bog.isDisplayed()).toBe(true);
    });
  });
});
