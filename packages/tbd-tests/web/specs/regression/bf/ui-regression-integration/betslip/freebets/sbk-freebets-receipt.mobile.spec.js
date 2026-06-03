const {
  MinimizedPO,
  SportsbookReceiptPanelPO,
  SportPagePO,
  SinglesCardPO,
  SinglePO,
  BetSegmentsPO,
  BetsSummaryPO,
  CardPO,
  CurrencyNumberInputFieldPO,
  FreeBetsPO,
  OptionPO,
  BetslipDrawerPO,
  PrimaryButtonPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  BetSummaryPO,
  BetControlsPO,
  SportsbookPlacePanelPO,
} = require("../../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const EventMarketCardPO = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.po");
const MultiLinesMultiplesPO = require("@ppb/tbd-shared/components/Betslip/MultiLinesMultiples/MultiLinesMultiples.web.po");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");

const freeBetsPO = new FreeBetsPO();
const sportsbookReceiptPanelPO = new SportsbookReceiptPanelPO();
const receiptFreeBetsOptionPO = new OptionPO(sportsbookReceiptPanelPO.element);
const controlsPO = new BetControlsPO();

const sportPagePO = new SportPagePO();
const eventMarketCardPO = {
  first: new EventMarketCardPO(sportPagePO.primaryEventCards[0]),
  second: new EventMarketCardPO(sportPagePO.primaryEventCards[1]),
  third: new EventMarketCardPO(sportPagePO.primaryEventCards[2]),
};
const matchOddsCard = {
  first: new CardPO(eventMarketCardPO.first.market),
  second: new CardPO(eventMarketCardPO.second.market),
  third: new CardPO(eventMarketCardPO.third.market),
};
const inlineSportsbookMarketPO = {
  first: new InlineSportsbookMarketPO(matchOddsCard.first.inlineSportsbookMarket),
  second: new InlineSportsbookMarketPO(matchOddsCard.second.inlineSportsbookMarket),
  third: new InlineSportsbookMarketPO(matchOddsCard.third.inlineSportsbookMarket),
};
const sportsbookRunnerPO = {
  first: new SportsbookBetButtonPO(inlineSportsbookMarketPO.first.betButtons[0]),
  second: new SportsbookBetButtonPO(inlineSportsbookMarketPO.second.betButtons[0]),
  third: new SportsbookBetButtonPO(inlineSportsbookMarketPO.third.betButtons[0]),
};

const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const placeMultipleControlsPO = new BetControlsPO(sportsbookPlacePanelPO.element);
const placeMultipleStakeField = new CurrencyNumberInputFieldPO(placeMultipleControlsPO.currencyInput);

const singlesCardsPO = new SinglesCardPO(sportsbookPlacePanelPO.element);
const placeSingle = {
  first: new SinglePO(singlesCardsPO.singles[0]),
  second: new SinglePO(singlesCardsPO.singles[1]),
};
const controls = {
  first: new BetControlsPO(placeSingle.first.element),
  second: new BetControlsPO(placeSingle.second.element),
};
const firstPlaceSingleStakeField = new CurrencyNumberInputFieldPO(controls.first.currencyInput);
const secondPlaceSingleStakeField = new CurrencyNumberInputFieldPO(controls.second.currencyInput);

const firstSingle = sportsbookReceiptPanelPO.singles[0];
const firstSingleFreeBets = new OptionPO(firstSingle);
const secondSingleFreeBets = new OptionPO(sportsbookReceiptPanelPO.singles[1]);
const firstMultiple = sportsbookReceiptPanelPO.multiples[0];
const firstMultipleFreeBets = new FreeBetsPO(firstMultiple);
const secondMultiple = sportsbookReceiptPanelPO.multiples[1];
const secondMultipleFreeBets = new OptionPO(secondMultiple);

const firstSingleSegmentsPO = new BetSegmentsPO(sportsbookReceiptPanelPO.singles[0]);
const secondSingleSegmentsPO = new BetSegmentsPO(sportsbookReceiptPanelPO.singles[1]);
const firstMultipleSegmentsPO = new BetSummaryPO(firstMultiple);
const firstMultipleBetSegmentsPO = new BetSegmentsPO(firstMultipleSegmentsPO.element);
const secondMultipleSegmentsPO = new BetSummaryPO(secondMultiple);
const secondMultipleBetSegmentsPO = new BetSegmentsPO(secondMultipleSegmentsPO.element);

const placeButtonPO = new PrimaryButtonPO(sportsbookPlacePanelPO.place);
const stakeInputField = new CurrencyNumberInputFieldPO(controlsPO.currencyInput);
const receiptBetsSummaryPO = new BetsSummaryPO(sportsbookReceiptPanelPO.summary);

