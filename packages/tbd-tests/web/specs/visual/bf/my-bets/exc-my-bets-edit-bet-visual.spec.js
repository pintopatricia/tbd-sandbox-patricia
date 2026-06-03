const {
  MyBetsPagePO,
  MarketPagePO,
  ExchangeInlineEditPanelPO,
  BetSelectionDetailsPO,
} = require("../../../../page-objects");

const { getMyBetsLayout, getMarketLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const BetCardGroupPO = require("@ppb/tbd-shared/components/BetCardGroup/BetCardGroup.web.po");
const MarketBetSelectionCardGroupPO = require("@ppb/tbd-shared/components/MarketBetSelectionCardGroup/MarketBetSelectionCardGroup.web.po");
const MarketBetSelectionCardPO = require("@ppb/tbd-shared/components/MarketBetSelectionCard/MarketBetSelectionCard.web.po");
const { getMyBetsEXCViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const { getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;

const { getIndexHTML } = require("../../mocks/webserver/webserver-controller");
const { getMockFonts } = require("../../mocks/fonts/fonts-controller");
const { getCustomerBehaviourService } = require("../../mocks/cbs/cbs-controller");

const routes = require("../../../utils/routes");
const MockService = require("../../helpers/mocking-service");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();
const marketPagePO = new MarketPagePO();

const firstBetCardGroupPO = new BetCardGroupPO(myBetsPO.betCardGroups[0]);
const firstMarketBetSelectionCardGroupPO = new MarketBetSelectionCardGroupPO(myBetsPO.betCardGroups[0]);
const firstMarketBetSelectionCardPO = new MarketBetSelectionCardPO(firstMarketBetSelectionCardGroupPO.groupItems[0]);

const firstMarketBetSelectionDetailsPO = new BetSelectionDetailsPO(firstMarketBetSelectionCardPO.betSelectionDetails);

const exchangeInlineEditPanelPO = new ExchangeInlineEditPanelPO();

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

const MATCH_ODDS_ERO_MOCK = [
  {
    marketId: "1.11111111",
    runners: [
      {
        selectionId: "55555555",
        availableToBack: [
          {
            price: 9.4,
            size: 26.05,
          },
        ],
        availableToLay: [
          {
            price: 21.0,
            size: 5.0,
          },
        ],
      },
      {
        selectionId: "66666666",
        availableToBack: [
          {
            price: 11.0,
            size: 119.64,
          },
        ],
        availableToLay: [
          {
            price: 10.0,
            size: 5.0,
          },
        ],
      },
      {
        selectionId: "44444444",
        availableToBack: [
          {
            price: 11.0,
            size: 54.29,
          },
        ],
        availableToLay: [
          {
            price: 200.0,
            size: 1.0,
          },
        ],
      },
      {
        selectionId: "13496400",
        availableToBack: [
          {
            price: 11.5,
            size: 52.85,
          },
        ],
        availableToLay: [
          {
            price: 10.0,
            size: 3.25,
          },
        ],
      },
    ],
  },
];

const POSITION_VIEWS_MOCK = {
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
              placedDate: "2023-08-23T14:53:14.000Z",
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

const RUNNERS_MOCK = [
  {
    name: "Sporting Lisbon",
    selectionId: 44444444,
    runnerURN: "ppb:excRunner:1.11111111/44444444/0",
  },
  {
    name: "Draw",
    selectionId: 55555555,
    runnerURN: "ppb:excRunner:1.11111111/55555555/0",
  },
  {
    name: "Rio Ave",
    selectionId: 66666666,
    runnerURN: "ppb:excRunner:1.11111111/66666666/0",
  },
];

const EXCHANGE_MARKET_MOCK = {
  __typename: "ExchangeMarket",
  urn: "ppb:excMarket:1.11111111",
  liveData: {
    totalMatched: 1170.4098467653773,
    exchangeMarketStatus: "OPEN",
    inplay: "false",
  },
  name: "Winner",
  marketType: "WINNER",
  marketTypeName: null,
  hierarchy: {
    __typename: "EventCompetitionHierarchy",
    sportevent: {
      __typename: "SportsEvent",
      urn: "ppb:event:1111111111",
      eventId: 1111111111,
      name: "Sporting Lisbon v Rio Ave",
      openDate: "2024-06-20T11:00:00.000Z",
      competition: {
        __typename: "Competition",
        urn: "ppb:competition:12593221",
        name: "Sporting Lisbon v Rio Ave",
        competitionId: 12593221,
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
      urn: "ppb:competition:12593221",
      name: "Sporting Lisbon v Rio Ave",
      competitionId: 12593221,
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
  runners: RUNNERS_MOCK,
  marketRulesViewLink: {
    viewUrn: "ppb:tbd:view:marketRules:1.11111111",
    viewUrl: "",
  },
};

const RUNNER_VIEW_LINKS_MOCK = [
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
];

const MARKET_EXTENDED_CARD_MOCK = {
  node: {
    __typename: "MarketExtendedCard",
    urn: "ppb:tbd:card:marketExtended:1.11111111|0|false|false|false|0",
    cardTitle: "Winner",
    numberOfItemsToDisplay: null,
    viewLinks: [],
    defaultIndex: 0,
    displayRunners: {
      exchange: {
        market: EXCHANGE_MARKET_MOCK,
        runners: RUNNERS_MOCK,
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
          value: null,
          profit: null,
          status: "UNAVAILABLE",
        },
      ],
    },
    runnerViewLinks: RUNNER_VIEW_LINKS_MOCK,
    isRunnerExpandable: null,
    raceViewLink: null,
    marketPromo: null,
  },
};

const MARKET_EXTENDED_CARD_PARTIALS_MOCK = {
  node: {
    __typename: "MarketExtendedCard",
    urn: "ppb:tbd:card:marketExtended:1.11111111|0|false|false|false|0",
  },
};

const BFF_MATCH_ODDS_MARKET_PAGE_MOCK = {
  __typename: "MarketView",
  urn: "ppb:tbd:view:market:1.11111111",
  url: "Football/us-open-2024/winner/mwe-1.11111111",
  canonicalUrl: "/exchange/plus/Football/market/1.11111111",
  mainMarket: EXCHANGE_MARKET_MOCK,
  edges: [MARKET_EXTENDED_CARD_MOCK],
  partialEdges: [MARKET_EXTENDED_CARD_PARTIALS_MOCK],
};

const MODULE_NAME = "my_bets_exc";

describe("My Bets Page - Edit Unmatched Bet", () => {
  describe("when the user opens the my bets page with one unmatched bet", () => {
    beforeAll(async () => {
      await mockService.mockFonts(getMockFonts());

      await mockService.mockHttpRequest(getCustomerBehaviourService());
      await mockService.mockHttpRequest(await getIndexHTML(VIEW_UNMATCHED_FOOTBALL_MOCK.urn));
      await mockService.mockHttpRequest(getMyBetsLayout(VIEW_UNMATCHED_FOOTBALL_MOCK));
      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
      await browser.url(routes.getMyBetsViewUrl("open"));

      await browser.waitUntilDisplayed(firstBetCardGroupPO.element, "Bet Card Group not visible");
      await browser.waitUntilDisplayed(firstMarketBetSelectionCardPO.element, "Bet selection not visible");
      await browser.waitUntilDisplayed(firstMarketBetSelectionDetailsPO.editButton, "Edit Button not visible");
    });

    describe("and the user clicks to edit it", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMarketLayout(BFF_MATCH_ODDS_MARKET_PAGE_MOCK));
        await mockService.mockHttpRequest(getMarkets(MATCH_ODDS_ERO_MOCK));
        await mockService.mockHttpRequest(getMarketPositionViews(POSITION_VIEWS_MOCK));

        await firstMarketBetSelectionDetailsPO.editButton.waitForClickable();
        await firstMarketBetSelectionDetailsPO.editButton.click();
        await browser.waitUntilDisplayed(marketPagePO.element, "Market Page not visible");
        await browser.waitUntilInViewport(
          exchangeInlineEditPanelPO.element,
          "Exchange Inline Edit Panel not in viewport",
        );

        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1421]_should_open_the_market_view_page_with_the_inline_bet_panel_opened`,
        );
      });

      it("[PRPI-1421]_should_open_the_market_view_page_with_the_inline_bet_panel_opened", async () => {
        expect(
          await browser.checkScreen(
            `${MODULE_NAME}_[PRPI-1421]_should_open_the_market_view_page_with_the_inline_bet_panel_opened`,
          ),
        ).toBe(0);
      });
    });
  });
});
