const {
  MinimizedPO,
  SportPagePO,
  SinglesCardPO,
  SinglePO,
  ScrollableSwimlanePO,
  SportsbookBetButtonPO,
  BetslipDrawerPO,
  InlineSportsbookMarketPO,
  CurrencyNumberInputFieldPO,
  PrimaryButtonPO,
  LinkPO,
  BetControlsPO,
  HighlightedSelectionCardPO,
  SportsbookPlacePanelPO,
  PromoButtonPO,
  ExtraWalletCardGroupPO,
  ExtraWalletCardPO,
  GenerosityWalletPO,
} = require("../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getSportsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const CouponCardGroupPO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.web.po");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");

const routes = require("../../../../../utils/routes");
const { addStake } = require("../../../../helpers/betslip.util");

const mockService = new MockService();

const sportPagePO = new SportPagePO();
const eventMarketsCardCouponPO = new CouponCardGroupPO(sportPagePO.element);
const inlineSportsbookMarketPO = new InlineSportsbookMarketPO(eventMarketsCardCouponPO.eventCoupons[0]);
const firstRunnerButtonPO = new SportsbookBetButtonPO(inlineSportsbookMarketPO.betButtons[0]);
const oddsboostSwimlanePO = new ScrollableSwimlanePO(sportPagePO.scrollableSwimlanes[0]);
const oddsboostFirstCardPO = new HighlightedSelectionCardPO(oddsboostSwimlanePO.highlightedSelectionCards[0]);
const oddsboostSecondCardPO = new HighlightedSelectionCardPO(oddsboostSwimlanePO.highlightedSelectionCards[1]);
const oddsboostFirstCardBetButtonPO = new SportsbookBetButtonPO(oddsboostFirstCardPO.sportsbookBetButton);
const oddsboostSecondCardBetButtonPO = new SportsbookBetButtonPO(oddsboostSecondCardPO.sportsbookBetButton);
const linkPO = new LinkPO(sportPagePO.quickLinksCards[0]);

const placePanelPO = new SportsbookPlacePanelPO();
const singlesCardPO = new SinglesCardPO(placePanelPO.element);
const firstSingleBetPlacePanelPO = new SinglePO(singlesCardPO.singles[0]);
const secondSingleBetPlacePanelPO = new SinglePO(singlesCardPO.singles[1]);
const thirdSingleBetPlacePanelPO = new SinglePO(singlesCardPO.singles[2]);
const firstSingleBetPlacePanelControlsPO = new BetControlsPO(firstSingleBetPlacePanelPO.element);
const secondSingleBetPlacePanelControlsPO = new BetControlsPO(secondSingleBetPlacePanelPO.element);
const thirdSingleBetPlacePanelControlsPO = new BetControlsPO(thirdSingleBetPlacePanelPO.element);
const firstSingleGenerosityWalletButtonPO = new PromoButtonPO(firstSingleBetPlacePanelPO.freeBetsButton);
const extraWalletCardGroupPO = new ExtraWalletCardGroupPO();
const firstExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[0]);
const generosityWalletPO = new GenerosityWalletPO();
const freeBetsWalletApplyButtonPO = new PrimaryButtonPO(generosityWalletPO.applyButton);
const firstSingleStakeFieldPlacePanelPO = new CurrencyNumberInputFieldPO(
  firstSingleBetPlacePanelControlsPO.currencyInput,
);
const secondSingleStakeFieldPlacePanelPO = new CurrencyNumberInputFieldPO(
  secondSingleBetPlacePanelControlsPO.currencyInput,
);
const thirdSingleStakeFieldPlacePanelPO = new CurrencyNumberInputFieldPO(
  thirdSingleBetPlacePanelControlsPO.currencyInput,
);
const placeButton = new PrimaryButtonPO(placePanelPO.place);
// betslip
const betslipDrawerPO = new BetslipDrawerPO();
const sportsbookMinimizedPO = new MinimizedPO();

