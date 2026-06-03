const {
  MyBetsPagePO,
  MarketPagePO,
  FooterPO,
  BetSegmentsPO,
  BottomSheetPO,
  ExchangeInlineEditPanelPO,
  ExchangeUnmatchedCardPO,
  FootballScoreboardPO,
  CardPO,
  PrimaryButtonPO,
  OddsPO,
  BetSelectionDetailsPO,
  ExchangeInlineReceiptPanelPO,
  NudgesNumberInputFieldPO,
} = require("../../../../page-objects");
const BetCardGroupPO = require("@ppb/tbd-shared/components/BetCardGroup/BetCardGroup.web.po");
const MarketBetSelectionCardGroupPO = require("@ppb/tbd-shared/components/MarketBetSelectionCardGroup/MarketBetSelectionCardGroup.web.po");
const MarketBetSelectionCardPO = require("@ppb/tbd-shared/components/MarketBetSelectionCard/MarketBetSelectionCard.web.po");
const { getMyBetsLayout, getGenericLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsEXCViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const { getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getQuote } = require("@flutter-global/uki-channels-http-clients/mock-index").CASHOUT;

const {
  getPlaceBetResponse,
} = require("@flutter-global/uki-channels-http-clients/src/clients/ExchangeTransactional/mock-controller/etx-controller");

const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const routes = require("../../../../../utils/routes");
const MockService = require("../../../../mock-essentials/mocking-service");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();
const bottomSheetPO = new BottomSheetPO();

const firstBetCardGroupPO = new BetCardGroupPO(myBetsPO.betCardGroups[0]);
const firstMarketBetSelectionCardGroupPO = new MarketBetSelectionCardGroupPO(myBetsPO.betCardGroups[0]);
const firstMarketBetSelectionCardPO = new MarketBetSelectionCardPO(firstMarketBetSelectionCardGroupPO.groupItems[0]);

const firstMarketBetSelectionDetailsPO = new BetSelectionDetailsPO(firstMarketBetSelectionCardPO.betSelectionDetails);

const bottomSheetMarketPagePO = new MarketPagePO(bottomSheetPO.content);
const bottomSheetCardPO = new CardPO(bottomSheetPO.content);
const bottomSheetExchangeInlineEditPanelPO = new ExchangeInlineEditPanelPO();
const footerPO = new FooterPO(bottomSheetPO.regulatory);

const exchangeStakeInputFieldPO = new NudgesNumberInputFieldPO(bottomSheetExchangeInlineEditPanelPO.inputs[1]);
const placeButtonPO = new PrimaryButtonPO(bottomSheetExchangeInlineEditPanelPO.place);

const exchangeInlineReceiptPanelPO = new ExchangeInlineReceiptPanelPO();
const exchangeUnmatchedCardPO = new ExchangeUnmatchedCardPO(exchangeInlineReceiptPanelPO.placedBetCards[0]);
const unmatchedBetSegmentsPO = new BetSegmentsPO(exchangeUnmatchedCardPO.results);
const unmatchedBetSegmentsOddsPO = new OddsPO(unmatchedBetSegmentsPO.leftValue);

const footballScoreboardPO = new FootballScoreboardPO(bottomSheetPO.headerContent);

const MODAL_PLACED_BET_MOCK = {
  marketId: "1.11111111",
  status: "SUCCESS",
  instructionReports: [
    {
      betId: "322311028610",
      status: "SUCCESS",
      price: 9,
      size: 7,
      side: "BACK",
      averagePriceMatched: 0,
      sizeMatched: 0,
      orderStatus: "EXECUTABLE",
    },
  ],
};

const MODAL_PLACED_BET_COMPLETED_MOCK = {
  marketId: "1.11111111",
  status: "SUCCESS",
  instructionReports: [
    {
      betId: "322311028610",
      status: "SUCCESS",
      price: 3.5,
      size: 7,
      side: "BACK",
      averagePriceMatched: 3.5,
      sizeMatched: 7,
      orderStatus: "EXECUTION_COMPLETE",
    },
  ],
};

const CASHOUT_QUOTE_MOCK = [
  {
    marketId: "1.11111111",
    value: null,
    profit: null,
    status: "UNAVAILABLE",
  },
];

const CASHOUT_QUOTE_SUCCESS_MOCK = [
  {
    marketId: "1.11111111",
    value: 1.98,
    currentLiability: 2.0,
    profit: -0.02,
    profitPerSelection: {
      44444444: -0.02,
      66666666: -0.01,
      55555555: -0.02,
    },
    minPartialPercentage: 5,
    maxPartialPercentage: 100,
    status: "AVAILABLE",
    algorithm: "ZERO_BACK",
  },
];

const POSITION_VIEWS_SUCCESS_MOCK = {
  marketPositions: [
    {
      marketId: "1.11111111",
      selections: [
        {
          selectionId: 4444444,
          handicap: 0.0,
          orders: [
            {
              betId: "1:322311028610",
              marketId: "1.11111111",
              selectionId: 4444444,
              handicap: 0.0,
              price: 9,
              size: 1.0,
              isFreeBet: "false",
              bspLiability: 0.0,
              placedDate: "2023-08-24T08:39:21.000Z",
              averagePriceMatched: 0.0,
              sizeMatched: 0.0,
              sizeRemaining: 1.0,
              sizeLapsed: 0.0,
              sizeCancelled: 0.0,
              sizeVoided: 0.0,
              regulatorCode: "GIBRALTAR REGULATOR",
              side: "BACK",
              status: "EXECUTABLE",
              persistenceType: "LAPSE",
              orderType: "LIMIT",
            },
          ],
        },
      ],

      projectionStats: {},
      settledProfit: 0.0,
    },
  ],
};

const MODAL_ERO_MOCK = [
  {
    marketId: "1.11111111",
    runners: [
      {
        selectionId: "44444444",
        description: {
          runnerName: "Sporting Lisbon",
        },
        availableToBack: [{ price: 2.26, size: 335.06 }],
        availableToLay: [{ price: 5.8, size: 110 }],
      },
      {
        selectionId: "66666666",
        description: {
          runnerName: "Rio Ave",
        },
        availableToBack: [{ price: 3.5, size: 100 }],
        availableToLay: [{ price: 6.8, size: 110 }],
      },
      {
        selectionId: "55555555",
        description: {
          runnerName: "The Draw",
        },
        availableToBack: [{ price: 1.5, size: 100 }],
        availableToLay: [{ price: 1.8, size: 110 }],
      },
    ],
  },
];

const MODAL_POSITION_VIEWS_MOCK = {
  marketPositions: [
    {
      marketId: "1.11111111",
      selections: [
        {
          selectionId: 44444444,
          handicap: 0.0,
          orders: [
            {
              betId: "1:322311028610",
              marketId: "1.11111111",
              selectionId: 44444444,
              handicap: 0.0,
              price: 9.0,
              size: 1.0,
              isFreeBet: "false",
              bspLiability: 0.0,
              placedDate: "2023-08-24T16:29:49.000Z",
              averagePriceMatched: 0.0,
              sizeMatched: 0.0,
              sizeRemaining: 1.0,
              sizeLapsed: 0.0,
              sizeCancelled: 0.0,
              sizeVoided: 0.0,
              regulatorCode: "GIBRALTAR REGULATOR",
              side: "BACK",
              status: "EXECUTABLE",
              persistenceType: "LAPSE",
              orderType: "LIMIT",
            },
          ],
        },
      ],

      projectionStats: {},
      settledProfit: 0.0,
    },
  ],
};

const MODAL_FIXTURE_CARD_MOCK = {
  node: {
    __typename: "FixtureCard",
    urn: "ppb:tbd:card:fixture:1111111111|viewLink|0",
    fixture: {
      __typename: "FootballFixture",
      urn: "ppb:fixture:1111111111",
      home: {
        name: "Sporting Lisbon",
        color: "ffffff",
        crest: null,
      },
      away: {
        name: "Rio Ave",
        color: "ffffff",
        crest: null,
      },
      isAmericanFormat: "false",
      runnerNames: null,
      scheduledAt: "2023-08-27T15:30:00Z",
      startedAt: null,
      score: null,
      firstLegScore: null,
      duration: {
        period: "REGULAR",
        status: "PRE_MATCH",
        clock: null,
        stoppageMinutes: null,
      },
      penaltyShootout: null,
    },
    fixtureEventViewLink: {
      viewUrn: "ppb:tbd:view:event:1111111111",
      viewUrl: "football/portuguese-primeira-liga/benfica-v-porto/match-odds/e-1111111111",
    },
    sportevent: {
      __typename: "SportsEvent",
      urn: "ppb:event:1111111111",
      eventId: 1111111111,
      name: "Sporting Lisbon v Rio Ave",
      openDate: "2023-08-27T15:30:00.000Z",
      competition: {
        __typename: "Competition",
        urn: "ppb:competition:10932509",
        name: "Sporting Lisbon v Rio Ave",
        competitionId: 10932509,
        sport: {
          __typename: "Sport",
          urn: "ppb:eventType:1",
          name: "Football",
          sportId: 1,
        },
      },
    },
    availableToSubscribe: "false",
  },
};

const MODAL_FIXTURE_CARD_PARTIALS_MOCK = {
  node: {
    __typename: "FixtureCard",
    urn: "ppb:tbd:card:fixture:1111111111|viewLink|0",
  },
};

const MODAL_MARKET_EXTENDED_CARD_MOCK = {
  node: {
    __typename: "MarketExtendedCard",
    urn: "ppb:tbd:card:marketExtended:1.11111111|0|false|false|false|0",
    cardTitle: "Match Odds",
    numberOfItemsToDisplay: null,
    viewLinks: [],
    defaultIndex: 0,
    displayRunners: {
      exchange: {
        market: {
          __typename: "ExchangeMarket",
          urn: "ppb:excMarket:1.11111111",
          liveData: {
            totalMatched: 25120.166377978836,
            exchangeMarketStatus: "OPEN",
            inplay: "false",
          },
          name: "Match Odds",
          marketType: "MATCH_ODDS",
          marketTypeName: null,
          hierarchy: {
            __typename: "EventCompetitionHierarchy",
            sportevent: {
              __typename: "SportsEvent",
              urn: "ppb:event:1111111111",
              eventId: 1111111111,
              name: "Sporting Lisbon v Rio Ave",
              openDate: "2023-08-27T15:30:00.000Z",
              competition: {
                __typename: "Competition",
                urn: "ppb:competition:10932509",
                name: "Sporting Lisbon v Rio Ave",
                competitionId: 10932509,
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:1",
                  name: "Football",
                  sportId: 1,
                },
              },
            },
            competition: {
              __typename: "Competition",
              urn: "ppb:competition:10932509",
              name: "Sporting Lisbon v Rio Ave",
              competitionId: 10932509,
              sport: {
                __typename: "Sport",
                urn: "ppb:eventType:1",
                name: "Football",
                sportId: 1,
              },
            },
          },
          sport: {
            __typename: "Sport",
            urn: "ppb:eventType:1",
            name: "Football",
            sportId: 1,
          },
          bettingType: "ODDS",
          eachWayDivisor: null,
          numberOfWinners: 1,
          runners: [
            {
              __typename: "Runner",
              runnerURN: "ppb:excRunner:1.11111111/44444444/0",
              name: "Sporting Lisbon",
              selectionId: 44444444,
              handicap: 0,
              resultType: null,
            },
            {
              __typename: "Runner",
              runnerURN: "ppb:excRunner:1.11111111/55555555/0",
              name: "The Draw",
              selectionId: 55555555,
              handicap: 0,
              resultType: null,
            },
            {
              __typename: "Runner",
              runnerURN: "ppb:excRunner:1.11111111/66666666/0",
              name: "Rio Ave",
              selectionId: 66666666,
              handicap: 0,
              resultType: null,
            },
          ],

          marketRulesViewLink: {
            viewUrn: "ppb:tbd:view:marketRules:1.11111111",
            viewUrl: "",
          },
        },
        runners: [
          {
            runnerURN: "ppb:excRunner:1.11111111/44444444/0",
          },
          {
            runnerURN: "ppb:excRunner:1.11111111/55555555/0",
          },
          {
            runnerURN: "ppb:excRunner:1.11111111/66666666/0",
          },
        ],
      },
      sportsbook: null,
    },
    cashoutQuotes: {
      exchangeCashoutQuotes: [
        {
          __typename: "ExchangeCashoutQuote",
          urn: "ppb:excCashoutQuote:1.11111111/0",
          marketURN: "ppb:excMarket:1.11111111",
          marketBetURN: "ppb:marketBet:1.11111111",
          value: 0.99,
          profit: -0.02,
          status: "AVAILABLE",
        },
      ],
    },
    runnerViewLinks: [
      {
        runnerUrn: "ppb:excRunner:1.11111111/44444444/0",
        viewUrl: "Not Implemented",
        viewUrn: "ppb:tbd:view:runner:1.11111111/44444444/0",
      },
      {
        runnerUrn: "ppb:excRunner:1.11111111/55555555/0",
        viewUrl: "Not Implemented",
        viewUrn: "ppb:tbd:view:runner:1.11111111/55555555/0",
      },
      {
        runnerUrn: "ppb:excRunner:1.11111111/66666666/0",
        viewUrl: "Not Implemented",
        viewUrn: "ppb:tbd:view:runner:1.11111111/66666666/0",
      },
    ],

    isRunnerExpandable: null,
    raceViewLink: null,
    marketPromo: null,
  },
};

