const {
  CounterAggregatorPO,
  MyBetsPagePO,
  CardPO,
  BetSelectionDetailsPO,
  BetSegmentsPO,
  FootballScoreboardPO,
  BottomSheetPO,
  MarketPagePO,
  FooterPO,
  SectionElementsPO,
} = require("../../../../page-objects");

const { getMyBetsLayout, getCardResults, getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const BetCardGroupPO = require("@ppb/tbd-shared/components/BetCardGroup/BetCardGroup.web.po");
const MarketBetSelectionCardGroupPO = require("@ppb/tbd-shared/components/MarketBetSelectionCardGroup/MarketBetSelectionCardGroup.web.po");
const MarketBetSelectionCardPO = require("@ppb/tbd-shared/components/MarketBetSelectionCard/MarketBetSelectionCard.web.po");
const MarketBetCardGroupPO = require("@ppb/tbd-shared/components/MarketBetCardGroup/MarketBetCardGroup.web.po");
const MarketBetCardPO = require("@ppb/tbd-shared/components/MarketBetCard/MarketBetCard.web.po");
const { getCancelBetResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").ETX;

const { getMyBetsEXCViewMock, getMyBetsEXCCardResults } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");

const routes = require("../../../../../utils/routes");
const MockService = require("../../../../mock-essentials/mocking-service");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();
const bottomSheetPO = new BottomSheetPO();

const betCardGroupPO = new BetCardGroupPO(myBetsPO.betCardGroups[0]);

const firstMarketBetCardGroupPO = new MarketBetCardGroupPO(betCardGroupPO.groupItems[1]);
const secondMarketBetCardGroupPO = new MarketBetCardGroupPO(betCardGroupPO.groupItems[2]);

const firstMarketBetCardPO = new MarketBetCardPO(firstMarketBetCardGroupPO.groupItems[0]);
const secondMarketBetCardPO = new MarketBetCardPO(secondMarketBetCardGroupPO.groupItems[0]);

const firstCardPO = new CardPO(firstMarketBetCardGroupPO.groupItems[1]);
const secondCardPO = new CardPO(secondMarketBetCardGroupPO.groupItems[1]);

const firstCounterAggregatorPO = new CounterAggregatorPO(firstMarketBetCardPO.counterAggregator);
const secondCounterAggregatorPO = new CounterAggregatorPO(secondMarketBetCardPO.counterAggregator);

const firstMarketBetSelectionCardGroupPO = new MarketBetSelectionCardGroupPO(firstMarketBetCardGroupPO.groupItems[1]);
const secondMarketBetSelectionCardGroupPO = new MarketBetSelectionCardGroupPO(secondMarketBetCardGroupPO.groupItems[1]);

const bottomSheetMarketPagePO = new MarketPagePO(bottomSheetPO.content);
const footerPO = new FooterPO(bottomSheetPO.content);
const footballScoreboardPO = new FootballScoreboardPO(bottomSheetPO.headerContent);
const footerSectionPO = new SectionElementsPO(footerPO.sections[0]);
const footerFirstSection = footerSectionPO.items[0];

const firstMarketFirstMarketBetSelectionCardPO = new MarketBetSelectionCardPO(
  firstMarketBetSelectionCardGroupPO.groupItems[0],
);
const firstMarketSecondMarketBetSelectionCardPO = new MarketBetSelectionCardPO(
  firstMarketBetSelectionCardGroupPO.groupItems[1],
);
const firstMarketThirdMarketBetSelectionCardPO = new MarketBetSelectionCardPO(
  firstMarketBetSelectionCardGroupPO.groupItems[2],
);
const firstMarketFourthMarketBetSelectionCardPO = new MarketBetSelectionCardPO(
  firstMarketBetSelectionCardGroupPO.groupItems[3],
);

const firstMarketFirstMarketBetSelectionDetailsPO = new BetSelectionDetailsPO(
  firstMarketFirstMarketBetSelectionCardPO.betSelectionDetails,
);
const firstMarketSecondMarketBetSelectionDetailsPO = new BetSelectionDetailsPO(
  firstMarketSecondMarketBetSelectionCardPO.betSelectionDetails,
);
const firstMarketThirdMarketBetSelectionDetailsPO = new BetSelectionDetailsPO(
  firstMarketThirdMarketBetSelectionCardPO.betSelectionDetails,
);
const firstMarketFourthMarketBetSelectionDetailsPO = new BetSelectionDetailsPO(
  firstMarketFourthMarketBetSelectionCardPO.betSelectionDetails,
);

const firstMarketFirstMarketBetSegmentsPO = new BetSegmentsPO(firstMarketFirstMarketBetSelectionCardPO.betSegments);
const firstMarketSecondMarketBetSegmentsPO = new BetSegmentsPO(firstMarketSecondMarketBetSelectionCardPO.betSegments);
const firstMarketThirdMarketBetSegmentsPO = new BetSegmentsPO(firstMarketThirdMarketBetSelectionCardPO.betSegments);
const firstMarketFourthMarketBetSegmentsPO = new BetSegmentsPO(firstMarketFourthMarketBetSelectionCardPO.betSegments);

const secondMarketFirstMarketBetSelectionCardPO = new MarketBetSelectionCardPO(
  secondMarketBetSelectionCardGroupPO.groupItems[0],
);
const secondMarketFirstMarketBetSelectionDetailsPO = new BetSelectionDetailsPO(
  secondMarketFirstMarketBetSelectionCardPO.betSelectionDetails,
);

const secondMarketFirstMarketBetSegmentsPO = new BetSegmentsPO(secondMarketFirstMarketBetSelectionCardPO.betSegments);

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
      exchangeCashoutQuotes: [],
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

const MODAL_FIXTURE_CARD_PARTIALS_MOCK = {
  node: {
    __typename: "FixtureCard",
    urn: "ppb:tbd:card:fixture:1111111111|viewLink|0",
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

const getFirstMarketBetCardGroupWithBets = (numOfUnmatched) => {
  const UNMATCHED_BETS = [
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

  const bets = UNMATCHED_BETS.slice(0, numOfUnmatched);

  // add BSP bet
  bets.push({
    __typename: "MarketBetSelectionCard",
    id: "555555555555",
    isBsp: true,
    bspLiability: 1,
    price: 0,
    runnerDesc: "Rio Ave",
    side: "BACK",
    size: 0,
    profit: 0,
    priceMatched: 0,
    isUnmatched: "false",
  });

  return {
    __typename: "MarketBetCardGroup",
    edges: bets.length
      ? [
          {
            __typename: "MarketBetCard",
            description: "Match Odds",
            numOfOrders: bets.length,
            numOfUnmatched,
          },
          {
            __typename: "MarketBetExpandableCardGroup",
            isOpen: true,
            edges: [
              {
                __typename: "MarketBetSelectionCardGroup",
                edges: bets,
              },
            ],
          },
        ]
      : [],
  };
};

const FIRST_MARKET_BET_CARD_GROUP_4_BETS = getFirstMarketBetCardGroupWithBets(4);
const FIRST_MARKET_BET_CARD_GROUP_3_BETS = getFirstMarketBetCardGroupWithBets(3);
const FIRST_MARKET_BET_CARD_GROUP_2_BETS = getFirstMarketBetCardGroupWithBets(2);
const FIRST_MARKET_BET_CARD_GROUP_ONLY_BSP = getFirstMarketBetCardGroupWithBets(0);

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
                    id: "666666666666",
                    handicap: 0,
                    placedDate: "2023-09-25T16:44:09.000Z",
                    settledDate: null,
                    matchedDate: "1970-01-01T00:00:00.000Z",
                    price: 4.91,
                    runnerDesc: "0-1",
                    side: "LAY",
                    size: 1,
                    liability: 0,
                    profit: 4,
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

describe("My Bets Page - Unmatched Bets", () => {
  describe("when navigating to the unmatched bets tab from my bets page", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(VIEW_UNMATCHED_FOOTBALL_MOCK.urn, {
          products: ["exchange"],
        }),
      );
      await mockService.mockHttpRequest(getMyBetsLayout(VIEW_UNMATCHED_FOOTBALL_MOCK));
      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));

      await browser.url(routes.getMyBetsViewUrl("open"));

      await browser.waitUntilDisplayed(betCardGroupPO.element, "Bet Card Group not visible");
      await browser.waitUntilDisplayed(firstMarketBetCardGroupPO.element, "First Market Bet card not visible");
      await browser.waitUntilDisplayed(secondMarketBetCardGroupPO.element, "Second Market Bet card not visible");
    });

    it("[PRPI-5575] should display one bet card group with one fixture and two markets", async () => {
      expect(await betCardGroupPO.groupItems.length).toBe(3);

      expect(await firstCounterAggregatorPO.element.isDisplayed()).toBe(true);
      expect(await firstCounterAggregatorPO.title.getText()).toBe("Match Odds");

      expect(await secondCounterAggregatorPO.element.isDisplayed()).toBe(true);
      expect(await secondCounterAggregatorPO.title.getText()).toBe("Correct Score");
    });

    it("[PRPI-5576] the liability should not be displayed for both markets", async () => {
      expect(await firstMarketBetCardPO.liabilityContainer.isDisplayed()).toBe(false);
      expect(await secondMarketBetCardPO.liabilityContainer.isDisplayed()).toBe(false);
    });

    it("[PRPI-5577] the 'Cancel All' button should be displayed for the first market only", async () => {
      expect(await firstCounterAggregatorPO.button.isDisplayed()).toBe(true);
      expect(await firstCounterAggregatorPO.button.getText()).toBe("Cancel All");

      expect(await secondCounterAggregatorPO.button.isDisplayed()).toBe(false);
    });

    it("[PRPI-5578] both markets should be expanded by default", async () => {
      expect(await firstCardPO.element.isDisplayed()).toBe(true);
      expect(await firstCardPO.content.isDisplayed()).toBe(true);

      expect(await secondCardPO.element.isDisplayed()).toBe(true);
      expect(await secondCardPO.content.isDisplayed()).toBe(true);
    });

    describe("the match odds market", () => {
      const firstMarketBspBetSelectionCardPO = new MarketBetSelectionCardPO(
        firstMarketBetSelectionCardGroupPO.groupItems[4],
      );
      const firstMarketBspBetSelectionDetailsPO = new BetSelectionDetailsPO(
        firstMarketBspBetSelectionCardPO.betSelectionDetails,
      );
      const firstMarketBspBetSegmentsPO = new BetSegmentsPO(firstMarketBspBetSelectionCardPO.betSegments);

      it("[PRPI-5579] should display 4 unmatched bets and 1 BSP bet", async () => {
        expect(await firstCounterAggregatorPO.counter.getText()).toBe("5");
        expect(await firstMarketBetSelectionCardGroupPO.groupItems.length).toBe(5);
      });

      it("[PRPI-10521] the 1st unmatched bet should display the odds, stake, profit and no liability", async () => {
        expect(await firstMarketFirstMarketBetSegmentsPO.leftLabel.getText()).toBe("Odds");
        expect(await firstMarketFirstMarketBetSegmentsPO.leftValue.getText()).toBe("6");
        expect(await firstMarketFirstMarketBetSegmentsPO.midLabel.getText()).toBe("Stake");
        expect(await firstMarketFirstMarketBetSegmentsPO.midValue.getText()).toBe("$1.00");
        expect(await firstMarketFirstMarketBetSegmentsPO.rightLabel.getText()).toBe("Profit");
        expect(await firstMarketFirstMarketBetSegmentsPO.rightValue.getText()).toBe("$5.00");
        expect(await firstMarketFirstMarketBetSegmentsPO.midRightLabel.isExisting()).toBe(false);
        expect(await firstMarketFirstMarketBetSegmentsPO.midRightValue.isExisting()).toBe(false);
      });

      it("[PRPI-10522] the 2nd unmatched bet should display the odds, stake, profit and no liability", async () => {
        expect(await firstMarketSecondMarketBetSegmentsPO.leftLabel.getText()).toBe("Odds");
        expect(await firstMarketSecondMarketBetSegmentsPO.leftValue.getText()).toBe("7");
        expect(await firstMarketSecondMarketBetSegmentsPO.midLabel.getText()).toBe("Stake");
        expect(await firstMarketSecondMarketBetSegmentsPO.midValue.getText()).toBe("$1.00");
        expect(await firstMarketSecondMarketBetSegmentsPO.rightLabel.getText()).toBe("Profit");
        expect(await firstMarketSecondMarketBetSegmentsPO.rightValue.getText()).toBe("$6.00");
        expect(await firstMarketSecondMarketBetSegmentsPO.midRightLabel.isExisting()).toBe(false);
        expect(await firstMarketSecondMarketBetSegmentsPO.midRightValue.isExisting()).toBe(false);
      });

      it("[PRPI-10523] the 3rd unmatched bet should display the odds, stake, profit and no liability", async () => {
        expect(await firstMarketThirdMarketBetSegmentsPO.leftLabel.getText()).toBe("Odds");
        expect(await firstMarketThirdMarketBetSegmentsPO.leftValue.getText()).toBe("8");
        expect(await firstMarketThirdMarketBetSegmentsPO.midLabel.getText()).toBe("Stake");
        expect(await firstMarketThirdMarketBetSegmentsPO.midValue.getText()).toBe("$1.00");
        expect(await firstMarketThirdMarketBetSegmentsPO.rightLabel.getText()).toBe("Profit");
        expect(await firstMarketThirdMarketBetSegmentsPO.rightValue.getText()).toBe("$7.00");
        expect(await firstMarketThirdMarketBetSegmentsPO.midRightLabel.isExisting()).toBe(false);
        expect(await firstMarketThirdMarketBetSegmentsPO.midRightValue.isExisting()).toBe(false);
      });

      it("[PRPI-10524] the 4th unmatched bet should display the odds, stake, profit and no liability", async () => {
        expect(await firstMarketFourthMarketBetSegmentsPO.leftLabel.getText()).toBe("Odds");
        expect(await firstMarketFourthMarketBetSegmentsPO.leftValue.getText()).toBe("9");
        expect(await firstMarketFourthMarketBetSegmentsPO.midLabel.getText()).toBe("Stake");
        expect(await firstMarketFourthMarketBetSegmentsPO.midValue.getText()).toBe("$1.00");
        expect(await firstMarketFourthMarketBetSegmentsPO.rightLabel.getText()).toBe("Profit");
        expect(await firstMarketFourthMarketBetSegmentsPO.rightValue.getText()).toBe("$8.00");
        expect(await firstMarketFourthMarketBetSegmentsPO.midRightLabel.isExisting()).toBe(false);
        expect(await firstMarketFourthMarketBetSegmentsPO.midRightValue.isExisting()).toBe(false);
      });

      it("[PRPI-10525] the unmatched bets should display the 'BACK' label", async () => {
        expect(await firstMarketFirstMarketBetSelectionDetailsPO.side.getText()).toBe("BACK");
        expect(await firstMarketSecondMarketBetSelectionDetailsPO.side.getText()).toBe("BACK");
        expect(await firstMarketThirdMarketBetSelectionDetailsPO.side.getText()).toBe("BACK");
        expect(await firstMarketFourthMarketBetSelectionDetailsPO.side.getText()).toBe("BACK");
      });

      it("[PRPI-5580] all unmatched bets should display the edit button", async () => {
        expect(await firstMarketFirstMarketBetSelectionDetailsPO.editButton.isDisplayed()).toBe(true);
        expect(await firstMarketSecondMarketBetSelectionDetailsPO.editButton.isDisplayed()).toBe(true);
        expect(await firstMarketThirdMarketBetSelectionDetailsPO.editButton.isDisplayed()).toBe(true);
        expect(await firstMarketFourthMarketBetSelectionDetailsPO.editButton.isDisplayed()).toBe(true);
      });

      it("[PRPI-5581] all unmatched bets should display the cancel button", async () => {
        expect(await firstMarketFirstMarketBetSelectionDetailsPO.removeButton.isDisplayed()).toBe(true);
        expect(await firstMarketSecondMarketBetSelectionDetailsPO.removeButton.isDisplayed()).toBe(true);
        expect(await firstMarketThirdMarketBetSelectionDetailsPO.removeButton.isDisplayed()).toBe(true);
        expect(await firstMarketFourthMarketBetSelectionDetailsPO.removeButton.isDisplayed()).toBe(true);
      });

      it("[PRPI-5582] the BSP bet should display 'BSP' odds, 'TBD' profit and the stake value", async () => {
        expect(await firstMarketBspBetSegmentsPO.leftValue.getText()).toBe("SP");
        expect(await firstMarketBspBetSegmentsPO.midValue.getText()).toBe("$1.00");
        expect(await firstMarketBspBetSegmentsPO.rightValue.getText()).toBe("TBD");
      });

      it("[PRPI-5583] the BSP bet should not display the edit or cancel button", async () => {
        expect(await firstMarketBspBetSelectionDetailsPO.editButton.isDisplayed()).toBe(false);
        expect(await firstMarketBspBetSelectionDetailsPO.removeButton.isDisplayed()).toBe(false);
      });

      describe("and when collapsing the market", () => {
        beforeAll(async () => {
          await firstCardPO.header.waitForClickable();
          await firstCardPO.header.click();
          await browser.waitUntilNotDisplayed(firstCardPO.content, "Accordion isn't collapsed");
        });

        it("[PRPI-5584] should not display the market bets", async () => {
          expect(await firstMarketBetSelectionCardGroupPO.groupItems.length).toBe(0);
        });

        describe("and when expanding the market again (one bet got matched in between)", () => {
          const BFF_3_BETS_CARDS_UPDATES = getMyBetsEXCCardResults([FIRST_MARKET_BET_CARD_GROUP_3_BETS], {
            eventId: 1111111111,
            marketId: "1.11111111",
          });

          const firstMarketBspBetSelectionCardPO = new MarketBetSelectionCardPO(
            firstMarketBetSelectionCardGroupPO.groupItems[3],
          );
          const firstMarketBspBetSegmentsPO = new BetSegmentsPO(firstMarketBspBetSelectionCardPO.betSegments);

          beforeAll(async () => {
            await mockService.mockHttpRequest(getCardResults(BFF_3_BETS_CARDS_UPDATES));

            await firstCardPO.header.waitForClickable();
            await firstCardPO.header.click();

            await browser.waitUntilDisplayed(firstCardPO.content, "Accordion isn't expanded");
          });

          it("[PRPI-5585] should now display 3 unmatched bets and 1 BSP bet", async () => {
            await browser.waitUntilArrayLength(firstMarketBetSelectionCardGroupPO.groupItems, (length) => length === 4);
            await browser.waitUntilEquals(firstCounterAggregatorPO.counter, "4");

            expect(await firstMarketBspBetSegmentsPO.leftValue.getText()).toBe("SP");
          });

          describe("and when cancelling an unmatched bet", () => {
            const BFF_2_BETS_CARDS_UPDATES = getMyBetsEXCCardResults([FIRST_MARKET_BET_CARD_GROUP_2_BETS], {
              eventId: 1111111111,
              marketId: "1.11111111",
            });

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

            const firstMarketBspBetSelectionCardPO = new MarketBetSelectionCardPO(
              firstMarketBetSelectionCardGroupPO.groupItems[2],
            );
            const firstMarketBspBetSegmentsPO = new BetSegmentsPO(firstMarketBspBetSelectionCardPO.betSegments);

            beforeAll(async () => {
              await mockService.mockHttpRequest(getCardResults(BFF_2_BETS_CARDS_UPDATES));
              await mockService.mockHttpRequest(getCancelBetResponse(ETX_CANCEL));

              await firstMarketFirstMarketBetSelectionDetailsPO.removeButton.waitForClickable();
              await firstMarketFirstMarketBetSelectionDetailsPO.removeButton.click();
            });

            it("[PRPI-5586] should now display 2 unmatched bets and 1 BSP bet", async () => {
              await browser.waitUntilArrayLength(
                firstMarketBetSelectionCardGroupPO.groupItems,
                (length) => length === 3,
              );
              await browser.waitUntilEquals(firstCounterAggregatorPO.counter, "3");

              expect(await firstMarketBspBetSegmentsPO.leftValue.getText()).toBe("SP");
            });

            describe("and when cancelling all unmatched bets from the market", () => {
              const BFF_ONLY_BSP_CARDS_UPDATES = getMyBetsEXCCardResults([FIRST_MARKET_BET_CARD_GROUP_ONLY_BSP], {
                eventId: 1111111111,
                marketId: "1.11111111",
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

              const firstMarketBspBetSelectionCardPO = new MarketBetSelectionCardPO(
                firstMarketBetSelectionCardGroupPO.groupItems[0],
              );
              const firstMarketBspBetSegmentsPO = new BetSegmentsPO(firstMarketBspBetSelectionCardPO.betSegments);

              beforeAll(async () => {
                await mockService.mockHttpRequest(getCardResults(BFF_ONLY_BSP_CARDS_UPDATES));
                await mockService.mockHttpRequest(getCancelBetResponse(ETX_CANCEL_ALL));

                await firstMarketFirstMarketBetSelectionDetailsPO.removeButton.waitForClickable();
                await firstMarketFirstMarketBetSelectionDetailsPO.removeButton.click();
              });

              it("[PRPI-5586] should only display the BSP bet and no unmatched bets", async () => {
                await browser.waitUntilArrayLength(
                  firstMarketBetSelectionCardGroupPO.groupItems,
                  (length) => length === 1,
                );
                await browser.waitUntilEquals(firstCounterAggregatorPO.counter, "1");

                expect(await firstMarketBspBetSegmentsPO.leftValue.getText()).toBe("SP");
              });
            });
          });
        });
      });
    });

    describe("and the user clicks on market name", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getGenericLayout(BFF_GENERIC_VIEW_PAGE_MOCK));
        await mockService.mockHttpRequest(getCardResults(BFF_CARDS_MOCK));

        await firstCounterAggregatorPO.title.click();

        await browser.waitUntilDisplayed(bottomSheetPO.element, "Bottom Sheet panel not visible");
        await browser.waitUntilDisplayed(footballScoreboardPO.element, "Football Scoreboard not visible");
        await browser.waitUntilDisplayed(bottomSheetMarketPagePO.element, "Bottom Sheet Market Page not visible");
        await browser.waitUntilDisplayed(footerPO.element, "Bottom Sheet Regulatory Section not visible");
      });

      it("[PRPI-5587] should open the bottom sheet with the market", async () => {
        expect(await bottomSheetPO.element.isDisplayedInViewport()).toBe(true);
      });

      it("[PRPI-5588] the bottom sheet should display the 'Match Odds' title", async () => {
        expect(await bottomSheetPO.headerTitle.getText()).toBe("Match Odds");
      });

      it("[PRPI-5589] the bottom sheet should display the close", async () => {
        expect(await bottomSheetPO.closeButton.isDisplayed()).toBe(true);
      });

      it("[PRPI-5590] the market card should be displayed", async () => {
        expect(await bottomSheetMarketPagePO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-5591] the regulatory footer should be displayed", async () => {
        expect(await footerFirstSection.isDisplayed()).toBe(true);
        expect(await footerFirstSection.getText()).toBe(
          "Gambling can be addictive, please play responsibly. Regulatory footer words here",
        );
      });

      it("[PRPI-5592] the scoreboard should be displayed", async () => {
        expect(await footballScoreboardPO.element.isDisplayed()).toBe(true);
        expect(await footballScoreboardPO.homeTeam.getText()).toBe("Sporting Lisbon");
        expect(await footballScoreboardPO.awayTeam.getText()).toBe("Rio Ave");
      });
    });

    describe("the correct score market", () => {
      it("[PRPI-5593] should display 1 unmatched bet", async () => {
        expect(await secondCounterAggregatorPO.counter.getText()).toBe("1");
        expect(await secondMarketFirstMarketBetSelectionCardPO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-10526] the unmatched bet should display the 'LAY' label", async () => {
        expect(await secondMarketFirstMarketBetSelectionDetailsPO.side.getText()).toBe("LAY");
      });

      it("[PRPI-10527] the unmatched bet should display the edit and cancel buttons", async () => {
        expect(await secondMarketFirstMarketBetSelectionDetailsPO.editButton.isDisplayed()).toBe(true);
        expect(await secondMarketFirstMarketBetSelectionDetailsPO.removeButton.isDisplayed()).toBe(true);
      });

      it("[PRPI-10528] should display the odds, stake, liability and profit", async () => {
        expect(await secondMarketFirstMarketBetSegmentsPO.leftLabel.getText()).toBe("Odds");
        expect(await secondMarketFirstMarketBetSegmentsPO.leftValue.getText()).toBe("4.91");
        expect(await secondMarketFirstMarketBetSegmentsPO.midLabel.getText()).toBe("Backer's Stake");
        expect(await secondMarketFirstMarketBetSegmentsPO.midValue.getText()).toBe("$1.00");
        expect(await secondMarketFirstMarketBetSegmentsPO.midRightLabel.getText()).toBe("Liability");
        expect(await secondMarketFirstMarketBetSegmentsPO.midRightValue.getText()).toBe("$3.91");
        expect(await secondMarketFirstMarketBetSegmentsPO.rightLabel.getText()).toBe("Profit");
        expect(await secondMarketFirstMarketBetSegmentsPO.rightValue.getText()).toBe("$4.00");
      });

      // TODO - when cancelling the bet, the market is still displayed (to be fixed in STSIER-929)
      xdescribe("and when cancelling the unmatched bet", () => {
        const SECOND_MARKET_NO_BETS = {
          __typename: "MarketBetCardGroup",
          edges: [],
        };

        const BFF_NO_BETS_CARDS_UPDATES = getMyBetsEXCCardResults([SECOND_MARKET_NO_BETS], {
          eventId: 1111111111,
          marketId: "2.22222222",
        });

        const ETX_CANCEL = {
          marketId: "2.22222222",
          status: "SUCCESS",
          sizeCancelled: 1,
          cancelledDate: "2020-01-21T13:43:32.000Z",
          instructionReports: [
            {
              betId: "666666666666",
            },
          ],
        };

        beforeAll(async () => {
          await mockService.mockHttpRequest(getCardResults(BFF_NO_BETS_CARDS_UPDATES));
          await mockService.mockHttpRequest(getCancelBetResponse(ETX_CANCEL));

          await secondMarketFirstMarketBetSelectionDetailsPO.removeButton.waitForClickable();
          await secondMarketFirstMarketBetSelectionDetailsPO.removeButton.click();
        });

        // TODO: Adapt this test to have the future update message on market level
        it("[PRPI-5594] the market should no longer be visible", async () => {
          await browser.waitUntilArrayLength(secondMarketBetCardGroupPO.groupItems, (length) => length === 0);
        });
      });
    });
  });
});
