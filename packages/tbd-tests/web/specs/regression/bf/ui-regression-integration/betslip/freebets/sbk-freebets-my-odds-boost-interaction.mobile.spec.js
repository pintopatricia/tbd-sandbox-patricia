const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const {
  MinimizedPO,
  SportsbookReceiptPanelPO,
  SportPagePO,
  SinglesCardPO,
  SinglePO,
  CardPO,
  FreeBetsPO,
  BetslipDrawerPO,
  PrimaryButtonPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  BetControlsPO,
  CurrencyNumberInputFieldPO,
  BetSegmentsPO,
  OddsPO,
  PNLAndWhatIfPO,
  FreeBetsCardLabelPO,
  PromoButtonPO,
  SportsbookPlacePanelPO,
  ExtraWalletCardGroupPO,
  ExtraWalletCardPO,
  GenerosityWalletPO,
  AlertPO,
  OptionPO,
} = require("../../../../../../page-objects");
const EventMarketCardPO = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.po");
const { getSportsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");

const sportPagePO = new SportPagePO();
const sportsbookMinimizedPO = new MinimizedPO();
const freeBetsPO = new FreeBetsPO();

const eventMarketCardPO = {
  first: new EventMarketCardPO(sportPagePO.primaryEventCards[0]),
  second: new EventMarketCardPO(sportPagePO.primaryEventCards[1]),
  third: new EventMarketCardPO(sportPagePO.primaryEventCards[2]),
};

const betslipDrawerPO = new BetslipDrawerPO();
const mockService = new MockService();
const placeButtonPO = new PrimaryButtonPO();
const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();

const singlesCardPO = new SinglesCardPO(sportsbookPlacePanelPO.element);
const firstSingle = new SinglePO(singlesCardPO.singles[0]);
const secondSingle = new SinglePO(singlesCardPO.singles[1]);

const firstSingleControls = new BetControlsPO(firstSingle.element);
const secondSingleControls = new BetControlsPO(secondSingle.element);

const firstGenerosityWalletButtonPO = new PromoButtonPO(firstSingleControls.generosityWalletButton);
const firstSingleGenerosityWalletAlertPO = new AlertPO(firstSingleControls.generosityAlertMessage);
const secondGenerosityWalletButtonPO = new PromoButtonPO(secondSingleControls.generosityWalletButton);
const secondSingleGenerosityWalletAlertPO = new AlertPO(secondSingleControls.generosityAlertMessage);

const generosityWalletPO = new GenerosityWalletPO();
const generosityWalletApplyButtonPO = new PrimaryButtonPO(generosityWalletPO.applyButton);

const extraWalletCardGroupPO = new ExtraWalletCardGroupPO();
const firstExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[0]);
const firstExtraWalletCardOptionPO = new OptionPO(firstExtraWalletCardPO.walletOption);
const secondExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[1]);
const thirdExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[2]);
const thirdExtraWalletCardOptionPO = new OptionPO(thirdExtraWalletCardPO.walletOption);

const stakeInputField = new CurrencyNumberInputFieldPO(firstSingleControls.currencyInput);
const sportsbookReceiptPanelPO = new SportsbookReceiptPanelPO();
const placePanelPO = new SportsbookPlacePanelPO();
const placeButton = new PrimaryButtonPO(placePanelPO.place);

const firstSingleReturnValues = new PNLAndWhatIfPO(firstSingleControls.returnsValueContainer);

const receiptSingleSegmentsPO = new BetSegmentsPO(sportsbookReceiptPanelPO.singles[0]);
const receiptSingleOddsSegment = new OddsPO(receiptSingleSegmentsPO.leftValue);

const receiptSingleReturnsSegments = new PNLAndWhatIfPO(receiptSingleSegmentsPO.rightValue);

const singleReceiptFreeBets = new FreeBetsPO(sportsbookReceiptPanelPO.singles[0]);
const singleReceiptAlert = new AlertPO(sportsbookReceiptPanelPO.singles[0]);

const freeBetsCardLabelPO = {
  first: new FreeBetsCardLabelPO(firstSingle.element),
  second: new FreeBetsCardLabelPO(secondSingle.element),
};

