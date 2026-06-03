const {
  MinimizedPO,
  SportPagePO,
  SportsbookConfirmPO,
  MultiBetBuilderPO,
  BetLegsPO,
  CardPO,
  BetControlsPO,
  BetslipDrawerPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  CurrencyNumberInputFieldPO,
  BetsSummaryPO,
  PNLAndWhatIfPO,
  PrimaryButtonPO,
  SecondaryButtonPO,
  AlertPO,
  BetSelectionDetailsPO,
  SportsbookPlacePanelPO,
} = require("../../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const EventMarketCardPO = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.po");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");
const { advanceToConfirmStep } = require("../../../../../../helpers/betslip.util");

const sportPagePO = new SportPagePO();
const sportsbookMinimizedBetslipPO = new MinimizedPO();
const summaryPO = new BetsSummaryPO();
const firstEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[0]);
const secondEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[1]);
const thirdEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[2]);
const firstMatchOddsCard = new CardPO(firstEventMarketCardPO.market);
const secondMatchOddsCard = new CardPO(secondEventMarketCardPO.market);
const thirdMatchOddsCard = new CardPO(thirdEventMarketCardPO.market);
const firstSbkMarketPO = new InlineSportsbookMarketPO(firstMatchOddsCard.inlineSportsbookMarket);
const secondSbkMarketPO = new InlineSportsbookMarketPO(secondMatchOddsCard.inlineSportsbookMarket);
const thirdSbkMarketPO = new InlineSportsbookMarketPO(thirdMatchOddsCard.inlineSportsbookMarket);
const firstSbkRunnerPO = new SportsbookBetButtonPO(firstSbkMarketPO.betButtons[0]);
const secondSbkRunnerPO = new SportsbookBetButtonPO(secondSbkMarketPO.betButtons[0]);
const thirdSbkRunnerPO = new SportsbookBetButtonPO(thirdSbkMarketPO.betButtons[0]);
const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const sportsbookConfirmPO = new SportsbookConfirmPO();

const betslipDrawerPO = new BetslipDrawerPO();

const multipleControlsPO = new BetControlsPO(sportsbookPlacePanelPO.collapsableSections[0]);

const multipleStakeInputFieldPO = new CurrencyNumberInputFieldPO(multipleControlsPO.currencyInput);
const multipleReturnValuesPO = new PNLAndWhatIfPO(multipleControlsPO.returnsValueContainer);

const placeButtonPO = new PrimaryButtonPO(sportsbookPlacePanelPO.place);
const editButtonPO = new SecondaryButtonPO(sportsbookConfirmPO.edit);
const confirmButtonPO = new PrimaryButtonPO(sportsbookConfirmPO.place);

const multiBetBuilderPO = new MultiBetBuilderPO(sportsbookPlacePanelPO.element);

const placeNotification = new AlertPO(sportsbookPlacePanelPO.element);

const betLegsPO = new BetLegsPO(multiBetBuilderPO.element);

const firstSelectionDetails = new BetSelectionDetailsPO(betLegsPO.selections[0]);
const secondSelectionDetails = new BetSelectionDetailsPO(betLegsPO.selections[1]);
const thirdSelectionDetails = new BetSelectionDetailsPO(betLegsPO.selections[2]);

const mockService = new MockService();
const EVENT_TYPE_ID = 1;

