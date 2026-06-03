const {
  CounterAggregatorPO,
  MyBetsPagePO,
  CardPO,
  PrimaryButtonPO,
  BetSelectionDetailsPO,
  BetSegmentsPO,
  BottomSheetPO,
  MarketPagePO,
  FooterPO,
  FootballScoreboardPO,
  SectionElementsPO,
} = require("../../../../page-objects");

const { getMyBetsLayout, getCardResults, getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getQuote } = require("@flutter-global/uki-channels-http-clients/mock-index").CASHOUT;

const BetCardGroupPO = require("@ppb/tbd-shared/components/BetCardGroup/BetCardGroup.web.po");
const MarketBetSelectionCardGroupPO = require("@ppb/tbd-shared/components/MarketBetSelectionCardGroup/MarketBetSelectionCardGroup.web.po");
const MarketBetSelectionCardPO = require("@ppb/tbd-shared/components/MarketBetSelectionCard/MarketBetSelectionCard.web.po");
const MarketBetCardGroupPO = require("@ppb/tbd-shared/components/MarketBetCardGroup/MarketBetCardGroup.web.po");
const MarketBetCardPO = require("@ppb/tbd-shared/components/MarketBetCard/MarketBetCard.web.po");

const { getMyBetsEXCViewMock, getMyBetsEXCCardResults } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");

const routes = require("../../../../../utils/routes");
const MockService = require("../../../../mock-essentials/mocking-service");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();
const bottomSheetPO = new BottomSheetPO();

const betCardGroupPO = new BetCardGroupPO(myBetsPO.betCardGroups[0]);

const marketBetCardGroupPO = new MarketBetCardGroupPO(betCardGroupPO.groupItems[1]);
const marketBetCardPO = new MarketBetCardPO(marketBetCardGroupPO.groupItems[0]);

const marketBetCardLiabilityBetSegmentsPO = new BetSegmentsPO(marketBetCardPO.liabilityContainer);

const primaryButtonPO = new PrimaryButtonPO();

const cardPO = new CardPO(marketBetCardGroupPO.groupItems[1]);
const counterAggregatorPO = new CounterAggregatorPO(marketBetCardPO.counterAggregator);

const marketBetSelectionCardGroupPO = new MarketBetSelectionCardGroupPO(marketBetCardGroupPO.groupItems[1]);

const firstMarketBetSelectionCardPO = new MarketBetSelectionCardPO(marketBetSelectionCardGroupPO.groupItems[0]);
const secondMarketBetSelectionCardPO = new MarketBetSelectionCardPO(marketBetSelectionCardGroupPO.groupItems[1]);

const firstBetSelectionDetailsPO = new BetSelectionDetailsPO(firstMarketBetSelectionCardPO.betSelectionDetails);
const secondBetSelectionDetailsPO = new BetSelectionDetailsPO(secondMarketBetSelectionCardPO.betSelectionDetails);

const firstBetSegmentsPO = new BetSegmentsPO(firstMarketBetSelectionCardPO.betSegments);
const secondBetSegmentsPO = new BetSegmentsPO(secondMarketBetSelectionCardPO.betSegments);

const bottomSheetMarketPagePO = new MarketPagePO(bottomSheetPO.content);
const footerPO = new FooterPO(bottomSheetPO.content);
const footballScoreboardPO = new FootballScoreboardPO(bottomSheetPO.headerContent);
const footerSectionPO = new SectionElementsPO(footerPO.sections[0]);
const footerFirstSection = footerSectionPO.items[0];

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
                    liability: 0.9,
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

