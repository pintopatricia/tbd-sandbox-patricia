const {
  MinimizedPO,
  SportPagePO,
  SportsbookConfirmPO,
  SinglesCardPO,
  SinglePO,
  CardPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  BetslipDrawerPO,
  BetControlsPO,
  CurrencyNumberInputFieldPO,
  PrimaryButtonPO,
  SecondaryButtonPO,
  AlertPO,
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
const firstEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[0]);
const secondEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[1]);
const firstMatchOddsCard = new CardPO(firstEventMarketCardPO.market);
const secondMatchOddsCard = new CardPO(secondEventMarketCardPO.market);
const firstSbkMarketPO = new InlineSportsbookMarketPO(firstMatchOddsCard.inlineSportsbookMarket);
const secondSbkMarketPO = new InlineSportsbookMarketPO(secondMatchOddsCard.inlineSportsbookMarket);
const firstSbkRunnerPO = new SportsbookBetButtonPO(firstSbkMarketPO.betButtons[0]);
const secondSbkRunnerPO = new SportsbookBetButtonPO(secondSbkMarketPO.betButtons[0]);
const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const sportsbookConfirmPO = new SportsbookConfirmPO();
const sportsbookMinimizedBetslipPO = new MinimizedPO();
const betslipDrawerPO = new BetslipDrawerPO();
const betControlsPO = new BetControlsPO();
const singlesCardPO = new SinglesCardPO(sportsbookPlacePanelPO.element);
const firstSinglePO = new SinglePO(singlesCardPO.singles[0]);
const firstSingleControlsPO = new BetControlsPO(firstSinglePO.element);
const secondSinglePO = new SinglePO(singlesCardPO.singles[1]);
const secondSingleControlsPO = new BetControlsPO(secondSinglePO.element);
const sportsbookStakeInputField1 = new CurrencyNumberInputFieldPO(firstSingleControlsPO.currencyInput);
const sportsbookStakeInputField2 = new CurrencyNumberInputFieldPO(secondSingleControlsPO.currencyInput);
const placeButtonPO = new PrimaryButtonPO(sportsbookPlacePanelPO.place);
const editButtonPO = new SecondaryButtonPO(sportsbookConfirmPO.edit);
const placeNotification = new AlertPO(sportsbookPlacePanelPO.element);

const mockService = new MockService();

const confirmButtonsElements = {
  placeButtonElement: placeButtonPO.element,
  editButtonElement: editButtonPO.element,
};

const EVENT_TYPE_ID = 1;

const MARKET_A_ID = "924.1";
const MARKET_B_ID = "924.2";
const MARKET_C_ID = "924.3";

const SELECTION_A_ID = 1;
const SELECTION_B_ID = 2;
const SELECTION_C_ID = 3;

