const { getMyBetsEXCViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const {
  getAppContext,
  getMyBetsLayout,
  getHomeLayoutWithViewLink,
  getCardResults,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const { swipeToBottom } = require("../../../../helpers/gestures");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const {
  MyBetsScreenSO,
  SectionElementsSO,
  FootballScoreboardSO,
  TeamsSO,
  TeamSO,
} = require("../../../../screen-objects");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsSO = new MyBetsScreenSO();
const regulatorySections = new SectionElementsSO();

const firstHeaderSO = new FootballScoreboardSO(myBetsSO.betCardGroups[0]);
const teamsSO = new TeamsSO(myBetsSO.betCardGroups[1]);
const firstTeam = new TeamSO(teamsSO.firstTeam);
const secondTeam = new TeamSO(teamsSO.secondTeam);

const FIRST_REQUEST_AGG_MOCK = [
  {
    aggregatorDesc: "Newcastle v Liverpool",
    edges: [
      {
        __typename: "FixtureCard",
        homeName: "Newcastle",
        awayName: "Liverpool",
      },
      {
        __typename: "MarketBetCardGroup",
        edges: [
          {
            __typename: "MarketBetCard",
            description: "Match Odds",
            numOfOrders: 1,
            liability: 1,
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
                    placedDate: "2023-08-23T10:13:14.000Z",
                    settledDate: null,
                    matchedDate: "2023-08-23T10:13:14.000Z",
                    price: 2.28,
                    priceMatched: 2.28,
                    runnerDesc: "Newcastle",
                    side: "BACK",
                    size: 1,
                    profit: 1.28,
                    selectionId: 25422,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    aggregatorDesc: "US Open 2023",
    edges: [
      {
        __typename: "EventHeaderCard",
        title: "US Open 2023",
        date: "2023-04-15T15:50:00.000Z",
      },
      {
        __typename: "MarketBetCardGroup",
        edges: [
          {
            __typename: "MarketBetCard",
            description: "Winner",
            numOfOrders: 1,
            liability: 1,
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
                    id: "315519424936",
                    handicap: 0,
                    placedDate: "2023-08-02T09:21:26.000Z",
                    settledDate: null,
                    matchedDate: "2023-08-02T09:21:26.000Z",
                    price: 9,
                    priceMatched: 9,
                    runnerDesc: "Scottie Scheffler",
                    side: "BACK",
                    size: 1,
                    profit: 8,
                    selectionId: 14753595,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    aggregatorDesc: "US Open 2024",
    edges: [
      {
        __typename: "EventHeaderCard",
        title: "US Open 2024",
        date: "2023-04-15T15:50:00.000Z",
      },
      {
        __typename: "MarketBetCardGroup",
        edges: [
          {
            __typename: "MarketBetCard",
            description: "Winner",
            numOfOrders: 1,
            liability: 1,
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
                    id: "315519424937",
                    handicap: 0,
                    placedDate: "2023-08-02T09:21:26.000Z",
                    settledDate: null,
                    matchedDate: "2023-08-02T09:21:26.000Z",
                    price: 9,
                    priceMatched: 9,
                    runnerDesc: "Scottie Scheffler",
                    side: "BACK",
                    size: 1,
                    profit: 8,
                    selectionId: 14753599,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    aggregatorDesc: "Sporting v Benfica",
    edges: [
      {
        __typename: "FixtureCard",
        homeName: "Sporting",
        awayName: "Benfica",
      },
      {
        __typename: "MarketBetCardGroup",
        edges: [
          {
            __typename: "MarketBetCard",
            description: "Match Odds",
            numOfOrders: 1,
            liability: 1,
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
                    id: "322311028613",
                    handicap: 0,
                    placedDate: "2023-08-23T10:13:14.000Z",
                    settledDate: null,
                    matchedDate: "2023-08-23T10:13:14.000Z",
                    price: 2.28,
                    priceMatched: 2.28,
                    runnerDesc: "Sporting",
                    side: "BACK",
                    size: 1,
                    profit: 1.28,
                    selectionId: 25422,
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

const SECOND_REQUEST_AGG_MOCK = [
  {
    aggregatorDesc: "Newcastle v Liverpool",
    edges: [
      {
        __typename: "FixtureCard",
        homeName: "Newcastle",
        awayName: "Liverpool",
      },
      {
        __typename: "MarketBetCardGroup",
        edges: [
          {
            __typename: "MarketBetCard",
            description: "Match Odds",
            numOfOrders: 1,
            liability: 1,
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
                    id: "422311028610",
                    handicap: 0,
                    placedDate: "2023-08-23T10:13:14.000Z",
                    settledDate: null,
                    matchedDate: "2023-08-23T10:13:14.000Z",
                    price: 2.28,
                    priceMatched: 2.28,
                    runnerDesc: "Newcastle",
                    side: "BACK",
                    size: 1,
                    profit: 1.28,
                    selectionId: 25422,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    aggregatorDesc: "US Open 2023",
    edges: [
      {
        __typename: "EventHeaderCard",
        title: "US Open 2023",
        date: "2023-04-15T15:50:00.000Z",
      },
      {
        __typename: "MarketBetCardGroup",
        edges: [
          {
            __typename: "MarketBetCard",
            description: "Winner",
            numOfOrders: 1,
            liability: 1,
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
                    id: "415519424936",
                    handicap: 0,
                    placedDate: "2023-08-02T09:21:26.000Z",
                    settledDate: null,
                    matchedDate: "2023-08-02T09:21:26.000Z",
                    price: 9,
                    priceMatched: 9,
                    runnerDesc: "Scottie Scheffler",
                    side: "BACK",
                    size: 1,
                    profit: 8,
                    selectionId: 14753595,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    aggregatorDesc: "US Open 2024",
    edges: [
      {
        __typename: "EventHeaderCard",
        title: "US Open 2024",
        date: "2023-04-15T15:50:00.000Z",
      },
      {
        __typename: "MarketBetCardGroup",
        edges: [
          {
            __typename: "MarketBetCard",
            description: "Winner",
            numOfOrders: 1,
            liability: 1,
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
                    id: "415519424937",
                    handicap: 0,
                    placedDate: "2023-08-02T09:21:26.000Z",
                    settledDate: null,
                    matchedDate: "2023-08-02T09:21:26.000Z",
                    price: 9,
                    priceMatched: 9,
                    runnerDesc: "Scottie Scheffler",
                    side: "BACK",
                    size: 1,
                    profit: 8,
                    selectionId: 14753599,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    aggregatorDesc: "Sporting v Benfica",
    edges: [
      {
        __typename: "FixtureCard",
        homeName: "Sporting",
        awayName: "Benfica",
      },
      {
        __typename: "MarketBetCardGroup",
        edges: [
          {
            __typename: "MarketBetCard",
            description: "Match Odds",
            numOfOrders: 1,
            liability: 1,
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
                    id: "422311028613",
                    handicap: 0,
                    placedDate: "2023-08-23T10:13:14.000Z",
                    settledDate: null,
                    matchedDate: "2023-08-23T10:13:14.000Z",
                    price: 2.28,
                    priceMatched: 2.28,
                    runnerDesc: "Sporting",
                    side: "BACK",
                    size: 1,
                    profit: 1.28,
                    selectionId: 25422,
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

const THIRD_REQUEST_AGG_MOCK = [
  {
    aggregatorId: 3111111110,
    aggregatorDesc: "USA - Presidential Election 2026",
    edges: [
      {
        __typename: "EventHeaderCard",
        title: "USA - Presidential Election 2024",
        date: "2023-04-15T15:50:00.000Z",
      },
      {
        __typename: "MarketBetCardGroup",
        edges: [
          {
            __typename: "MarketBetCard",
            description: "Democratic Nominee",
            numOfOrders: 1,
            liability: 1,
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
                    id: "308347007290",
                    handicap: 0,
                    placedDate: "2023-05-23T10:02:07.000Z",
                    settledDate: null,
                    matchedDate: "2023-05-23T10:02:07.000Z",
                    price: 1.37,
                    priceMatched: 1.37,
                    runnerDesc: "Joe Biden",
                    side: "BACK",
                    size: 1,
                    profit: 0.37,
                    selectionId: 6816445,
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

const FIRST_REQUEST_VIEW_MOCK = getMyBetsEXCViewMock(FIRST_REQUEST_AGG_MOCK, {
  isOpenMatched: true,
  hasNextPage: true,
});

const SECOND_REQUEST_VIEW_MOCK = getMyBetsEXCViewMock(SECOND_REQUEST_AGG_MOCK, {
  isOpenMatched: true,
  hasNextPage: true,
  cursor: "PA==",
  isPagination: true,
});

const THIRD_REQUEST_VIEW_MOCK = getMyBetsEXCViewMock(THIRD_REQUEST_AGG_MOCK, {
  isOpenMatched: true,
  isPagination: true,
  hasFooter: true,
});

// It was not necessary to be onto matched
const MY_BETS_URL = routes.getMyBetsViewUrl("open", { matchedStatus: "matched" });
const MY_BETS_URN = routes.getMyBetsURN("open", { matchedStatus: "matched" });

describe("My Bets Page - Exchange Pagination", () => {
  describe("When the user enter on my bets page", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getAppContext({}));
      // Register pagination mock FIRST so MockServer evaluates it before the broad mock (FIFO order, same priority)
      // MyBetsView on exchange dispatch 2 requests on load
      await mockService.mockHttpRequest(getMyBetsLayout(SECOND_REQUEST_VIEW_MOCK, { cursorFilter: "NA==" }));
      await mockService.mockHttpRequest(getMyBetsLayout(FIRST_REQUEST_VIEW_MOCK));

      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));

      const HOME_VIEW_LINK = getStartViewLink(MY_BETS_URL);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK, MY_BETS_URN));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

      await browser.waitUntilDisplayed(firstHeaderSO.element, "First Header not visible (Score Board)");
    });

    it("[PRPI-1856] should display 2 bet card groups", async () => {
      expect(await myBetsSO.betCardGroups.length).toBe(2);
    });

    it("[PRPI-1857] should not display the footer", async () => {
      expect(await regulatorySections.element.isDisplayed()).toBe(false);
    });

    describe("and when the user scrolls the page", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMyBetsLayout(THIRD_REQUEST_VIEW_MOCK), { cursorFilter: "PA==" });

        await swipeToBottom();

        await browser.waitUntilDisplayed(regulatorySections.element, "The footer is not visible");
      });

      it("[PRPI-1858] should display the third bet card groud", async () => {
        expect(await firstTeam.name.getText()).toBe("FONTWELL");
        expect(await secondTeam.name.getText()).toBe("USA - Presidential Election 2024");
      });

      it("[PRPI-1859] should display the footer", async () => {
        expect(await regulatorySections.element.isDisplayed()).toBe(true);
      });
    });
  });
});
