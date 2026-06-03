const {
  MinimizedPO,
  SportsbookReceiptPanelPO,
  SportPagePO,
  SinglePO,
  SinglesCardPO,
  CardPO,
  BetControlsPO,
  BetslipDrawerPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  CurrencyNumberInputFieldPO,
  BetsSummaryPO,
  PrimaryButtonPO,
  PNLAndWhatIfPO,
  SportsbookPlacePanelPO,
  PromoButtonPO,
  GenerosityWalletPO,
  ExtraWalletCardGroupPO,
  ExtraWalletCardPO,
  AlertPO,
  OptionPO,
} = require("../../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getSportsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const EventMarketCardPO = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.po");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");

const sportPagePO = new SportPagePO();
const sportsbookMinimizedBetslipPO = new MinimizedPO();
const summaryPO = new BetsSummaryPO();
const firstEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[0]);
const secondEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[1]);
const firstMatchOddsCardPO = new CardPO(firstEventMarketCardPO.market);
const secondMatchOddsCardPO = new CardPO(secondEventMarketCardPO.market);
const firstSbkMarketPO = new InlineSportsbookMarketPO(firstMatchOddsCardPO.inlineSportsbookMarket);
const secondSbkMarketPO = new InlineSportsbookMarketPO(secondMatchOddsCardPO.inlineSportsbookMarket);
const firstSbkRunnerPO = new SportsbookBetButtonPO(firstSbkMarketPO.betButtons[0]);
const secondSbkRunnerPO = new SportsbookBetButtonPO(secondSbkMarketPO.betButtons[0]);
const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();

const singlesCardPO = new SinglesCardPO(sportsbookPlacePanelPO.element);
const firstSinglePO = new SinglePO(singlesCardPO.singles[0]);
const secondSinglePO = new SinglePO(singlesCardPO.singles[1]);

const firstSingleControlsPO = new BetControlsPO(firstSinglePO.element);
const secondSingleControlsPO = new BetControlsPO(secondSinglePO.element);

const firstSingleGenerosityButtonPO = new PromoButtonPO(firstSingleControlsPO.generosityWalletButton);
const secondSingleGenerosityButtonPO = new PromoButtonPO(secondSingleControlsPO.generosityWalletButton);

const multipleControlsPO = new BetControlsPO(sportsbookPlacePanelPO.collapsableSections[0]);
const multipleGenerosityButtonPO = new PromoButtonPO(multipleControlsPO.generosityWalletButton);
const multipleStakeInputFieldPO = new CurrencyNumberInputFieldPO(multipleControlsPO.currencyInput);
const multipleReturnValuesPO = new PNLAndWhatIfPO(multipleControlsPO.returnsValueContainer);
const multipleStartingPriceOptionPO = new OptionPO(multipleControlsPO.startingPrice);
const multipleGenerosityWalletAlertPO = new AlertPO(multipleControlsPO.generosityAlertMessage);
const betslipDrawerPO = new BetslipDrawerPO();

const receiptPanelPO = new SportsbookReceiptPanelPO();
const betBuildersFreeBetsWalletsAlertPO = new AlertPO(receiptPanelPO.multiples[0]);
const sportsbookReceiptSummaryPO = new BetsSummaryPO(receiptPanelPO.summary);

const generosityWalletPO = new GenerosityWalletPO();
const generosityWalletApplyButtonPO = new PrimaryButtonPO(generosityWalletPO.applyButton);

const extraWalletCardGroupPO = new ExtraWalletCardGroupPO();
const firstExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[0]);
const firstExtraWalletCardOptionPO = new OptionPO(firstExtraWalletCardPO.walletOption);
const secondExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[1]);
const secondExtraWalletCardOptionPO = new OptionPO(secondExtraWalletCardPO.walletOption);

const mockService = new MockService();
const EVENT_TYPE_ID = 1;

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