const MODAL_MARKET_EXTENDED_CARD_PARTIALS_MOCK = {
  node: {
    __typename: "MarketExtendedCard",
    urn: "ppb:tbd:card:marketExtended:1.11111111|0|false|false|false|0",
  },
};

const MODAL_REGULATORY_CARD_MOCK = {
  node: {
    __typename: "RegulatoryCard",
    urn: "ppb:tbd:card:regulatory:footer",
    sections: [
      {
        sectionType: "GENERIC",
        __typename: "RegulatorySectionGeneric",
        genericSectionTitle: "Responsible Gambling",
        items: [
          {
            __typename: "RegulatoryTextItem",
            alignment: "LEFT",
            text: "Gambling can be addictive, please play responsibly. Regulatory footer words here",
          },
        ],
      },
    ],
  },
};

const MODAL_REGULATORY_CARD_PARTIALS_MOCK = {
  node: {
    __typename: "RegulatoryCard",
    urn: "ppb:tbd:card:regulatory:footer",
  },
};

const BFF_GENERIC_VIEW_PAGE_MOCK = {
  __typename: "GenericView",
  urn: "ppb:tbd:view:generic:exchangeLightMarket:1.11111111",
  url: "view/d-1.11111111",
  title: null,
  canonicalUrl: "/sport/",
  category: "MODAL",
  viewHeader: {
    title: null,
    titleImage: null,
    subTitle: null,
    badge: null,
  },
  edges: [MODAL_FIXTURE_CARD_MOCK, MODAL_MARKET_EXTENDED_CARD_MOCK, MODAL_REGULATORY_CARD_MOCK],
  partialEdges: [
    MODAL_FIXTURE_CARD_PARTIALS_MOCK,
    MODAL_MARKET_EXTENDED_CARD_PARTIALS_MOCK,
    MODAL_REGULATORY_CARD_PARTIALS_MOCK,
  ],
};