const confirmButtonsElements = {
  placeButtonElement: placeButtonPO.element,
  editButtonElement: editButtonPO.element,
};

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.1",
      eachwayAvailable: true,
      runnerDetails: [
        {
          selectionId: "1",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
          },
        },
        {
          selectionId: "2",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.2 },
            },
          },
        },
        {
          selectionId: "3",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
          },
        },
      ],
    },
    {
      marketId: "924.2",
      eachwayAvailable: true,
      runnerDetails: [
        {
          selectionId: "11",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
          },
        },
        {
          selectionId: "22",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
          },
        },
        {
          selectionId: "33",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
          },
        },
      ],
    },
    {
      marketId: "924.3",
      eachwayAvailable: true,
      runnerDetails: [
        {
          selectionId: "111",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
          },
        },
        {
          selectionId: "222",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
          },
        },
        {
          selectionId: "333",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
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
                  name: "Home Team vs Away Team",
                  openDate: "2010-10-14T18:45",
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
                      name: "Match Odds",
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
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:29359896",
                  openDate: "2010-10-14T18:45",
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
                          runnerURN: "ppb:sbkRunner:924.2/11",
                          selectionId: 11,
                          name: "Team B 2",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.2/22",
                          selectionId: 22,
                          name: "Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.2/32",
                          selectionId: 33,
                          name: "Team A 2",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.2/11" },
                      { runnerURN: "ppb:sbkRunner:924.2/22" },
                      { runnerURN: "ppb:sbkRunner:924.2/33" },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:3",
        cardGroupTitle: "League 3",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359897",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359897",
                title: "Team A 3 vs Team B 3",
                fixture: {
                  urn: "ppb:fixture:29359897",
                  home: {
                    name: "Team B 3",
                  },
                  away: {
                    name: "Team A 3",
                  },
                },
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:29359897",
                  openDate: "2010-10-14T18:45",
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
                      urn: "ppb:sbkMarket:924.3",
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team B 3 v Team A 3",
                          urn: "ppb:event:29359897",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.3/111",
                          selectionId: 111,
                          name: "Team B 3",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.3/222",
                          selectionId: 222,
                          name: "Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.3/333",
                          selectionId: 333,
                          name: "Team A 3",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.3/111" },
                      { runnerURN: "ppb:sbkRunner:924.3/222" },
                      { runnerURN: "ppb:sbkRunner:924.3/333" },
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
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:3",
      },
    },
  ],
};

const FIRST_RUNNER = { marketId: "924.1", selectionId: 1 };
const SECOND_RUNNER = { marketId: "924.2", selectionId: 11 };
const THIRD_RUNNER = { marketId: "924.3", selectionId: 111 };

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [FIRST_RUNNER],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: FIRST_RUNNER,
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
    decimalDisplayOdds: { decimalOdds: 1.1 },
  },
};

const SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [SECOND_RUNNER],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: SECOND_RUNNER,
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
    decimalDisplayOdds: { decimalOdds: 1.1 },
  },
};

const TWO_SINGLES_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const THIRD_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [THIRD_RUNNER],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const THIRD_SINGLE_ODDS_MOCK = {
  runner: THIRD_RUNNER,
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
    decimalDisplayOdds: { decimalOdds: 1.1 },
  },
};