const TOKENS = [
  { id: 20000000001, amount: 2, expirationDate: "2025-02-02T00:00:50.000Z" },
  { id: 20000000002, amount: 3, expirationDate: "2025-02-02T00:01:00.000Z" },
];

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
  runner: {
    marketId: "924.1",
    selectionId: 1,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
    decimalDisplayOdds: { decimalOdds: 1.1 },
  },
  availablePriceTypes: ["STARTING_PRICE"],
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.2",
          selectionId: 11,
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
  availablePriceTypes: ["STARTING_PRICE"],
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.2",
    selectionId: 11,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
    decimalDisplayOdds: { decimalOdds: 1.1 },
  },
  availablePriceTypes: ["STARTING_PRICE"],
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
      canPlaceEachwayBet: true,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      numLines: 1,
      hasBonusMoney: true,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 2.4,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 2.4 },
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
      availablePriceTypes: ["STARTING_PRICE"],
    },
  ],

  hasBonusMoney: true,
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const SPB_MOCK = {
  result: [
    {
      betModifiers: ["PRICE_BOOST"],
      runners: [
        {
          runner: { marketId: "924.1", selectionId: 1 },
        },
        {
          runner: { marketId: "924.2", selectionId: 11 },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.1", selectionId: 1 } }],
          },
          winOdds: { decimalDisplayOdds: { decimalOdds: 0.2 } },
        },
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.2", selectionId: 11 } }],
            winOdds: { decimalDisplayOdds: { decimalOdds: 0.4 } },
          },
        },
      ],

      betType: "DOUBLE",
      totalStake: 0.12,
      totalPotentialWin: 2.5,
      originalTotalPotentialWin: 0.29,
      betPrice: { decimalDisplayOdds: { decimalOdds: 2.4 } },
      originalBetPrice: { decimalDisplayOdds: { decimalOdds: 2.0 } },
    },
  ],
};

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