const EVENT_TYPE_ID = 1;

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:card:group:topEventsByCompetition:228",
        filteredCouponTitle: "UEFA Champions League",
        has90Min: false,
        filterOptions: {
          sortOption: {
            defaultOption: "RANK",
            availableOptions: ["RANK", "TIME"],
          },
          dateRangeFilter: {},
          marketTypeFilter: {},
          competitionsFilter: {},
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29899897",
                eventViewLink: {
                  viewUrn: "ppb:tbd:view:event:29899897",
                  viewUrl: "football/uefa-champions-league/man-city-v-real-madrid/e-29899897",
                },
                title: "Match Odds",
                sportevent: {
                  name: "Wolves v Man Utd",
                  urn: "ppb:event:12345",
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
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        sportevent: {
                          name: "Wolves v Man Utd",
                          urn: "ppb:event:12345",
                          __typename: "SportsEvent",
                          competition: {
                            urn: "ppb:competition:12191691",
                            name: "Competition Name",
                          },
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.1/1",
                          selectionId: 1,
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/2",
                          selectionId: 2,
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/3",
                          selectionId: 3,
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
                fixture: {
                  urn: "ppb:fixture:29899897",
                  home: { name: "Man City" },
                  away: { name: "Real Madrid" },
                },
              },
            },
          ],
        },
        partials: {
          partialEdges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29899897",
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:1",
        cardGroupTitle: "Oddsboost",
        full: {
          edges: [
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:924.2/1",
                title: "SMR - Zenit to beat Rotor Volograd",
                market: {
                  __typename: "SportsbookMarket",
                  urn: "ppb:sbkMarket:924.2",
                  name: "Daily OddsBoost",
                  marketType: "DAILY_POWER_PRICES",
                  hierarchy: {
                    __typename: "EventCompetitionHierarchy",
                    sportevent: {
                      name: "Wolves v Man Utd",
                      urn: "ppb:event:12345",
                      __typename: "SportsEvent",
                      competition: {
                        urn: "ppb:competition:12191691",
                        name: "Competition Name",
                      },
                    },
                  },
                  runners: [
                    {
                      runnerURN: "ppb:sbkRunner:924.2/1",
                      selectionId: 1,
                    },
                  ],

                  isOddsboostMarketType: true,
                },
                runner: {
                  runnerURN: "ppb:sbkRunner:924.2/1",
                },
                displayPreviousOdd: true,
                badge: "ODDSBOOST",
              },
            },
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:924.3/1",
                title: "All teams to score in the UEFA Champions League (in 90 mins)",
                market: {
                  __typename: "SportsbookMarket",
                  urn: "ppb:sbkMarket:924.3",
                  name: "Friday Featured OddsBoosts",
                  marketType: "DAILY_POWER_PRICES",
                  hierarchy: {
                    __typename: "EventCompetitionHierarchy",
                    sportevent: {
                      name: "Wolves v Man Utd",
                      urn: "ppb:event:12345",
                      __typename: "SportsEvent",
                      competition: {
                        urn: "ppb:competition:12191691",
                        name: "Competition Name",
                      },
                    },
                  },
                  runners: [
                    {
                      runnerURN: "ppb:sbkRunner:924.3/1",
                      selectionId: 1,
                    },
                  ],

                  isOddsboostMarketType: true,
                },
                runner: {
                  runnerURN: "ppb:sbkRunner:924.3/1",
                },
                displayPreviousOdd: true,
                badge: "ODDSBOOST",
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:924.2/1",
              },
            },
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:924.3/1",
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:allCompetitions:1",
        quickLinksTitle: "All Competitions",
        links: [
          {
            label: "View All Competitions",
            target: "_self",
            icon: null,
            url: routes.getAllCompetitionsViewUrl("1"),
          },
        ],
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:card:group:topEventsByCompetition:228",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:1",
      },
    },
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:allCompetitions:1",
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
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.73 },
            trueOdds: {
              decimalOdds: { decimalOdds: 1.73 },
            },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 2,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 4.33 },
            trueOdds: {
              decimalOdds: { decimalOdds: 4.33 },
            },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 3,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 4.2 },
            trueOdds: {
              decimalOdds: { decimalOdds: 4.2 },
            },
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
            trueOdds: {
              decimalOdds: { decimalOdds: 1.2 },
            },
            decimalDisplayOdds: {
              decimalOdds: 1.2,
            },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 1.1 },
            },
          ],
        },
      ],
    },
    {
      marketId: "924.3",
      runnerDetails: [
        {
          selectionId: "1",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.3 },
            },
            decimalDisplayOdds: {
              decimalOdds: 1.3,
            },
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

  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.73 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.73,
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
  tokens: {
    priceBoostTokens: [
      {
        id: "11331122",
        numberOfTokens: 2,
        generosity: 2,
        boostPrice: {
          trueOdds: {
            decimalOdds: 1.2,
          },
        },
      },
    ],
  },
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.1",
    selectionId: 1,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.73 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.73,
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

  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.2 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.2,
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
      decimalOdds: { decimalOdds: 1.2 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.2,
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

  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.3 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.3,
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
      decimalOdds: { decimalOdds: 1.3 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.3,
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const DOUBLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const TRIPLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, THIRD_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

const WALLET_MOCK = [{ amount: "2.00", walletName: "BOOST_TOKENS" }];

const PLACE_MOCK = {
  result: [
    {
      totalStake: 1.0,
      originalTotalPotentialWin: 1.3,
      originalBetPrice: {
        decimalDisplayOdds: {
          decimalOdds: 1.3,
        },
      },
      totalPotentialWin: 1.73,
      betModifiers: ["PRICE_BOOST"],
      runners: [
        {
          runner: { marketId: "924.1", selectionId: 1 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 1.73 },
          },
        },
      ],

      legs: [
        {
          leg: { betRunners: [{ runner: { marketId: "924.1", selectionId: 1 } }] },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 1.73 },
          },
        },
      ],
    },
    {
      totalStake: 2.0,
      totalPotentialWin: 1.2,
      runners: [
        {
          runner: { marketId: "924.2", selectionId: 1 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
          },
        },
      ],

      legs: [
        {
          leg: { betRunners: [{ runner: { marketId: "924.2", selectionId: 1 } }] },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
          },
        },
      ],
    },
    {
      totalStake: 3.0,
      totalPotentialWin: 1.3,
      runners: [
        {
          runner: { marketId: "924.3", selectionId: 1 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
          },
        },
      ],

      legs: [
        {
          leg: { betRunners: [{ runner: { marketId: "924.3", selectionId: 1 } }] },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
          },
        },
      ],
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
        edges: [
          {
            node: {
              __typename: "ExtraWalletCard",
              urn: `ppb:tbd:card:extraWalletCard:11331122#1`,
              badges: [],
              extraWallet: {
                __typename: "ExtraWallet",
                urn: `ppb:extraWallet:11331122`,
                walletId: `11331122`,
                indexedId: `11331122#1`,
                amount: 1,
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
          },
        ],

        __typename: "ExtraWalletCardGroupConnection",
      },
    },
  ],
};

