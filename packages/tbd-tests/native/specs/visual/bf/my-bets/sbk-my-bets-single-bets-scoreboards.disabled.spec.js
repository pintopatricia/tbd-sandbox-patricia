const { getAppContext, getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");

const {
  MyBetsScreenSO,
  BottomBarSO,
  AvBFixtureSO,
  FootballScoreboardSO,
  DurationSO,
  CardSO,
  EventHeaderSO,
} = require("../../../../screen-objects");
const { HEADER_ITEMS_MOCK, GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsScreenSO = new MyBetsScreenSO();

const footballScoreboardSO = new FootballScoreboardSO(myBetsScreenSO.betCardGroups[0]);
const footballDurationSO = new DurationSO(footballScoreboardSO.element);
const avBFixtureSO = new AvBFixtureSO();
const cardSO = new CardSO();
const eventHeaderSO = new EventHeaderSO();

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
        eventDescription: "Spezia v Entella",
        eventMarketDescription: "Match Odds",
        selectionName: "Spezia",
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
      isSettled: false,
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

/* SBK BET WITH FOOTBALL SCOREBOARD Mocks */
const SBK_BET_CARD_FOOTBALL_SCOREBOARD_FIXTURE = {
  node: {
    __typename: "FixtureCard",
    urn: "ppb:tbd:card:fixture:2022803|viewLink|0",
    sportevent: { urn: "ppb:event:2022803", name: "Spezia v Entella" },
    scheduledAt: "2020-07-27T19:00:00Z",
    fixtureEventViewLink: {
      viewUrn: "ppb:tbd:view:event:2022803",
      viewUrl: "football/argentinian-reserves/ca-lanus-(res)-v-ca-union-santa-fe-(res)/e-30744688",
    },
    fixture: {
      urn: "ppb:fixture:2022803",
      home: { name: "Spezia" },
      away: { name: "Entella" },
      score: null,
      duration: null,
    },
  },
};

const SBK_BET_CARD_FOOTBALL_SCOREBOARD_PARTIALS_FIXTURE = {
  node: {
    __typename: "FixtureCard",
    urn: "ppb:tbd:card:fixture:2022803|viewLink|0",
  },
};

const BET_LEG_CARD_FIRST_PARTIAL = {
  __typename: "BetLegCard",
  urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
};

const BET_LEG_CARD_FIRST = {
  ...BET_LEG_CARD_FIRST_PARTIAL,
  betUrn: "ppb:sbkBet:926229536",
  leg: SBK_BET_CARD_FULL.node.bet.legs[0],
};

const FIRST_LEG_CARD_GROUP_PARTIAL = {
  __typename: "SportsbookBetLegCardGroup",
  urn: "ppb:tbd:cardgroup:sbkBetLeg:926229536/0",
};

const BET_EXPANDABLE_LEGS_PARTIAL = {
  __typename: "SportsbookExpandableLegCardGroup",
  urn: "ppb:tbd:cardgroup:sbkExpandableLeg:926229536",
};

const BET_INFO_ID = {
  __typename: "SportsbookBetInfoCard",
  urn: "ppb:tbd:card:sbkBetInfo:1179447017",
};

const BET_EXPANDABLE_LEGS = {
  ...BET_EXPANDABLE_LEGS_PARTIAL,
  full: {
    edges: [
      {
        node: {
          ...FIRST_LEG_CARD_GROUP_PARTIAL,
          full: {
            edges: [SBK_BET_CARD_FOOTBALL_SCOREBOARD_FIXTURE, { node: BET_LEG_CARD_FIRST }],
          },
          partials: {
            partialEdges: [SBK_BET_CARD_FOOTBALL_SCOREBOARD_PARTIALS_FIXTURE, { node: BET_LEG_CARD_FIRST_PARTIAL }],
          },
        },
      },
      { node: BET_INFO_ID },
    ],
  },
  partials: {
    partialEdges: [{ node: FIRST_LEG_CARD_GROUP_PARTIAL }, { node: BET_INFO_ID }],
  },
};

const BETCARD_GROUP_CARDS_SBK_BET_FOOTBALL_SCOREBOARD = {
  node: {
    __typename: "BetCardGroup",
    urn: "ppb:tbd:card:bet:group:926229536|sbk",
    full: {
      edges: [SBK_BET_CARD_FULL, { node: BET_EXPANDABLE_LEGS }],
    },
    partials: {
      partialEdges: [SBK_BET_CARD_PARTIALS, { node: BET_EXPANDABLE_LEGS_PARTIAL }],
    },
  },
};

const SCA_MOCK_FOOTBALL = {
  fixture: [
    {
      eventId: 2022803,
      score: {
        home: 0,
        away: 0,
      },
      duration: {
        period: "REGULAR",
        status: "INPLAY_FIRST_HALF",
        clock: {
          minute: 0,
          second: 1,
        },
      },
    },
  ],
};

/* SBK BET WITH INPLAY TENNIS SCOREBOARD Mocks */
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

/* BFF MY BETS Mocks */
const BFF_MY_BETS_MOCK_FOOTBALL = {
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
  edges: [BETCARD_GROUP_CARDS_SBK_BET_FOOTBALL_SCOREBOARD],
  pageInfo: {
    hasNextPage: "true",
    endCursor: "NA==",
  },
  headerItems: HEADER_ITEMS_MOCK,
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

const BFF_MY_BETS_MOCK_EVENT_HEADER = [
  {
    betType: "SGL",
    isOpen: true,
    profitAndLoss: 0.33,
    edges: {
      legCardGroups: [
        {
          eventHeader: {
            title: "Cheltenham Antepost Doubles",
            tertiaryTitle: "#WhatOddsPaddy",
            date: "2023-04-15T15:50:00.000Z",
          },
          legs: [
            {
              parts: [
                {
                  priceType: "LIVE",
                  eventDescription: "Cheltenham Antepost Doubles",
                  eventMarketDescription: "Cheltenham Antepost Doubles -Antepost Rules Apply",
                  selectionName: "Constitution Hill To Win",
                },
              ],
            },
          ],
        },
      ],

      betInfo: {
        betReceiptId: "O/11037374/0002541",
        regulatorBetId: "bc000000001c17979f05",
        placedDate: "2023-03-13T11:13:24.000Z",
        settledDate: "2023-03-13T11:14:24.000Z",
      },
    },
  },
];

const BFF_MY_BETS_MOCK_EVENT_HEADER_HUGE = [
  {
    betType: "SGL",
    isOpen: true,
    profitAndLoss: 0.33,
    edges: {
      legCardGroups: [
        {
          eventHeader: {
            title:
              "Cheltenham Antepost Doubles Cheltenham Antepost Doubles Cheltenham Antepost Doubles Cheltenham Antepost Doubles",
            tertiaryTitle:
              "#WhatOddsPaddy #WhatOddsPaddy #WhatOddsPaddy #WhatOddsPaddy #WhatOddsPaddy #WhatOddsPaddy #WhatOddsPaddy",
            date: "2023-04-15T15:50:00.000Z",
          },
          legs: [
            {
              parts: [
                {
                  priceType: "LIVE",
                  eventDescription: "Cheltenham Antepost Doubles",
                  eventMarketDescription:
                    "Cheltenham Antepost Doubles Cheltenham Antepost Doubles Cheltenham Antepost Doubles Cheltenham Antepost Doubles -Antepost Rules Apply",
                  selectionName:
                    "Constitution Hill To Win the big race around the cheltenham thing that runs is huge as a football field",
                },
              ],
            },
          ],
        },
      ],

      betInfo: {
        betReceiptId: "O/11037374/0002541",
        regulatorBetId: "bc000000001c17979f05",
        placedDate: "2023-03-13T11:13:24.000Z",
        settledDate: "2023-03-13T11:14:24.000Z",
      },
    },
  },
];

const CARD_NAME = "my_bets_page";

describe("My Bets Page - SBK Single Bets", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext({ products: ["SPORTSBOOK"] }));
    await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK_FOOTBALL));
    await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
    await startApp("home");
  });

  describe("When the user opens My Bets page with a bet in a Pre-Play Football event", () => {
    beforeAll(async () => {
      await browser.waitUntilClickableNative(BottomBarSO.myBets, "My bets button is not clickable");
      await BottomBarSO.myBets.click();
      await browser.waitUntilDisplayed(myBetsScreenSO.header, "My bets screen title is not displayed");

      await browser.waitUntilClickableNative(cardSO.element);
      await cardSO.element.click();
      await browser.waitUntilDisplayed(cardSO.contentWrapper);

      await browser.waitUntilEquals(footballDurationSO.date, "Feb 1");

      await browser.waitUntilImageEquals(
        `${CARD_NAME}_[PRPI-4852]_the_football_scoreboard_should_be_displayed_with_the_event_date`,
      );
    });

    it("[PRPI-4852]_the_football_scoreboard_should_be_displayed_with_the_event_date", async () => {
      expect(
        (
          await browser.compareScreen(
            `${CARD_NAME}_[PRPI-4852]_the_football_scoreboard_should_be_displayed_with_the_event_date`,
          )
        ).misMatchPercentage,
      ).toEqual(0);
    });

    describe("and then the event goes to InPlay", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_MOCK_FOOTBALL));
        await browser.waitUntilEquals(footballDurationSO.statusLabel, "1'");
        await browser.waitUntilImageEquals(
          `${CARD_NAME}_[PRPI-4853]_the_Inplay_football_scoreboard_should_be_displayed`,
        );
      });

      it("[PRPI-4853]_the_Inplay_football_scoreboard_should_be_displayed", async () => {
        expect(
          (await browser.compareScreen(`${CARD_NAME}_[PRPI-4853]_the_Inplay_football_scoreboard_should_be_displayed`))
            .misMatchPercentage,
        ).toEqual(0);
      });
    });
  });

  describe("When the user opens My Bets page with a bet in a tennis InPlay event", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK_TENNIS_INPLAY));
      await mockService.mockHttpRequest(getScaResponse(SCA_MOCK_TENNIS));
      await browser.waitUntilClickableNative(BottomBarSO.home, "Home button is not clickable");
      await BottomBarSO.home.click();
      await browser.waitUntilClickableNative(BottomBarSO.myBets, "My bets button is not clickable");
      await BottomBarSO.myBets.click();

      await browser.waitUntilClickableNative(cardSO.element);
      await cardSO.element.click();
      await browser.waitUntilDisplayed(cardSO.contentWrapper);

      await browser.waitUntilDisplayed(avBFixtureSO.element);
      await browser.waitUntilImageEquals(`${CARD_NAME}_[PRPI-4854]_the_Inplay_tennis_scoreboard_should_be_displayed`);
    });

    it("[PRPI-4854]_the_Inplay_tennis_scoreboard_should_be_displayed", async () => {
      expect(
        (await browser.compareScreen(`${CARD_NAME}_[PRPI-4854]_the_Inplay_tennis_scoreboard_should_be_displayed`))
          .misMatchPercentage,
      ).toEqual(0);
    });
  });

  describe("When the user opens My Bets page with a non SCA event", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMyBetsLayout(getMyBetsSBKViewMock(BFF_MY_BETS_MOCK_EVENT_HEADER)));

      await browser.waitUntilClickableNative(BottomBarSO.myBets, "My bets button is not clickable");
      await BottomBarSO.myBets.click();
      await browser.waitUntilDisplayed(myBetsScreenSO.header, "My bets screen title is not displayed");

      await browser.waitUntilClickableNative(cardSO.element);
      await cardSO.element.click();
      await browser.waitUntilDisplayed(cardSO.contentWrapper);

      await browser.waitUntilDisplayed(eventHeaderSO.element, "Event Header is not displayed");

      await browser.waitUntilImageEquals(
        `${CARD_NAME}_[PRPI-4855]_the_event_header_scoreboard_should_be_displayed_with_the_event_data`,
      );
    });

    it("[PRPI-4855]_the_event_header_scoreboard_should_be_displayed_with_the_event_data", async () => {
      expect(
        (
          await browser.compareScreen(
            `${CARD_NAME}_[PRPI-4855]_the_event_header_scoreboard_should_be_displayed_with_the_event_data`,
          )
        ).misMatchPercentage,
      ).toEqual(0);
    });

    describe("and event header has huge titles", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMyBetsLayout(getMyBetsSBKViewMock(BFF_MY_BETS_MOCK_EVENT_HEADER_HUGE)));

        await browser.waitUntilClickableNative(BottomBarSO.myBets, "My bets button is not clickable");
        await BottomBarSO.myBets.click();
        await browser.waitUntilDisplayed(myBetsScreenSO.header, "My bets screen title is not displayed");

        await browser.waitUntilClickableNative(cardSO.element);
        await cardSO.element.click();
        await browser.waitUntilDisplayed(cardSO.contentWrapper);

        await browser.waitUntilDisplayed(eventHeaderSO.element, "Event Header is not displayed");

        await browser.waitUntilImageEquals(
          `${CARD_NAME}_[PRPI-4856]_the_event_header_scoreboard_should_be_displayed_with_cropped_data`,
        );
      });

      it("[PRPI-4856]_the_event_header_scoreboard_should_be_displayed_with_cropped_data", async () => {
        expect(
          (
            await browser.compareScreen(
              `${CARD_NAME}_[PRPI-4856]_the_event_header_scoreboard_should_be_displayed_with_cropped_data`,
            )
          ).misMatchPercentage,
        ).toEqual(0);
      });
    });
  });
});
