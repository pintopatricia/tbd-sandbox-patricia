const {
  getAppContext,
  getMyBetsLayout,
  getCardResults,
  getHomeLayoutWithViewLink,
  getGenericLayout,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getQuote } = require("@flutter-global/uki-channels-http-clients/mock-index").CASHOUT;

const BetCardGroupSO = require("@ppb/tbd-shared/components/BetCardGroup/BetCardGroup.native.so");
const MarketBetSelectionCardGroupSO = require("@ppb/tbd-shared/components/MarketBetSelectionCardGroup/MarketBetSelectionCardGroup.native.so");
const MarketBetSelectionCardSO = require("@ppb/tbd-shared/components/MarketBetSelectionCard/MarketBetSelectionCard.native.so");
const MarketBetCardGroupSO = require("@ppb/tbd-shared/components/MarketBetCardGroup/MarketBetCardGroup.native.so");
const MarketBetCardSO = require("@ppb/tbd-shared/components/MarketBetCard/MarketBetCard.native.so");

const { getMyBetsEXCViewMock, getMyBetsEXCCardResults } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const routes = require("../../../../../utils/routes");
const MockService = require("../../../../mock-essentials/mocking-service");

const {
  MyBetsScreenSO,
  CardSO,
  PrimaryButtonSO,
  BetSelectionDetailsSO,
  BetSegmentsSO,
  OddsSO,
  PNLAndWhatIfSO,
  CounterAggregatorSO,
  SelectionSegmentSO,
  BottomSheetSO,
  ExchangeMarketSO,
  TeamSO,
  FootballScoreboardSO,
} = require("../../../../screen-objects");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsSO = new MyBetsScreenSO();
const bottomSheetSO = new BottomSheetSO();

const betCardGroupSO = new BetCardGroupSO(myBetsSO.betCardGroups[0]);

const marketBetCardGroupSO = new MarketBetCardGroupSO(betCardGroupSO.groupItems[1]);
const marketBetCardSO = new MarketBetCardSO(marketBetCardGroupSO.groupItems[0]);

const marketBetCardLiabilityBetSegmentsSO = new BetSegmentsSO(marketBetCardSO.liabilityContainer);
const marketBetCardLiabilityLeftSelectionSegmentsSO = new SelectionSegmentSO(
  marketBetCardLiabilityBetSegmentsSO.leftSegment,
);
const marketBetCardLiabilityLeftSelectionSegmentOddsSO = new OddsSO(marketBetCardLiabilityBetSegmentsSO.leftSegment);

const primaryButtonSO = new PrimaryButtonSO();

const cardSO = new CardSO(marketBetCardGroupSO.groupItems[1]);
const counterAggregatorSO = new CounterAggregatorSO(marketBetCardSO.counterAggregator);

const marketBetSelectionCardGroupSO = new MarketBetSelectionCardGroupSO(marketBetCardGroupSO.groupItems[1]);

const firstMarketBetSelectionCardSO = new MarketBetSelectionCardSO(marketBetSelectionCardGroupSO.groupItems[0]);
const secondMarketBetSelectionCardSO = new MarketBetSelectionCardSO(marketBetSelectionCardGroupSO.groupItems[1]);

const firstBetSelectionDetailsSO = new BetSelectionDetailsSO(firstMarketBetSelectionCardSO.betSelectionDetails);
const secondBetSelectionDetailsSO = new BetSelectionDetailsSO(secondMarketBetSelectionCardSO.betSelectionDetails);

const firstBetSegmentsSO = new BetSegmentsSO(firstMarketBetSelectionCardSO.betSegments);
const firstBetLeftSelectionSegmentsSO = new SelectionSegmentSO(firstBetSegmentsSO.leftSegment);
const firstBetLeftSelectionSegmentOddsSO = new OddsSO(firstBetSegmentsSO.leftSegment);
const firstBetMidSelectionSegmentsSO = new SelectionSegmentSO(firstBetSegmentsSO.midSegment);
const firstBetLeftSelectionSegmentStakeSO = new OddsSO(firstBetSegmentsSO.midSegment);
const firstBetRightSelectionSegmentsSO = new SelectionSegmentSO(firstBetSegmentsSO.rightSegment);
const firstBetRightSelectionSegmentPNLAndWhatIfSO = new PNLAndWhatIfSO(firstBetSegmentsSO.rightSegment);