const TREBLE_MULTI_SGM_MOCK = {
  betType: "TREBLE",
  features: ["SGM_MULTIPLES"],
  legCombinations: [{ runners: [FIRST_RUNNER] }, { runners: [SECOND_RUNNER] }, { runners: [THIRD_RUNNER] }],
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 2.4,
  betMinStakeIncrement: 0.01,
  winAverageOdds: 2.4,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 2.4 } },
    decimalDisplayOdds: { decimalOdds: 2.4 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const DOUBLE_MULTI_SGM_MOCK = {
  betType: "DOUBLE",
  features: ["SGM_MULTIPLES"],
  legCombinations: [{ runners: [SECOND_RUNNER] }, { runners: [THIRD_RUNNER] }],
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 2.4,
  betMinStakeIncrement: 0.01,
  winAverageOdds: 2.4,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 2.4 } },
    decimalDisplayOdds: { decimalOdds: 2.4 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const MULTI_BET_BUILDER_MOCK = {
  betCombinations: [TREBLE_MULTI_SGM_MOCK, FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, THIRD_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

const MULTI_BET_BUILDER_MOCK_FAILURES = {
  betCombinations: [DOUBLE_MULTI_SGM_MOCK, FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, THIRD_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
  betFailures: [
    {
      failedRunner: {
        marketId: "924.1",
        selectionId: 1,
      },
      failureCode: "MARKET_SUSPENDED",
    },
  ],
};

const SMP_MOCK_FIRST_UPDATE = {
  markets: [
    {
      selectionId: "1",
      runnerOdds: {
        decimalDisplayOdds: { decimalOdds: 1.1 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      runnerStatus: "SUSPENDED",
      eachwayRunnerOdds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.5 },
        },
      },
    },
    {
      selectionId: "2",
      runnerOdds: {
        decimalDisplayOdds: { decimalOdds: 1.2 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      eachwayRunnerOdds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.2 },
        },
      },
    },
    {
      selectionId: "3",
      runnerOdds: {
        decimalDisplayOdds: { decimalOdds: 1.3 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      eachwayRunnerOdds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.5 },
        },
      },
    },
  ],
};

const SMP_MOCK_SECOND_UPDATE = {
  markets: [
    {
      selectionId: "1",
      runnerOdds: {
        decimalDisplayOdds: { decimalOdds: 1.1 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      eachwayRunnerOdds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.5 },
        },
      },
    },
    {
      selectionId: "2",
      runnerOdds: {
        decimalDisplayOdds: { decimalOdds: 1.2 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      eachwayRunnerOdds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.2 },
        },
      },
    },
    {
      selectionId: "3",
      runnerOdds: {
        decimalDisplayOdds: { decimalOdds: 1.3 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      eachwayRunnerOdds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.5 },
        },
      },
    },
  ],
};

