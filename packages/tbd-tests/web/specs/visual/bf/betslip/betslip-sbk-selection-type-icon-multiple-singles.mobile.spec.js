const {
  SportPagePO,
  InlineSportsbookMarketPO,
  MinimizedPO,
  BetslipDrawerPO,
  SportsbookPlacePanelPO,
  SportsbookConfirmPO,
  SportsbookReceiptPanelPO,
  CardPO,
  SinglesCardPO,
  SinglePO,
  BetDetailsPO,
  SportsbookBetButtonPO,
  BetControlsPO,
  CurrencyNumberInputFieldPO,
  PrimaryButtonPO,
  SecondaryButtonPO,
} = require("../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const EventMarketCardPO = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.po");
const OneLineMultiplePO = require("@ppb/tbd-shared/components/Betslip/OneLineMultiple/OneLineMultiple.web.po");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { addStake, advanceToConfirmStep } = require("../../../../helpers/betslip.util");

// Sorts page
const sportPagePO = new SportPagePO();
const firstEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[0]);
const secondEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[1]);
const firstMatchOddsCard = new CardPO(firstEventMarketCardPO.market);
const secondMatchOddsCard = new CardPO(secondEventMarketCardPO.market);
const firstSbkMarketPO = new InlineSportsbookMarketPO(firstMatchOddsCard.inlineSportsbookMarket);
const secondSbkMarketPO = new InlineSportsbookMarketPO(secondMatchOddsCard.inlineSportsbookMarket);
const firstSbkRunnerPO = new SportsbookBetButtonPO(firstSbkMarketPO.betButtons[0]);
const secondSbkRunnerPO = new SportsbookBetButtonPO(secondSbkMarketPO.betButtons[0]);

// Betslip
const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const sportsbookConfirmPO = new SportsbookConfirmPO();
const sportsbookMinimizedBetslipPO = new MinimizedPO();
const betslipDrawerPO = new BetslipDrawerPO();

// Betslip - Multiples
const oneLineMultiplePO = new OneLineMultiplePO(sportsbookPlacePanelPO.element);
const oneLineMultipleControlsPO = new BetControlsPO(oneLineMultiplePO.element);
const oneLineMultiple = new CurrencyNumberInputFieldPO(oneLineMultipleControlsPO.currencyInput);

// Betslip - Singles
const singlesCardPO = new SinglesCardPO(sportsbookPlacePanelPO.element);
const firstSinglePO = new SinglePO(singlesCardPO.singles[0]);
const secondSinglePO = new SinglePO(singlesCardPO.singles[1]);
const firstSingleControlsPO = new BetControlsPO(firstSinglePO.element);
const secondSingleControlsPO = new BetControlsPO(secondSinglePO.element);
const firstSingle = new CurrencyNumberInputFieldPO(firstSingleControlsPO.currencyInput);
const secondSingle = new CurrencyNumberInputFieldPO(secondSingleControlsPO.currencyInput);

// Bet Receipt - Singles
const sportsbookReceiptPanelPO = new SportsbookReceiptPanelPO();
const secondSingleReceiptBetDetails = new BetDetailsPO(sportsbookReceiptPanelPO.singles[1]);

// Betslip - Buttons
const placeButtonPO = new PrimaryButtonPO(sportsbookPlacePanelPO.place);
const editButtonPO = new SecondaryButtonPO(sportsbookConfirmPO.edit);

const mockService = new MockService();

const confirmButtonsElements = {
  placeButtonElement: placeButtonPO.element,
  editButtonElement: editButtonPO.element,
};

const MODULE_NAME = "betslip_sbk_selection_type_icon_multiple_singles";

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
                      isSuperSub: true,
                      name: "Match Odds",
                      marketType: "MATCH_ODDS",
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
                      name: "Full Time Result - 2 UP",
                      marketType: "FULL_TIME_RESULT_-_2_UP",
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

const FIRST_RUNNER = {
  marketId: MARKET_A_ID,
  selectionId: SELECTION_A_ID,
};

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
  },
};

const SECOND_RUNNER = {
  marketId: MARKET_B_ID,
  selectionId: SELECTION_A_ID,
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
};

const IMPLY_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, DOUBLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const SPB_SUCCESS_MOCK = {
  result: [
    {
      betNo: 0,
      betId: 2147491735,
      betReceiptId: "O/41656474/0000093",
      numLines: 1,
      totalStake: 0.19,
      runners: [
        {
          runner: FIRST_RUNNER,
          odds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: FIRST_RUNNER }],
            legType: "SIMPLE_SELECTION",
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],

      totalPotentialWin: 2,
      resultCode: "SUCCESS",
    },
    {
      betNo: 1,
      betId: 2147491736,
      betReceiptId: "O/41656474/0000094",
      numLines: 1,
      totalStake: 0.2,
      runners: [
        {
          runner: SECOND_RUNNER,
          odds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: SECOND_RUNNER }],
            legType: "SIMPLE_SELECTION",
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],

      totalPotentialWin: 2,
      resultCode: "SUCCESS",
    },
    {
      betNo: 2,
      betId: 2147491737,
      betReceiptId: "O/41656474/0000095",
      numLines: 1,
      totalStake: 1,
      runners: [
        {
          runner: FIRST_RUNNER,
          odds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          runner: SECOND_RUNNER,
          odds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: FIRST_RUNNER }],
            legType: "SIMPLE_SELECTION",
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          leg: {
            betRunners: [{ runner: SECOND_RUNNER }],
            legType: "SIMPLE_SELECTION",
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],

      totalPotentialWin: 2,
      resultCode: "SUCCESS",
    },
  ],

  respCode: "SUCCESS",
};

