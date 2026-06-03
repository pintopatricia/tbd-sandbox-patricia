const {
  MinimizedPO,
  SportPagePO,
  SinglesCardPO,
  SinglePO,
  BetDetailsPO,
  BetControlsPO,
  CardPO,
  CurrencyNumberInputFieldPO,
  BetslipDrawerPO,
  KeyboardPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
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
const firstMatchOddsCard = new CardPO(firstEventMarketCardPO.market);
const secondMatchOddsCard = new CardPO(secondEventMarketCardPO.market);
const firstSbkMarketPO = new InlineSportsbookMarketPO(firstMatchOddsCard.inlineSportsbookMarket);
const secondSbkMarketPO = new InlineSportsbookMarketPO(secondMatchOddsCard.inlineSportsbookMarket);
const firstSbkRunnerPO = new SportsbookBetButtonPO(firstSbkMarketPO.betButtons[0]);
const secondSbkRunnerPO = new SportsbookBetButtonPO(secondSbkMarketPO.betButtons[0]);

const minimizedPO = new MinimizedPO();
const betslipDrawerPO = new BetslipDrawerPO();
const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const controlsPO = new BetControlsPO();
const keyboardPO = new KeyboardPO();
const singlesCardPO = new SinglesCardPO(sportsbookPlacePanelPO.element);
const firstSinglePO = new SinglePO(singlesCardPO.singles[0]);
const firstSingleControlsPO = new BetControlsPO(firstSinglePO.element);
const singleStakePO = new CurrencyNumberInputFieldPO(firstSingleControlsPO.currencyInput);
const stakeInputFieldPO = new CurrencyNumberInputFieldPO(controlsPO.currencyInput);
const secondSinglePO = new SinglePO(singlesCardPO.singles[1]);
const secondSingleBetDetailsPO = new BetDetailsPO(secondSinglePO.element);
const multipleControlsPO = new BetControlsPO(sportsbookPlacePanelPO.element);
const multipleStakePO = new CurrencyNumberInputFieldPO(multipleControlsPO.currencyInput);

const mockService = new MockService();
const EVENT_TYPE_ID = 1;

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
                  name: "Team B vs Team A",
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
                  name: "Team B 2 vs Team A 2",
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
      marketId: "924.3",
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
      ],
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
  runner: {
    marketId: "924.2",
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

const SIB_SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const SIB_DOUBLE_MOCK = {
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

describe("SBK Keyboard Interactions - Multiples", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_SINGLE_MOCK));
    await browser.url(routes.getEventViewUrl(EVENT_TYPE_ID));
    await browser.waitUntilDisplayed(sportPagePO.actionLink[0]);
    await browser.waitUntilEquals(firstSbkRunnerPO.odd, "1.1");
  });

  describe("When more than a selection is added to the betslip", () => {
    beforeAll(async () => {
      await firstSbkRunnerPO.sportsbookBetButton.waitForClickable();
      await firstSbkRunnerPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Singles betslip not displayed");

      await betslipDrawerPO.header.waitForClickable();
      await betslipDrawerPO.header.click();
      await browser.waitUntilDisplayed(minimizedPO.element, "Betslip was not minimized");

      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_DOUBLE_MOCK));
      await secondSbkRunnerPO.sportsbookBetButton.scrollIntoView({
        block: "center",
      });
      await browser.waitUntilDisplayed(secondSbkRunnerPO.sportsbookBetButton, "Second runner bet button not visible");

      await secondSbkRunnerPO.sportsbookBetButton.waitForClickable();
      await secondSbkRunnerPO.sportsbookBetButton.click();
      await browser.waitUntilEquals(minimizedPO.counter, "2");

      await minimizedPO.element.waitForClickable();
      await minimizedPO.element.click();
      await browser.waitUntilDisplayed(multipleStakePO.element, "Sportsbook Multiples not displayed");
    });

    describe("When multiples stake field is pressed", () => {
      beforeAll(async () => {
        await multipleStakePO.numberField.waitForClickable();
        await multipleStakePO.numberField.click();
        await browser.waitUntil(() => multipleStakePO.numberField.isFocused());
        await browser.waitUntilDisplayed(keyboardPO.element);
      });

      it("[PRPI-8188] The keyboard should display", async () => {
        expect(await keyboardPO.element.isDisplayedInViewport()).toBe(true);
      });

      describe("When a stake of 1.79 is added via keyboard", () => {
        beforeAll(async () => {
          await browser.waitUntilStopsMoving(keyboardPO.element);
          await keyboardPO.one.waitForClickable();
          await keyboardPO.one.click();
          await keyboardPO.separator.click();
          await keyboardPO.seven.click();
          await keyboardPO.nine.click();
        });

        it("[PRPI-8189] The stake field is populated with 1.79", async () => {
          expect(await multipleStakePO.numberField.getValue()).toBe("1.79");
        });

        describe("When the single selection stake input field is clicked", () => {
          beforeAll(async () => {
            await singleStakePO.element.scrollIntoView({ block: "center" });
            await browser.waitUntilDisplayed(singleStakePO.element, "Single stake input field not visible");

            await singleStakePO.numberField.waitForClickable();
            await singleStakePO.numberField.click();
          });

          it("[PRPI-8190] Should remove focus from multiples stake field", async () => {
            expect(await multipleStakePO.numberField.isFocused()).toBe(false);
          });

          it("[PRPI-8190] Should add focus to single stake field", async () => {
            expect(await singleStakePO.numberField.isFocused()).toBe(true);
          });

          describe("When the second single is removed from the betslip", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getImplyBetsResponse(SIB_SINGLE_MOCK));
              await secondSingleBetDetailsPO.remove.waitForClickable();
              await secondSingleBetDetailsPO.remove.click();

              await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Betslip not displayed");
              await browser.waitUntil(async () => (await singlesCardPO.singles.length) === 1);
              await browser.waitUntilDisplayed(keyboardPO.element);
            });

            it("[PRPI-8191] The stake input field should be focused", async () => {
              expect(await stakeInputFieldPO.numberField.isFocused()).toBe(true);
            });

            it("[PRPI-8191] The keyboard should be displayed", async () => {
              expect(await keyboardPO.element.isDisplayedInViewport()).toBe(true);
            });
          });
        });
      });
    });
  });
});