const multiLinesMultiplesPO = new MultiLinesMultiplesPO();
const firstAdditionalMultipleControlsPO = new BetControlsPO(multiLinesMultiplesPO.multiples[0]);
const firstAdditionalMultipleStakeInputFieldPO = new CurrencyNumberInputFieldPO(
  firstAdditionalMultipleControlsPO.currencyInput,
);

const betslipDrawerPO = new BetslipDrawerPO();
const sportsbookMinimizedPO = new MinimizedPO();
const mockService = new MockService();

const EVENT_TYPE_ID = 1;
const ODDS = 1.1;
const BONUS = 1;

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
                    runners: [
                      {
                        runnerURN: "ppb:sbkRunner:924.1/1",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.1/2",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.1/3",
                      },
                    ],

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
                    runners: [
                      {
                        runnerURN: "ppb:sbkRunner:924.2/1",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.2/2",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.2/3",
                      },
                    ],

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
                    runners: [
                      {
                        runnerURN: "ppb:sbkRunner:924.3/1",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.3/2",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.3/3",
                      },
                    ],

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

const DECIMAL_ODDS_MOCK = { decimalOdds: ODDS };

const TRUE_ODDS_MOCK = {
  trueOdds: {
    decimalOdds: DECIMAL_ODDS_MOCK,
  },
};
const DECIMAL_DISPLAY_ODDS = {
  decimalDisplayOdds: { decimalOdds: ODDS },
};
const WIN_ODDS_MOCK = {
  winOdds: {
    ...DECIMAL_DISPLAY_ODDS,
  },
};
const RUNNER_ODDS_MOCK = {
  runnerOdds: {
    ...DECIMAL_DISPLAY_ODDS,
  },
};
const RUNNER_DETAILS_MOCK = {
  runnerDetails: [
    {
      ...RUNNER_ODDS_MOCK,
      selectionId: "1",
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      ...RUNNER_DETAILS_MOCK,
      marketId: "924.1",
    },
    {
      ...RUNNER_DETAILS_MOCK,
      marketId: "924.2",
    },
    {
      ...RUNNER_DETAILS_MOCK,
      marketId: "924.3",
    },
  ],
};

// SIB - SINGLES MOCKS
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

  hasBonusMoney: true,
  bonusWalletConditions: [{ value: 2, type: "NON_REDEEMABLE_AMOUNT" }],
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.1",
    selectionId: 1,
  },
  odds: {
    ...TRUE_ODDS_MOCK,
  },
};

// SIB - MULTIPLES MOCKS
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
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.2",
    selectionId: 1,
  },
  odds: {
    ...DECIMAL_DISPLAY_ODDS,
    ...TRUE_ODDS_MOCK,
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
};

const THIRD_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.3",
    selectionId: 1,
  },
  odds: {
    ...DECIMAL_DISPLAY_ODDS,
    ...TRUE_ODDS_MOCK,
  },
};

const DOUBLE_AND_TREBLE_BASE_MOCK = {
  averageOdds: 1.1,
  betMaxStake: 1000,
  betMinStake: 0.12,
  betMinStakeIncrement: 0.01,
  legCombinations: [],
  winAverageOdds: 1.1,
};

const DOUBLE_COMBINATION = {
  ...DOUBLE_AND_TREBLE_BASE_MOCK,
  betType: "DOUBLE",
  numLines: 3,
  winAvgOdds: {
    decimalDisplayOdds: {
      decimalOdds: 2.4,
    },
    trueOdds: {
      decimalOdds: { decimalOdds: 2.4 },
    },
  },
};

const TREBLE_COMBINATION = {
  ...DOUBLE_AND_TREBLE_BASE_MOCK,
  betType: "TREBLE",
  bonusWalletConditions: [{ value: 3, type: "NON_REDEEMABLE_AMOUNT" }],
  hasBonusMoney: true,
  winAvgOdds: {
    decimalDisplayOdds: {
      decimalOdds: 3.4,
    },
    trueOdds: {
      decimalOdds: { decimalOdds: 3.4 },
    },
  },
};

// IMPLY MOCKS
const IMPLY_BET_SERVICE_MOCK = {
  betCombinations: [
    {
      betType: "SINGLE",
      bonusWalletConditions: [{ value: BONUS, type: "NON_REDEEMABLE_AMOUNT" }],
      hasBonusMoney: true,
      winAvgOdds: {
        ...DECIMAL_DISPLAY_ODDS,
        ...TRUE_ODDS_MOCK,
      },
    },
  ],

  hasBonusMoney: true,
  runnerOdds: [
    {
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
    },
  ],
};

