const {
  MinimizedPO,
  SportPagePO,
  SinglesCardPO,
  SinglePO,
  CardPO,
  BetControlsPO,
  BetsSummaryPO,
  PrimaryButtonPO,
  CurrencyNumberInputFieldPO,
  BetslipDrawerPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  FixedNumberInputFieldPO,
  BetDetailsPO,
  SelectionsBoardPO,
  SportsbookPlacePanelPO,
} = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const EventMarketCardPO = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.po");
const MultiLinesMultiplesPO = require("@ppb/tbd-shared/components/Betslip/MultiLinesMultiples/MultiLinesMultiples.web.po");
const OneLineMultiplePO = require("@ppb/tbd-shared/components/Betslip/OneLineMultiple/OneLineMultiple.web.po");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const sportPagePO = new SportPagePO();
const sportsbookMinimizedBetslipPO = new MinimizedPO();
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
const fourthSbkRunnerPO = new SportsbookBetButtonPO(thirdSbkMarketPO.betButtons[1]);
const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const singlesCardsPO = new SinglesCardPO(sportsbookPlacePanelPO.element);
const firstSingle = new SinglePO(singlesCardsPO.singles[0]);
const secondSingle = new SinglePO(singlesCardsPO.singles[1]);
const thirdSingle = new SinglePO(singlesCardsPO.singles[2]);
const fourthSingle = new SinglePO(singlesCardsPO.singles[3]);
const firstSingleControlsPO = new BetControlsPO(firstSingle.element);
const secondSingleControlsPO = new BetControlsPO(secondSingle.element);
const thirdSingleControlsPO = new BetControlsPO(thirdSingle.element);
const fourthSingleControlsPO = new BetControlsPO(fourthSingle.element);
const firstSingleOddPO = new FixedNumberInputFieldPO(firstSingleControlsPO.fixedInput);
const firstSingleStakePO = new CurrencyNumberInputFieldPO(firstSingleControlsPO.currencyInput);
const firstSingleBetDetailsPO = new BetDetailsPO(firstSingle.element);
const selectionsBoard = new SelectionsBoardPO(sportsbookPlacePanelPO.element);
const multipleControlsPO = new BetControlsPO(sportsbookPlacePanelPO.element);
const betsSummaryPO = new BetsSummaryPO(sportsbookPlacePanelPO.summary);
const placeButtonPO = new PrimaryButtonPO(sportsbookPlacePanelPO.place);
const multipleOddPO = new FixedNumberInputFieldPO(multipleControlsPO.fixedInput);
const multipleStakePO = new CurrencyNumberInputFieldPO(multipleControlsPO.currencyInput);
const oneLineMultiplePO = new OneLineMultiplePO();
const multiLinesMultiplesPO = new MultiLinesMultiplesPO();
const betslipDrawerPO = new BetslipDrawerPO();

const mockService = new MockService();

