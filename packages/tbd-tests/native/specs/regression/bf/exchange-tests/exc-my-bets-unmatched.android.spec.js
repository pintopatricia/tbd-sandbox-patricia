const {
  getAppContext,
  getMyBetsLayout,
  getCardResults,
  getHomeLayoutWithViewLink,
  getGenericLayout,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const BetCardGroupSO = require("@ppb/tbd-shared/components/BetCardGroup/BetCardGroup.native.so");
const MarketBetSelectionCardGroupSO = require("@ppb/tbd-shared/components/MarketBetSelectionCardGroup/MarketBetSelectionCardGroup.native.so");
const MarketBetSelectionCardSO = require("@ppb/tbd-shared/components/MarketBetSelectionCard/MarketBetSelectionCard.native.so");
const MarketBetCardGroupSO = require("@ppb/tbd-shared/components/MarketBetCardGroup/MarketBetCardGroup.native.so");
const MarketBetCardSO = require("@ppb/tbd-shared/components/MarketBetCard/MarketBetCard.native.so");
const { getCancelBetResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").ETX;

const { getMyBetsEXCViewMock, getMyBetsEXCCardResults } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const routes = require("../../../../../utils/routes");
const MockService = require("../../../../mock-essentials/mocking-service");
const { checkIfDisplayedWithSwipe, VERTICAL, swipeUpElement } = require("../../../../helpers/gestures");

const {
  MyBetsScreenSO,
  FootballScoreboardSO,
  CardSO,
  BetSegmentsSO,
  BetSelectionDetailsSO,
  SelectionSegmentSO,
  OddsSO,
  PNLAndWhatIfSO,
  TeamSO,
  ActionLinkSO,
  CounterAggregatorSO,
  ReceiptPanelSO,
  ReceiptTitleSO,
  BottomSheetSO,
  ExchangeMarketSO,
} = require("../../../../screen-objects");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsSO = new MyBetsScreenSO();
const bottomSheetSO = new BottomSheetSO();

const betCardGroupSO = new BetCardGroupSO(myBetsSO.betCardGroups[0]);

const footballScoreboardSO = new FootballScoreboardSO(betCardGroupSO.groupItems[0]);
const footballScoreboardHomeTeamSO = new TeamSO(footballScoreboardSO.homeTeam);
const footballScoreboardAwayTeamSO = new TeamSO(footballScoreboardSO.awayTeam);

const firstMarketBetCardGroupSO = new MarketBetCardGroupSO(betCardGroupSO.groupItems[1]);
const secondMarketBetCardGroupSO = new MarketBetCardGroupSO(betCardGroupSO.groupItems[2]);

const firstMarketBetCardSO = new MarketBetCardSO(firstMarketBetCardGroupSO.groupItems[0]);
const secondMarketBetCardSO = new MarketBetCardSO(secondMarketBetCardGroupSO.groupItems[0]);

const firstCardSO = new CardSO(firstMarketBetCardGroupSO.groupItems[1]);
const secondCardSO = new CardSO(secondMarketBetCardGroupSO.groupItems[1]);

const firstCounterAggregatorSO = new CounterAggregatorSO(firstMarketBetCardSO.counterAggregator);
const secondCounterAggregatorSO = new CounterAggregatorSO(secondMarketBetCardSO.counterAggregator);

const firstMarketBetSelectionCardGroupSO = new MarketBetSelectionCardGroupSO(firstMarketBetCardGroupSO.groupItems[1]);
const secondMarketBetSelectionCardGroupSO = new MarketBetSelectionCardGroupSO(secondMarketBetCardGroupSO.groupItems[1]);

const firstCounterAggregatorCancelAllButtonSO = new ActionLinkSO(firstCounterAggregatorSO.button);

const firstMarketFirstMarketBetSelectionCardSO = new MarketBetSelectionCardSO(
  firstMarketBetSelectionCardGroupSO.groupItems[0],
);
const firstMarketSecondMarketBetSelectionCardSO = new MarketBetSelectionCardSO(
  firstMarketBetSelectionCardGroupSO.groupItems[1],
);
const firstMarketThirdMarketBetSelectionCardSO = new MarketBetSelectionCardSO(
  firstMarketBetSelectionCardGroupSO.groupItems[2],
);
const firstMarketFourthMarketBetSelectionCardSO = new MarketBetSelectionCardSO(
  firstMarketBetSelectionCardGroupSO.groupItems[3],
);

const firstMarketFirstMarketBetSelectionDetailsSO = new BetSelectionDetailsSO(
  firstMarketFirstMarketBetSelectionCardSO.betSelectionDetails,
);
const firstMarketFirstBetSegmentsSO = new BetSegmentsSO(firstMarketFirstMarketBetSelectionCardSO.betSegments);
const firstMarketFirstBetLeftSelectionSegmentsSO = new SelectionSegmentSO(firstMarketFirstBetSegmentsSO.leftSegment);
const firstMarketFirstBetLeftSelectionSegmentOddsSO = new OddsSO(firstMarketFirstBetSegmentsSO.leftSegment);
const firstMarketFirstBetMidSelectionSegmentsSO = new SelectionSegmentSO(firstMarketFirstBetSegmentsSO.midSegment);
const firstMarketFirstBetMidSelectionSegmentStakeSO = new OddsSO(firstMarketFirstBetSegmentsSO.midSegment);
const firstMarketFirstBetRightSelectionSegmentsSO = new SelectionSegmentSO(firstMarketFirstBetSegmentsSO.rightSegment);
const firstMarketFirstBetRightSelectionSegmentProfitSO = new PNLAndWhatIfSO(firstMarketFirstBetSegmentsSO.rightSegment);
const firstMarketSecondMarketBetSelectionDetailsSO = new BetSelectionDetailsSO(
  firstMarketSecondMarketBetSelectionCardSO.betSelectionDetails,
);
const firstMarketSecondBetSegmentsSO = new BetSegmentsSO(firstMarketSecondMarketBetSelectionCardSO.betSegments);
const firstMarketSecondBetLeftSelectionSegmentsSO = new SelectionSegmentSO(firstMarketSecondBetSegmentsSO.leftSegment);
const firstMarketSecondBetLeftSelectionSegmentOddsSO = new OddsSO(firstMarketSecondBetSegmentsSO.leftSegment);
const firstMarketSecondBetMidSelectionSegmentsSO = new SelectionSegmentSO(firstMarketSecondBetSegmentsSO.midSegment);
const firstMarketSecondBetMidSelectionSegmentStakeSO = new OddsSO(firstMarketSecondBetSegmentsSO.midSegment);
const firstMarketSecondBetRightSelectionSegmentsSO = new SelectionSegmentSO(
  firstMarketSecondBetSegmentsSO.rightSegment,
);
const firstMarketSecondBetRightSelectionSegmentProfitSO = new PNLAndWhatIfSO(
  firstMarketSecondBetSegmentsSO.rightSegment,
);
const firstMarketThirdMarketBetSelectionDetailsSO = new BetSelectionDetailsSO(
  firstMarketThirdMarketBetSelectionCardSO.betSelectionDetails,
);
const firstMarketThirdBetSegmentsSO = new BetSegmentsSO(firstMarketThirdMarketBetSelectionCardSO.betSegments);
const firstMarketThirdBetLeftSelectionSegmentsSO = new SelectionSegmentSO(firstMarketThirdBetSegmentsSO.leftSegment);
const firstMarketThirdBetLeftSelectionSegmentOddsSO = new OddsSO(firstMarketThirdBetSegmentsSO.leftSegment);
const firstMarketThirdBetMidSelectionSegmentsSO = new SelectionSegmentSO(firstMarketThirdBetSegmentsSO.midSegment);
const firstMarketThirdBetMidSelectionSegmentStakeSO = new OddsSO(firstMarketThirdBetSegmentsSO.midSegment);
const firstMarketThirdBetRightSelectionSegmentsSO = new SelectionSegmentSO(firstMarketThirdBetSegmentsSO.rightSegment);
const firstMarketThirdBetRightSelectionSegmentProfitSO = new PNLAndWhatIfSO(firstMarketThirdBetSegmentsSO.rightSegment);
const firstMarketFourthMarketBetSelectionDetailsSO = new BetSelectionDetailsSO(
  firstMarketFourthMarketBetSelectionCardSO.betSelectionDetails,
);
const firstMarketFourthBetSegmentsSO = new BetSegmentsSO(firstMarketFourthMarketBetSelectionCardSO.betSegments);
const firstMarketFourthBetLeftSelectionSegmentsSO = new SelectionSegmentSO(firstMarketFourthBetSegmentsSO.leftSegment);
const firstMarketFourthBetLeftSelectionSegmentOddsSO = new OddsSO(firstMarketFourthBetSegmentsSO.leftSegment);
const firstMarketFourthBetMidSelectionSegmentsSO = new SelectionSegmentSO(firstMarketFourthBetSegmentsSO.midSegment);
const firstMarketFourthBetMidSelectionSegmentStakeSO = new OddsSO(firstMarketFourthBetSegmentsSO.midSegment);
const firstMarketFourthBetRightSelectionSegmentsSO = new SelectionSegmentSO(
  firstMarketFourthBetSegmentsSO.rightSegment,
);
const firstMarketFourthBetRightSelectionSegmentProfitSO = new PNLAndWhatIfSO(
  firstMarketFourthBetSegmentsSO.rightSegment,
);

const secondMarketFirstMarketBetSelectionCardSO = new MarketBetSelectionCardSO(
  secondMarketBetSelectionCardGroupSO.groupItems[0],
);
const secondMarketFirstMarketBetSelectionDetailsSO = new BetSelectionDetailsSO(
  secondMarketFirstMarketBetSelectionCardSO.betSelectionDetails,
);
const secondMarketFirstBetSegmentsSO = new BetSegmentsSO(secondMarketFirstMarketBetSelectionCardSO.betSegments);
const secondMarketFirstBetLeftSelectionSegmentsSO = new SelectionSegmentSO(secondMarketFirstBetSegmentsSO.leftSegment);
const secondMarketFirstBetLeftSelectionSegmentOddsSO = new OddsSO(secondMarketFirstBetSegmentsSO.leftSegment);
const secondMarketFirstBetMidSelectionSegmentsSO = new SelectionSegmentSO(secondMarketFirstBetSegmentsSO.midSegment);
const secondMarketFirstBetMidSelectionSegmentStakeSO = new OddsSO(secondMarketFirstBetSegmentsSO.midSegment);
const secondMarketFirstBetMidRightSelectionSegmentsSO = new SelectionSegmentSO(
  secondMarketFirstBetSegmentsSO.midRightSegment,
);
const secondMarketFirstBetMidRightSelectionSegmentLiabilitySO = new OddsSO(
  secondMarketFirstBetSegmentsSO.midRightSegment,
);
const secondMarketFirstBetRightSelectionSegmentsSO = new SelectionSegmentSO(
  secondMarketFirstBetSegmentsSO.rightSegment,
);
const secondMarketFirstBetRightSelectionSegmentProfitSO = new PNLAndWhatIfSO(
  secondMarketFirstBetSegmentsSO.rightSegment,
);

const receiptPanelSO = new ReceiptPanelSO();
const receiptTitleSO = new ReceiptTitleSO();

const bottomSheetMarketPageSO = new ExchangeMarketSO(bottomSheetSO.content);

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

const getFirstMarketBetCardGroupWithBets = (numberOfBets) => {
  const BETS = [
    {
      __typename: "MarketBetSelectionCard",
      id: "111111111111",
      handicap: 0,
      placedDate: "2023-09-25T16:44:09.000Z",
      settledDate: null,
      matchedDate: "1970-01-01T00:00:00.000Z",
      price: 6,
      runnerDesc: "Rio Ave",
      side: "BACK",
      size: 1,
      profit: 5,
      selectionId: 44444444,
      isUnmatched: true,
    },
    {
      __typename: "MarketBetSelectionCard",
      id: "2222222222222",
      handicap: 0,
      placedDate: "2023-09-25T16:44:09.000Z",
      settledDate: null,
      matchedDate: "1970-01-01T00:00:00.000Z",
      price: 7,
      runnerDesc: "Rio Ave",
      side: "BACK",
      size: 1,
      profit: 6,
      selectionId: 44444444,
      isUnmatched: true,
    },
    {
      __typename: "MarketBetSelectionCard",
      id: "333333333333",
      handicap: 0,
      placedDate: "2023-09-25T16:44:09.000Z",
      settledDate: null,
      matchedDate: "1970-01-01T00:00:00.000Z",
      price: 8,
      runnerDesc: "Rio Ave",
      side: "BACK",
      size: 1,
      profit: 7,
      selectionId: 44444444,
      isUnmatched: true,
    },
    {
      __typename: "MarketBetSelectionCard",
      id: "444444444444",
      handicap: 0,
      placedDate: "2023-09-25T16:44:09.000Z",
      settledDate: null,
      matchedDate: "1970-01-01T00:00:00.000Z",
      price: 9,
      runnerDesc: "Rio Ave",
      side: "BACK",
      size: 1,
      profit: 8,
      selectionId: 44444444,
      isUnmatched: true,
    },
  ];

  return {
    __typename: "MarketBetCardGroup",
    edges:
      (numberOfBets && [
        {
          __typename: "MarketBetCard",
          description: "Match Odds",
          numOfOrders: numberOfBets,
          numOfUnmatched: numberOfBets,
        },
        {
          __typename: "MarketBetExpandableCardGroup",
          isOpen: true,
          edges: [
            {
              __typename: "MarketBetSelectionCardGroup",
              edges: BETS.slice(0, numberOfBets),
            },
          ],
        },
      ]) ||
      [],
  };
};

const FIRST_MARKET_BET_CARD_GROUP_4_BETS = getFirstMarketBetCardGroupWithBets(4);
const FIRST_MARKET_BET_CARD_GROUP_3_BETS = getFirstMarketBetCardGroupWithBets(3);
const FIRST_MARKET_BET_CARD_GROUP_2_BETS = getFirstMarketBetCardGroupWithBets(2);
const FIRST_MARKET_BET_CARD_GROUP_NO_BETS = getFirstMarketBetCardGroupWithBets(0);

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
      FIRST_MARKET_BET_CARD_GROUP_4_BETS,
      {
        __typename: "MarketBetCardGroup",
        edges: [
          {
            __typename: "MarketBetCard",
            description: "Correct Score",
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
                    id: "555555555555",
                    handicap: 0,
                    placedDate: "2023-09-25T16:44:09.000Z",
                    settledDate: null,
                    matchedDate: "1970-01-01T00:00:00.000Z",
                    price: 4.91,
                    runnerDesc: "0-1",
                    side: "LAY",
                    size: 1,
                    profit: 4,
                    liability: 0,
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

const ETX_CANCEL_ALL = {
  marketId: "1.11111111",
  status: "SUCCESS",
  sizeCancelled: 3,
  cancelledDate: "2020-01-21T13:43:32.000Z",
  instructionReports: [
    {
      betId: "2222222222222",
    },
    {
      betId: "333333333333",
    },
  ],
};

const ETX_CANCEL = {
  marketId: "1.11111111",
  status: "SUCCESS",
  sizeCancelled: 1,
  cancelledDate: "2020-01-21T13:43:32.000Z",
  instructionReports: [
    {
      betId: "111111111111",
    },
  ],
};

const ETX_CANCEL_ERROR = {
  marketId: "1.11111111",
  status: "ERROR",
  instructionReports: [
    {
      betId: "2222222222222",
    },
  ],
};

const setAccordionExpandedState = async (accordion, shouldBeExpanded) => {
  const isExpanded = await accordion.contentWrapper.isDisplayed();

  if (isExpanded !== shouldBeExpanded) {
    await browser.waitUntilClickableNative(accordion.header, "Accordion is not clickable");
    await accordion.header.click();
  }

  if (shouldBeExpanded) {
    await browser.waitUntilDisplayed(accordion.contentWrapper, "Accordion isn't expanded");
  } else {
    await browser.waitUntilNotDisplayed(accordion.contentWrapper, "Accordion isn't closed");
  }
};

const cancelUnmatchedBet = async (betSelectionDetailsSO) => {
  await browser.waitUntilClickableNative(betSelectionDetailsSO.removeButton, "Cancel button is not clickable");
  await betSelectionDetailsSO.removeButton.click();
};

const ensureFirstMarketFourthSelectionReady = async () => {
  await checkIfDisplayedWithSwipe({
    scrollContainer: myBetsSO.element,
    searchableElement: firstMarketFourthMarketBetSelectionCardSO.element,
    maxScrolls: 6,
    direction: VERTICAL.UP,
    percentage: 0.6,
  });
  await browser.waitUntilDisplayed(
    firstMarketFourthMarketBetSelectionCardSO.element,
    "Fourth first-market selection card not visible",
  );
  await browser.waitUntilDisplayed(
    firstMarketFourthBetLeftSelectionSegmentsSO.term,
    "Fourth selection segments not visible",
  );
};

const ensureSecondMarketReady = async () => {
  await browser.waitUntilDisplayed(
    secondMarketFirstMarketBetSelectionCardSO.element,
    "Second market selection card not visible",
  );

  for (let attempt = 0; attempt < 3; attempt += 1) {
    if (await secondMarketFirstBetSegmentsSO.midRightSegment.isExisting()) {
      await browser.waitUntilDisplayed(
        secondMarketFirstBetMidRightSelectionSegmentsSO.term,
        "Second market liability segment not visible",
      );
      return;
    }

    await setAccordionExpandedState(secondCardSO, false);
    await setAccordionExpandedState(secondCardSO, true);
    await browser.waitUntilArrayLength(secondMarketBetSelectionCardGroupSO.groupItems, (length) => length === 1);
  }

  throw new Error("Second market liability segment did not render after re-expanding accordion");
};

const MY_BETS_URL = routes.getMyBetsViewUrl("open");

describe("My Bets Page - Unmatched Bets", () => {
  describe("When the user open the My Bets Unmatched bets", () => {
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

      const HOME_VIEW_LINK = getStartViewLink(MY_BETS_URL);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, dismissOnboarding: true });

      // scroll all bet card group items into view
      await browser.waitUntilDisplayed(myBetsSO.header, "My bets screen title is not displayed");
      await browser.waitUntilDisplayed(betCardGroupSO.element, "Bet Card Group not visible");
      await browser.waitUntilDisplayed(footballScoreboardSO.element, "Football scoreboard not visible");
    });

    describe("and when collapsing the accordion for both markets", () => {
      beforeAll(async () => {
        await setAccordionExpandedState(firstCardSO, false);
        await setAccordionExpandedState(secondCardSO, false);
        await browser.waitUntilDisplayed(firstMarketBetCardGroupSO.element, "First Market Bet card not visible");
        await browser.waitUntilDisplayed(secondCounterAggregatorSO.element, "Second Market Bet card not visible");
      });

      it("[PRPI-1869] should display one bet card group with one fixture and two markets", async () => {
        expect(await footballScoreboardSO.element.isDisplayed()).toBe(true);
        expect(await footballScoreboardHomeTeamSO.name.getText()).toBe("Sporting Lisbon");
        expect(await footballScoreboardAwayTeamSO.name.getText()).toBe("Rio Ave");

        expect(await firstCounterAggregatorSO.element.isDisplayed()).toBe(true);
        expect(await firstCounterAggregatorSO.title.getText()).toBe("Match Odds");

        expect(await secondCounterAggregatorSO.element.isDisplayed()).toBe(true);
        expect(await secondCounterAggregatorSO.title.getText()).toBe("Correct Score");
      });

      it("[PRPI-1870] should not display the liability for both markets", async () => {
        expect(await firstMarketBetCardSO.liabilityContainer.isDisplayed()).toBe(false);
        expect(await secondMarketBetCardSO.liabilityContainer.isDisplayed()).toBe(false);
      });

      it("[PRPI-1871] should display the Cancel All button only for the first market", async () => {
        expect(await firstCounterAggregatorSO.button.isDisplayed()).toBe(true);
        expect(await firstCounterAggregatorCancelAllButtonSO.text.getText()).toBe("Cancel All");

        expect(await secondCounterAggregatorSO.button.isDisplayed()).toBe(false);
      });

      it("[PRPI-1872] should not display the market bets", async () => {
        expect(await firstMarketBetSelectionCardGroupSO.groupItems.length).toBe(0);
      });

      describe("and when expanding the accordion for the first market", () => {
        beforeAll(async () => {
          await setAccordionExpandedState(firstCardSO, true);
          await swipeUpElement(firstCardSO.element, 500);
          await browser.waitUntilArrayLength(firstMarketBetSelectionCardGroupSO.groupItems, (length) => length === 4);
          await browser.waitUntilEquals(firstCounterAggregatorSO.counter, "4");
        });

        it("[PRPI-1873] should display the collapse button", async () => {
          expect(await firstCardSO.element.isDisplayed()).toBe(true);
          expect(await firstCardSO.contentWrapper.isDisplayed()).toBe(true);
        });

        it("[PRPI-1874] should display 4 unmatched bets", async () => {
          expect(await firstMarketBetSelectionCardGroupSO.groupItems.length).toBe(4);
          expect(await firstCounterAggregatorSO.counter.getText()).toBe("4");
        });

        it("[PRPI-10571] the 1st unmatched bet should display the odds, stake, profit and no liability", async () => {
          expect(await firstMarketFirstBetLeftSelectionSegmentsSO.term.getText()).toBe("Odds");
          expect(await firstMarketFirstBetLeftSelectionSegmentOddsSO.odds.getText()).toBe("6");
          expect(await firstMarketFirstBetMidSelectionSegmentsSO.term.getText()).toBe("Stake");
          expect(await firstMarketFirstBetMidSelectionSegmentStakeSO.odds.getText()).toBe("$1.00");
          expect(await firstMarketFirstBetRightSelectionSegmentsSO.term.getText()).toBe("Profit");
          expect(await firstMarketFirstBetRightSelectionSegmentProfitSO.pnl.getText()).toBe("$5.00");
          expect(await firstMarketFirstBetSegmentsSO.midRightSegment.isExisting()).toBe(false);
        });

        it("[PRPI-10572] the 2nd unmatched bet should display the odds, stake, profit and no liability", async () => {
          expect(await firstMarketSecondBetLeftSelectionSegmentsSO.term.getText()).toBe("Odds");
          expect(await firstMarketSecondBetLeftSelectionSegmentOddsSO.odds.getText()).toBe("7");
          expect(await firstMarketSecondBetMidSelectionSegmentsSO.term.getText()).toBe("Stake");
          expect(await firstMarketSecondBetMidSelectionSegmentStakeSO.odds.getText()).toBe("$1.00");
          expect(await firstMarketSecondBetRightSelectionSegmentsSO.term.getText()).toBe("Profit");
          expect(await firstMarketSecondBetRightSelectionSegmentProfitSO.pnl.getText()).toBe("$6.00");
          expect(await firstMarketSecondBetSegmentsSO.midRightSegment.isExisting()).toBe(false);
        });

        it("[PRPI-10573] the 3rd unmatched bet should display the odds, stake, profit and no liability", async () => {
          expect(await firstMarketThirdBetLeftSelectionSegmentsSO.term.getText()).toBe("Odds");
          expect(await firstMarketThirdBetLeftSelectionSegmentOddsSO.odds.getText()).toBe("8");
          expect(await firstMarketThirdBetMidSelectionSegmentsSO.term.getText()).toBe("Stake");
          expect(await firstMarketThirdBetMidSelectionSegmentStakeSO.odds.getText()).toBe("$1.00");
          expect(await firstMarketThirdBetRightSelectionSegmentsSO.term.getText()).toBe("Profit");
          expect(await firstMarketThirdBetRightSelectionSegmentProfitSO.pnl.getText()).toBe("$7.00");
          expect(await firstMarketThirdBetSegmentsSO.midRightSegment.isExisting()).toBe(false);
        });

        it("[PRPI-10574] the 4th unmatched bet should display the odds, stake, profit and no liability", async () => {
          await ensureFirstMarketFourthSelectionReady();
          expect(await firstMarketFourthBetLeftSelectionSegmentsSO.term.getText()).toBe("Odds");
          expect(await firstMarketFourthBetLeftSelectionSegmentOddsSO.odds.getText()).toBe("9");
          expect(await firstMarketFourthBetMidSelectionSegmentsSO.term.getText()).toBe("Stake");
          expect(await firstMarketFourthBetMidSelectionSegmentStakeSO.odds.getText()).toBe("$1.00");
          expect(await firstMarketFourthBetRightSelectionSegmentsSO.term.getText()).toBe("Profit");
          expect(await firstMarketFourthBetRightSelectionSegmentProfitSO.pnl.getText()).toBe("$8.00");
          expect(await firstMarketFourthBetSegmentsSO.midRightSegment.isExisting()).toBe(false);
        });

        it("[PRPI-10575] the unmatched bets should display the 'BACK' label", async () => {
          await browser.waitUntilArrayLength(firstMarketBetSelectionCardGroupSO.groupItems, (length) => length === 4);
          await ensureFirstMarketFourthSelectionReady();
          expect(await firstMarketFirstMarketBetSelectionDetailsSO.side.getText()).toBe("BACK");
          expect(await firstMarketSecondMarketBetSelectionDetailsSO.side.getText()).toBe("BACK");
          expect(await firstMarketThirdMarketBetSelectionDetailsSO.side.getText()).toBe("BACK");
          expect(await firstMarketFourthMarketBetSelectionDetailsSO.side.getText()).toBe("BACK");
        });

        it("[PRPI-1875] should display the edit button on all bets", async () => {
          await ensureFirstMarketFourthSelectionReady();
          expect(await firstMarketFirstMarketBetSelectionDetailsSO.editButton.isDisplayed()).toBe(true);
          expect(await firstMarketSecondMarketBetSelectionDetailsSO.editButton.isDisplayed()).toBe(true);
          expect(await firstMarketThirdMarketBetSelectionDetailsSO.editButton.isDisplayed()).toBe(true);
          expect(await firstMarketFourthMarketBetSelectionDetailsSO.editButton.isDisplayed()).toBe(true);
        });

        it("[PRPI-1876] should display the cancel button on all bets", async () => {
          await ensureFirstMarketFourthSelectionReady();
          expect(await firstMarketFirstMarketBetSelectionDetailsSO.removeButton.isDisplayed()).toBe(true);
          expect(await firstMarketSecondMarketBetSelectionDetailsSO.removeButton.isDisplayed()).toBe(true);
          expect(await firstMarketThirdMarketBetSelectionDetailsSO.removeButton.isDisplayed()).toBe(true);
          expect(await firstMarketFourthMarketBetSelectionDetailsSO.removeButton.isDisplayed()).toBe(true);
        });

        describe("and when closing/opening the accordion (one bet got matched in between)", () => {
          beforeAll(async () => {
            const BFF_3_BETS_CARDS_UPDATES = getMyBetsEXCCardResults([FIRST_MARKET_BET_CARD_GROUP_3_BETS], {
              eventId: 1111111111,
              marketId: "1.11111111",
            });

            await setAccordionExpandedState(firstCardSO, false); // collapse selections

            await mockService.mockHttpRequest(getCardResults(BFF_3_BETS_CARDS_UPDATES));

            await setAccordionExpandedState(firstCardSO, true); // expand selections again with update
          });

          it("[PRPI-1877] should now display 3 unmatched bets", async () => {
            await browser.waitUntilEquals(firstCounterAggregatorSO.counter, "3");
            await browser.waitUntilArrayLength(firstMarketBetSelectionCardGroupSO.groupItems, (length) => length === 3);
          });

          describe("and when cancelling a bet successfully", () => {
            const BFF_2_BETS_CARDS_UPDATES = getMyBetsEXCCardResults([FIRST_MARKET_BET_CARD_GROUP_2_BETS], {
              eventId: 1111111111,
              marketId: "1.11111111",
            });

            beforeAll(async () => {
              await mockService.mockHttpRequest(getCardResults(BFF_2_BETS_CARDS_UPDATES));
              await mockService.mockHttpRequest(getCancelBetResponse(ETX_CANCEL));
              await cancelUnmatchedBet(firstMarketFirstMarketBetSelectionDetailsSO);
            });

            it("[PRPI-1877] should now display 2 unmatched bets", async () => {
              await browser.waitUntilEquals(firstCounterAggregatorSO.counter, "2");
              await browser.waitUntilArrayLength(
                firstMarketBetSelectionCardGroupSO.groupItems,
                (length) => length === 2,
              );
            });

            describe("and when attempting to cancel a bet, but there is an error", () => {
              beforeAll(async () => {
                await mockService.mockHttpRequest(getCardResults(BFF_2_BETS_CARDS_UPDATES));
                await mockService.mockHttpRequest(getCancelBetResponse(ETX_CANCEL_ERROR));
                await cancelUnmatchedBet(firstMarketFirstMarketBetSelectionDetailsSO);
              });

              it("[PRPI-1877] the error receipt should be displayed", async () => {
                await browser.waitUntilDisplayed(receiptPanelSO.element, "Error receipt isn't displayed");
                expect(await receiptTitleSO.label.getText()).toBe("Error Canceling Bet");
                expect(await receiptTitleSO.dismissButton.isDisplayed()).toBe(true);
              });

              describe("and when dismissing the receipt", () => {
                beforeAll(async () => {
                  await browser.waitUntilClickableNative(
                    receiptPanelSO.dismissButton,
                    "Dismiss button is not clickable",
                  );
                  await receiptPanelSO.dismissButton.click();

                  await browser.waitUntilNotDisplayed(receiptPanelSO.element, "The receipt is still visible");
                });

                it("[PRPI-1877] should still display 2 unmatched bets", async () => {
                  expect(await firstCounterAggregatorSO.counter.getText()).toBe("2");
                });
              });
            });

            // TODO - when cancelling all bets, the market is still displayed (to be fixed in STSIER-929)
            xdescribe("and when cancelling all bets from the market", () => {
              beforeAll(async () => {
                const BFF_NO_BETS_CARDS_UPDATES = getMyBetsEXCCardResults([FIRST_MARKET_BET_CARD_GROUP_NO_BETS], {
                  eventId: 1111111111,
                  marketId: "1.11111111",
                });

                await mockService.mockHttpRequest(getCardResults(BFF_NO_BETS_CARDS_UPDATES));
                await mockService.mockHttpRequest(getCancelBetResponse(ETX_CANCEL_ALL));

                await browser.waitUntilClickableNative(
                  firstCounterAggregatorSO.button,
                  "Cancel button is not clickable",
                );
                await firstCounterAggregatorSO.button.click();

                await browser.waitUntilArrayLength(firstMarketBetCardGroupSO.groupItems, (length) => length === 0);
              });

              it("[PRPI-1877] the 'Match Odds' market should no longer be visible", async () => {
                expect(await firstMarketBetCardGroupSO.groupItems.length).toBe(0);
              });
            });
          });
        });

        describe("and when expanding the accordion for the second market", () => {
          beforeAll(async () => {
            await setAccordionExpandedState(firstCardSO, false);
            await setAccordionExpandedState(secondCardSO, true);
            await browser.waitUntilArrayLength(
              secondMarketBetSelectionCardGroupSO.groupItems,
              (length) => length === 1,
            );
          });

          it("[PRPI-1878] should display 1 unmatched bet", async () => {
            expect(await secondCounterAggregatorSO.counter.getText()).toBe("1");
            expect(await secondMarketFirstMarketBetSelectionCardSO.element.isDisplayed()).toBe(true);
          });

          it("[PRPI-10526] the unmatched bet should display the 'LAY' label", async () => {
            expect(await secondMarketFirstMarketBetSelectionDetailsSO.side.getText()).toBe("LAY");
          });

          it("[PRPI-10527] the unmatched bet should display the edit and cancel buttons", async () => {
            expect(await secondMarketFirstMarketBetSelectionDetailsSO.editButton.isDisplayed()).toBe(true);
            expect(await secondMarketFirstMarketBetSelectionDetailsSO.removeButton.isDisplayed()).toBe(true);
          });

          it("[PRPI-10528] should display the odds, stake, liability and profit", async () => {
            await ensureSecondMarketReady();
            expect(await secondMarketFirstBetLeftSelectionSegmentsSO.term.getText()).toBe("Odds");
            expect(await secondMarketFirstBetLeftSelectionSegmentOddsSO.odds.getText()).toBe("4.91");
            expect(await secondMarketFirstBetMidSelectionSegmentsSO.term.getText()).toBe("Backer's Stake");
            expect(await secondMarketFirstBetMidSelectionSegmentStakeSO.odds.getText()).toBe("$1.00");
            expect(await secondMarketFirstBetMidRightSelectionSegmentsSO.term.getText()).toBe("Liability");
            expect(await secondMarketFirstBetMidRightSelectionSegmentLiabilitySO.odds.getText()).toBe("$3.91");
            expect(await secondMarketFirstBetRightSelectionSegmentsSO.term.getText()).toBe("Profit");
            expect(await secondMarketFirstBetRightSelectionSegmentProfitSO.pnl.getText()).toBe("$4.00");
          });
        });
      });
    });

    describe("and the user clicks on market name", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getGenericLayout(BFF_GENERIC_VIEW_PAGE_MOCK));

        await browser.waitUntilDisplayed(myBetsSO.header, "My bets screen title is not displayed");
        await browser.waitUntilClickableNative(firstCounterAggregatorSO.title, "Market title is not clickable");
        await firstCounterAggregatorSO.title.click();

        await browser.waitUntilDisplayed(bottomSheetSO.element, "Bottom Sheet panel not visible");
        await browser.waitUntilDisplayed(footballScoreboardSO.element, "Football Scoreboard not visible");
        await browser.waitUntilDisplayed(bottomSheetMarketPageSO.element, "Bottom Sheet Market Page not visible");
        await browser.waitUntilEquals(footballScoreboardHomeTeamSO.name, "Sporting Lisbon");
      });

      it("[PRPI-4679] should open the bottom sheet with the market", async () => {
        expect(await bottomSheetSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-4680] the bottom sheet should display the 'Match Odds' title", async () => {
        expect(await bottomSheetSO.headerTitle.getText()).toBe("Match Odds");
      });

      it("[PRPI-4681] the bottom sheet should display the header button", async () => {
        expect(await bottomSheetSO.headerButton.isDisplayed()).toBe(true);
      });

      it("[PRPI-4682] the market card should be displayed", async () => {
        expect(await bottomSheetMarketPageSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-4683] the scoreboard should be displayed", async () => {
        expect(await footballScoreboardSO.element.isDisplayed()).toBe(true);
        expect(await footballScoreboardHomeTeamSO.name.getText()).toBe("Sporting Lisbon");
        expect(await footballScoreboardAwayTeamSO.name.getText()).toBe("Rio Ave");
      });
    });
  });
});