const MODULE_NAME = "oddsboost-betting-jouney";

describe("Oddsboost multiple singles", () => {
  describe(" When the user adds 3 selections: 1 MYOB bet, 1 oddsboost with previousOdds and 1 oddsboost without previousOdds", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_VIEW_MOCK.urn, { disableCSSAnimations: true, PRICE_BOOST_OFFERS: { isActive: true } }),
      );
      await mockService.mockHttpRequest(getScaResponse({}));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
      await mockService.mockHttpRequest(getWallets(WALLET_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
      await mockService.mockHttpRequest(getCardResults(BFF_FETCH_CARDS_MOCK));
      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
      await browser.waitUntilEquals(firstRunnerButtonPO.odd, "1.73");
      // add first selection
      await firstRunnerButtonPO.element.waitForClickable();
      await firstRunnerButtonPO.element.click();
      await browser.waitUntilDisplayed(placePanelPO.element);
      // select MYOB
      await firstSingleGenerosityWalletButtonPO.element.waitForClickable();
      await firstSingleGenerosityWalletButtonPO.element.click();
      await firstExtraWalletCardPO.element.click();
      await freeBetsWalletApplyButtonPO.element.click();

      await browser.waitUntilAttributeContains(
        firstSingleGenerosityWalletButtonPO.element,
        "class",
        PromoButtonPO.states.selected,
      );
      // colapse betslip
      await betslipDrawerPO.header.waitForClickable();
      await betslipDrawerPO.header.click();
      await browser.waitUntilDisplayed(sportsbookMinimizedPO.counter);
      // add second selection
      await linkPO.element.scrollIntoView({
        block: "start",
      });
      await browser.waitUntilInViewport(linkPO.element);
      await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
      await oddsboostFirstCardBetButtonPO.element.waitForClickable();
      await oddsboostFirstCardBetButtonPO.element.click();
      await browser.waitUntilEquals(sportsbookMinimizedPO.counter, "2");
      // add third selection
      await oddsboostSecondCardPO.element.scrollIntoView();
      await browser.waitUntilEquals(oddsboostSecondCardBetButtonPO.odd, "1.3");
      await mockService.mockHttpRequest(getImplyBetsResponse(TRIPLE_MOCK));
      await oddsboostSecondCardBetButtonPO.element.waitForClickable();
      await oddsboostSecondCardBetButtonPO.element.click();
      await browser.waitUntilEquals(sportsbookMinimizedPO.counter, "3");
      // open betslip
      await sportsbookMinimizedPO.element.waitForClickable();
      await sportsbookMinimizedPO.element.click();
      await browser.waitUntilDisplayed(placePanelPO.element);
      await thirdSingleStakeFieldPlacePanelPO.element.scrollIntoView({
        block: "end",
      });
      await browser.waitUntilInViewport(thirdSingleStakeFieldPlacePanelPO.element);
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1491]_the_place_panel_should_display_the_correct_information_for_each_bet`,
      );
    });

    it("[PRPI-1491]_the_place_panel_should_display_the_correct_information_for_each_bet", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1491]_the_place_panel_should_display_the_correct_information_for_each_bet`,
        ),
      ).toEqual(0);
    });

    describe("And after inserting the stakes the user clicks on Place bet button", () => {
      beforeAll(async () => {
        await firstSingleStakeFieldPlacePanelPO.numberField.waitForClickable();
        await firstSingleStakeFieldPlacePanelPO.numberField.click();
        await addStake(firstSingleStakeFieldPlacePanelPO, "1");

        await secondSingleStakeFieldPlacePanelPO.numberField.waitForClickable();
        await secondSingleStakeFieldPlacePanelPO.numberField.click();
        await addStake(secondSingleStakeFieldPlacePanelPO, "2");

        await thirdSingleStakeFieldPlacePanelPO.numberField.waitForClickable();
        await thirdSingleStakeFieldPlacePanelPO.numberField.click();
        await addStake(thirdSingleStakeFieldPlacePanelPO, "3");

        await browser.waitUntilEquals(
          placeButton.label,
          "Place $6.00 Bet",
          "Single Place button label is not equal to 'Place $6.00 Bet'",
        );

        await mockService.mockHttpRequest(getPlaceBet(PLACE_MOCK));
        await placeButton.element.waitForClickable();
        await placeButton.element.click();
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1492]_the_receipt_panel_should_display_the_correct_information_for_each_bet`,
        );
      });

      it("[PRPI-1492]_the_receipt_panel_should_display_the_correct_information_for_each_bet", async () => {
        expect(
          await browser.checkScreen(
            `${MODULE_NAME}_[PRPI-1492]_the_receipt_panel_should_display_the_correct_information_for_each_bet`,
          ),
        ).toEqual(0);
      });
    });
  });
});