describe("Selection type icon - Singles and One Line Multiples", () => {
  describe("when one selection is added to betslip", () => {
    beforeAll(async () => {
      const indexHTML = await getIndexHTML(BFF_MOCK.urn, {
        products: ["sportsbook"],
        brandSettings: {
          SHOW_SELECTION_TYPE_ICON: true,
        },
        BET_CONFIRMATION_STEP: { isActive: true },
      });
      await Promise.all([
        mockService.mockFonts(getMockFonts()),
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

    describe("when adding another combinable selection with selection type icon to betslip", () => {
      beforeAll(async () => {
        await betslipDrawerPO.header.click();
        await browser.waitUntilDisplayed(sportsbookMinimizedBetslipPO.counter, "Betslip was not minimized");

        await secondSbkRunnerPO.sportsbookBetButton.scrollIntoView({
          block: "center",
        });
        await browser.waitUntilDisplayed(secondSbkRunnerPO.sportsbookBetButton, "Second runner bet button not visible");

        await mockService.mockHttpRequest(getImplyBetsResponse(IMPLY_MOCK));
        await secondSbkRunnerPO.sportsbookBetButton.click();
        await browser.waitUntilDisplayed(sportsbookMinimizedBetslipPO.title, "Acca builder not visible");
        await sportsbookMinimizedBetslipPO.element.click();

        await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1267]_should_display_place_step_one_line_multi`);
      });

      it("[PRPI-1267]_should_display_place_step_one_line_multi", async () => {
        expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1267]_should_display_place_step_one_line_multi`)).toBe(
          0,
        );
      });

      describe("when scrolling to singles section", () => {
        beforeAll(async () => {
          await secondSingle.element.scrollIntoView({ block: "center" });
          await browser.waitUntilDisplayed(secondSingle.element, "Second single receipt bet details not visible");
          await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1268]_should_display_place_step_singles`);
        });

        it("[PRPI-1268]_should_display_place_step_singles", async () => {
          expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1268]_should_display_place_step_singles`)).toBe(0);
        });

        describe("and the user adds stake value to all the bets", () => {
          beforeAll(async () => {
            await firstSingle.numberField.waitForClickable();
            await addStake(firstSingle, "0.19");

            await secondSingle.numberField.waitForClickable();
            await addStake(secondSingle, "0.2");

            await oneLineMultiple.numberField.waitForClickable();
            await addStake(oneLineMultiple, "1");
          });

          describe("and the user advances to confirm step", () => {
            beforeAll(async () => {
              await advanceToConfirmStep(confirmButtonsElements);
              await browser.waitUntilDisplayed(sportsbookConfirmPO.element, "Confirm step is not visible");
              await browser.waitUntilImageEquals(
                `${MODULE_NAME}_[PRPI-1269]_should_display_confirm_step_one_line_multi`,
              );
            });

            it("[PRPI-1269]_should_display_confirm_step_one_line_multi", async () => {
              expect(
                await browser.checkScreen(`${MODULE_NAME}_[PRPI-1269]_should_display_confirm_step_one_line_multi`),
              ).toBe(0);
            });

            describe("when scrolling the page", () => {
              beforeAll(async () => {
                await secondSingle.element.scrollIntoView({ block: "center" });
                await browser.waitUntilDisplayed(secondSingle.element, "Second single receipt bet details not visible");
                await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1269]_should_display_confirm_step_singles`);
              });

              it("[PRPI-1269]_should_display_confirm_step_singles", async () => {
                expect(
                  await browser.checkScreen(`${MODULE_NAME}_[PRPI-1269]_should_display_confirm_step_singles`),
                ).toBe(0);
              });

              describe("and placing the bet", () => {
                beforeAll(async () => {
                  await mockService.mockHttpRequest(getPlaceBet(SPB_SUCCESS_MOCK));
                  await placeButtonPO.element.click();
                  await browser.waitUntilImageEquals(
                    `${MODULE_NAME}_[PRPI-1269]_should_display_bet_receipt_one_line_multi`,
                  );
                });

                it("[PRPI-1269]_should_display_bet_receipt_one_line_multi", async () => {
                  expect(
                    await browser.checkScreen(`${MODULE_NAME}_[PRPI-1269]_should_display_bet_receipt_one_line_multi`),
                  ).toBe(0);
                });

                describe("when scrolling the page", () => {
                  beforeAll(async () => {
                    await secondSingleReceiptBetDetails.element.scrollIntoView({ block: "center" });
                    await browser.waitUntilDisplayed(secondSingleReceiptBetDetails.element);
                    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1269]_should_display_bet_receipt_singles`);
                  });

                  it("[PRPI-1269]_should_display_bet_receipt_singles", async () => {
                    expect(
                      await browser.checkScreen(`${MODULE_NAME}_[PRPI-1269]_should_display_bet_receipt_singles`),
                    ).toBe(0);
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