const BFF_CARDS_MOCK = {
  cards: [MODAL_FIXTURE_CARD_MOCK.node, MODAL_MARKET_EXTENDED_CARD_MOCK.node, MODAL_REGULATORY_CARD_MOCK.node],
};

const UNMATCHED_FOOTBALL_EVENT_MOCK = [
  {
    aggregatorDesc: "Sporting Lisbon v Rio Ave",
    edges: [
      {
        __typename: "FixtureCard",
        homeName: "Sporting Lisbon",
        awayName: "Rio Ave",
        scheduledAt: "2023-09-25T19:15:00Z",
      },
      {
        __typename: "MarketBetCardGroup",
        edges: [
          {
            __typename: "MarketBetCard",
            description: "Double Chance",
            numOfOrders: 1,
            numOfUnmatched: 1,
          },
          {
            __typename: "MarketBetExpandableCardGroup",
            isOpen: true,
            edges: [
              {
                __typename: "MarketBetSelectionCardGroup",
                edges: [
                  {
                    __typename: "MarketBetSelectionCard",
                    id: "322311028610",
                    handicap: 0,
                    placedDate: "2023-09-25T16:44:09.000Z",
                    settledDate: null,
                    matchedDate: "1970-01-01T00:00:00.000Z",
                    price: 9,
                    runnerDesc: "Home or Draw",
                    side: "BACK",
                    size: 1,
                    profit: 8,
                    selectionId: 44444444,
                    isUnmatched: true,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

const VIEW_UNMATCHED_FOOTBALL_MOCK = getMyBetsEXCViewMock(UNMATCHED_FOOTBALL_EVENT_MOCK, {
  isOpen: true,
  hasFooter: true,
});

const clickOnElement = async (element) => {
  await element.waitForClickable();
  await element.click();
};

describe("My Bets Page - Edit Unmatched Bet", () => {
  describe("when the user opens the my bets page with one unmatched bet", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(VIEW_UNMATCHED_FOOTBALL_MOCK.urn, {
          products: ["exchange"],
        }),
      );
      await mockService.mockHttpRequest(getMyBetsLayout(VIEW_UNMATCHED_FOOTBALL_MOCK));
      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
      await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_MOCK));

      await browser.url(routes.getMyBetsViewUrl("open"));

      await browser.waitUntilDisplayed(firstBetCardGroupPO.element, "Bet Card Group not visible");
      await browser.waitUntilDisplayed(firstMarketBetSelectionCardPO.element, "Bet selection not visible");
      await browser.waitUntilDisplayed(firstMarketBetSelectionDetailsPO.editButton, "Edit Button not visible");
    });

    it("[PRPI-4669] should show one selection with an edit button", async () => {
      expect(await firstMarketBetSelectionDetailsPO.editButton.isDisplayed()).toBe(true);
    });

    describe("and the user clicks to edit it", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getGenericLayout(BFF_GENERIC_VIEW_PAGE_MOCK));
        await mockService.mockHttpRequest(getCardResults(BFF_CARDS_MOCK));
        await mockService.mockHttpRequest(getMarkets(MODAL_ERO_MOCK));
        await mockService.mockHttpRequest(getMarketPositionViews(MODAL_POSITION_VIEWS_MOCK));

        await clickOnElement(firstMarketBetSelectionDetailsPO.editButton);

        await browser.waitUntilDisplayed(bottomSheetPO.element, "Bottom Sheet Edit panel not visible");
        await browser.waitUntilDisplayed(footballScoreboardPO.element, "Football Scoreboard not visible");
        await browser.waitUntilDisplayed(bottomSheetMarketPagePO.element, "Bottom Sheet Market Page not visible");
        await browser.waitUntilDisplayed(
          bottomSheetExchangeInlineEditPanelPO.element,
          "Bottom Sheet Inline edit panel not visible",
        );
        await browser.waitUntilDisplayed(footerPO.element, "Bottom Sheet Regulatory Section not visible");
      });

      it("[PRPI-5517] should open the bottom sheet to edit the bet", async () => {
        expect(await bottomSheetPO.element.isDisplayedInViewport()).toBe(true);
      });

      it("[PRPI-5518] the bottom sheet should display the 'Edit bet' title", async () => {
        expect(await bottomSheetPO.headerTitle.getText()).toBe("Edit bet");
      });

      it("[PRPI-5519] the bottom sheet should display the close", async () => {
        expect(await bottomSheetPO.closeButton.isDisplayed()).toBe(true);
      });

      it("[PRPI-4671] the market card should be displayed", async () => {
        expect(await bottomSheetMarketPagePO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-4672] the inline betslip should be displayed", async () => {
        expect(await bottomSheetExchangeInlineEditPanelPO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-5520] the regulatory footer should be displayed", async () => {
        expect(await footerPO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-4673] the scoreboard should be displayed", async () => {
        expect(await footballScoreboardPO.element.isDisplayed()).toBe(true);
        expect(await footballScoreboardPO.homeTeam.getText()).toBe("Sporting Lisbon");
        expect(await footballScoreboardPO.awayTeam.getText()).toBe("Rio Ave");
      });

      describe("and when editing and place an unmatched bet", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getPlaceBetResponse(MODAL_PLACED_BET_MOCK));

          await exchangeStakeInputFieldPO.setValue("7");

          await clickOnElement(placeButtonPO.element);

          await browser.waitUntilDisplayed(exchangeInlineReceiptPanelPO.element, "Inline Receipt panel not visible");
        });

        it("[PRPI-5521] the bottom sheet is still displayed", async () => {
          expect(await bottomSheetCardPO.element.isDisplayed()).toBe(true);
        });

        it("[PRPI-5522] the inline betslip receipt has the correct info", async () => {
          expect(await exchangeUnmatchedCardPO.header.getText()).toBe("Bet Unmatched");
          expect(await unmatchedBetSegmentsOddsPO.value.getText()).toBe("9");
          expect(await unmatchedBetSegmentsPO.midValue.getText()).toBe("$7.00");
        });

        describe("and when editing to a matched bet", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getPlaceBetResponse(MODAL_PLACED_BET_COMPLETED_MOCK));

            await clickOnElement(exchangeUnmatchedCardPO.confirm);

            await exchangeStakeInputFieldPO.setValue("3.5");

            await clickOnElement(placeButtonPO.element);

            await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_SUCCESS_MOCK));
            await mockService.mockHttpRequest(getMarketPositionViews(POSITION_VIEWS_SUCCESS_MOCK));

            await browser.waitUntilDisplayed(exchangeInlineReceiptPanelPO.element, "Inline Receipt panel not visible");
            await browser.waitUntilDisplayed(bottomSheetCardPO.element, "Bottom Sheet Card not visible");
          });

          it("[PRPI-5523] the bottom sheet is still displayed", async () => {
            expect(await bottomSheetCardPO.element.isDisplayed()).toBe(true);
          });

          it("[PRPI-5524] the inline betslip receipt has the correct info", async () => {
            expect(await exchangeUnmatchedCardPO.header.getText()).toBe("Bet Matched");
            expect(await unmatchedBetSegmentsOddsPO.value.getText()).toBe("3.5");
            expect(await unmatchedBetSegmentsPO.midValue.getText()).toBe("$7.00");
          });

          describe("and on bottom sheet close", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(
                getMyBetsLayout({
                  ...VIEW_UNMATCHED_FOOTBALL_MOCK,
                  edges: [],
                }),
              );
              await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_SUCCESS_MOCK));

              await clickOnElement(bottomSheetPO.closeButton);
              await browser.tickFakeClock();

              await browser.waitUntilDisplayed(myBetsPO.emptyState, "No Bets state is not displayed");
            });

            it("[PRPI-5525] should refresh the view to display the no bets state", async () => {
              expect(await myBetsPO.emptyState.isDisplayed()).toBe(true);
            });
          });
        });
      });
    });
  });
});