const matchOddsCard = {
  first: new CardPO(eventMarketCardPO.first.market),
  second: new CardPO(eventMarketCardPO.second.market),
  third: new CardPO(eventMarketCardPO.third.market),
};
const sportsbookMarketPO = {
  first: new InlineSportsbookMarketPO(matchOddsCard.first.inlineSportsbookMarket),
  second: new InlineSportsbookMarketPO(matchOddsCard.second.inlineSportsbookMarket),
  third: new InlineSportsbookMarketPO(matchOddsCard.third.inlineSportsbookMarket),
};
const marketRunnerSportsbookPO = {
  first: new SportsbookBetButtonPO(sportsbookMarketPO.first.betButtons[0]),
  second: new SportsbookBetButtonPO(sportsbookMarketPO.second.betButtons[0]),
  third: new SportsbookBetButtonPO(sportsbookMarketPO.third.betButtons[0]),
};

const EVENT_TYPE_ID = 1;

const FRACTIONAL_DISPLAY_ODDS_MOCK = {
  fractionalDisplayOdds: { numerator: 1, denominator: 2 },
};

const WALLETS = [
  { id: "1231", amount: 2, walletType: "PRICE_BOOST_TOKEN", expirationDate: "2025-02-02T00:00:50.000Z" },
  { id: "1232", amount: 3, walletType: "PRICE_BOOST_TOKEN", expirationDate: "2025-02-02T00:01:00.000Z" },
  { id: "1233", amount: 10, walletType: "BONUS_CASH" },
  { id: "1234", amount: 15, walletType: "BONUS_CASH" },
];

const RUNNER_DETAILS_MOCK = [
  {
    selectionId: "1",
    runnerOdds: {
      ...FRACTIONAL_DISPLAY_ODDS_MOCK,
      decimalDisplayOdds: { decimalOdds: 1.1 },
    },
  },
  {
    selectionId: "2",
    runnerOdds: {
      ...FRACTIONAL_DISPLAY_ODDS_MOCK,
      decimalDisplayOdds: { decimalOdds: 1.2 },
    },
  },
  {
    selectionId: "3",
    runnerOdds: {
      ...FRACTIONAL_DISPLAY_ODDS_MOCK,
      decimalDisplayOdds: { decimalOdds: 1.3 },
    },
  },
];

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.1",
      runnerDetails: RUNNER_DETAILS_MOCK,
    },
    {
      marketId: "924.2",
      runnerDetails: RUNNER_DETAILS_MOCK,
    },
    {
      marketId: "924.3",
      runnerDetails: RUNNER_DETAILS_MOCK,
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

const SPB_MOCK = {
  result: [
    {
      originalBetPrice: {
        decimalDisplayOdds: { decimalOdds: 1.1 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      betModifiers: ["PRICE_BOOST"],
      runners: [
        {
          runner: { marketId: "924.1", selectionId: 1 },
          odds: {
            decimalDisplayOdds: {
              decimalOdds: 2.2,
            },
            fractionalDisplayOdds: {
              numerator: 1,
              denominator: 2,
            },
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.1", selectionId: 1 } }],
            edgeContexts: [
              {
                tokenId: "1234#1",
                generosity: 1,
                edge: "PRICE_BOOST",
              },
            ],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 2.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],

      totalPotentialWin: 2.2,
      originalTotalPotentialWin: 1.1,
      resultCode: "SUCCESS",
      wallets: [
        {
          amount: 1,
          type: "DEPOSITS",
        },
      ],

      betNo: 0,
      betId: 2253631677,
      betReceiptId: "O/10885708/0000011",
      numLines: 1,
      totalStake: 1,
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

  tokens: {
    priceBoostTokens: WALLETS.filter(({ walletType }) => walletType === "PRICE_BOOST_TOKEN").map(({ id, amount }) => ({
      id: `${id}`,
      numberOfTokens: 1,
      generosity: amount,
      boostPrice: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.2 },
        },
        decimalDisplayOdds: {
          decimalOdds: 2.2,
        },
        fractionalDisplayOdds: {
          numerator: 1,
          denominator: 2,
        },
      },
      maxStake: 10,
    })),
  },
};

const FIRST_SINGLE_MOCK_WITH_BONUS = {
  ...FIRST_SINGLE_MOCK,
  hasBonusMoney: true,
};

const FIRST_SINGLE_MOCK_WITH_FREE_BET_WALLETS = {
  ...FIRST_SINGLE_MOCK,
  applicableWallets: WALLETS.filter(({ walletType }) => walletType === "BONUS_CASH").map(({ id }) => id),
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

  tokens: {
    priceBoostTokens: WALLETS.filter(({ walletType }) => walletType === "PRICE_BOOST_TOKEN").map(({ id, amount }) => ({
      id: `${id}`,
      numberOfTokens: 1,
      generosity: amount,
      boostPrice: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.2 },
        },
        decimalDisplayOdds: {
          decimalOdds: 2.2,
        },
        fractionalDisplayOdds: {
          numerator: 1,
          denominator: 2,
        },
      },
      maxStake: 10,
    })),
  },
};

const SECOND_SINGLE_MOCK_WITH_BONUS = {
  ...SECOND_SINGLE_MOCK,
  hasBonusMoney: true,
};

const SINGLE_ODDS_BASE_MOCK = {
  trueOdds: {
    decimalOdds: { decimalOdds: 1.1 },
  },
  decimalDisplayOdds: {
    decimalOdds: 1.1,
  },
  ...FRACTIONAL_DISPLAY_ODDS_MOCK,
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.1",
    selectionId: 1,
  },
  odds: {
    trueOdds: SINGLE_ODDS_BASE_MOCK.trueOdds,
    fractionalDisplayOdds: SINGLE_ODDS_BASE_MOCK.fractionalDisplayOdds,
  },
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.2",
    selectionId: 1,
  },
  odds: SINGLE_ODDS_BASE_MOCK,
};