const secondBetSegmentsSO = new BetSegmentsSO(secondMarketBetSelectionCardSO.betSegments);
const secondBetLeftSelectionSegmentsSO = new SelectionSegmentSO(secondBetSegmentsSO.leftSegment);
const secondBetLeftSelectionSegmentOddsSO = new OddsSO(secondBetSegmentsSO.leftSegment);
const secondBetMidSelectionSegmentsSO = new SelectionSegmentSO(secondBetSegmentsSO.midSegment);
const secondBetMidSelectionSegmentsStakeSO = new OddsSO(secondBetSegmentsSO.midSegment);
const secondBetMidRightSelectionSegmentsSO = new SelectionSegmentSO(secondBetSegmentsSO.midRightSegment);
const secondBetMidRightSelectionSegmentsLiabilitySO = new OddsSO(secondBetSegmentsSO.midRightSegment);
const secondBetRightSelectionSegmentsSO = new SelectionSegmentSO(secondBetSegmentsSO.rightSegment);
const secondBetRightSelectionSegmentPNLAndWhatIfSO = new PNLAndWhatIfSO(secondBetSegmentsSO.rightSegment);

const footballScoreboardSO = new FootballScoreboardSO(bottomSheetSO.headerContent);
const homeTeamSO = new TeamSO(footballScoreboardSO.homeTeam);
const awayTeamSO = new TeamSO(footballScoreboardSO.awayTeam);
const bottomSheetMarketPageSO = new ExchangeMarketSO(bottomSheetSO.content);

const CASHOUT_QUOTE_POSITIVE_PROFIT_MOCK = [
  {
    marketId: "1.11111111",
    status: "AVAILABLE",
    algorithm: "ZERO_BACK",
    value: 1.1,
    currentLiability: 1,
    profit: 0.1,
  },
];

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

