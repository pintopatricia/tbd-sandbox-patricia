const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const { getAppContext, getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");

const { BottomBarSO, CardSO } = require("../../../../screen-objects");
const { HEADER_ITEMS_MOCK, GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const MODULE_NAME = "my_bets_page";

const mockService = new MockService();

const cardSO = new CardSO();
const buildPrice = (price) => ({
  decimal: price,
  fractional: {
    numerator: price * 100,
    denominator: 100,
  },
});

const SBK_SINGLE_FOOTBALL_MOCK = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    isOpen: true,
    currentSize: 0.1,
    profitAndLoss: 0.17,
    betId: "32483331",
    edges: {
      legCardGroups: [
        {
          legs: [
            {
              parts: [
                {
                  sportId: "1",
                  price: buildPrice(1.65),
                  originalPrice: buildPrice(1.65),
                  priceType: "LIVE",
                  eventUrn: "ppb:event:32483335",
                  eventDescription: "Man Utd v Chelsea",
                  eventMarketDescription: "Over/Under Total Goals 3.5",
                  selectionName: "Man Utd",
                },
              ],
            },
          ],

          footballFixture: {
            homeName: "Man Utd",
            awayName: "Chelsea",
            scheduledAt: "2023-05-25T19:00:00.000Z",
            eventId: "32483335",
          },
        },
      ],

      betInfo: {
        betReceiptId: "O/11037374/0002965",
        placedDate: "2023-04-21T09:45:41.000Z",
        deviceId: "Mobile - App",
      },
    },
  },
]);

const SCA_INPLAY_MOCK = {
  fixture: [
    {
      eventId: "32483335",
      scheduledAt: "2023-07-14T13:00:00Z",
      score: {
        home: 1,
        away: 0,
      },
      duration: {
        period: "REGULAR",
        status: "INPLAY_FIRST_HALF",
        stoppageMinutes: null,
        clock: {
          minute: 43,
          second: 56,
        },
      },
      penaltyShootout: null,
      stats: [
        {
          period: "REGULAR",
          periodStatus: "INPLAY_FIRST_HALF",
          home: {
            goals: 1,
          },
          away: {
            goals: 0,
          },
        },
        {
          period: "REGULAR",
          periodStatus: "INPLAY_SECOND_HALF",
          home: {
            goals: 1234,
          },
          away: {
            goals: 0,
          },
        },
      ],
    },
  ],
};

// Tennis Mock
const BET_LEG = [
  {
    type: "SS",
    result: "PLACED",
    parts: [
      {
        price: {
          decimal: 1.86,
        },
        marketBetUrn: "ppb:marketBet:924.237747664",
        eventDescription: "Reeves/OtherGuyFromTheMatrix v Keeves/GuyFromFriends",
        eventMarketDescription: "Match Odds",
        selectionName: "Reeves",
        startTime: "2020-07-27T19:00:00.000Z",
        rule4Deductions: 5.5,
      },
    ],
  },
];

const SBK_BET_CARD_FULL = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:926229536",
    navigationLinks: [
      {
        marketBetUrn: "ppb:marketBet:924.237747664",
      },
    ],

    bet: {
      urn: "ppb:sbkBet:926229536",
      betReceiptId: "O/4275336/0021305",
      profitAndLoss: 0.22,
      isSettled: true,
      betType: "SGL",
      currentSize: 0.12,
      result: "CASHED_OUT",
      legs: BET_LEG,
      bonus: 1,
    },
  },
};

const SBK_BET_CARD_PARTIALS = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:926229536",
  },
};

const BET_INFO_ID = {
  __typename: "SportsbookBetInfoCard",
  urn: "ppb:tbd:card:sbkBetInfo:1179447017",
};

const SBK_BET_CARD_TENNIS_SCOREBOARD_IN_PLAY_FIXTURE = {
  node: {
    __typename: "FixtureCard",
    urn: "ppb:tbd:card:fixture:31111111|viewLink|0",
    sportevent: {
      urn: "ppb:event:31111111",
      name: "Reeves/OtherGuyFromTheMatrix v Keeves/GuyFromFriends",
    },
    fixture: {
      __typename: "TennisMatch",
      urn: `ppb:fixture:31111111`,
      runnerNames: {
        home: "Reeves/OtherGuyFromTheMatrix",
        away: "Keeves/GuyFromFriends",
      },
      scheduledStartTime: "2032-01-16T20:00:00Z",
      matchStatus: {
        status: "IN_RUNNING",
        reason: null,
      },
      teamA: {
        side: "HOME",
        players: [
          { name: "Keanu Reeves", rank: 420 },
          { name: "The OtherGuyFromTheMatrix", rank: 69 },
        ],
      },
      teamB: {
        side: "AWAY",
        players: [
          { name: "Reanu Keeves", rank: 69 },
          { name: "That GuyFromFriends", rank: 69 },
        ],
      },
    },
  },
};

const SBK_BET_CARD_TENNIS_SCOREBOARD_IN_PLAY_PARTIALS_FIXTURE = {
  node: {
    __typename: "FixtureCard",
    urn: "ppb:tbd:card:fixture:31111111|viewLink|0",
  },
};

const BET_LEG_CARD_TENNIS_FIRST_PARTIAL = {
  __typename: "BetLegCard",
  urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
};

const BET_LEG_CARD_TENNIS_FIRST = {
  ...BET_LEG_CARD_TENNIS_FIRST_PARTIAL,
  betUrn: "ppb:sbkBet:926229536",
  leg: SBK_BET_CARD_FULL.node.bet.legs[0],
};

