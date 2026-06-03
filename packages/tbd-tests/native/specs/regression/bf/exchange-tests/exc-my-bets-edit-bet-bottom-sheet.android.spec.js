const BetCardGroupSO = require("@ppb/tbd-shared/components/BetCardGroup/BetCardGroup.native.so");
const MarketBetSelectionCardGroupSO = require("@ppb/tbd-shared/components/MarketBetSelectionCardGroup/MarketBetSelectionCardGroup.native.so");
const MarketBetSelectionCardSO = require("@ppb/tbd-shared/components/MarketBetSelectionCard/MarketBetSelectionCard.native.so");
const {
  getAppContext,
  getMyBetsLayout,
  getGenericLayout,
  getHomeLayoutWithViewLink,
  getCardResults,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsEXCViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const { getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getQuote } = require("@flutter-global/uki-channels-http-clients/mock-index").CASHOUT;

const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const routes = require("../../../../../utils/routes");
const MockService = require("../../../../mock-essentials/mocking-service");

const {
  MyBetsScreenSO,
  BottomSheetSO,
  ExchangeInlineEditPanelSO,
  FootballScoreboardSO,
  BetSelectionDetailsSO,
  TeamSO,
  RegulatorySectionsSessionSO,
  ExchangeMarketSO,
} = require("../../../../screen-objects");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsSO = new MyBetsScreenSO();
const bottomSheetSO = new BottomSheetSO();

const firstBetCardGroupSO = new BetCardGroupSO(myBetsSO.betCardGroups[0]);
const firstMarketBetSelectionCardGroupSO = new MarketBetSelectionCardGroupSO(myBetsSO.betCardGroups[0]);
const firstMarketBetSelectionCardSO = new MarketBetSelectionCardSO(firstMarketBetSelectionCardGroupSO.groupItems[0]);

const firstMarketBetSelectionDetailsSO = new BetSelectionDetailsSO(firstMarketBetSelectionCardSO.betSelectionDetails);

const bottomSheetMarketPageSO = new ExchangeMarketSO(bottomSheetSO.content);
const bottomSheetExchangeInlineEditPanelSO = new ExchangeInlineEditPanelSO();
const regulatorySections = new RegulatorySectionsSessionSO(bottomSheetSO.content);

const footballScoreboardSO = new FootballScoreboardSO(bottomSheetSO.headerContent);
const homeTeamSO = new TeamSO(footballScoreboardSO.homeTeam);
const awayTeamSO = new TeamSO(footballScoreboardSO.awayTeam);

const CASHOUT_QUOTE_MOCK = [
  {
    marketId: "1.11111111",
    value: null,
    profit: null,
    status: "UNAVAILABLE",
  },
];

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
  edges: [MODAL_FIXTURE_CARD_MOCK, MODAL_MARKET_EXTENDED_CARD_MOCK],
  partialEdges: [MODAL_FIXTURE_CARD_PARTIALS_MOCK, MODAL_MARKET_EXTENDED_CARD_PARTIALS_MOCK],
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
  await browser.waitUntilClickableNative(element, "Element is not clickable");
  await element.click();
};

const MY_BETS_URL = routes.getMyBetsViewUrl("open");

describe("My Bets Page - Edit Unmatched Bet", () => {
  describe("when the user opens the my bets page with one unmatched bet", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        getAppContext({
          selectedDefaultProduct: "EXCHANGE",
          selectedExchangeDefaultProduct: "NEME",
          products: ["EXCHANGE"],
          phoenixMigratedUser: true,
          throttles: {
            EXC_ALLOWED_JURISDICTION: { isActive: true },
          },
        }),
      );

      await mockService.mockHttpRequest(getMyBetsLayout(VIEW_UNMATCHED_FOOTBALL_MOCK));
      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
      await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_MOCK));

      const HOME_VIEW_LINK = getStartViewLink(MY_BETS_URL);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, dismissOnboarding: true });
      await browser.waitUntilDisplayed(firstBetCardGroupSO.element, "Bet Card Group not visible");
      await browser.waitUntilDisplayed(firstMarketBetSelectionCardSO.element, "Bet selection not visible");
      await browser.waitUntilDisplayed(firstMarketBetSelectionDetailsSO.editButton, "Edit Button not visible");
    });

    it("[PRPI-1815] should show one selection with an edit button", async () => {
      expect(await firstMarketBetSelectionDetailsSO.editButton.isDisplayed()).toBe(true);
    });

    describe("and the user clicks to edit it", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getGenericLayout(BFF_GENERIC_VIEW_PAGE_MOCK));
        await mockService.mockHttpRequest(getMarkets(MODAL_ERO_MOCK));
        await mockService.mockHttpRequest(getMarketPositionViews(MODAL_POSITION_VIEWS_MOCK));

        await clickOnElement(firstMarketBetSelectionDetailsSO.editButton);

        await browser.waitUntilDisplayed(bottomSheetSO.element, "Bottom Sheet Edit panel not visible");
        await browser.waitUntilDisplayed(footballScoreboardSO.element, "Football Scoreboard not visible");
        await browser.waitUntilDisplayed(bottomSheetMarketPageSO.element, "Bottom Sheet Market Page not visible");
        await browser.waitUntilDisplayed(
          bottomSheetExchangeInlineEditPanelSO.element,
          "Bottom Sheet Inline edit panel not visible",
        );
        await browser.waitUntilDisplayed(regulatorySections.element, "Bottom Sheet Regulatory Section not visible");
        await browser.waitUntilEquals(homeTeamSO.name, "Sporting Lisbon");
      });

      it("[PRPI-1816] should open the bottom sheet to edit the bet", async () => {
        expect(await bottomSheetSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-1817] the bottom sheet should display the 'Edit bet' title", async () => {
        expect(await bottomSheetSO.headerTitle.getText()).toBe("Edit bet");
      });

      it("[PRPI-1818] the bottom sheet should display the header button", async () => {
        expect(await bottomSheetSO.headerButton.isDisplayed()).toBe(true);
      });

      it("[PRPI-1819] the market card should be displayed", async () => {
        expect(await bottomSheetMarketPageSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-1820] the inline betslip should be displayed", async () => {
        expect(await bottomSheetExchangeInlineEditPanelSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-4258] the regulatory footer should be displayed", async () => {
        expect(await regulatorySections.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-4259] the scoreboard should be displayed", async () => {
        expect(await footballScoreboardSO.element.isDisplayed()).toBe(true);
        expect(await homeTeamSO.name.getText()).toBe("Sporting Lisbon");
        expect(await awayTeamSO.name.getText()).toBe("Rio Ave");
      });

      // This test doesn't continue with the same use case as WEB due to the `snapshotMaxDepth` issue
    });
  });
});