const EVENT_TYPE_ID = 1;

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.1",
      runnerDetails: [
        {
          selectionId: "1",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.1 },
            },
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
        {
          selectionId: "2",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.2 },
            },
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "3",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.3 },
            },
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 3 },
          },
        },
      ],
    },
    {
      marketId: "924.2",
      runnerDetails: [
        {
          selectionId: "1",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.1 },
            },
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "2",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.2 },
            },
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "3",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.3 },
            },
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: "924.3",
      runnerDetails: [
        {
          selectionId: "1",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.1 },
            },
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "2",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.2 },
            },
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "3",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.3 },
            },
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
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
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
                  urn: "ppb:event:12345",
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
                          runnerURN: "ppb:sbkRunner:924.2/1",
                          selectionId: 1,
                          name: "Team B 2",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.2/2",
                          selectionId: 2,
                          name: "Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.2/3",
                          selectionId: 3,
                          name: "Team A 2",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.2/1" },
                      { runnerURN: "ppb:sbkRunner:924.2/2" },
                      { runnerURN: "ppb:sbkRunner:924.2/3" },
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
                  urn: "ppb:event:12345",
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
                          runnerURN: "ppb:sbkRunner:924.3/1",
                          selectionId: 1,
                          name: "Team B 3",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.3/2",
                          selectionId: 2,
                          name: "Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.3/3",
                          selectionId: 3,
                          name: "Team A 3",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.3/1" },
                      { runnerURN: "ppb:sbkRunner:924.3/2" },
                      { runnerURN: "ppb:sbkRunner:924.3/3" },
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
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 3.08 },
    },
    decimalDisplayOdds: { decimalOdds: 3.08 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.1",
    selectionId: 1,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 3.08 },
    },
    decimalDisplayOdds: { decimalOdds: 3.08 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.2",
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
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 3.08 },
    },
    decimalDisplayOdds: { decimalOdds: 3.08 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.2",
    selectionId: 1,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 3.08 },
    },
    decimalDisplayOdds: { decimalOdds: 3.08 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const THIRD_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.3",
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
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: { decimalOdds: 1.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const THIRD_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.3",
    selectionId: 1,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: { decimalOdds: 1.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const FOURTH_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.3",
          selectionId: 2,
        },
      ],
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
    decimalDisplayOdds: { decimalOdds: 1.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const FOURTH_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.3",
    selectionId: 2,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: { decimalOdds: 1.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const TREBLE_MOCK = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    THIRD_SINGLE_MOCK,
    FOURTH_SINGLE_MOCK,
    {
      betType: "TREBLE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      numLines: 2,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 9.56,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 9.56 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
    {
      betType: "DOUBLE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 2.4,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 2.4 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      numLines: 5,
    },
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK, FOURTH_SINGLE_ODDS_MOCK],
};

const DOUBLE_MOCK = {
  betCombinations: [
    SECOND_SINGLE_MOCK,
    THIRD_SINGLE_MOCK,
    FOURTH_SINGLE_MOCK,
    {
      betType: "DOUBLE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 2.4,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 2.4 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      numLines: 2,
    },
  ],

  runnerOdds: [SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK, FOURTH_SINGLE_ODDS_MOCK],
};

describe("Sportsbook stake calculations", () => {
  describe("when adding four selections to betslip and the betslip is opened", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await mockService.mockHttpRequest(
        getImplyBetsResponse({ betCombinations: [FIRST_SINGLE_MOCK], runnerOdds: [FIRST_SINGLE_ODDS_MOCK] }),
      );

      await browser.url(`${routes.getSportViewUrl(EVENT_TYPE_ID)}`);
      await browser.waitUntilDisplayed(sportPagePO.actionLink[0]);
      await browser.waitUntilEquals(firstSbkRunnerPO.odd, "1.1");

      // Add first selection and collapse
      await firstSbkRunnerPO.sportsbookBetButton.waitForClickable();
      await firstSbkRunnerPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element);
      await betslipDrawerPO.header.click();
      await browser.waitUntilDisplayed(sportsbookMinimizedBetslipPO.element);

      // Add second selection
      await secondSbkRunnerPO.sportsbookBetButton.scrollIntoView({
        block: "center",
      });
      await browser.waitUntilDisplayed(secondSbkRunnerPO.sportsbookBetButton, "Second runner bet button not visible");
      await secondSbkRunnerPO.sportsbookBetButton.click();

      // Add third selection
      await thirdSbkRunnerPO.sportsbookBetButton.scrollIntoView({
        block: "center",
      });
      await browser.waitUntilDisplayed(thirdSbkRunnerPO.sportsbookBetButton, "Third runner bet button not visible");
      await thirdSbkRunnerPO.sportsbookBetButton.click();

      // Add fourth selection
      await fourthSbkRunnerPO.sportsbookBetButton.scrollIntoView({
        block: "center",
      });
      await browser.waitUntilDisplayed(fourthSbkRunnerPO.sportsbookBetButton, "Fourth runner bet button not visible");
      await mockService.mockHttpRequest(getImplyBetsResponse(TREBLE_MOCK));
      await fourthSbkRunnerPO.sportsbookBetButton.click();

      await browser.waitUntil(
        async () => {
          const title = await sportsbookMinimizedBetslipPO.title.getText();

          return title.includes("Betslip");
        },
        {
          timeoutMsg: "Legs were not combined",
        },
      );
      await sportsbookMinimizedBetslipPO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element);
    });

    it("[PRPI-5625] should have a collapsed collapse with 4 selections", async () => {
      expect(await selectionsBoard.title.getText()).toBe("4 Selections");
    });

    it("[PRPI-5626] should have two multiple bets", async () => {
      expect(await oneLineMultiplePO.element.isDisplayed()).toBe(true);
      expect(await multiLinesMultiplesPO.multiples.length).toBe(1);
    });

    it("[PRPI-5627] should have current multiple price input field non-editable", async () => {
      expect(!!(await multipleOddPO.numberField.getAttribute("readonly"))).toBe(true);
    });

    it("[PRPI-5628] should have current multiple stake input field editable", async () => {
      expect(!!(await multipleStakePO.numberField.getAttribute("readonly"))).toBe(false);
      expect(await multipleStakePO.numberField.isEnabled()).toBe(true);
    });

    it("[PRPI-5629] should have 4 singles cards", async () => {
      expect(await singlesCardsPO.singles.length).toBe(4);
    });

    it("[PRPI-5630] should show a label with value 'Returns $0.00' on all single cards", async () => {
      expect(await firstSingleControlsPO.returns.isDisplayed()).toBe(true);
      expect(await secondSingleControlsPO.returns.isDisplayed()).toBe(true);
      expect(await thirdSingleControlsPO.returns.isDisplayed()).toBe(true);
      expect(await fourthSingleControlsPO.returns.isDisplayed()).toBe(true);

      expect(await firstSingleControlsPO.returnsLabel.getText()).toBe("Returns");
      expect(await firstSingleControlsPO.returnsValueContainer.getText()).toBe("$0.00");
      expect(await secondSingleControlsPO.returnsLabel.getText()).toBe("Returns");
      expect(await secondSingleControlsPO.returnsValueContainer.getText()).toBe("$0.00");
      expect(await thirdSingleControlsPO.returnsLabel.getText()).toBe("Returns");
      expect(await thirdSingleControlsPO.returnsValueContainer.getText()).toBe("$0.00");
      expect(await fourthSingleControlsPO.returnsLabel.getText()).toBe("Returns");
      expect(await fourthSingleControlsPO.returnsValueContainer.getText()).toBe("$0.00");
    });

    it("[PRPI-5631] should show a label with value 'Returns $0.00' on the multiple card", async () => {
      expect(await multipleControlsPO.returns.isDisplayed()).toBe(true);
      expect(await multipleControlsPO.returnsLabel.getText()).toBe("Returns");
      expect(await multipleControlsPO.returnsValueContainer.getText()).toBe("$0.00");
    });

    it("[PRPI-5632] should have a selection title of the name of the runner", async () => {
      expect(await firstSingleBetDetailsPO.title.getText()).toBe("Team B");
    });

    it("[PRPI-5633] should have a selection subtitle in the format of 'Market Name - Event Name'", async () => {
      expect(await firstSingleBetDetailsPO.subtitle.getText()).toBe("Match Odds - Team B v Team A");
    });

    it("[PRPI-5634] should have a trash can button visible", async () => {
      expect(await firstSingleBetDetailsPO.remove.isDisplayed()).toBe(true);
    });

    it("[PRPI-5635] should have a odd of 3.08 in the field", async () => {
      expect(await firstSingleOddPO.numberField.getAttribute("value")).toBe("3.08");
    });

    it("[PRPI-5636] should have a non-editable price input field", async () => {
      expect(!!(await firstSingleOddPO.numberField.getAttribute("readonly"))).toBe(true);
    });

    it("[PRPI-5637] should have an editable stake input field", async () => {
      expect(!!(await firstSingleStakePO.numberField.getAttribute("readonly"))).toBe(false);
      expect(await firstSingleStakePO.numberField.isEnabled()).toBe(true);
    });

    it("[PRPI-5638] should have a balance after bet as '$0.00'", async () => {
      expect(await betsSummaryPO.leftSegmentValue.getText()).toBe("$0.00");
    });

    it("[PRPI-5639] should have a balance after bet label as 'Balance After Bet'", async () => {
      expect(await betsSummaryPO.leftSegmentLabel.getText()).toBe("Balance After Bet");
    });

    it("[PRPI-5640] should have a stake button label that with 'Please Enter Stake'", async () => {
      expect(await placeButtonPO.label.getText()).toBe("Please Enter Stake");
    });

    it("[PRPI-5641] should have a total returns field as '$0.00'", async () => {
      expect(await betsSummaryPO.totalReturnsValue.getText()).toBe("$0.00");
    });

    it("[PRPI-5642] should have a total returns label as 'Total Returns'", async () => {
      expect(await betsSummaryPO.totalReturnsLabel.getText()).toBe("Total Returns");
    });

    it("[PRPI-5643] should have a disabled place button", async () => {
      expect(await placeButtonPO.element.isEnabled()).toBe(false);
    });

    it("[PRPI-5644] should have a visible trash can", async () => {
      expect(await sportsbookPlacePanelPO.removeAll.isDisplayed()).toBe(true);
    });

    it("[PRPI-5645] should have a disabled summary", async () => {
      expect(await betsSummaryPO.element.getAttribute("aria-disabled")).toBe("true");
    });

    describe("When I add a 0.12 stake value to the currently selected multiple with odd 9.56", () => {
      beforeAll(async () => {
        await multipleStakePO.element.scrollIntoView({ block: "center" });
        await browser.waitUntilDisplayed(multipleStakePO.element);

        await multipleStakePO.numberField.waitForClickable();
        await multipleStakePO.numberField.click();
        await multipleStakePO.setValue("0.12");
      });

      it("[PRPI-5646] should show the currency symbol in the input as '$'", async () => {
        expect(await multipleStakePO.currencySymbol.isDisplayed()).toBe(true);
        expect(await multipleStakePO.currencySymbol.getText()).toBe("$");
      });

      it("[PRPI-5647] should show a label with value 'Returns $2.29'", async () => {
        expect(await multipleControlsPO.returns.isDisplayed()).toBe(true);
        expect(await multipleControlsPO.returnsLabel.getText()).toBe("Returns");
        expect(await multipleControlsPO.returnsValueContainer.getText()).toBe("$2.29");
      });

      it("[PRPI-5648] should have a balance after bet as 'N/A'", async () => {
        expect(await betsSummaryPO.leftSegmentValue.getText()).toBe("N/A");
      });

      it("[PRPI-5649] should have total returns field be populated with value '$2.29'", async () => {
        expect(await betsSummaryPO.totalReturnsValue.getText()).toBe("$2.29");
      });

      it("[PRPI-5650] should have an enabled summary", async () => {
        expect(await betsSummaryPO.element.getAttribute("aria-disabled")).toBe("false");
      });

      it("[PRPI-5651] should have an enabled place button", async () => {
        expect(await placeButtonPO.element.isEnabled()).toBe(true);
      });

      it("[PRPI-5652] should have a stake button label that contains '$0.24'", async () => {
        expect(await placeButtonPO.label.getText()).toContain("$0.24");
      });

      describe("When I remove a combinable selection from betslip", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
          await firstSingleBetDetailsPO.remove.click();
          await browser.waitUntilEquals(multipleStakePO.numberField, "");
        });

        it("[PRPI-5653] should clear the stake from the currently selected multiple", async () => {
          expect(await multipleStakePO.numberField.getAttribute("value")).toBe("");
        });

        it("[PRPI-5654] should show a label with value 'Returns $0.00'", async () => {
          expect(await multipleControlsPO.returns.isDisplayed()).toBe(true);
          expect(await multipleControlsPO.returnsLabel.getText()).toBe("Returns");
          expect(await multipleControlsPO.returnsValueContainer.getText()).toBe("$0.00");
        });

        it("[PRPI-5655] should have a total stake field as '$0.00'", async () => {
          expect(await betsSummaryPO.leftSegmentValue.getText()).toBe("$0.00");
        });

        it("[PRPI-5655] should have a total returns field as '$0.00'", async () => {
          expect(await betsSummaryPO.totalReturnsValue.getText()).toBe("$0.00");
        });

        it("[PRPI-5655] should have a disabled place bet button", async () => {
          expect(await betsSummaryPO.element.getAttribute("aria-disabled")).toBe("true");
        });

        describe("When I add stake value 0.12 on the first single selection with odd 3.08", () => {
          beforeAll(async () => {
            await firstSingleStakePO.element.scrollIntoView({ block: "center" });
            await browser.waitUntilDisplayed(firstSingleStakePO.element);
            await firstSingleStakePO.setValue("0.12");
          });

          it("[PRPI-5656] should show a label with value 'Returns $0.37'", async () => {
            expect(await firstSingleControlsPO.returns.isDisplayed()).toBe(true);
            expect(await firstSingleControlsPO.returnsLabel.getText()).toBe("Returns");
            expect(await firstSingleControlsPO.returnsValueContainer.getText()).toBe("$0.37");
          });

          it("[PRPI-5656] should have a balance after bet as 'N/A'", async () => {
            expect(await betsSummaryPO.leftSegmentValue.getText()).toBe("N/A");
          });

          it("[PRPI-5656] should have total returns field be populated with value '$0.37'", async () => {
            expect(await betsSummaryPO.totalReturnsValue.getText()).toBe("$0.37");
          });

          it("[PRPI-5656] should have an enabled place button", async () => {
            expect(await placeButtonPO.element.isEnabled()).toBe(true);
          });

          it("[PRPI-5656] should have a stake button label that contains '$0.12'", async () => {
            expect(await placeButtonPO.label.getText()).toContain("$0.12");
          });

          describe("When editing the stake value of the single selection for 0.20 with odd 3.08", () => {
            beforeAll(async () => {
              await firstSingleStakePO.element.scrollIntoView({ block: "center" });
              await browser.waitUntilDisplayed(firstSingleStakePO.element);
              await firstSingleStakePO.setValue("0.20");
            });

            it("[PRPI-5656] should show a label with new value 'Returns $0.62'", async () => {
              expect(await firstSingleControlsPO.returns.isDisplayed()).toBe(true);
              expect(await firstSingleControlsPO.returnsLabel.getText()).toBe("Returns");
              expect(await firstSingleControlsPO.returnsValueContainer.getText()).toBe("$0.62");
            });

            it("[PRPI-5656] should have a balance after bet as 'N/A'", async () => {
              expect(await betsSummaryPO.leftSegmentValue.getText()).toBe("N/A");
            });

            it("[PRPI-5656] should have total returns field be populated with new value '$0.62'", async () => {
              expect(await betsSummaryPO.totalReturnsValue.getText()).toBe("$0.62");
            });

            it("[PRPI-5656] should have an enabled place button", async () => {
              expect(await betsSummaryPO.element.getAttribute("aria-disabled")).toBe("false");
            });

            it("[PRPI-5656] should have a stake button label that contains '$0.20'", async () => {
              expect(await placeButtonPO.label.getText()).toContain("$0.20");
            });
          });
        });
      });
    });
  });
});