const FIRST_LEG_CARD_GROUP_TENNIS_PARTIAL = {
  __typename: "SportsbookBetLegCardGroup",
  urn: "ppb:tbd:cardgroup:sbkBetLeg:926229536/0",
};

const BET_EXPANDABLE_LEGS_TENNIS_PARTIAL = {
  __typename: "SportsbookExpandableLegCardGroup",
  urn: "ppb:tbd:cardgroup:sbkExpandableLeg:926229536",
};

const BET_EXPANDABLE_LEGS_TENNIS = {
  ...BET_EXPANDABLE_LEGS_TENNIS_PARTIAL,
  full: {
    edges: [
      {
        node: {
          ...FIRST_LEG_CARD_GROUP_TENNIS_PARTIAL,
          full: {
            edges: [{ node: BET_LEG_CARD_TENNIS_FIRST }, SBK_BET_CARD_TENNIS_SCOREBOARD_IN_PLAY_FIXTURE],
          },
          partials: {
            partialEdges: [
              { node: BET_LEG_CARD_TENNIS_FIRST_PARTIAL },
              SBK_BET_CARD_TENNIS_SCOREBOARD_IN_PLAY_PARTIALS_FIXTURE,
            ],
          },
        },
      },
      {
        node: {
          ...BET_INFO_ID,
          betReceiptId: "O/4275336/0021305",
        },
      },
    ],
  },
  partials: {
    partialEdges: [{ node: FIRST_LEG_CARD_GROUP_TENNIS_PARTIAL }, { node: BET_INFO_ID }],
  },
};

const BETCARD_GROUP_CARDS_SBK_BET_TENNIS_SCOREBOARD_IN_PLAY = {
  node: {
    __typename: "BetCardGroup",
    urn: "ppb:tbd:card:bet:group:926229536|sbk",
    full: {
      edges: [SBK_BET_CARD_FULL, { node: BET_EXPANDABLE_LEGS_TENNIS }],
    },
    partials: {
      partialEdges: [SBK_BET_CARD_PARTIALS, { node: BET_EXPANDABLE_LEGS_TENNIS_PARTIAL }],
    },
  },
};

const SCA_MOCK_TENNIS = {
  match: [
    {
      matchStatus: {
        status: "IN_RUNNING",
        reason: null,
      },
      teamAScore: "1",
      teamBScore: "1",
      currentSet: {
        teamAScore: "15",
        teamBScore: "0",
        currentGame: {
          teamAScore: "15",
          teamBScore: "30",
          teamServing: "HOME",
          type: "NORMAL",
        },
      },
    },
  ],
};

const BFF_MY_BETS_MOCK_TENNIS_INPLAY = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  url: "mybets/myBets-open",
  filters: {
    orderType: {
      items: ["OPEN", "SETTLED"],
      defaultIndex: 0,
    },
    productType: {
      items: ["SPORTSBOOK"],
      defaultIndex: 1,
    },
  },
  edges: [BETCARD_GROUP_CARDS_SBK_BET_TENNIS_SCOREBOARD_IN_PLAY],
  pageInfo: {
    hasNextPage: "true",
    endCursor: "NA==",
  },
  headerItems: HEADER_ITEMS_MOCK,
};

const browseToMyBets = async () => {
  await browser.waitUntilClickableNative(BottomBarSO.home, "Home button is not clickable");
  await BottomBarSO.home.click();
  await browser.waitUntilClickableNative(BottomBarSO.myBets);
  await BottomBarSO.myBets.click();

  await browser.waitUntilDisplayed(cardSO.element);
  await browser.waitUntilClickableNative(cardSO.element);

  await cardSO.header.click();
  await browser.waitUntilDisplayed(cardSO.contentWrapper);
};

describe("My Bets Page - Brazil Jurisdiction", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      getAppContext({
        products: ["SPORTSBOOK"],
        jurisdiction: "BRAZIL",
      }),
    );
    await mockService.mockHttpRequest(getMyBetsLayout(SBK_SINGLE_FOOTBALL_MOCK));
    await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
    await startApp("home");
  });

  describe("and is a Football bet", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_MOCK));

      await browseToMyBets();

      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-4845]_date_and_time_in_footballscoreboard_and_device_ID_in_the_BetInfo_should_be_displayed_for_brazil_jurisdiction`,
      );
    });

    it("[PRPI-4845]_date_and_time_in_footballscoreboard_and_device_ID_in_the_BetInfo_should_be_displayed_for_brazil_jurisdiction", async () => {
      expect(
        (
          await browser.compareScreen(
            `${MODULE_NAME}_[PRPI-4845]_date_and_time_in_footballscoreboard_and_device_ID_in_the_BetInfo_should_be_displayed_for_brazil_jurisdiction`,
          )
        ).misMatchPercentage,
      ).toEqual(0);
    });
  });

  describe("and is a Tennis bet", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK_TENNIS_INPLAY));
      await mockService.mockHttpRequest(getScaResponse(SCA_MOCK_TENNIS));

      await browseToMyBets();

      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-4846]_date_and_time_in_avbscoreboard_should_be_displayed_brazil_jurisdiction`,
      );
    });

    it("[PRPI-4846]_date_and_time_in_avbscoreboard_should_be_displayed_brazil_jurisdiction", async () => {
      expect(
        (
          await browser.compareScreen(
            `${MODULE_NAME}_[PRPI-4846]_date_and_time_in_avbscoreboard_should_be_displayed_brazil_jurisdiction`,
          )
        ).misMatchPercentage,
      ).toEqual(0);
    });
  });
});
