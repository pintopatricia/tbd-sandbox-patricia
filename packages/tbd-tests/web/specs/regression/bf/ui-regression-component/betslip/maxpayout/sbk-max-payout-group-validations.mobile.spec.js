const {
  MinimizedPO,
  SportPagePO,
  MultiplesCardPO,
  CardPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  BetslipDrawerPO,
  AlertPO,
  BetControlsPO,
  CurrencyNumberInputFieldPO,
  PrimaryButtonPO,
  AlertsPO,
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

const placePanelPO = new SportsbookPlacePanelPO();
const controlsPO = new BetControlsPO();
const alertsPO = new AlertsPO();
const alertPO = new AlertPO(alertsPO.element);
const firstSingleStakeInputField = new CurrencyNumberInputFieldPO(controlsPO.currencyInput);
const sportsbookMinimizedBetslipPO = new MinimizedPO();
const placeButtonPO = new PrimaryButtonPO();

const betslipDrawerPO = new BetslipDrawerPO();
const multiplesCardPO = new MultiplesCardPO(placePanelPO.element);
const multipleControlsPO = new BetControlsPO(multiplesCardPO.element);
const multiplesStakeInputField = new CurrencyNumberInputFieldPO(multipleControlsPO.currencyInput);

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
            decimalDisplayOdds: { decimalOdds: 10 },
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
                      ],
                    },
                    runners: [{ runnerURN: "ppb:sbkRunner:924.1/1" }, { runnerURN: "ppb:sbkRunner:924.1/2" }],
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
                      ],
                    },
                    runners: [{ runnerURN: "ppb:sbkRunner:924.2/1" }, { runnerURN: "ppb:sbkRunner:924.2/2" }],
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

  betMinStake: 0.1,
  betMaxStake: 500000,
  betMaxPayout: 100000,
  averageOdds: 10,
  winAverageOdds: 10,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 10 },
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
      decimalOdds: { decimalOdds: 10 },
    },
    decimalDisplayOdds: {
      decimalOdds: 10,
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
  betMaxStake: 500000,
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

const SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
  maxPayout: 100000,
};