describe("My Bets Page - EXC Matched Bets", () => {
  describe("When the user opens My Bets and has a Matched bet with cashout", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(VIEW_MATCHED_FOOTBALL_MOCK.urn, {
          products: ["exchange"],
        }),
      );
      await mockService.mockHttpRequest(getMyBetsLayout(VIEW_MATCHED_FOOTBALL_MOCK));
      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
      await mockService.mockHttpRequest(getQuote(VIEW_MATCHED_FOOTBALL_MOCK));

      await browser.url(routes.getMyBetsViewUrl("open", { matchedStatus: "matched" }));

      await browser.waitUntilDisplayed(betCardGroupPO.element, "Bet Card Group not visible");
      await browser.waitUntilDisplayed(marketBetCardGroupPO.element, "Market Bet card not visible");
      await browser.waitUntilDisplayed(primaryButtonPO.element, "Cash Out Button is not visible");
    });

    it("[PRPI-5526] should display the market name 'Match Odds'", async () => {
      expect(await counterAggregatorPO.title.getText()).toBe("Match Odds");
    });

    it("[PRPI-5527] should display the counter with '2'", async () => {
      expect(await counterAggregatorPO.counter.getText()).toBe("2");
    });

    it("[PRPI-5528] should display the liability value", async () => {
      expect(await marketBetCardLiabilityBetSegmentsPO.leftLabel.getText()).toBe("Liability");
      expect(await marketBetCardLiabilityBetSegmentsPO.leftValue.getText()).toBe("$1.00");
    });

    it("[PRPI-5529] should display the cashout button", async () => {
      expect(await primaryButtonPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-5530] should display the accordion collapsed", async () => {
      expect(await cardPO.content.isDisplayed()).toBe(false);
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

        await cardPO.header.waitForClickable();
        await cardPO.header.click();

        await browser.waitUntilDisplayed(cardPO.content, "Collapse is not expanded");
        await browser.waitUntilDisplayed(firstMarketBetSelectionCardPO.element, "First selection is not displayed");
        await browser.waitUntilDisplayed(secondMarketBetSelectionCardPO.element, "Second selection is not displayed");
      });

      describe("and for the first selection", () => {
        it("[PRPI-5531] should display the label 'Back'", async () => {
          expect(await firstBetSelectionDetailsPO.side.getText()).toBe("BACK");
        });

        it("[PRPI-5532] should display the selection name", async () => {
          expect(await firstBetSelectionDetailsPO.title.getText()).toBe("Rio Ave");
        });

        it("[PRPI-5533] should display the 'Odds' label with '2' value", async () => {
          expect(await firstBetSegmentsPO.leftLabel.getText()).toBe("Odds");
          expect(await firstBetSegmentsPO.leftValue.getText()).toBe("2");
        });

        it("[PRPI-5534] should display the 'Stake' label with '$1.00' value", async () => {
          expect(await firstBetSegmentsPO.midLabel.getText()).toBe("Stake");
          expect(await firstBetSegmentsPO.midValue.getText()).toBe("$1.00");
        });

        it("[PRPI-10515] should not display the liability", async () => {
          expect(await firstBetSegmentsPO.midRightLabel.isExisting()).toBe(false);
          expect(await firstBetSegmentsPO.midRightValue.isExisting()).toBe(false);
        });

        it("[PRPI-5535] should display the 'Profit' label with '$1.00' value", async () => {
          expect(await firstBetSegmentsPO.rightLabel.getText()).toBe("Profit");
          expect(await firstBetSegmentsPO.rightValue.getText()).toBe("$1.00");
        });

        it("[PRPI-5536] should not display the cashout info label", async () => {
          expect(await firstMarketBetSelectionCardPO.infoLabel.isDisplayed()).toBe(false);
        });
      });

      describe("and for the second selection", () => {
        it("[PRPI-5537] should display the label 'Lay'", async () => {
          expect(await secondBetSelectionDetailsPO.side.getText()).toBe("LAY");
        });

        it("[PRPI-5538] should display the selection name", async () => {
          expect(await secondBetSelectionDetailsPO.title.getText()).toBe("Rio Ave");
        });

        it("[PRPI-5539] should display the 'Odds' label with '2' value", async () => {
          expect(await secondBetSegmentsPO.leftLabel.getText()).toBe("Odds");
          expect(await secondBetSegmentsPO.leftValue.getText()).toBe("2");
        });

        it("[PRPI-5540] should display the 'Backer's Stake' label with '$0.90' value", async () => {
          expect(await secondBetSegmentsPO.midLabel.getText()).toBe("Backer's Stake");
          expect(await secondBetSegmentsPO.midValue.getText()).toBe("$0.90");
        });

        it("[PRPI-10516] should display the 'Liability' label with '$0.90' value", async () => {
          expect(await secondBetSegmentsPO.midRightLabel.getText()).toBe("Liability");
          expect(await secondBetSegmentsPO.midRightValue.getText()).toBe("$0.90");
        });

        it("[PRPI-5541] should display the 'Profit' label with '$1.10' value", async () => {
          expect(await secondBetSegmentsPO.rightLabel.getText()).toBe("Profit");
          expect(await secondBetSegmentsPO.rightValue.getText()).toBe("$1.10");
        });

        it("[PRPI-5542] should not display the cashout info label", async () => {
          expect(await secondMarketBetSelectionCardPO.infoLabel.isDisplayed()).toBe(false);
        });
      });
    });

    describe("and the user clicks on market name", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getGenericLayout(BFF_GENERIC_VIEW_PAGE_MOCK));
        await mockService.mockHttpRequest(getCardResults(BFF_CARDS_MOCK));

        await counterAggregatorPO.title.click();

        await browser.waitUntilDisplayed(bottomSheetPO.element, "Bottom Sheet Edit panel not visible");
        await browser.waitUntilDisplayed(footballScoreboardPO.element, "Football Scoreboard not visible");
        await browser.waitUntilDisplayed(bottomSheetMarketPagePO.element, "Bottom Sheet Market Page not visible");
        await browser.waitUntilDisplayed(footerPO.element, "Bottom Sheet Regulatory Section not visible");
      });

      it("[PRPI-4674] should open the bottom sheet with the market", async () => {
        expect(await bottomSheetPO.element.isDisplayedInViewport()).toBe(true);
      });

      it("[PRPI-4675] the bottom sheet should display the 'Match Odds' title", async () => {
        expect(await bottomSheetPO.headerTitle.getText()).toBe("Match Odds");
      });

      it("[PRPI-5543] the bottom sheet should display the close", async () => {
        expect(await bottomSheetPO.closeButton.isDisplayed()).toBe(true);
      });

      it("[PRPI-4677] the market card should be displayed", async () => {
        expect(await bottomSheetMarketPagePO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-5544] the regulatory footer should be displayed", async () => {
        expect(await footerFirstSection.isDisplayed()).toBe(true);
        expect(await footerFirstSection.getText()).toBe(
          "Gambling can be addictive, please play responsibly. Regulatory footer words here",
        );
      });

      it("[PRPI-4678] the scoreboard should be displayed", async () => {
        expect(await footballScoreboardPO.element.isDisplayed()).toBe(true);
        expect(await footballScoreboardPO.homeTeam.getText()).toBe("Sporting Lisbon");
        expect(await footballScoreboardPO.awayTeam.getText()).toBe("Rio Ave");
      });
    });
  });
});
