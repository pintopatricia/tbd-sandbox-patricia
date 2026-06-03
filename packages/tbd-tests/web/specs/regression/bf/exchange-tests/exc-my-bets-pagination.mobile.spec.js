const { MyBetsPagePO, FooterPO, EventHeaderPO, FootballScoreboardPO } = require("../../../../page-objects");

const { getMyBetsEXCViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();
const footerPO = new FooterPO();

const firstHeaderPO = new FootballScoreboardPO(myBetsPO.betCardGroups[0]);
const secondHeaderPO = new EventHeaderPO(myBetsPO.betCardGroups[1]);
const thirdHeaderPO = new EventHeaderPO(myBetsPO.betCardGroups[2]);
const fourthHeaderPO = new EventHeaderPO(myBetsPO.betCardGroups[3]);

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
    aggregatorDesc: "Italy (W) v Sweden (W)",
    edges: [
      {
        __typename: "FixtureCard",
        homeName: "Italy (W)",
        awayName: "Sweden (W)",
        scheduledAt: "2023-09-26T15:45:00Z",
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
                    id: "322407484803",
                    handicap: 0,
                    placedDate: "2023-09-26T14:54:20.000Z",
                    settledDate: null,
                    matchedDate: "2023-09-26T14:54:20.000Z",
                    price: 6,
                    matchedPrice: 6,
                    runnerDesc: "Sweden (W)",
                    side: "BACK",
                    size: 1,
                    profit: 5,
                    selectionId: 541860,
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
    aggregatorDesc: "USA - Presidential Election 2024",
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
  isPagination: true,
  hasFooter: true,
});
describe("My Bets Page - Exchange Pagination", () => {
  describe("When the user enter on my bets page", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(FIRST_REQUEST_VIEW_MOCK.urn));
      await mockService.mockHttpRequest(getMyBetsLayout(FIRST_REQUEST_VIEW_MOCK));
      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
      // It was not necessary to be onto matched
      await browser.url(routes.getMyBetsViewUrl("open", { matchedStatus: "matched" }));

      await browser.waitUntilDisplayed(firstHeaderPO.element, "First Header not visible (Score Board)");
      await browser.waitUntilDisplayed(secondHeaderPO.element, "Second Header not visible (1st Event Header)");
      await browser.waitUntilDisplayed(thirdHeaderPO.element, "Third Header not visible (2nd Event Header)");
    });

    it("[PRPI-5562] should display 3 bet card groups", async () => {
      expect(await myBetsPO.betCardGroups.length).toBe(3);
    });

    it("[PRPI-5563] should not display the footer", async () => {
      expect(await footerPO.element.isDisplayed()).toBe(false);
    });

    describe("and when the user scrolls the page", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMyBetsLayout(SECOND_REQUEST_VIEW_MOCK));
        await thirdHeaderPO.element.scrollIntoView({ block: "start" });
        await browser.waitUntilDisplayed(fourthHeaderPO.element, "Fourth Header not visible (3rd Event Header)");
        await browser.waitUntilDisplayed(footerPO.element, "The footer is not visible");
      });

      it("[PRPI-5564] should display 4 bet cards groups", async () => {
        expect(await myBetsPO.betCardGroups.length).toBe(4);
      });

      it("[PRPI-5565] should display the footer", async () => {
        expect(await footerPO.element.isDisplayed()).toBe(true);
      });
    });
  });
});