describe("Betslip - Confirm SBK Multi Bet Builder", () => {
  beforeAll(async () => {
    const indexHTML = await getIndexHTML(BFF_MOCK.urn, {
      BET_CONFIRMATION_STEP: { isActive: true },
    });
    await Promise.all([
      mockService.mockHttpRequest(indexHTML),
      mockService.mockHttpRequest(getSportsLayout(BFF_MOCK)),
      mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true })),
      mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK)),
    ]);
  });

  describe("when user adds 3 selections to the betslip", () => {
    beforeAll(async () => {
      await browser.url(`${routes.getEventViewUrl(29359895)}`);
      await browser.waitUntilDisplayed(sportPagePO.actionLink[0]);
      await browser.waitUntilEquals(firstSbkRunnerPO.odd, "1.1");

      await firstSbkRunnerPO.sportsbookBetButton.click();

      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Waiting to display single sbk place panel");

      await betslipDrawerPO.header.click();

      await browser.waitUntilDisplayed(
        sportsbookMinimizedBetslipPO.element,
        "Waiting for minimized betslip to be displayed",
      );

      await secondSbkRunnerPO.sportsbookBetButton.scrollIntoView({
        block: "center",
      });
      await browser.waitUntilDisplayed(secondSbkRunnerPO.sportsbookBetButton, "Second runner bet button not visible");
      await mockService.mockHttpRequest(getImplyBetsResponse(TWO_SINGLES_MOCK));
      await secondSbkRunnerPO.sportsbookBetButton.click();
      await browser.waitUntilEquals(sportsbookMinimizedBetslipPO.counter, "2");

      await thirdSbkRunnerPO.sportsbookBetButton.scrollIntoView();
      await browser.waitUntilDisplayed(thirdSbkRunnerPO.sportsbookBetButton, "Third runner bet button not visible");
      await mockService.mockHttpRequest(getImplyBetsResponse(MULTI_BET_BUILDER_MOCK));
      await thirdSbkRunnerPO.sportsbookBetButton.click();
      await browser.waitUntilEquals(sportsbookMinimizedBetslipPO.counter, "3");

      await sportsbookMinimizedBetslipPO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element);
    });

    describe("when the user adds stake to the Multi Bet Builder", () => {
      beforeAll(async () => {
        await multipleStakeInputFieldPO.element.waitForClickable();
        await multipleStakeInputFieldPO.element.click();
        await multipleStakeInputFieldPO.setValue("0.12");
      });

      it("[PRPI-4042] should update the returns values on the selection level", async () => {
        expect(await multipleReturnValuesPO.element.getText()).toBe("$0.29");
      });

      it("[PRPI-4043] should update the returns values on the betslip level", async () => {
        expect(await summaryPO.totalReturnsValue.getText()).toBe("$0.29");
      });
    });

    describe("and the user advances to the confirm step", () => {
      beforeAll(async () => {
        await advanceToConfirmStep(confirmButtonsElements);
      });

      it("[PRPI-7776] should have the correct selections", async () => {
        expect(await betLegsPO.selections.length).toBe(3);
        expect(await firstSelectionDetails.title.getText()).toEqual("Team B");
        expect(await secondSelectionDetails.title.getText()).toEqual("Team B 2");
        expect(await thirdSelectionDetails.title.getText()).toEqual("Team B 3");
      });

      it("[PRPI-4044] should display the confirm screen", async () => {
        expect(await sportsbookConfirmPO.element.isDisplayedInViewport()).toBe(true);
      });

      it("[PRPI-7777] should display a multi bet build", async () => {
        expect(await multiBetBuilderPO.element.isDisplayedInViewport()).toBe(true);
      });

      describe("when one of the markets get suspended", () => {
        beforeAll(async () => {
          await Promise.all([
            mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_FIRST_UPDATE)),
            mockService.mockHttpRequest(getImplyBetsResponse(MULTI_BET_BUILDER_MOCK_FAILURES)),
          ]);

          await browser.tickFakeClock();

          await browser.waitUntilDisplayed(placeNotification.element, "The notification is not displayed");
          await browser.waitUntilEquals(placeNotification.message, "Odds and availability have changed");
        });

        it("[PRPI-4046] should disable the confirm button", async () => {
          expect(await confirmButtonPO.element.isEnabled()).toBe(false);
        });

        describe("and the user clicks the edit button", () => {
          beforeAll(async () => {
            await editButtonPO.element.click();
          });

          it("[PRPI-7778] should not display the confirm step", async () => {
            expect(await sportsbookConfirmPO.element.isDisplayedInViewport()).toBe(false);
          });

          describe("and the user adds a stake to the bet builder multi", () => {
            beforeAll(async () => {
              await multipleStakeInputFieldPO.element.waitForClickable();
              await multipleStakeInputFieldPO.element.click();
              await multipleStakeInputFieldPO.setValue("0.12");
            });

            it("[PRPI-4047] should update the return values on the selection level", async () => {
              expect(await multipleReturnValuesPO.element.getText()).toBe("$0.29");
            });

            it("[PRPI-4047] should update the return values on the betslip level", async () => {
              expect(await summaryPO.totalReturnsValue.getText()).toBe("$0.29");
            });

            describe("and the user advances to confirm step", () => {
              beforeAll(async () => {
                await advanceToConfirmStep(confirmButtonsElements);
              });

              it("[PRPI-4047] should display the confirm step", async () => {
                expect(await sportsbookConfirmPO.element.isDisplayedInViewport()).toBe(true);
              });

              it("[PRPI-4047] should have the correct selections", async () => {
                expect(await betLegsPO.selections.length).toBe(2);
                expect(await firstSelectionDetails.title.getText()).toEqual("Team B 2");
                expect(await secondSelectionDetails.title.getText()).toEqual("Team B 3");
              });

              describe("when the suspended market gets available again", () => {
                beforeAll(async () => {
                  await Promise.all([
                    mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_SECOND_UPDATE)),
                    mockService.mockHttpRequest(getImplyBetsResponse(MULTI_BET_BUILDER_MOCK)),
                  ]);

                  await browser.tickFakeClock();

                  await browser.waitUntilDisplayed(placeNotification.element, "The notification is not displayed");
                  await browser.waitUntilEquals(placeNotification.message, "Odds and availability have changed");
                });

                it("[PRPI-4047] should disable the confirm button", async () => {
                  expect(await confirmButtonPO.element.isEnabled()).toBe(false);
                });
              });
            });
          });
        });
      });
    });
  });
});
