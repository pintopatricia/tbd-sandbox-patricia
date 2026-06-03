const {
  MinimizedPO,
  SportPagePO,
  SinglesCardPO,
  SinglePO,
  HeaderPO,
  SportsbookReceiptPanelPO,
  CardPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  BetslipDrawerPO,
  FixedNumberInputFieldPO,
  CurrencyNumberInputFieldPO,
  BetSegmentsPO,
  BetControlsPO,
  OddsPO,
  PNLAndWhatIfPO,
  SportsbookPlacePanelPO,
  PromoButtonPO,
  AlertPO,
  ExtraWalletCardPO,
  ExtraWalletCardGroupPO,
  PrimaryButtonPO,
  GenerosityWalletPO,
  OptionPO,
} = require("../../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;

const { getSportsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const EventMarketCardPO = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.po");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");

const sportPagePO = new SportPagePO();
const headerPO = new HeaderPO();
const firstEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[0]);
const secondEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[1]);
const firstMatchOddsCard = new CardPO(firstEventMarketCardPO.market);
const secondMatchOddsCard = new CardPO(secondEventMarketCardPO.market);
const firstSbkMarketPO = new InlineSportsbookMarketPO(firstMatchOddsCard.inlineSportsbookMarket);
const secondSbkMarketPO = new InlineSportsbookMarketPO(secondMatchOddsCard.inlineSportsbookMarket);
const firstSbkRunnerPO = new SportsbookBetButtonPO(firstSbkMarketPO.betButtons[0]);
const secondSbkRunnerPO = new SportsbookBetButtonPO(secondSbkMarketPO.betButtons[0]);
const thirdSbkRunnerPO = new SportsbookBetButtonPO(secondSbkMarketPO.betButtons[1]);
const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const sportsbookMinimizedBetslipPO = new MinimizedPO();
const betslipDrawerPO = new BetslipDrawerPO();

const singlesCardPO = new SinglesCardPO(sportsbookPlacePanelPO.element);
const firstSingle = new SinglePO(singlesCardPO.singles[0]);
const firstSingleAlertPO = new AlertPO(firstSingle.element);
const secondSingle = new SinglePO(singlesCardPO.singles[1]);
const secondSingleAlertPO = new AlertPO(secondSingle.element);
const thirdSingle = new SinglePO(singlesCardPO.singles[2]);

const firstSingleControls = new BetControlsPO(firstSingle.element);
const secondSingleControls = new BetControlsPO(secondSingle.element);
const thirdSingleControls = new BetControlsPO(thirdSingle.element);

const generosityWalletPO = new GenerosityWalletPO();
const generosityWalletApplyButtonPO = new PrimaryButtonPO(generosityWalletPO.applyButton);
const generosityWalletCloseButtonPO = new PrimaryButtonPO(generosityWalletPO.closeButton);

const extraWalletCardGroupPO = new ExtraWalletCardGroupPO();

const firstExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[0]);
const firstExtraWalletCardOptionPO = new OptionPO(firstExtraWalletCardPO.walletOption);

const secondExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[1]);
const secondExtraWalletCardOptionPO = new OptionPO(secondExtraWalletCardPO.walletOption);

const firstSingleOddsInputField = new FixedNumberInputFieldPO(firstSingleControls.fixedInput);
const firstSingleStakeInputField = new CurrencyNumberInputFieldPO(firstSingleControls.currencyInput);
const firstSingleGenerosityWalletButtonPO = new PromoButtonPO(firstSingleControls.generosityWalletButton);
const firstSingleReturnValues = new PNLAndWhatIfPO(firstSingleControls.returnsValueContainer);

const secondSingleOddsInputField = new FixedNumberInputFieldPO(secondSingleControls.fixedInput);
const secondSingleStakeInputField = new CurrencyNumberInputFieldPO(secondSingleControls.currencyInput);
const secondSingleGenerosityWalletButtonPO = new PromoButtonPO(secondSingleControls.generosityWalletButton);
const secondSingleReturnValues = new PNLAndWhatIfPO(secondSingleControls.returnsValueContainer);

const thirdSingleStakeInputField = new CurrencyNumberInputFieldPO(thirdSingleControls.currencyInput);
const thirdSingleGenerosityWalletButtonPO = new PromoButtonPO(thirdSingleControls.generosityWalletButton);