const DOUBLE_MOCK = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    {
      betType: "DOUBLE",
      legCombinations: [],
      betMinStake: 0.1,
      betMaxStake: 500000,
      betMaxPayout: 100000,
      averageOdds: 10,
      winAverageOdds: 10,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 10,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 10 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

describe("Max Payout Group Validation", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { currencyCode: "USD", countryCode: "GB" }));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await browser.url(`${routes.getEventViewUrl(EVENT_TYPE_ID)}`);
    await browser.waitUntilDisplayed(sportPagePO.actionLink[0]);
    await browser.waitUntilEquals(firstSbkRunnerPO.odd, "10");

    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
    await firstSbkRunnerPO.sportsbookBetButton.waitForClickable();
    await firstSbkRunnerPO.sportsbookBetButton.click();
    await browser.waitUntilDisplayed(placePanelPO.element, "First selection hasn't been added");
  });

  describe("When I add a stake value of 400000 in the Single", () => {
    beforeAll(async () => {
      await firstSingleStakeInputField.setValue("400000");
      await browser.waitUntilDisplayed(alertPO.element, "Notification was not displayed");
    });

    it("[PRPI-8162] Should display the message 'Maximum payout is $1.40 millions per day'", async () => {
      expect(await alertPO.items[0].getText()).toBe("Maximum payout is $1.40 millions per day");
    });

    it("[PRPI-8163] Should display the url description 'Please review your stake'", async () => {
      expect(await alertPO.detail.getText()).toBe("Please review your stake");
    });

    it("[PRPI-8164] And the place bet button is disabled", async () => {
      expect(await placeButtonPO.element.isEnabled()).toBe(false);
    });

    describe("When I change the stake value to 40 in the Single", () => {
      beforeAll(async () => {
        await firstSingleStakeInputField.setValue("40");
        await browser.waitUntilNotDisplayed(alertPO.element, "Notification was not removed");
      });

      it("[PRPI-8165] Should remove the message", async () => {
        expect(await alertPO.element.isExisting()).toBe(false);
      });

      it("[PRPI-8166] And the place bet button is enabled", async () => {
        expect(await placeButtonPO.element.isEnabled()).toBe(true);
      });

      describe("When I add a stake value of 40000 in the Single", () => {
        beforeAll(async () => {
          await firstSingleStakeInputField.setValue("40000");
          await browser.waitUntilDisplayed(alertPO.element, "Notification was not displayed");
        });

        it("[PRPI-8167] Should display the message 'Each sport has max payout limits per bet'", async () => {
          expect(await alertPO.items[0].getText()).toBe("Each sport has max payout limits per bet");
        });

        it("[PRPI-8168] Should display the url description 'See T&C\u2019s.'", async () => {
          expect(await alertPO.link.getText()).toBe("See T&C’s.");
        });

        it("[PRPI-8169] And the place bet button is enabled", async () => {
          expect(await placeButtonPO.element.isEnabled()).toBe(true);
        });

        describe("When I add another selection", () => {
          beforeAll(async () => {
            await firstSingleStakeInputField.setValue("");
            await betslipDrawerPO.header.waitForClickable();
            await betslipDrawerPO.header.click();
            await browser.waitUntilDisplayed(sportsbookMinimizedBetslipPO.counter, "Betslip was not minimized");
            await browser.waitUntilDisplayed(
              secondSbkRunnerPO.sportsbookBetButton,
              "Second runner bet button not visible",
            );
            await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
            await secondSbkRunnerPO.sportsbookBetButton.waitForClickable();
            await secondSbkRunnerPO.sportsbookBetButton.click();
            await browser.waitUntilDisplayed(sportsbookMinimizedBetslipPO.title, "Acca builder for double not visible");
            await sportsbookMinimizedBetslipPO.element.waitForClickable();
            await sportsbookMinimizedBetslipPO.element.click();
            await browser.waitUntilDisplayed(multiplesCardPO.element, "Multiples card was not displayed");
          });

          describe("When I add a stake value of 400000 in the Multiple", () => {
            beforeAll(async () => {
              await multiplesStakeInputField.setValue("400000");
              await browser.waitUntilDisplayed(alertPO.element, "Notification was not displayed");
            });

            it("[PRPI-8170] Should display the message 'Maximum payout is $1.40 millions per day'", async () => {
              expect(await alertPO.items[0].getText()).toBe("Maximum payout is $1.40 millions per day");
            });

            it("[PRPI-8170] Should display the url description 'Please review your stake'", async () => {
              expect(await alertPO.detail.getText()).toBe("Please review your stake");
            });

            it("[PRPI-8170] And the place bet button is disabled", async () => {
              expect(await placeButtonPO.element.isEnabled()).toBe(false);
            });

            describe("When I add a stake value of 40000 in the Multiple", () => {
              beforeAll(async () => {
                await multiplesStakeInputField.setValue("40000");
                await browser.waitUntilDisplayed(alertPO.element, "Notification was not displayed");
              });

              it("[PRPI-8170] Should display the message 'Each sport has max payout limits per bet'", async () => {
                expect(await alertPO.items[0].getText()).toBe("Each sport has max payout limits per bet");
              });

              it("[PRPI-8170] Should display the detail info 'Max daily payout is $1.40 millions. See T&C\u2019s.'", async () => {
                const detailText = await alertPO.detail.getText();
                const linkText = await alertPO.link.getText();
                const expectedText = `${detailText} ${linkText}`;

                expect(expectedText).toBe("Max daily payout is $1.40 millions. See T&C’s.");
              });

              it("[PRPI-8170] Should display the url extra detail info 'See T&C\u2019s.'", async () => {
                expect(await alertPO.link.getText()).toBe("See T&C’s.");
              });

              it("[PRPI-8170] Should have the correct url", async () => {
                expect(await alertPO.link.getAttribute("href")).toBe(
                  "https://www.betfair.com/en/aboutUs/Sportsbook.Rules.And.Regulations/#MaxWin",
                );
              });

              it("[PRPI-8170] And the place bet button is enabled", async () => {
                expect(await placeButtonPO.element.isEnabled()).toBe(true);
              });
            });
          });
        });
      });
    });
  });

  describe("When the stake value is above the max payout and the max stake limit", () => {
    beforeAll(async () => {
      await firstSingleStakeInputField.setValue("5000000");
      await browser.waitUntilDisplayed(alertPO.element, "Notification was not displayed");
    });

    it("[PRPI-8171] should only display the max stake notification", async () => {
      expect(await alertPO.items[0].getText()).toBe("Maximum stake is $500,000.00");
      expect(await alertPO.items.length).toBe(1);
    });

    describe("when I tap on the message to correct the stake to the max stake value", () => {
      beforeAll(async () => {
        await alertPO.element.waitForClickable();
        await alertPO.element.click();
      });

      it("[PRPI-8172] should display the max payout notification", async () => {
        expect(await alertPO.items[0].getText()).toBe("Maximum payout is $1.40 millions per day");
        expect(await alertPO.items.length).toBe(1);
      });
    });
  });
});