const SMP_MOCK = {
  markets: [
    {
      marketId: MARKET_A_ID,
      runnerDetails: [
        {
          selectionId: String(SELECTION_A_ID),
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_B_ID),
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_C_ID),
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: MARKET_B_ID,
      runnerDetails: [
        {
          selectionId: String(SELECTION_A_ID),
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_B_ID),
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_C_ID),
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: MARKET_C_ID,
      runnerDetails: [
        {
          selectionId: String(SELECTION_A_ID),
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_B_ID),
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_C_ID),
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
                      urn: `ppb:sbkMarket:${MARKET_A_ID}`,
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
                          runnerURN: `ppb:sbkRunner:${MARKET_A_ID}/${SELECTION_A_ID}`,
                          selectionId: SELECTION_A_ID,
                          name: "Team B",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_A_ID}/${SELECTION_B_ID}`,
                          selectionId: SELECTION_B_ID,
                          name: "Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_A_ID}/${SELECTION_C_ID}`,
                          selectionId: SELECTION_C_ID,
                          name: "Team A",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${MARKET_A_ID}/${SELECTION_A_ID}` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_A_ID}/${SELECTION_B_ID}` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_A_ID}/${SELECTION_C_ID}` },
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
                      urn: `ppb:sbkMarket:${MARKET_B_ID}`,
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
                          runnerURN: `ppb:sbkRunner:${MARKET_B_ID}/${SELECTION_A_ID}`,
                          selectionId: SELECTION_A_ID,
                          name: "Team B 2",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_B_ID}/${SELECTION_B_ID}`,
                          selectionId: SELECTION_B_ID,
                          name: "Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_B_ID}/${SELECTION_C_ID}`,
                          selectionId: SELECTION_C_ID,
                          name: "Team A 2",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${MARKET_B_ID}/${SELECTION_A_ID}` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_B_ID}/${SELECTION_B_ID}` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_B_ID}/${SELECTION_C_ID}` },
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
          marketId: MARKET_A_ID,
          selectionId: SELECTION_A_ID,
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
    marketId: MARKET_A_ID,
    selectionId: SELECTION_A_ID,
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
          marketId: MARKET_B_ID,
          selectionId: SELECTION_A_ID,
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
    marketId: MARKET_B_ID,
    selectionId: SELECTION_A_ID,
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

const SMP_MOCK_FIRST_UPDATE = {
  markets: [
    {
      selectionId: String(SELECTION_A_ID),
      runnerOdds: {
        decimalDisplayOdds: { decimalOdds: 1.1 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      runnerStatus: "SUSPENDED",
    },
    {
      selectionId: String(SELECTION_B_ID),
      runnerOdds: {
        decimalDisplayOdds: { decimalOdds: 1.2 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
    {
      selectionId: String(SELECTION_C_ID),
      runnerOdds: {
        decimalDisplayOdds: { decimalOdds: 1.3 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],
};

const MARKETS_FIRST_UPDATE_FAILURES = {
  betCombinations: [FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, DOUBLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
  betFailures: [
    {
      failedRunner: {
        marketId: MARKET_A_ID,
        selectionId: SELECTION_A_ID,
      },
      failureCode: "MARKET_SUSPENDED",
    },
  ],
};

const SMP_MOCK_SECOND_UPDATE = {
  markets: [
    {
      selectionId: String(SELECTION_A_ID),
      runnerOdds: {
        decimalDisplayOdds: { decimalOdds: 1.1 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
    {
      selectionId: String(SELECTION_B_ID),
      runnerOdds: {
        decimalDisplayOdds: { decimalOdds: 1.2 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
    {
      selectionId: String(SELECTION_C_ID),
      runnerOdds: {
        decimalDisplayOdds: { decimalOdds: 1.3 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],
};

const MARKETS_FIRST_SECOND_FAILURES = {
  betCombinations: [FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, DOUBLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
  betFailures: [],
};

describe("Singles Confirm Experience", () => {
  describe("when one selection is added to betslip", () => {
    beforeAll(async () => {
      const indexHTML = await getIndexHTML(BFF_MOCK.urn, {
        products: ["sportsbook"],
        BET_CONFIRMATION_STEP: { isActive: true },
      });
      await Promise.all([
        mockService.mockHttpRequest(indexHTML),
        mockService.mockHttpRequest(getSportsLayout(BFF_MOCK)),
        mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true })),
        mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK)),
      ]);

      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));

      await browser.waitUntilDisplayed(sportPagePO.actionLink[0]);

      await browser.waitUntilEquals(firstSbkRunnerPO.odd, "1.1");
      await firstSbkRunnerPO.sportsbookBetButton.click();

      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "First selection hasn't been added");
    });

    it("[PRPI-4066] should open betslip with a single selection", async () => {
      expect(await sportsbookPlacePanelPO.element.isDisplayedInViewport()).toBe(true);
    });

    describe("when adding another combinable selection to betslip", () => {
      beforeAll(async () => {
        await betslipDrawerPO.header.click();
        await browser.waitUntilDisplayed(sportsbookMinimizedBetslipPO.counter, "Betslip was not minimized");

        await secondSbkRunnerPO.sportsbookBetButton.scrollIntoView({
          block: "center",
        });
        await browser.waitUntilDisplayed(secondSbkRunnerPO.sportsbookBetButton, "Second runner bet button not visible");

        await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
        await secondSbkRunnerPO.sportsbookBetButton.click();
        await browser.waitUntilDisplayed(sportsbookMinimizedBetslipPO.title, "Acca builder not visible");
        await sportsbookMinimizedBetslipPO.element.waitForClickable();
        await sportsbookMinimizedBetslipPO.element.click();
      });

      it("[PRPI-4067] should change betslip to multiples experience", async () => {
        expect(await sportsbookPlacePanelPO.element.isDisplayedInViewport()).toBe(true);
      });
    });

    describe("and the user adds stake value to both singles", () => {
      beforeAll(async () => {
        await sportsbookStakeInputField1.numberField.waitForClickable();
        await sportsbookStakeInputField1.numberField.setValue(0.12);

        await sportsbookStakeInputField2.numberField.waitForClickable();
        await sportsbookStakeInputField2.numberField.setValue(1);
      });

      describe("when the user advances to confirm step", () => {
        beforeAll(async () => {
          await advanceToConfirmStep(confirmButtonsElements);
        });

        it("[PRPI-4075] should display the confirm screen", async () => {
          expect(await sportsbookConfirmPO.element.isDisplayedInViewport()).toBe(true);
        });

        it("[PRPI-4076] should display two singles", async () => {
          expect(await betControlsPO.element.isDisplayedInViewport()).toBe(true);
          expect(await singlesCardPO.singles.length).toBe(2);
        });
      });

      describe("and one of the runners gets suspended", () => {
        beforeAll(async () => {
          await Promise.all([
            mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_FIRST_UPDATE)),
            mockService.mockHttpRequest(getImplyBetsResponse(MARKETS_FIRST_UPDATE_FAILURES)),
          ]);
          await browser.tickFakeClock();
          await browser.waitUntilEquals(placeNotification.message, "Odds and availability have changed");
        });

        it("[PRPI-7811] should disable the place button", async () => {
          expect(await placeButtonPO.element.isEnabled()).toBe(false);
        });
      });

      describe("and the user clicks the edit button", () => {
        beforeAll(async () => {
          await editButtonPO.element.waitForClickable();
          await editButtonPO.element.click();
        });

        it("[PRPI-4078] should return to place potential step", async () => {
          expect(await sportsbookPlacePanelPO.element.isDisplayedInViewport()).toBe(true);
        });

        describe("and the user advances to confirm step", () => {
          beforeAll(async () => {
            await advanceToConfirmStep(confirmButtonsElements);
          });

          it("[PRPI-4079] should display the confirm screen", async () => {
            expect(await sportsbookConfirmPO.element.isDisplayedInViewport()).toBe(true);
          });

          it("[PRPI-4080] should display a single", async () => {
            expect(await betControlsPO.element.isDisplayedInViewport()).toBe(true);
            expect(await singlesCardPO.element.isDisplayedInViewport()).toEqual(true);
          });

          it("[PRPI-7812] should display Review and confirm bet", async () => {
            expect(await betslipDrawerPO.header.isDisplayedInViewport()).toBe(true);
            expect(await betslipDrawerPO.header.getText()).toEqual("Review and confirm bet");
          });

          it("[PRPI-7813] should display Edit bet button", async () => {
            expect(await editButtonPO.element.isDisplayedInViewport()).toBe(true);
          });

          it("[PRPI-7814] should display Confirm R\xA31.12 Selection button", async () => {
            expect(await placeButtonPO.element.isDisplayedInViewport()).toBe(true);
            expect(await placeButtonPO.element.getText()).toEqual("Confirm $1.12 Selection");
          });

          describe("when the staked and suspended single gets available again", () => {
            beforeAll(async () => {
              await Promise.all([
                mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_SECOND_UPDATE)),
                mockService.mockHttpRequest(getImplyBetsResponse(MARKETS_FIRST_SECOND_FAILURES)),
              ]);

              await browser.tickFakeClock();

              await browser.waitUntilEquals(placeNotification.message, "Odds and availability have changed");
            });

            it("[PRPI-4081] should disable the place button", async () => {
              expect(await placeButtonPO.element.isEnabled()).toBe(false);
            });

            describe("and the user clicks the edit button", () => {
              beforeAll(async () => {
                await editButtonPO.element.waitForClickable();
                await editButtonPO.element.click();
              });

              it("[PRPI-4081] should return to place potential step", async () => {
                expect(await sportsbookPlacePanelPO.element.isDisplayedInViewport()).toBe(true);
              });
            });
          });
        });
      });
    });
  });
});
