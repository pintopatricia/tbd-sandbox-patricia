const {
  MinimizedPO,
  SportPagePO,
  SinglesCardPO,
  SinglePO,
  CardPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  BetslipDrawerPO,
  AlertPO,
  AlertsPO,
  BetControlsPO,
  CurrencyNumberInputFieldPO,
  PrimaryButtonPO,
  SportsbookPlacePanelPO,
} = require("../../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const EventMarketCardPO = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.po");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");

const sportPagePO = new SportPagePO();
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
const sportsbookMinimizedBetslipPO = new MinimizedPO();

const betslipDrawerPO = new BetslipDrawerPO();
const alertsPO = new AlertsPO();
const alertPO = new AlertPO(alertsPO.element);
const multipleControlsPO = new BetControlsPO(sportsbookPlacePanelPO.element);
const multiplesStakeInputField = new CurrencyNumberInputFieldPO(multipleControlsPO.currencyInput);
const singlesCardPO = new SinglesCardPO(sportsbookPlacePanelPO.element);
const firstSingle = new SinglePO(singlesCardPO.singles[0]);
const firstSingleControls = new BetControlsPO(firstSingle.element);
const firstSingleStakeInputField = new CurrencyNumberInputFieldPO(firstSingleControls.currencyInput);
const placeButton = new PrimaryButtonPO();

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
      runnerDetails: [
        {
          selectionId: "1",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.4 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "2",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "3",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.6 },
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
            decimalDisplayOdds: { decimalOdds: 1.7 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "2",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.8 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "3",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.39 },
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
        cardGroupTitle: "League 1",
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
                    name: "Team A",
                  },
                  away: {
                    name: "Team B",
                  },
                },
                sportevent: {
                  name: "Team A vs Team B",
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
                          name: "Team A v Team B",
                          urn: "ppb:event:29359895",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.1/1",
                          selectionId: 1,
                          name: "Team A",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/2",
                          selectionId: 2,
                          name: "Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/3",
                          selectionId: 3,
                          name: "Team B",
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
                title: "Team C vs Team D",
                fixture: {
                  urn: "ppb:fixture:29359896",
                  home: {
                    name: "Team C",
                  },
                  away: {
                    name: "Team D",
                  },
                },
                sportevent: {
                  name: "Team C vs Team D",
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
                          name: "Team C v Team D",
                          urn: "ppb:event:29359896",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.2/1",
                          selectionId: 1,
                          name: "Team C",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.2/2",
                          selectionId: 2,
                          name: "Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.2/3",
                          selectionId: 3,
                          name: "Team D",
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
                title: "Team E vs Team F",
                fixture: {
                  urn: "ppb:fixture:29359897",
                  home: {
                    name: "Team E",
                  },
                  away: {
                    name: "Team F",
                  },
                },
                sportevent: {
                  name: "Team E vs Team F",
                  urn: "ppb:event:29359897",
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
                          name: "Team E v Team F",
                          urn: "ppb:event:29359897",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.3/1",
                          selectionId: 1,
                          name: "Team E",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.3/2",
                          selectionId: 2,
                          name: "Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.3/3",
                          selectionId: 3,
                          name: "Team F",
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

  betMinStake: 0.1,
  betMaxStake: 300,
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
  runner: {
    marketId: "924.1",
    selectionId: 1,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
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
          selectionId: 1,
        },
      ],
    },
  ],

  betMinStake: 0.1,
  betMaxStake: 300,
  averageOdds: 1.4,
  winAverageOdds: 1.4,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.4 },
    },
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
      decimalOdds: { decimalOdds: 1.4 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.4,
    },
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

  betMinStake: 0.1,
  betMaxStake: 300,
  averageOdds: 1.7,
  winAverageOdds: 1.7,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.7 },
    },
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
      decimalOdds: { decimalOdds: 1.7 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.7,
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
      betMinStake: 0.1,
      betMaxStake: 300,
      averageOdds: 1.54,
      winAverageOdds: 1.54,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 1.54,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 1.54 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const TREBLE_MOCK = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    THIRD_SINGLE_MOCK,
    {
      betType: "DOUBLE",
      numLines: 2,
      legCombinations: [],
      betMinStake: 0.1,
      betMaxStake: 300,
      averageOdds: 1.54,
      winAverageOdds: 1.54,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 1.54,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 1.54 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
    {
      betType: "TREBLE",
      legCombinations: [],
      numLines: 1,
      betMinStake: 0.1,
      betMaxStake: 300,
      averageOdds: 2.62,
      winAverageOdds: 2.62,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 2.62,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 2.62 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

describe("Multiple Singles Validations", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await browser.url(`${routes.getEventViewUrl(EVENT_TYPE_ID)}`);
    await browser.waitUntilDisplayed(sportPagePO.actionLink[0]);
    await browser.waitUntilEquals(firstSbkRunnerPO.odd, "1.1");

    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
    await firstSbkRunnerPO.sportsbookBetButton.click();
    await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "First selection hasn't been added");

    await betslipDrawerPO.header.click();
    await browser.waitUntilDisplayed(sportsbookMinimizedBetslipPO.counter, "Betslip was not minimized");

    await secondSbkRunnerPO.sportsbookBetButton.scrollIntoView({
      block: "center",
    });
    await browser.waitUntilDisplayed(secondSbkRunnerPO.sportsbookBetButton, "Second runner bet button not visible");
    await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
    await secondSbkRunnerPO.sportsbookBetButton.click();
    await browser.waitUntilDisplayed(sportsbookMinimizedBetslipPO.title, "Acca builder for double not visible");

    await thirdSbkRunnerPO.sportsbookBetButton.scrollIntoView({
      block: "center",
    });
    await browser.waitUntilDisplayed(thirdSbkRunnerPO.sportsbookBetButton, "Third runner bet button not visible");
    await mockService.mockHttpRequest(getImplyBetsResponse(TREBLE_MOCK));
    await thirdSbkRunnerPO.sportsbookBetButton.click();
    await browser.waitUntilDisplayed(sportsbookMinimizedBetslipPO.title, "Acca builder for treble not visible");

    await sportsbookMinimizedBetslipPO.element.click();
    await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Betslip not visible");
  });

  describe("Multiples", () => {
    describe("When I have a valid multiple combination", () => {
      describe("When I write a stake value of $0.09 in the selected multiple", () => {
        beforeAll(async () => {
          await multiplesStakeInputField.setValue("0.09");
          await browser.waitUntilDisplayed(alertPO.element, "Notification not visible");
        });

        it("[PRPI-7947] Should show a warning displayed above the place bet button", async () => {
          expect(await alertPO.icon.isDisplayed()).toBe(true);
        });

        it("[PRPI-7948] And the warning message says 'Minimum stake is $0.10. Tap to update stake'", async () => {
          expect(await alertPO.items[0].getText()).toBe("Minimum stake is $0.10");
          expect(await alertPO.detailAction.getText()).toBe("Tap to update stake");
        });

        it("[PRPI-7949] And the place bet button is disabled", async () => {
          expect(await placeButton.element.isEnabled()).toBe(false);
        });

        describe("When I press the notification", () => {
          beforeAll(async () => {
            await alertPO.element.click();
            await browser.waitUntilNotDisplayed(alertPO.element, "Notification still present");
          });

          it("[PRPI-7950] Should remove the notification", async () => {
            expect(await alertPO.element.isDisplayed()).toBe(false);
          });

          it("[PRPI-7951] And the place button becomes is enabled", async () => {
            expect(await placeButton.element.isEnabled()).toBe(true);
          });

          it("[PRPI-7952] And it should update the stake field", async () => {
            expect(await multiplesStakeInputField.numberField.getValue()).toBe("0.1");
          });

          describe("When I write a stake value of $500.00 in the selected multiple", () => {
            beforeAll(async () => {
              await multiplesStakeInputField.setValue("500");
              await browser.waitUntilDisplayed(alertPO.element, "Notification not visible");
            });

            it("[PRPI-7953] Should show a warning displayed above the place bet button", async () => {
              expect(await alertPO.icon.isDisplayed()).toBe(true);
            });

            it("[PRPI-7953] And the warning message says 'Maximum stake is \xA3300.00. Tap to update stake'", async () => {
              expect(await alertPO.items[0].getText()).toBe("Maximum stake is $300.00");
              expect(await alertPO.detailAction.getText()).toBe("Tap to update stake");
            });

            it("[PRPI-7953] And the place bet button is disabled", async () => {
              expect(await placeButton.element.isEnabled()).toBe(false);
            });

            describe("When I press other place than notification", () => {
              beforeAll(async () => {
                await firstSingleStakeInputField.element.click();
                await browser.waitUntilNotDisplayed(alertPO.element, "Notification still present");
              });

              it("[PRPI-7953] Should remove the notification", async () => {
                expect(await alertPO.element.isDisplayed()).toBe(false);
              });

              it("[PRPI-7953] And the place button becomes is enabled", async () => {
                expect(await placeButton.element.isEnabled()).toBe(true);
              });

              it("[PRPI-7953] And it should update the stake field", async () => {
                expect(await multiplesStakeInputField.numberField.getValue()).toBe("300");
              });
            });
          });
        });
      });
    });
  });

  describe("Singles", () => {
    describe("When I have a valid single", () => {
      describe("When I write a stake value of $0.09 in the selected single", () => {
        beforeAll(async () => {
          await firstSingleStakeInputField.element.scrollIntoView();
          await firstSingleStakeInputField.setValue("0.09");
          await browser.waitUntilDisplayed(alertPO.element, "Notification not visible");
        });

        it("[PRPI-7954] Should show a warning displayed above the place bet button", async () => {
          expect(await alertPO.icon.isDisplayed()).toBe(true);
        });

        it("[PRPI-7955] And the warning message says 'Minimum stake is $0.10. Tap to update stake'", async () => {
          expect(await alertPO.items[0].getText()).toBe("Minimum stake is $0.10");
          expect(await alertPO.detailAction.getText()).toBe("Tap to update stake");
        });

        it("[PRPI-7956] And the place bet button is disabled", async () => {
          expect(await placeButton.element.isEnabled()).toBe(false);
        });

        describe("When I press the notification", () => {
          beforeAll(async () => {
            await alertPO.element.click();
            await browser.waitUntilNotDisplayed(alertPO.element, "Notification still present");
          });

          it("[PRPI-7957] Should remove the notification", async () => {
            expect(await alertPO.element.isDisplayed()).toBe(false);
          });

          it("[PRPI-7958] And the place button becomes is enabled", async () => {
            expect(await placeButton.element.isEnabled()).toBe(true);
          });

          it("[PRPI-7959] And it should update the stake field", async () => {
            expect(await firstSingleStakeInputField.numberField.getValue()).toBe("0.1");
          });

          describe("When I write a stake value of $500.00 in the selected multiple", () => {
            beforeAll(async () => {
              await firstSingleStakeInputField.element.scrollIntoView();
              await firstSingleStakeInputField.setValue("500");
              await browser.waitUntilDisplayed(alertPO.element, "Notification not visible");
            });

            it("[PRPI-7960] Should show a warning displayed above the place bet button", async () => {
              expect(await alertPO.icon.isDisplayed()).toBe(true);
            });

            it("[PRPI-7961] And the warning message says 'Maximum stake is \xA3300.00. Tap to update stake'", async () => {
              expect(await alertPO.items[0].getText()).toBe("Maximum stake is $300.00");
              expect(await alertPO.detailAction.getText()).toBe("Tap to update stake");
            });

            it("[PRPI-7962] And the place bet button is disabled", async () => {
              expect(await placeButton.element.isEnabled()).toBe(false);
            });

            describe("When I press other place than notification", () => {
              beforeAll(async () => {
                await placeButton.element.click();
                await browser.waitUntilNotDisplayed(alertPO.element, "Notification still present");
              });

              it("[PRPI-7963] Should remove the notification", async () => {
                expect(await alertPO.element.isDisplayed()).toBe(false);
              });

              it("[PRPI-7963] And the place button becomes is enabled", async () => {
                expect(await placeButton.element.isEnabled()).toBe(true);
              });

              it("[PRPI-7963] And it should update the stake field", async () => {
                expect(await firstSingleStakeInputField.numberField.getValue()).toBe("300");
              });
            });
          });
        });
      });
    });
  });
});
