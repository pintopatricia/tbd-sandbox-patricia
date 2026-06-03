const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const {
  getMyBetsLayout,
  getHomeLayoutWithViewLink,
  getAppContext,
  getCardResults,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");

const { getStartViewLink } = require("../../../../helpers/view-link-start");
const { startApp } = require("../../../../helpers/urls");
const { swipeDownElementFullscreen } = require("../../../../helpers/gestures");

const MY_BETS_SETTLED_URL = "mybets/settled/mb-736574746c6564";

const MockService = require("../../../../mock-essentials/mocking-service");
const {
  MyBetsScreenSO,
  AvBScoreboardSO,
  BetInfoSO,
  CardSO,
  FootballScoreboardSO,
  SportsbookBetPanelSO,
  BetInfoItemSO,
  CopyToClipboardSO,
} = require("../../../../screen-objects");
const { HEADER_ITEMS_MOCK, GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsSO = new MyBetsScreenSO();
const sbkBetPanelSO = new SportsbookBetPanelSO(myBetsSO.betCardGroups[0]);
const cardSO = new CardSO();

const footballScoreboardSO = new FootballScoreboardSO();
const avbScoreboardSO = new AvBScoreboardSO();
const betInfoSO = new BetInfoSO();
const thirdBetInfoItemSO = new BetInfoItemSO(betInfoSO.infoItems[2]);
const thirdCopyToClipboardSO = new CopyToClipboardSO(thirdBetInfoItemSO.element);

const buildPrice = (price) => ({
  decimal: price,
  fractional: {
    numerator: price * 100,
    denominator: 100,
  },
});

// Football Mock
const SCA_SETTLED_MOCK = {
  fixture: [
    {
      eventId: "32483335",
      scheduledAt: "2023-07-14T13:00:00Z",
      score: {
        home: 4,
        away: 0,
      },
      duration: {
        period: "REGULAR",
        status: "END",
        stoppageMinutes: null,
        clock: {
          minute: 90,
          second: 59,
        },
      },
      penaltyShootout: null,
      stats: [
        {
          period: "REGULAR",
          periodStatus: "FULL",
          home: {
            goals: 4,
          },
          away: {
            goals: 0,
          },
        },
      ],
    },
  ],
};

const SBK_FOOTBALL_SINGLE = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    betId: "32483333",
    isOpen: false,
    isSettled: true,
    result: "WON",
    profitAndLoss: 0.52,
    currentSize: 0.1,
    betPrice: buildPrice(1.95),
    edges: {
      legCardGroups: [
        {
          footballFixture: {
            homeName: "Newcastle",
            awayName: "Brighton",
            scheduledAt: "2023-07-14T13:00:00Z",
            eventId: "32483335",
          },
          legs: [
            {
              parts: [
                {
                  price: buildPrice(1.95),
                  originalPrice: buildPrice(1.95),
                  eventDescription: "Newcastle v Brighton",
                  selectionName: "Newcastle",
                },
              ],
            },
          ],
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
            edges: [SBK_BET_CARD_TENNIS_SCOREBOARD_IN_PLAY_FIXTURE, { node: BET_LEG_CARD_TENNIS_FIRST }],
          },
          partials: {
            partialEdges: [
              SBK_BET_CARD_TENNIS_SCOREBOARD_IN_PLAY_PARTIALS_FIXTURE,
              { node: BET_LEG_CARD_TENNIS_FIRST_PARTIAL },
            ],
          },
        },
      },
      { node: BET_INFO_ID },
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
  urn: "ppb:tbd:view:myBets:settled",
  url: "mybets/myBets-settled",
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

let firstLoad = true;

const browseToMyBets = async (MOCK) => {
  await mockService.mockHttpRequest(getMyBetsLayout(MOCK));
  await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));

  if (firstLoad) {
    firstLoad = false;
    const HOME_VIEW_LINK = getStartViewLink(MY_BETS_SETTLED_URL);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, pullToRefresh: true });
  } else {
    await swipeDownElementFullscreen(sbkBetPanelSO.element);
  }

  await browser.waitUntilDisplayed(cardSO.element);
};

describe("My bets - Brazil jurisdiction", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext({ products: ["SPORTSBOOK"], jurisdiction: "BRAZIL" }));
  });

  describe("and the sport is Tennis", () => {
    beforeAll(async () => {
      await browseToMyBets(BFF_MY_BETS_MOCK_TENNIS_INPLAY);

      await mockService.mockHttpRequest(getScaResponse(SCA_MOCK_TENNIS));
      await browser.waitUntilDisplayed(cardSO.element);

      await browser.waitUntilClickableNative(cardSO.header);
      await cardSO.header.click();
      await browser.waitUntilDisplayed(cardSO.contentWrapper);
    });

    it("[PRPI-3659] should display the date and time of the event", async () => {
      expect(await avbScoreboardSO.dateTime.getText()).toEqual("Jan 16, 20:00");
    });
  });

  describe("and the sport is Football", () => {
    beforeAll(async () => {
      await browseToMyBets(SBK_FOOTBALL_SINGLE);

      await mockService.mockHttpRequest(getScaResponse(SCA_SETTLED_MOCK));
      await browser.waitUntilDisplayed(cardSO.element);

      await browser.waitUntilClickableNative(cardSO.header);
      await cardSO.header.click();
      await browser.waitUntilDisplayed(cardSO.contentWrapper);
      await browser.waitUntilDisplayed(betInfoSO.element);
    });

    it("[PRPI-3660] should display the date and time of the event", async () => {
      expect(await footballScoreboardSO.dateTime.getText()).toEqual("Jul 14, 14:00");
    });

    it("[PRPI-3661] should display the BetInfo with three lines", async () => {
      expect(await betInfoSO.element.isDisplayed()).toEqual(true);
      expect(await betInfoSO.infoItems.length).toEqual(3);
    });

    it("[PRPI-3662] should display device ID in the third line with correct information", async () => {
      expect(await thirdBetInfoItemSO.label.getText()).not.toEqual("I18N.MYBETS.DEVICE_ID");
      expect(await thirdBetInfoItemSO.contentText.isDisplayed()).toEqual(false);
      expect(await thirdCopyToClipboardSO.contentLabel.getText()).toEqual("Mobile - App");
    });
  });
});