const IMPLY_BET_SERVICE_TREBLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, THIRD_SINGLE_MOCK, TREBLE_COMBINATION, DOUBLE_COMBINATION],
  hasBonusMoney: true,
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

// SPB - SINGLES MOCKS
const FIRST_SINGLE_LEG = {
  ...WIN_ODDS_MOCK,
  leg: { betRunners: [{ runner: { marketId: "924.1", selectionId: 1 } }] },
};

const SPB_MOCK_SUCCESS = {
  result: [
    {
      betPrice: {
        decimalDisplayOdds: { decimalOdds: ODDS },
      },
      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.1", selectionId: 1 } }],
          },
          ...WIN_ODDS_MOCK,
        },
      ],

      totalPotentialWin: 2.3,
      wallets: [{ amount: BONUS, nonRedeemableAmount: BONUS, type: "BONUS_CASH" }],
    },
  ],
};

// SPB - MULTIPLES MOCKS
const SECOND_SINGLE_LEG = {
  ...WIN_ODDS_MOCK,
  leg: { betRunners: [{ runner: { marketId: "924.2", selectionId: 1 } }] },
};

const THIRD_SINGLE_LEG = {
  ...WIN_ODDS_MOCK,
  leg: { betRunners: [{ runner: { marketId: "924.3", selectionId: 1 } }] },
};

const MULTIPLES_MOCK = [
  {
    legs: [FIRST_SINGLE_LEG],
    wallets: [{ amount: 2, nonRedeemableAmount: 2, type: "BONUS_CASH" }],
    totalPotentialWin: 1,
  },
  {
    legs: [SECOND_SINGLE_LEG],
    totalPotentialWin: 2,
  },
  {
    legs: [FIRST_SINGLE_LEG, SECOND_SINGLE_LEG, THIRD_SINGLE_LEG],
    wallets: [{ amount: 3, nonRedeemableAmount: 3, type: "BONUS_CASH" }],
    totalPotentialWin: 1,
  },
  {
    legs: [FIRST_SINGLE_LEG, SECOND_SINGLE_LEG, THIRD_SINGLE_LEG],
    totalPotentialWin: 2,
  },
];

const SPB_MOCK_MULTIPLES_SUCCESS = {
  result: MULTIPLES_MOCK,
};

describe("Freebets - Sportsbook Single Bet Receipt", () => {
  describe("When the user with bonus is in betslip place bet panel", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await mockService.mockHttpRequest(getImplyBetsResponse(IMPLY_BET_SERVICE_MOCK));
      await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK_SUCCESS));
      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
      await browser.waitUntilEquals(sportsbookRunnerPO.first.odd, "1.1");
      await sportsbookRunnerPO.first.sportsbookBetButton.click();
    });

    describe("When user inserts stake lower than available bonus, taps to activate bonus and places bet", () => {
      beforeAll(async () => {
        await freeBetsPO.activateBonus("Use Free Bet Balance");
        await stakeInputField.numberField.setValue(3);
        await placeButtonPO.element.click();
        await browser.waitUntilEquals(
          receiptFreeBetsOptionPO.title,
          "Used $1.00 Free Bet",
          "Freebets label is not equal to 'Used $1.00 Free Bet'",
        );
      });

      it("[PRPI-7835] should display the receipt panel", async () => {
        expect(await sportsbookReceiptPanelPO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-7836] should display the Returns label considering bonus used", async () => {
        expect(await firstSingleSegmentsPO.rightLabel.getText()).toBe("Returns");
        expect(await firstSingleSegmentsPO.rightValue.getText()).toBe("$2.30");
      });

      it("[PRPI-7837] should display the potential returns label considering bonus used", async () => {
        expect(await receiptBetsSummaryPO.totalReturnsValue.getText()).toBe("$2.30");
      });

      it("[PRPI-7838] should display the bonus label with correct bonus amount used", async () => {
        expect(await receiptFreeBetsOptionPO.title.getText()).toBe("Used $1.00 Free Bet");
      });
    });
  });
});

