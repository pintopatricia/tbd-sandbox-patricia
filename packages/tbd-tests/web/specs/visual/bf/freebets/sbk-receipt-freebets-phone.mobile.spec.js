const {
  MinimizedPO,
  SportPagePO,
  SinglesCardPO,
  SinglePO,
  CardPO,
  CurrencyNumberInputFieldPO,
  FreeBetsPO,
  BetslipDrawerPO,
  PrimaryButtonPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  BetControlsPO,
  SportsbookPlacePanelPO,
} = require("../../../../page-objects");
const OneLineMultiplePO = require("@ppb/tbd-shared/components/Betslip/OneLineMultiple/OneLineMultiple.web.po");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;

const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const EventMarketCardPO = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.po");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");
const { addStake } = require("../../../../helpers/betslip.util");

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
const placeButton = new PrimaryButtonPO(sportsbookPlacePanelPO.place);

const singlesCardsPO = new SinglesCardPO(sportsbookPlacePanelPO.element);
const firstPlaceSingle = new SinglePO(singlesCardsPO.singles[0]);
const firstPlaceSingleControls = new BetControlsPO(firstPlaceSingle.element);

const firstPlaceSingleStakeField = new CurrencyNumberInputFieldPO(firstPlaceSingleControls.currencyInput);

const oneLineMultiplePO = new OneLineMultiplePO(sportsbookPlacePanelPO.element);
const oneLineMultipleControlsPO = new BetControlsPO(oneLineMultiplePO.element);
const oneLineMultipleStakeFieldPO = new CurrencyNumberInputFieldPO(oneLineMultipleControlsPO.currencyInput);

const freeBetsPO = new FreeBetsPO();
const betslipDrawerPO = new BetslipDrawerPO();
const sportsbookMinimizedPO = new MinimizedPO();
const mockService = new MockService();

const EVENT_TYPE_ID = 1;
const ODDS = 1.1;

const FRACTIONAL_DISPLAY_ODDS = {
  fractionalDisplayOdds: { numerator: 1, denominator: 2 },
};

const DECIMAL_ODDS = { decimalOdds: ODDS };
const TRUE_ODDS_MOCK = {
  trueOdds: {
    decimalOdds: DECIMAL_ODDS,
  },
};

const RUNNER_1 = {
  runnerOdds: {
    decimalDisplayOdds: DECIMAL_ODDS,
    ...FRACTIONAL_DISPLAY_ODDS,
  },
  selectionId: "1",
};
const RUNNER_2 = {
  runnerOdds: {
    decimalDisplayOdds: { decimalOdds: 1.2 },
    ...FRACTIONAL_DISPLAY_ODDS,
  },
  selectionId: "2",
};
const RUNNER_3 = {
  runnerOdds: {
    decimalDisplayOdds: { decimalOdds: 1.3 },
    ...FRACTIONAL_DISPLAY_ODDS,
  },
  selectionId: "3",
};

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.1",
      runnerDetails: [
        RUNNER_1,
        RUNNER_2,
        {
          noOdds: true,
          selectionId: "3",
        },
      ],
    },
    {
      marketId: "924.2",
      runnerDetails: [RUNNER_1, RUNNER_2, RUNNER_3],
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
                    name: "English Premier League",
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
                    name: "English Premier League",
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
        viewAll: {
          icon: null,
          label: "View All",
          viewLink: { viewUrn: "ppb:tbd:view:external:external", viewUrl: "https://betfair.com" },
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

// SIB SINGLES
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

  bonusWalletConditions: [{ value: 2, type: "NON_REDEEMABLE_AMOUNT" }],
  hasBonusMoney: true,
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.1",
    selectionId: 1,
  },
  odds: {
    ...FRACTIONAL_DISPLAY_ODDS,
    ...TRUE_ODDS_MOCK,
  },
};

// SIB MULTIPLES
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
    ...FRACTIONAL_DISPLAY_ODDS,
    ...TRUE_ODDS_MOCK,
    decimalDisplayOdds: DECIMAL_ODDS,
  },
};

const DOUBLE_COMBINATION = {
  betType: "DOUBLE",
  legCombinations: [],
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: ODDS,
  winAverageOdds: ODDS,
  numLines: 1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    decimalDisplayOdds: {
      decimalOdds: 2.4,
    },
    trueOdds: {
      decimalOdds: { decimalOdds: 2.4 },
    },
    ...FRACTIONAL_DISPLAY_ODDS,
  },
};