const generateBetCardGroupMock = () => [
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
            description: "Match Odds",
            numOfOrders: 2,
            numOfUnmatched: 0,
            liability: 1,
            cashoutQuotes: CASHOUT_QUOTE_POSITIVE_PROFIT_MOCK,
          },
          {
            __typename: "MarketBetExpandableCardGroup",
            isOpen: false,
            edges: [
              {
                __typename: "MarketBetSelectionCardGroup",
                edges: [
                  {
                    __typename: "MarketBetSelectionCard",
                    id: "111111111111",
                    handicap: 0,
                    placedDate: "2023-09-25T16:44:09.000Z",
                    settledDate: null,
                    matchedDate: "2023-09-25T16:44:09.000Z",
                    price: 2.0,
                    runnerDesc: "Rio Ave",
                    side: "BACK",
                    size: 1,
                    profit: 1,
                    selectionId: 44444444,
                    isUnmatched: "false",
                  },
                  {
                    __typename: "MarketBetSelectionCard",
                    id: "2222222222222",
                    handicap: 0,
                    placedDate: "2023-09-25T16:44:09.000Z",
                    settledDate: null,
                    matchedDate: "2023-09-25T16:44:09.000Z",
                    price: 2.0,
                    runnerDesc: "Rio Ave",
                    side: "LAY",
                    size: 0.9,
                    liability: 0.8,
                    profit: 1.1,
                    selectionId: 44444444,
                    isUnmatched: "false",
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

const MATCHED_FOOTBALL_EVENT_2_BET_MOCK = generateBetCardGroupMock();

const VIEW_MATCHED_FOOTBALL_MOCK = getMyBetsEXCViewMock(MATCHED_FOOTBALL_EVENT_2_BET_MOCK, {
  isOpenMatched: true,
  hasFooter: true,
});

const MY_BETS_URL = routes.getMyBetsViewUrl("open", { matchedStatus: "matched" });
const MY_BETS_URN = routes.getMyBetsURN("open", { matchedStatus: "matched" });
const HOME_VIEW_LINK = getStartViewLink(MY_BETS_URL, MY_BETS_URN);

describe("My Bets Page - EXC Matched Bets", () => {
  describe("When the user opens My Bets and has a Matched bet with cashout", () => {
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
      await mockService.mockHttpRequest(getMyBetsLayout(VIEW_MATCHED_FOOTBALL_MOCK));
      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
      await mockService.mockHttpRequest(getQuote(VIEW_MATCHED_FOOTBALL_MOCK));
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, dismissOnboarding: true });

      await browser.waitUntilDisplayed(betCardGroupSO.element, "Bet Card Group not visible");
      await browser.waitUntilDisplayed(marketBetCardGroupSO.element, "Market Bet card not visible");
      await browser.waitUntilDisplayed(primaryButtonSO.element, "Cash Out Button is not visible");
    });

    it("[PRPI-1824] should display the market name 'Match Odds'", async () => {
      expect(await counterAggregatorSO.title.getText()).toBe("Match Odds");
    });

    it("[PRPI-1825] should display the counter with '2'", async () => {
      expect(await counterAggregatorSO.counter.getText()).toBe("2");
    });

    it("[PRPI-1826] should display the liability value", async () => {
      expect(await marketBetCardLiabilityLeftSelectionSegmentsSO.term.getText()).toBe("Liability");
      expect(await marketBetCardLiabilityLeftSelectionSegmentOddsSO.odds.getText()).toBe("$1.00");
    });

    it("[PRPI-1827] should display the cashout button", async () => {
      expect(await primaryButtonSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-1828] should display the accordion collapsed", async () => {
      expect(await cardSO.contentWrapper.isDisplayed()).toBe(false);
    });

    describe("and the user clicks on the 'Show Selection Info'", () => {
      beforeAll(async () => {
        const [
          {
            edges: [, MARKET_BET_CARD_GROUP],
          },
        ] = MATCHED_FOOTBALL_EVENT_2_BET_MOCK;

        const BFF_CARDS_UPDATES = getMyBetsEXCCardResults([MARKET_BET_CARD_GROUP], {
          eventId: 1111111111,
          marketId: "1.11111111",
          isOpenMatched: true,
        });

        await mockService.mockHttpRequest(getCardResults(BFF_CARDS_UPDATES));

        await browser.waitUntilClickableNative(cardSO.header, "Collapse button is not clickable");
        await cardSO.header.click();

        await browser.waitUntilDisplayed(cardSO.contentWrapper, "Collapse is not expanded");
        await browser.waitUntilDisplayed(firstMarketBetSelectionCardSO.element, "First selection is not displayed");
        await browser.waitUntilDisplayed(secondMarketBetSelectionCardSO.element, "Second selection is not displayed");
      });

      describe("and for the first selection", () => {
        it("[PRPI-1829] should display the label 'Back'", async () => {
          expect(await firstBetSelectionDetailsSO.side.getText()).toBe("BACK");
        });

        it("[PRPI-1830] should display the selection name", async () => {
          expect(await firstBetSelectionDetailsSO.title.getText()).toBe("Rio Ave");
        });

        it("[PRPI-1831] should display the 'Odds' label with '2' value", async () => {
          expect(await firstBetLeftSelectionSegmentsSO.term.getText()).toBe("Odds");
          expect(await firstBetLeftSelectionSegmentOddsSO.odds.getText()).toBe("2");
        });

        it("[PRPI-1832] should display the 'Stake' label with '$1.00' value", async () => {
          expect(await firstBetMidSelectionSegmentsSO.term.getText()).toBe("Stake");
          expect(await firstBetLeftSelectionSegmentStakeSO.odds.getText()).toBe("$1.00");
        });

        it("[PRPI-10515] should not display the liability", async () => {
          expect(await firstBetSegmentsSO.midRightSegment.isExisting()).toBe(false);
        });

        it("[PRPI-1833] should display the 'Profit' label with '$1.00' value", async () => {
          expect(await firstBetRightSelectionSegmentsSO.term.getText()).toBe("Profit");
          expect(await firstBetRightSelectionSegmentPNLAndWhatIfSO.pnl.getText()).toBe("$1.00");
        });

        it("[PRPI-1834] should not display the cashout info label", async () => {
          expect(await firstMarketBetSelectionCardSO.infoLabel.isDisplayed()).toBe(false);
        });
      });

      describe("and for the second selection", () => {
        it("[PRPI-1835] should display the label 'Lay'", async () => {
          expect(await secondBetSelectionDetailsSO.side.getText()).toBe("LAY");
        });

        it("[PRPI-1836] should display the selection name", async () => {
          expect(await secondBetSelectionDetailsSO.title.getText()).toBe("Rio Ave");
        });

        it("[PRPI-1837] should display the 'Odds' label with '2' value", async () => {
          expect(await secondBetLeftSelectionSegmentsSO.term.getText()).toBe("Odds");
          expect(await secondBetLeftSelectionSegmentOddsSO.odds.getText()).toBe("2");
        });

        it("[PRPI-1838] should display the 'Backer's Stake' label with '$0.90' value", async () => {
          expect(await secondBetMidSelectionSegmentsSO.term.getText()).toBe("Backer's Stake");
          expect(await secondBetMidSelectionSegmentsStakeSO.odds.getText()).toBe("$0.90");
        });

        it("[PRPI-10570] should display the 'Liability' label with '$0.80' value", async () => {
          expect(await secondBetMidRightSelectionSegmentsSO.term.getText()).toBe("Liability");
          expect(await secondBetMidRightSelectionSegmentsLiabilitySO.odds.getText()).toBe("$0.80");
        });

        it("[PRPI-1839] should display the 'Profit' label with '$1.10' value", async () => {
          expect(await secondBetRightSelectionSegmentsSO.term.getText()).toBe("Profit");
          expect(await secondBetRightSelectionSegmentPNLAndWhatIfSO.pnl.getText()).toBe("$1.10");
        });

        it("[PRPI-1840] should not display the cashout info label", async () => {
          expect(await secondMarketBetSelectionCardSO.infoLabel.isDisplayed()).toBe(false);
        });
      });
    });

    describe("and the user clicks on market name", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getGenericLayout(BFF_GENERIC_VIEW_PAGE_MOCK));

        await counterAggregatorSO.element.click();

        await browser.waitUntilDisplayed(bottomSheetSO.element, "Bottom Sheet panel not visible");
        await browser.waitUntilDisplayed(footballScoreboardSO.element, "Football Scoreboard not visible");
        await browser.waitUntilDisplayed(bottomSheetMarketPageSO.element, "Bottom Sheet Market Page not visible");
        await browser.waitUntilEquals(homeTeamSO.name, "Sporting Lisbon");
      });

      it("[PRPI-4674] should open the bottom sheet with the market", async () => {
        expect(await bottomSheetSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-4675] the bottom sheet should display the 'Match Odds' title", async () => {
        expect(await bottomSheetSO.headerTitle.getText()).toBe("Match Odds");
      });

      it("[PRPI-4676] the bottom sheet should display the header button", async () => {
        expect(await bottomSheetSO.headerButton.isDisplayed()).toBe(true);
      });

      it("[PRPI-4677] the market card should be displayed", async () => {
        expect(await bottomSheetMarketPageSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-4678] the scoreboard should be displayed", async () => {
        expect(await footballScoreboardSO.element.isDisplayed()).toBe(true);
        expect(await homeTeamSO.name.getText()).toBe("Sporting Lisbon");
        expect(await awayTeamSO.name.getText()).toBe("Rio Ave");
      });
    });
  });
});