const receiptPanelPO = new SportsbookReceiptPanelPO();
const receiptSingleSegments = new BetSegmentsPO(receiptPanelPO.singles[0]);
const receiptSingleOddsSegment = new OddsPO(receiptSingleSegments.leftValue);
const receiptSingleReturnsSegments = new PNLAndWhatIfPO(receiptSingleSegments.rightValue);

const firstSingleFreeBetsWalletsAlertPO = new AlertPO(receiptPanelPO.singles[0]);
const secondSingleFreeBetsWalletsAlertPO = new AlertPO(receiptPanelPO.singles[1]);
const thirdSingleFreeBetsWalletsAlertPO = new AlertPO(receiptPanelPO.singles[2]);

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
          noOdds: true,
        },
        {
          selectionId: "3",
          noOdds: true,
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
          noOdds: true,
        },
      ],
    },
    {
      marketId: "924.3",
      runnerDetails: [
        {
          selectionId: "1",
          noOdds: true,
        },
        {
          selectionId: "2",
          noOdds: true,
        },
        {
          selectionId: "3",
          noOdds: true,
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
        title: "League",
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
        title: "League 2",
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

const FIRST_RUNNER = { marketId: "924.1", selectionId: 1 };
const SECOND_RUNNER = { marketId: "924.2", selectionId: 1 };
const THIRD_RUNNER = { marketId: "924.2", selectionId: 2 };

const TOKENS = [
  { id: 20000000001, amount: 2, expirationDate: "2025-02-02T00:00:50.000Z" },
  { id: 20000000002, amount: 3, expirationDate: "2025-02-02T00:01:00.000Z" },
];

const FIRST_SINGLE_MOCK = {
  legCombinations: [{ runners: [FIRST_RUNNER] }],
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
  tokens: {
    priceBoostTokens: TOKENS.map(({ id, amount }) => ({
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

const FIRST_SINGLE_ODDS_MOCK = {
  runner: FIRST_RUNNER,
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [{ runners: [SECOND_RUNNER] }],
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
  tokens: {
    priceBoostTokens: TOKENS.map(({ id, amount }) => ({
      id: `${id}`,
      numberOfTokens: 1,
      generosity: amount,
      boostPrice: {
        trueOdds: {
          decimalOdds: 1.2,
        },
      },
      maxStake: 10,
    })),
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

const THIRD_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.2",
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
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
  tokens: {
    priceBoostTokens: TOKENS.map(({ id, amount }) => ({
      id: `${id}`,
      numberOfTokens: 1,
      generosity: amount,
      boostPrice: {
        trueOdds: {
          decimalOdds: 1.2,
        },
      },
    })),
  },
};

const THIRD_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.2",
    selectionId: 2,
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

const DOUBLE_MOCK_NON_COMBINEABLE = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    THIRD_SINGLE_MOCK,
    {
      betType: "DOUBLE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      numLines: 2,
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

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

const SPB_MOCK = {
  result: [
    {
      betModifiers: ["PRICE_BOOST"],
      runners: [{ runner: FIRST_RUNNER }],
      legs: [
        {
          leg: { betRunners: [{ runner: FIRST_RUNNER }] },
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
      runners: [{ runner: SECOND_RUNNER }],
      legs: [
        {
          leg: { betRunners: [{ runner: SECOND_RUNNER }] },
          winOdds: { decimalDisplayOdds: { decimalOdds: 2.5 } },
        },
      ],

      totalStake: 0.12,
      totalPotentialWin: 2,
      betPrice: { decimalDisplayOdds: { decimalOdds: 2 } },
    },
  ],
};

const THREE_BETS_SPB_MOCK = {
  result: [
    {
      runners: [{ runner: FIRST_RUNNER }],
      legs: [
        {
          leg: { betRunners: [{ runner: FIRST_RUNNER }] },
          winOdds: { decimalDisplayOdds: { decimalOdds: 2.5 } },
        },
      ],

      totalStake: 0.12,
      totalPotentialWin: 2.5,
      betPrice: { decimalDisplayOdds: { decimalOdds: 2.5 } },
    },
    {
      betModifiers: ["PRICE_BOOST"],
      runners: [{ runner: SECOND_RUNNER }],
      legs: [
        {
          leg: { betRunners: [{ runner: SECOND_RUNNER }] },
          winOdds: { decimalDisplayOdds: { decimalOdds: 2.5 } },
        },
      ],

      totalStake: 0.12,
      totalPotentialWin: 2,
      betPrice: { decimalDisplayOdds: { decimalOdds: 2 } },
      originalTotalPotentialWin: 2,
      originalBetPrice: { decimalDisplayOdds: { decimalOdds: 2 } },
    },
    {
      betModifiers: ["PRICE_BOOST"],
      runners: [{ runner: THIRD_RUNNER }],
      legs: [
        {
          leg: { betRunners: [{ runner: THIRD_RUNNER }] },
          winOdds: { decimalDisplayOdds: { decimalOdds: 2.5 } },
        },
      ],

      totalStake: 0.12,
      totalPotentialWin: 2,
      betPrice: { decimalDisplayOdds: { decimalOdds: 2 } },
      originalTotalPotentialWin: 2,
      originalBetPrice: { decimalDisplayOdds: { decimalOdds: 2 } },
    },
  ],
};

const WALLET_MOCK = [
  { amount: "25.00", walletName: "MAIN" },
  { amount: "2.00", walletName: "BOOST_TOKENS" },
  { amount: "0.00", walletName: "SPORTSBOOK_BONUS_WAGERING" },
];

const BFF_FETCH_CARDS_MOCK = {
  cards: [
    {
      __typename: "ExtraWalletCardGroup",
      urn: "ppb:tbd:cardgroup:extraWalletCardGroup:extraWallets",
      amount: 10.0,
      helpUrl: "thisisahelpurl",
      full: {
        edges: TOKENS.map(({ id, amount, expirationDate }) => ({
          node: {
            __typename: "ExtraWalletCard",
            urn: `ppb:tbd:card:extraWalletCard:${id}#1`,
            badges: [],
            extraWallet: {
              __typename: "ExtraWallet",
              urn: `ppb:extraWallet:${id}`,
              walletId: `${id}`,
              indexedId: `${id}#1`,
              amount,
              expirationDate,
              walletType: "PRICE_BOOST_TOKEN",
            },
            restrictions: {
              __typename: "WalletRestrictions",
              single: "false",
              acca: "false",
              sameGameMulti: "false",
            },
          },
          __typename: "ExtraWalletCardGroupEdge",
        })),
        __typename: "ExtraWalletCardGroupConnection",
      },
    },
  ],
};

describe("My Odds Boost", () => {
  describe("with place panel opened with 3 selections", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_MOCK.urn, {
          PRICE_BOOST_OFFERS: { isActive: true },
        }),
      );
      await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getWallets(WALLET_MOCK));
      await mockService.mockHttpRequest(getCardResults(BFF_FETCH_CARDS_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));

      await browser.waitUntilEquals(firstSbkRunnerPO.odd, "1.1");
      await browser.waitUntil(async () => (await headerPO.balanceLabel.getText()) === "$25.00");

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
      await browser.waitUntilDisplayed(sportsbookMinimizedBetslipPO.title, "Acca builder not visible");

      await thirdSbkRunnerPO.sportsbookBetButton.scrollIntoView({
        block: "center",
      });
      await browser.waitUntilDisplayed(thirdSbkRunnerPO.sportsbookBetButton, "Third runner bet button not visible");

      await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK_NON_COMBINEABLE));
      await thirdSbkRunnerPO.sportsbookBetButton.click();
      await browser.waitUntil(async () => (await sportsbookMinimizedBetslipPO.title.getText()).includes("Betslip"), {
        timeoutMsg: "Non combineable selection wasn't added",
      });
      await sportsbookMinimizedBetslipPO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Betslip is not visible");
    });

    it("[PRPI-8037] should display unselected MYOB button in each single", async () => {
      expect(await firstSingleGenerosityWalletButtonPO.element.isDisplayed()).toBe(true);
      expect(
        await browser.containsClass(firstSingleGenerosityWalletButtonPO.element, PromoButtonPO.states.selected),
      ).toBe(false);

      expect(await secondSingleGenerosityWalletButtonPO.element.isDisplayed()).toBe(true);
      expect(
        await browser.containsClass(secondSingleGenerosityWalletButtonPO.element, PromoButtonPO.states.selected),
      ).toBe(false);

      expect(await thirdSingleGenerosityWalletButtonPO.element.isDisplayed()).toBe(true);
      expect(
        await browser.containsClass(thirdSingleGenerosityWalletButtonPO.element, PromoButtonPO.states.selected),
      ).toBe(false);
    });

    describe("When user adds a stake value of 0.12 in the first selection", () => {
      beforeAll(async () => {
        await firstSingleStakeInputField.setValue(0.12);
      });

      it("[PRPI-8038] should have the returns value updated", async () => {
        expect(await firstSingleControls.returnsLabel.getText()).toBe("Returns");
        expect(await firstSingleReturnValues.pnl.getText()).toBe("$0.13");
      });

      describe("And spends the first MYOB token", () => {
        beforeAll(async () => {
          await firstSingleGenerosityWalletButtonPO.element.click();
          await firstExtraWalletCardPO.element.click();
          await generosityWalletApplyButtonPO.element.click();
        });

        it("[PRPI-8039] should select the MYOB button", async () => {
          expect(
            await browser.containsClass(firstSingleGenerosityWalletButtonPO.element, PromoButtonPO.states.selected),
          ).toBe(true);
        });

        it("[PRPI-8040] should update the odds field with the new odd", async () => {
          expect(await firstSingleOddsInputField.numberField.getValue()).toBe("2.2");
        });

        it("[PRPI-8041] should display old odds", async () => {
          expect(await firstSingleOddsInputField.previousValue.getText()).toBe("1.1");
        });

        it("[PRPI-8042] should have the returns value updated", async () => {
          expect(await firstSingleControls.returnsLabel.getText()).toBe("Returns");
          expect(await firstSingleReturnValues.previousPnl.getText()).toBe("$0.13");
          expect(await firstSingleReturnValues.pnl.getText()).toBe("$0.26");
        });

        describe("When user adds a stake value of 0.12 in the second selection", () => {
          beforeAll(async () => {
            await secondSingleStakeInputField.element.scrollIntoView({ block: "center" });
            await secondSingleStakeInputField.setValue(0.12);
          });

          it("[PRPI-8043] should have the returns value updated", async () => {
            expect(await secondSingleControls.returnsLabel.getText()).toBe("Returns");
            expect(await secondSingleReturnValues.pnl.getText()).toBe("$0.13");
          });

          describe("And spends the second and last available MYOB token", () => {
            beforeAll(async () => {
              await secondSingleGenerosityWalletButtonPO.element.click();
              await secondExtraWalletCardPO.element.click();
              await generosityWalletApplyButtonPO.element.click();
            });

            it("[PRPI-8044] should select the MYOB button", async () => {
              expect(
                await browser.containsClass(
                  secondSingleGenerosityWalletButtonPO.element,
                  PromoButtonPO.states.selected,
                ),
              ).toBe(true);
            });

            it("[PRPI-8044] should update the odds field with the new odd", async () => {
              expect(await secondSingleOddsInputField.numberField.getValue()).toBe("2.2");
            });

            it("[PRPI-8044] should display old odds", async () => {
              expect(await secondSingleOddsInputField.previousValue.getText()).toBe("1.1");
            });

            it("[PRPI-8044] should have the returns value updated", async () => {
              expect(await secondSingleControls.returnsLabel.getText()).toBe("Returns");
              expect(await secondSingleReturnValues.previousPnl.getText()).toBe("$0.13");
              expect(await secondSingleReturnValues.pnl.getText()).toBe("$0.26");
            });

            describe("When user unselects the MYOB button on the second selection", () => {
              beforeAll(async () => {
                await secondSingleAlertPO.actionLink.waitForClickable();
                await secondSingleAlertPO.actionLink.click();
              });

              it("[PRPI-8044] should display unselected MYOB button on the second selection", async () => {
                expect(await secondSingleGenerosityWalletButtonPO.element.isDisplayed()).toBe(true);
                expect(
                  await browser.containsClass(
                    secondSingleGenerosityWalletButtonPO.element,
                    PromoButtonPO.states.selected,
                  ),
                ).toBe(false);
              });

              it("[PRPI-8044] should display unselected MYOB button on the third selection", async () => {
                expect(await thirdSingleGenerosityWalletButtonPO.element.isDisplayed()).toBe(true);
                expect(
                  await browser.containsClass(
                    thirdSingleGenerosityWalletButtonPO.element,
                    PromoButtonPO.states.selected,
                  ),
                ).toBe(false);
              });

              it("[PRPI-8044] should display starter odd on the second selection", async () => {
                expect(await secondSingleOddsInputField.numberField.getValue()).toBe("1.1");
              });

              describe("when user clicks on place", () => {
                beforeAll(async () => {
                  await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK));
                  await sportsbookPlacePanelPO.place.click();
                  await browser.waitUntilDisplayed(receiptPanelPO.element);
                });

                it("[PRPI-8044] the receipt should be displayed", async () => {
                  expect(await receiptPanelPO.element.isDisplayed()).toBe(true);
                });

                it("[PRPI-8044] the odds should show the old value", async () => {
                  expect(await receiptSingleOddsSegment.previousValue.getText()).toBe("2");
                });

                it("[PRPI-8044] the odds should show the new value", async () => {
                  expect(await receiptSingleOddsSegment.value.getText()).toBe("2.5");
                });

                it("[PRPI-8044] the returns should show the old", async () => {
                  expect(await receiptSingleReturnsSegments.previousPnl.getText()).toBe("$2.00");
                });

                it("[PRPI-8044] the returns should show the new value", async () => {
                  expect(await receiptSingleReturnsSegments.pnl.getText()).toBe("$2.50");
                });

                it("[PRPI-8044] the MYOB icon should be displayed", async () => {
                  expect(await firstSingleFreeBetsWalletsAlertPO.icon.isDisplayed()).toBe(true);
                });

                it("[PRPI-8044] the MYOB label should be 'Bet Boost Applied'", async () => {
                  expect(await firstSingleFreeBetsWalletsAlertPO.message.getText()).toBe("Bet Boost Applied");
                });
              });
            });
          });
        });
      });
    });
  });

  describe("given the user has three selections on the Betslip", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_MOCK.urn, {
          PRICE_BOOST_OFFERS: { isActive: true },
        }),
      );
      await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getWallets(WALLET_MOCK));
      await mockService.mockHttpRequest(getCardResults(BFF_FETCH_CARDS_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));

      await browser.waitUntilEquals(firstSbkRunnerPO.odd, "1.1");
      await browser.waitUntil(async () => (await headerPO.balanceLabel.getText()) === "$25.00");

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
      await browser.waitUntilDisplayed(sportsbookMinimizedBetslipPO.title, "Acca builder not visible");

      await thirdSbkRunnerPO.sportsbookBetButton.scrollIntoView({
        block: "center",
      });
      await browser.waitUntilDisplayed(thirdSbkRunnerPO.sportsbookBetButton, "Third runner bet button not visible");

      await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK_NON_COMBINEABLE));
      await thirdSbkRunnerPO.sportsbookBetButton.click();
      await browser.waitUntil(async () => (await sportsbookMinimizedBetslipPO.title.getText()).includes("Betslip"), {
        timeoutMsg: "Non combineable selection wasn't added",
      });
      await sportsbookMinimizedBetslipPO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Betslip is not visible");
    });

    describe("and the user has two Price Boosts", () => {
      describe("and the first two rows have the Price Boost button selected", () => {
        beforeAll(async () => {
          await firstSingleGenerosityWalletButtonPO.element.click();
          await firstExtraWalletCardPO.element.click();
          await generosityWalletApplyButtonPO.element.click();
          await firstSingleStakeInputField.setValue(0.12);

          await secondSingleGenerosityWalletButtonPO.element.click();
          await secondExtraWalletCardPO.element.click();
          await generosityWalletApplyButtonPO.element.click();
          await secondSingleStakeInputField.setValue(0.12);

          await thirdSingleStakeInputField.setValue(0.12);

          await thirdSingleGenerosityWalletButtonPO.element.click();
          await browser.waitUntilDisplayed(firstExtraWalletCardOptionPO.element);
          await browser.waitUntilDisplayed(secondExtraWalletCardOptionPO.element);
        });

        it("[PRPI-5276]then the third selection doesn't have Price Boost available in the Generosity Wallet", async () => {
          expect(await firstExtraWalletCardOptionPO.input.isSelected()).toBe(true);
          expect(await firstExtraWalletCardOptionPO.input.isEnabled()).toBe(false);

          expect(await secondExtraWalletCardOptionPO.input.isSelected()).toBe(true);
          expect(await secondExtraWalletCardOptionPO.input.isEnabled()).toBe(false);
        });

        afterAll(async () => {
          await generosityWalletCloseButtonPO.element.click();
        });
      });

      describe("when the user removes Price Boost on the first row", () => {
        beforeAll(async () => {
          await firstSingleAlertPO.actionLink.waitForClickable();
          await firstSingleAlertPO.actionLink.click();
        });

        describe("then on the first row the user open generosity wallet", () => {
          beforeAll(async () => {
            await firstSingleGenerosityWalletButtonPO.element.waitForClickable();
            await firstSingleGenerosityWalletButtonPO.element.click();
          });

          it("[PRPI-5277]then the user have the price boost available", async () => {
            expect(await firstExtraWalletCardPO.element.isEnabled()).toBe(true);
          });

          afterAll(async () => {
            await generosityWalletPO.closeButton.waitForClickable();
            await generosityWalletPO.closeButton.click();
          });
        });

        it("[PRPI-5278]then on the second row the user have the price boost selected", async () => {
          expect(
            await browser.containsClass(secondSingleGenerosityWalletButtonPO.element, PromoButtonPO.states.selected),
          ).toBe(true);
        });

        describe("then on the third row the user open generosity wallet", () => {
          beforeAll(async () => {
            await thirdSingleGenerosityWalletButtonPO.element.waitForClickable();
            await thirdSingleGenerosityWalletButtonPO.element.click();
          });

          it("[PRPI-5279]then the user have the price boost available", async () => {
            expect(await firstExtraWalletCardPO.element.isEnabled()).toBe(true);
          });

          afterAll(async () => {
            await generosityWalletPO.closeButton.waitForClickable();
            await generosityWalletPO.closeButton.click();
          });
        });
      });

      describe("when the user selects the Price Boost on the third combination", () => {
        beforeAll(async () => {
          await thirdSingleGenerosityWalletButtonPO.element.waitForClickable();
          await thirdSingleGenerosityWalletButtonPO.element.click();
          await firstExtraWalletCardPO.element.waitForClickable();
          await firstExtraWalletCardPO.element.click();
          await generosityWalletApplyButtonPO.element.click();
        });

        describe("and the user opens the Generosity Wallet in the first row", () => {
          beforeAll(async () => {
            await firstSingleGenerosityWalletButtonPO.element.click();
            await browser.waitUntilDisplayed(firstExtraWalletCardOptionPO.element);
            await browser.waitUntilDisplayed(secondExtraWalletCardOptionPO.element);
          });

          it("[PRPI-5280]then the user doesn't have Price Boosts available", async () => {
            expect(await firstExtraWalletCardOptionPO.input.isSelected()).toBe(true);
            expect(await firstExtraWalletCardOptionPO.input.isEnabled()).toBe(false);

            expect(await secondExtraWalletCardOptionPO.input.isSelected()).toBe(true);
            expect(await secondExtraWalletCardOptionPO.input.isEnabled()).toBe(false);
          });

          afterAll(async () => {
            await generosityWalletPO.closeButton.click();
          });
        });

        it("[PRPI-5281]then the third selection has the Generosity Wallet button selected", async () => {
          expect(
            await browser.containsClass(thirdSingleGenerosityWalletButtonPO.element, PromoButtonPO.states.selected),
          ).toBe(true);
        });
      });

      describe("when I place bets", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getPlaceBet(THREE_BETS_SPB_MOCK));
          await sportsbookPlacePanelPO.place.click();
          await browser.waitUntilDisplayed(receiptPanelPO.element);
        });

        it("[PRPI-3462]then the first bet is placed without Price Boost", async () => {
          expect(await firstSingleFreeBetsWalletsAlertPO.message.isExisting()).toBe(false);
        });

        it("[PRPI-3463]then the second and third bets are placed with Price Boost", async () => {
          expect(await secondSingleFreeBetsWalletsAlertPO.message.getText()).toBe("Bet Boost Applied");
          expect(await thirdSingleFreeBetsWalletsAlertPO.message.getText()).toBe("Bet Boost Applied");
        });
      });
    });
  });
});