// IMPLY MOCKS

const IMPLY_BET_SERVICE_DOUBLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, DOUBLE_COMBINATION],
  hasBonusMoney: true,
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

// SPB SINGLES
const FIRST_SINGLE_LEG = {
  leg: { betRunners: [{ runner: { marketId: "924.1", selectionId: 1 } }] },
  winOdds: {
    decimalDisplayOdds: DECIMAL_ODDS,
    ...FRACTIONAL_DISPLAY_ODDS,
  },
};

// SPB MULTIPLES
const SECOND_SINGLE_LEG = {
  leg: { betRunners: [{ runner: { marketId: "924.2", selectionId: 1 } }] },
  winOdds: {
    decimalDisplayOdds: DECIMAL_ODDS,
    ...FRACTIONAL_DISPLAY_ODDS,
  },
};

const MULTIPLES_MOCK = [
  {
    betPrice: {
      decimalDisplayOdds: DECIMAL_ODDS,
      fractionalDisplayOdds: { numerator: 11, denominator: 100 },
    },
    legs: [FIRST_SINGLE_LEG],
    totalPotentialWin: 1,
    wallets: [{ amount: 2, nonRedeemableAmount: 2, type: "BONUS_CASH" }],
  },
  {
    betPrice: {
      decimalDisplayOdds: DECIMAL_ODDS,
      fractionalDisplayOdds: { numerator: 11, denominator: 100 },
    },
    legs: [FIRST_SINGLE_LEG, SECOND_SINGLE_LEG],
    totalPotentialWin: 2,
  },
];

const SPB_MOCK_MULTIPLES_SUCCESS = {
  result: MULTIPLES_MOCK,
};

const MODULE_NAME = "free_bets";

describe("Freebets", () => {
  describe("When user is in place panel using bonus", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_MOCK.urn, { currencyCode: "EUR", localeCodeBcp47: "en-GB" }),
      );
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await mockService.mockHttpRequest(getImplyBetsResponse(IMPLY_BET_SERVICE_DOUBLE_MOCK));
      await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK_MULTIPLES_SUCCESS));

      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
      await browser.waitUntilEquals(firstSbkRunnerPO.odd, "1.1");
    });

    describe("And has a single with bonus and a multiple without bonus and taps to place bet", () => {
      beforeAll(async () => {
        // add first selection
        await firstSbkRunnerPO.sportsbookBetButton.click();

        await browser.waitUntilDisplayed(placeButton.element, "Place button is not visible");

        // minimize betslip
        await betslipDrawerPO.header.click();
        await browser.waitUntilDisplayed(sportsbookMinimizedPO.element, "Minimized betslip not found");

        // add second selection
        await secondSbkRunnerPO.sportsbookBetButton.scrollIntoView({
          block: "center",
        });
        await browser.waitUntilInViewport(
          secondSbkRunnerPO.sportsbookBetButton,
          "Second runner bet button not visible",
        );
        await secondSbkRunnerPO.sportsbookBetButton.click();
        await browser.waitUntilEquals(sportsbookMinimizedPO.counter, "2", "Second selection not added");

        // open betslip
        await sportsbookMinimizedPO.element.click();
        await browser.waitUntilDisplayed(placeButton.element, "Multiples Place button is not visible");

        await freeBetsPO.activateBonus("Use Free Bet Balance");

        await oneLineMultipleStakeFieldPO.numberField.waitForClickable();
        await addStake(oneLineMultipleStakeFieldPO, "3");

        await firstPlaceSingleStakeField.numberField.waitForClickable();
        await addStake(firstPlaceSingleStakeField, "4");

        await browser.waitUntilEquals(
          placeButton.label,
          "Place €7.00 Bet",
          "Place button label is not equal to 'Place €7.00 Bet'",
        );

        await placeButton.element.click();

        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1312]_should_see_single_bet_with_bonus_component_and_multiple_bet_without_bonus_available_label`,
        );
      });

      it("[PRPI-1312]_should_see_single_bet_with_bonus_component_and_multiple_bet_without_bonus_available_label", async () => {
        expect(
          await browser.checkScreen(
            `${MODULE_NAME}_[PRPI-1312]_should_see_single_bet_with_bonus_component_and_multiple_bet_without_bonus_available_label`,
          ),
        ).toBe(0);
      });
    });
  });
});