describe("Betslip - SBK Price Boost Multiples", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getCardResults(BFF_FETCH_CARDS_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(
      getImplyBetsResponse({ betCombinations: [FIRST_SINGLE_MOCK], runnerOdds: [FIRST_SINGLE_ODDS_MOCK] }),
    );
  });

  describe("When the user adds 2 selections to the betslip", () => {
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
      await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
      await secondSbkRunnerPO.sportsbookBetButton.click();
      await browser.waitUntil(
        async () => {
          const title = await sportsbookMinimizedBetslipPO.title.getText();

          return title.includes("2.4");
        },
        {
          timeoutMsg: "2 Leg multiple was not combined",
        },
      );

      await sportsbookMinimizedBetslipPO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element);
    });

    describe("and then the user has two Price Boosts", () => {
      it("[PRPI-8017] should display the generosity wallet button on the double", async () => {
        expect(await multipleGenerosityButtonPO.element.isDisplayed()).toBe(true);
        expect(await browser.containsClass(multipleGenerosityButtonPO.element, PromoButtonPO.states.selected)).toBe(
          false,
        );
      });

      it("[PRPI-8018] should display the generosity wallet button on each single", async () => {
        expect(await firstSingleGenerosityButtonPO.element.isDisplayed()).toBe(true);
        expect(await browser.containsClass(firstSingleGenerosityButtonPO.element, PromoButtonPO.states.selected)).toBe(
          false,
        );

        expect(await secondSingleGenerosityButtonPO.element.isDisplayed()).toBe(true);
        expect(await browser.containsClass(secondSingleGenerosityButtonPO.element, PromoButtonPO.states.selected)).toBe(
          false,
        );
      });

      describe("and then the user clicks on the generosity wallet button on the double and applies a price boost token", () => {
        beforeAll(async () => {
          await multipleGenerosityButtonPO.element.click();
          await firstExtraWalletCardPO.element.click();
          await generosityWalletApplyButtonPO.element.click();
        });

        it("[PRPI-8019] should display the generosity wallet button as selected on the double and the alert with the '2% Bet Boost Applied' label", async () => {
          expect(await browser.containsClass(multipleGenerosityButtonPO.element, PromoButtonPO.states.selected)).toBe(
            true,
          );
          expect(await multipleGenerosityWalletAlertPO.message.getText()).toBe("2% Bet Boost Applied");
        });

        it("[PRPI-8019] should display the generosity wallet button as not selected and enabled on the singles", async () => {
          expect(await firstSingleGenerosityButtonPO.element.isEnabled()).toBe(true);
          expect(
            await browser.containsClass(firstSingleGenerosityButtonPO.element, PromoButtonPO.states.selected),
          ).toBe(false);

          expect(await secondSingleGenerosityButtonPO.element.isEnabled()).toBe(true);
          expect(
            await browser.containsClass(secondSingleGenerosityButtonPO.element, PromoButtonPO.states.selected),
          ).toBe(false);
        });

        describe("and then the user clicks on the starting price toggle", () => {
          beforeAll(async () => {
            await multipleStartingPriceOptionPO.element.waitForClickable();
            await multipleStartingPriceOptionPO.element.click();
          });

          it("[PRPI-8020] should deselect the promo button and select starting price", async () => {
            expect(await browser.containsClass(multipleGenerosityButtonPO.element, PromoButtonPO.states.selected)).toBe(
              false,
            );
            expect(await multipleGenerosityWalletAlertPO.element.isDisplayed()).toBe(false);

            expect(await multipleStartingPriceOptionPO.input.isSelected()).toBe(true);
            expect(await multipleStartingPriceOptionPO.input.isEnabled()).toBe(true);
          });

          describe("and then the user tries to select price boost tokens again with starting price selected", () => {
            beforeAll(async () => {
              await multipleGenerosityButtonPO.element.waitForClickable();
              await multipleGenerosityButtonPO.element.click();
            });

            it("[PRPI-8020] should display all the price boost token wallets as unselected and disabled", async () => {
              expect(await firstExtraWalletCardOptionPO.input.isSelected()).toBe(false);
              expect(await firstExtraWalletCardOptionPO.input.isEnabled()).toBe(false);
              expect(await secondExtraWalletCardOptionPO.input.isSelected()).toBe(false);
              expect(await secondExtraWalletCardOptionPO.input.isEnabled()).toBe(false);
            });

            describe("and then the user deselects the starting price and applies a price boost token again", () => {
              beforeAll(async () => {
                // Close the generosity wallet
                await generosityWalletPO.closeButton.waitForClickable();
                await generosityWalletPO.closeButton.click();

                // Deselect starting price
                await multipleStartingPriceOptionPO.element.waitForClickable();
                await multipleStartingPriceOptionPO.element.click();

                // Apply price boost token again
                await multipleGenerosityButtonPO.element.click();
                await firstExtraWalletCardPO.element.click();
                await generosityWalletApplyButtonPO.element.click();
              });

              it("[PRPI-8020] should display the generosity wallet button as selected on the double and the alert with the '2% Bet Boost Applied' label", async () => {
                expect(
                  await browser.containsClass(multipleGenerosityButtonPO.element, PromoButtonPO.states.selected),
                ).toBe(true);
                expect(await multipleGenerosityWalletAlertPO.message.getText()).toBe("2% Bet Boost Applied");
              });

              describe("and then the user adds stake to the double", () => {
                beforeAll(async () => {
                  await multipleStakeInputFieldPO.element.waitForClickable();
                  await multipleStakeInputFieldPO.element.click();
                  await multipleStakeInputFieldPO.setValue("0.12");
                });

                it("[PRPI-8020] should update the returns values on the selection level", async () => {
                  expect(await multipleReturnValuesPO.previousPnl.getText()).toBe("$0.29");
                  expect(await multipleReturnValuesPO.pnl.getText()).toBe("$0.26");
                });

                it("[PRPI-8020] should update the returns values on the betslip level", async () => {
                  expect(await summaryPO.totalReturnsValue.getText()).toBe("$0.29\n$0.26");
                });

                describe("and then the user places bets", () => {
                  beforeAll(async () => {
                    await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK));
                    await sportsbookPlacePanelPO.place.click();
                    await browser.waitUntilDisplayed(receiptPanelPO.element);
                  });

                  it("[PRPI-8020] should display that the multiple is place is Price Boost", async () => {
                    expect(await betBuildersFreeBetsWalletsAlertPO.message.getText()).toBe("Bet Boost Applied");
                  });

                  it("[PRPI-8020] should display the correct returns on the receipt panel", async () => {
                    expect(await sportsbookReceiptSummaryPO.totalReturnsValue.getText()).toBe("$0.29\n$2.50");
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