const DOUBLE_AND_TREBLE_BASE_MOCK = {
  legCombinations: [],
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
};

const DOUBLE_COMBINATION = {
  ...DOUBLE_AND_TREBLE_BASE_MOCK,
  betType: "DOUBLE",
  winAvgOdds: {
    ...FRACTIONAL_DISPLAY_ODDS_MOCK,
    decimalDisplayOdds: {
      decimalOdds: 2.4,
    },
    trueOdds: {
      decimalOdds: { decimalOdds: 2.4 },
    },
  },
};

const DOUBLE_COMBINATION_WITH_BONUS = {
  ...DOUBLE_COMBINATION,
  hasBonusMoney: true,
};

const SINGLE_MOCK_WITH_BONUS = {
  betCombinations: [FIRST_SINGLE_MOCK_WITH_BONUS],
  hasBonusMoney: true,
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const SINGLE_MOCK_WITH_FREE_BET_WALLETS = {
  betCombinations: [FIRST_SINGLE_MOCK_WITH_FREE_BET_WALLETS],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const DOUBLE_MOCK_WITH_BONUS = {
  betCombinations: [FIRST_SINGLE_MOCK_WITH_BONUS, SECOND_SINGLE_MOCK_WITH_BONUS, DOUBLE_COMBINATION_WITH_BONUS],
  hasBonusMoney: true,
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const DOUBLE_MOCK_WITH_FREE_BETS_WALLETS = {
  betCombinations: [FIRST_SINGLE_MOCK_WITH_FREE_BET_WALLETS, SECOND_SINGLE_MOCK, DOUBLE_COMBINATION],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
  wallets: WALLETS.filter(({ walletType }) => walletType === "BONUS_CASH").map(({ id, amount }) => ({
    walletId: id,
    amount,
    redeemable: "false",
    type: "BONUS_CASH",
  })),
};

const BFF_FETCH_CARDS_MOCK = {
  cards: [
    {
      __typename: "ExtraWalletCardGroup",
      urn: "ppb:tbd:cardgroup:extraWalletCardGroup:extraWallets",
      amount: 10.0,
      helpUrl: "thisisahelpurl",
      full: {
        edges: WALLETS.map(({ id, amount, expirationDate, walletType }) => {
          const newId = walletType !== "BONUS_CASH" ? `${id}#1` : `${id}`;
          return {
            node: {
              __typename: "ExtraWalletCard",
              urn: `ppb:tbd:card:extraWalletCard:${newId}`,
              badges: [],
              extraWallet: {
                __typename: "ExtraWallet",
                urn: `ppb:extraWallet:${newId}`,
                walletId: newId,
                indexedId: newId,
                amount,
                expirationDate,
                walletType,
              },
              restrictions: {
                __typename: "WalletRestrictions",
                single: "false",
                acca: "false",
                sameGameMulti: "false",
              },
            },
            __typename: "ExtraWalletCardGroupEdge",
          };
        }),
        __typename: "ExtraWalletCardGroupConnection",
      },
    },
  ],
};

describe("Free Bets and My Odds Boost interaction", () => {
  describe("when the user has betlip open with three selections with MYOB available", () => {
    describe("and the user clicks on the two singles' MYOB buttons", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { currencyCode: "USD", countryCode: "US" }));
        await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
        await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
        await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK_WITH_BONUS));
        await mockService.mockHttpRequest(getCardResults(BFF_FETCH_CARDS_MOCK));
        await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK));
        await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
        await browser.waitUntilEquals(marketRunnerSportsbookPO.first.odd, "1.1");

        await marketRunnerSportsbookPO.first.sportsbookBetButton.click();
        await browser.waitUntilDisplayed(placeButtonPO.element, "Place button is not visible");

        await betslipDrawerPO.header.click();
        await browser.waitUntilDisplayed(sportsbookMinimizedPO.element, "Minimized betslip not found");

        await marketRunnerSportsbookPO.second.sportsbookBetButton.scrollIntoView({
          block: "center",
        });
        await browser.waitUntilInViewport(
          marketRunnerSportsbookPO.second.sportsbookBetButton,
          "Second market bet button not in viewport",
        );

        await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK_WITH_BONUS));

        await marketRunnerSportsbookPO.second.sportsbookBetButton.click();
        await browser.waitUntilEquals(sportsbookMinimizedPO.counter, "2", "Second selection not added");

        await sportsbookMinimizedPO.element.waitForClickable();
        await sportsbookMinimizedPO.element.click();

        await browser.waitUntilEquals(
          freeBetsPO.label,
          "Use Free Bet Balance",
          "Freebets label is not equal to 'Use Free Bet Balance'",
        );

        await firstGenerosityWalletButtonPO.element.waitForClickable();
        await firstGenerosityWalletButtonPO.element.click();
        await firstExtraWalletCardPO.element.waitForClickable();
        await firstExtraWalletCardPO.element.click();
        await generosityWalletApplyButtonPO.element.click();

        await secondGenerosityWalletButtonPO.element.click();
        await secondExtraWalletCardPO.element.click();
        await generosityWalletApplyButtonPO.element.click();

        await stakeInputField.setValue("1");
      });

      it("[PRPI-5265] should display the MYOB buttons as selected with the correspondent alerts", async () => {
        expect(await browser.containsClass(firstGenerosityWalletButtonPO.element, PromoButtonPO.states.selected)).toBe(
          true,
        );

        expect(await browser.containsClass(secondGenerosityWalletButtonPO.element, PromoButtonPO.states.selected)).toBe(
          true,
        );

        expect(await firstSingleGenerosityWalletAlertPO.message.getText()).toBe("2% Bet Boost Applied");
        expect(await secondSingleGenerosityWalletAlertPO.message.getText()).toBe("3% Bet Boost Applied");
      });

      it("[PRPI-5266]shouldn't display any Free bet warning message", async () => {
        expect(await freeBetsCardLabelPO.first.label.isDisplayed()).toBe(false);
        expect(await freeBetsCardLabelPO.second.label.isDisplayed()).toBe(false);
      });

      it("[PRPI-5267]should display the new total returns", async () => {
        expect(await firstSingleControls.returnsLabel.getText()).toBe("Returns");
        expect(await firstSingleReturnValues.previousPnl.getText()).toBe("$1.10");
        expect(await firstSingleReturnValues.pnl.getText()).toBe("$2.20");
      });

      describe("When I selected the free bet checkbox", () => {
        beforeAll(async () => {
          await freeBetsPO.activateBonus("Use Free Bet Balance");
        });

        it("[PRPI-5268]should change the MYOB buttons to default state with no alert displayed", async () => {
          expect(
            await browser.containsClass(firstGenerosityWalletButtonPO.element, PromoButtonPO.states.selected),
          ).toBe(false);

          expect(
            await browser.containsClass(secondGenerosityWalletButtonPO.element, PromoButtonPO.states.selected),
          ).toBe(false);

          expect(await firstSingleGenerosityWalletAlertPO.element.isDisplayed()).toBe(false);
        });

        it("[PRPI-5269]should check the free bet checkbox", async () => {
          expect(await freeBetsPO.input.isSelected()).toBe(true);
        });

        it("[PRPI-5270]shouldn't display any new total returns", async () => {
          expect(await firstSingleControls.returnsLabel.getText()).toBe("Returns");
          expect(await firstSingleReturnValues.previousPnl.isDisplayed()).toBe(false);
          expect(await firstSingleReturnValues.pnl.getText()).toBe("$1.10");
        });

        describe("When I selected the MYOB button", () => {
          beforeAll(async () => {
            await firstGenerosityWalletButtonPO.element.waitForClickable();
            await firstGenerosityWalletButtonPO.element.click();
            await firstExtraWalletCardPO.element.waitForClickable();
            await firstExtraWalletCardPO.element.click();
            await generosityWalletApplyButtonPO.element.click();
            await freeBetsCardLabelPO.first.label.waitForDisplayed();
          });

          it("[PRPI-5271]should display a message 'Free Bet Ineligible'", async () => {
            expect(await freeBetsCardLabelPO.first.label.isDisplayed()).toBe(true);
            expect(await freeBetsCardLabelPO.first.label.getText()).toBe("Free Bet Ineligible");
          });

          it("[PRPI-5271]should display the MYOB button as selected with the correspondent alert", async () => {
            expect(
              await browser.containsClass(firstGenerosityWalletButtonPO.element, PromoButtonPO.states.selected),
            ).toBe(true);
            expect(await firstSingleGenerosityWalletAlertPO.message.getText()).toBe("2% Bet Boost Applied");
          });

          it("[PRPI-5271]should display the new total returns", async () => {
            expect(await firstSingleControls.returnsLabel.getText()).toBe("Returns");
            expect(await firstSingleReturnValues.previousPnl.getText()).toBe("$1.10");
            expect(await firstSingleReturnValues.pnl.getText()).toBe("$2.20");
          });

          it("[PRPI-5271]should check the free bet checkbox", async () => {
            expect(await freeBetsPO.input.isSelected()).toBe(true);
          });

          describe("When I place the bet", () => {
            beforeAll(async () => {
              await stakeInputField.setValue("1");
              await placeButton.element.waitForClickable();
              await placeButton.element.click();
              await browser.waitUntilEquals(receiptSingleOddsSegment.previousValue, "1.1");
            });

            it("[PRPI-5271]should place the bets with MYOB applied", async () => {
              expect(await sportsbookReceiptPanelPO.element.isDisplayed()).toBe(true);
              expect(await receiptSingleOddsSegment.previousValue.getText()).toBe("1.1");
              expect(await receiptSingleOddsSegment.value.getText()).toBe("2.2");
              expect(await receiptSingleReturnsSegments.previousPnl.getText()).toBe("$1.10");
              expect(await receiptSingleReturnsSegments.pnl.getText()).toBe("$2.20");
              expect(await singleReceiptAlert.message.getText()).toBe("Bet Boost Applied");
            });

            it("[PRPI-5271]should not apply the free bet", async () => {
              expect(await singleReceiptFreeBets.label.getText()).toBe("Bonus not available");
            });
          });
        });
      });
    });
  });
});