describe("Freebets - Sportsbook Multiple Bet Receipt", () => {
  describe("When user is in place panel using bonus", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK_MULTIPLES_SUCCESS));
      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
      await browser.waitUntilEquals(sportsbookRunnerPO.first.odd, "1.1");
    });
    describe("And has two multiples: one with available bonus and has two singles: one with available bonus", () => {
      beforeAll(async () => {
        await sportsbookRunnerPO.first.sportsbookBetButton.click();
        await browser.waitUntilDisplayed(betslipDrawerPO.header, "Betslip not visible");

        await betslipDrawerPO.header.click();
        await browser.waitUntilDisplayed(sportsbookMinimizedPO.element, "Minimized betslip not found");

        await sportsbookRunnerPO.second.sportsbookBetButton.scrollIntoView({
          block: "center",
        });
        await browser.waitUntilInViewport(
          sportsbookRunnerPO.second.sportsbookBetButton,
          "Second runner bet button not in viewport",
        );
        await sportsbookRunnerPO.second.sportsbookBetButton.click();
        await browser.waitUntilEquals(sportsbookMinimizedPO.counter, "2", "Second selection not added");

        await sportsbookRunnerPO.third.sportsbookBetButton.scrollIntoView();
        await browser.waitUntilInViewport(
          sportsbookRunnerPO.third.sportsbookBetButton,
          "Third runner bet button not in viewport",
        );
        await mockService.mockHttpRequest(getImplyBetsResponse(IMPLY_BET_SERVICE_TREBLE_MOCK));
        await sportsbookRunnerPO.third.sportsbookBetButton.click();
        await browser.waitUntilEquals(sportsbookMinimizedPO.counter, "3", "Third selection not added");

        await sportsbookMinimizedPO.element.waitForClickable();
        await sportsbookMinimizedPO.element.click();
        await freeBetsPO.activateBonus("Use Free Bet Balance");

        await placeMultipleStakeField.setValue("3");
        await firstAdditionalMultipleStakeInputFieldPO.setValue("2");
        await firstPlaceSingleStakeField.element.scrollIntoView();
        await browser.waitUntilInViewport(
          firstPlaceSingleStakeField.element,
          "First single stake field not in viewport",
        );
        await firstPlaceSingleStakeField.setValue("4");

        await secondPlaceSingleStakeField.element.scrollIntoView();
        await browser.waitUntilInViewport(
          secondPlaceSingleStakeField.element,
          "Second single stake field not in viewport",
        );
        await secondPlaceSingleStakeField.setValue("1");
      });
      describe("When user taps to place bet", () => {
        beforeAll(async () => {
          await placeButtonPO.element.click();
          await browser.waitUntilEquals(
            firstMultipleFreeBets.label,
            "Used $3.00 Free Bet",
            "First multiple freebets label don't match",
          );
        });

        it("[PRPI-7839] The multiple with bonus shows bonus", async () => {
          expect(await firstMultipleFreeBets.label.getText()).toBe("Used $3.00 Free Bet");
        });

        it("[PRPI-7840] The multiple without bonus should not show the Free Bets Label", async () => {
          expect(await secondMultipleFreeBets.title.isExisting()).toBe(false);
        });

        it("[PRPI-7841] The single with bonus shows bonus", async () => {
          expect(await firstSingleFreeBets.title.getText()).toBe("Used $2.00 Free Bet");
        });

        it("[PRPI-7842] The single without bonus should not show the Free Bets Label", async () => {
          expect(await secondSingleFreeBets.title.isExisting()).toBe(false);
        });
        it("[PRPI-7843] The multiple selection with bonus display return with correct value", async () => {
          expect(await firstMultipleBetSegmentsPO.rightLabel.getText()).toBe("Returns");
          expect(await firstMultipleBetSegmentsPO.rightValue.getText()).toBe("$1.00");
        });
        it("[PRPI-7844] The single selection with bonus display return with correct value", async () => {
          expect(await firstSingleSegmentsPO.rightLabel.getText()).toBe("Returns");
          expect(await firstSingleSegmentsPO.rightValue.getText()).toBe("$1.00");
        });
        it("[PRPI-7843] The multiple selection without bonus display return with correct value", async () => {
          expect(await secondMultipleBetSegmentsPO.rightLabel.getText()).toBe("Returns");
          expect(await secondMultipleBetSegmentsPO.rightValue.getText()).toBe("$2.00");
        });
        it("[PRPI-7845] The single selection without bonus display return with correct value", async () => {
          expect(await secondSingleSegmentsPO.rightLabel.getText()).toBe("Returns");
          expect(await secondSingleSegmentsPO.rightValue.getText()).toBe("$2.00");
        });
        it("[PRPI-7846] The total returns displayed should be considering bonus used", async () => {
          expect(await receiptBetsSummaryPO.totalReturnsValue.getText()).toBe("$6.00");
        });
        it("[PRPI-7847] The total stake value displayed should be considering bonus used", async () => {
          expect(await receiptBetsSummaryPO.leftSegmentValue.getText()).toBe("$4.00");
        });
      });
    });
  });
});