describe("Free Bets Wallets and My Odds Boost interaction", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { currencyCode: "USD", countryCode: "US" }));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK_WITH_FREE_BET_WALLETS));
    await mockService.mockHttpRequest(getCardResults(BFF_FETCH_CARDS_MOCK));
    await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
    await browser.waitUntilEquals(marketRunnerSportsbookPO.first.odd, "1.1");

    await marketRunnerSportsbookPO.first.sportsbookBetButton.click();
    await browser.waitUntilDisplayed(placeButtonPO.element, "Place button is not visible");

    await betslipDrawerPO.header.click();
    await browser.waitUntilDisplayed(sportsbookMinimizedPO.element, "Minimized betslip not found");

    await marketRunnerSportsbookPO.second.sportsbookBetButton.scrollIntoView({
      block: "center",
    });
    await browser.waitUntilInViewport(
      marketRunnerSportsbookPO.second.sportsbookBetButton,
      "Second market bet button not in viewport",
    );

    await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK_WITH_FREE_BETS_WALLETS));

    await marketRunnerSportsbookPO.second.sportsbookBetButton.click();
    await browser.waitUntilEquals(sportsbookMinimizedPO.counter, "2", "Second selection not added");

    await sportsbookMinimizedPO.element.waitForClickable();
    await sportsbookMinimizedPO.element.click();
  });

  describe("when the user has betlip open with three selections with the promo button available for the singles", () => {
    describe("and the user clicks on the first single promo button and selects a free bet wallet on the bottom sheet", () => {
      beforeAll(async () => {
        await firstGenerosityWalletButtonPO.element.waitForClickable();
        await firstGenerosityWalletButtonPO.element.click();

        await thirdExtraWalletCardPO.element.waitForClickable();
        await thirdExtraWalletCardPO.element.click();
      });

      it("[PRPI-7821] should select the free bet wallet", async () => {
        expect(await thirdExtraWalletCardOptionPO.input.isEnabled()).toBe(true);
        expect(await thirdExtraWalletCardOptionPO.input.isSelected()).toBe(true);
      });

      describe("and then the user selects one price boost token", () => {
        beforeAll(async () => {
          await firstExtraWalletCardPO.element.waitForClickable();
          await firstExtraWalletCardPO.element.click();
        });

        it("[PRPI-7821] should unselect the free bet wallet and select the price boost token", async () => {
          expect(await thirdExtraWalletCardOptionPO.input.isEnabled()).toBe(true);
          expect(await thirdExtraWalletCardOptionPO.input.isSelected()).toBe(false);

          expect(await firstExtraWalletCardOptionPO.input.isEnabled()).toBe(true);
          expect(await firstExtraWalletCardOptionPO.input.isSelected()).toBe(true);
        });

        describe("and the user applies the price boost token to the first single", () => {
          beforeAll(async () => {
            await generosityWalletApplyButtonPO.element.waitForClickable();
            await generosityWalletApplyButtonPO.element.click();
          });

          it("[PRPI-7821] should display the first promo button as selected and display an alert with the '2% Bet Boost Applied' label", async () => {
            expect(
              await browser.containsClass(firstGenerosityWalletButtonPO.element, PromoButtonPO.states.selected),
            ).toBe(true);

            expect(await firstSingleGenerosityWalletAlertPO.message.getText()).toBe("2% Bet Boost Applied");
          });

          describe("and then the user opens the generosity wallet on the same single", () => {
            beforeAll(async () => {
              await firstGenerosityWalletButtonPO.element.waitForClickable();
              await firstGenerosityWalletButtonPO.element.click();
            });

            it("[PRPI-7821] should display the first wallet (price boost token) as selected and enabled", async () => {
              expect(await thirdExtraWalletCardOptionPO.input.isEnabled()).toBe(true);
              expect(await thirdExtraWalletCardOptionPO.input.isSelected()).toBe(false);

              expect(await firstExtraWalletCardOptionPO.input.isEnabled()).toBe(true);
              expect(await firstExtraWalletCardOptionPO.input.isSelected()).toBe(true);
            });

            describe("and then the user selects a free bet wallet", () => {
              beforeAll(async () => {
                await thirdExtraWalletCardPO.element.waitForClickable();
                await thirdExtraWalletCardPO.element.click();
              });

              it("[PRPI-7821] should select the free bet wallet and unselect the price boost wallet", async () => {
                expect(await thirdExtraWalletCardOptionPO.input.isEnabled()).toBe(true);
                expect(await thirdExtraWalletCardOptionPO.input.isSelected()).toBe(true);

                expect(await firstExtraWalletCardOptionPO.input.isEnabled()).toBe(true);
                expect(await firstExtraWalletCardOptionPO.input.isSelected()).toBe(false);
              });

              describe("and then the user applies the free bet wallet", () => {
                beforeAll(async () => {
                  await generosityWalletApplyButtonPO.element.waitForClickable();
                  await generosityWalletApplyButtonPO.element.click();
                });

                it("[PRPI-7821] should display the promo button as selected with the alert showing 'Includes $10.00 in Free Bets'", async () => {
                  expect(
                    await browser.containsClass(firstGenerosityWalletButtonPO.element, PromoButtonPO.states.selected),
                  ).toBe(true);

                  expect(await firstSingleGenerosityWalletAlertPO.message.getText()).toBe(
                    "Includes $10.00 in Free Bets",
                  );
                });
              });
            });
          });
        });
      });
    });
  });
});
