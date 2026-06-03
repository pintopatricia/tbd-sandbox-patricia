const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;

const { getEventLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");

const { ObbEventPopularsCardSO } = require("../../../../screen-objects");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const mockService = new MockService();
const obbEventPopularsCardSO = new ObbEventPopularsCardSO();
const MODULE_NAME = "obb_event_populars";

const EVENT_ID = "33755137";
const EVENT_OPEN_DATE = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();

const OBB_EVENT_POPULARS_CARD = {
  __typename: "ObbEventPopularsCard",
  urn: "ppb:obb:card:eventPopulars:aTlm5hIAACIAfTQD/e/33755137",
  obbEventPopularsCardTitle: {
    __typename: "DisplayNameTitle",
    name: "Popular Picks",
  },
  badgeLabel: {
    __typename: "DisplayNameTitle",
    name: "New",
  },
  numberOfVisibleBettingOpportunities: 3,
  showPopularEvidence: true,
  showStats: true,
  event: {
    urn: "ppb:event:33755137",
    name: "Man Utd v Newcastle",
    eventId: 33755137,
    __typename: "SportsEvent",
  },
  popularBettingOpportunities: [
    {
      betCount: 1,
      participants: [
        {
          __typename: "ObbFootballPlayer",
          urn: "ppb:obb:footballPlayer:6860/e/33755137",
          player: {
            id: "6860",
            name: "Luke Shaw",
            position: null,
            shirtNumber: null,
            seasonStats: {
              matchesPlayed: 17,
              averages: {
                shotsOnTarget: 0,
                totalShots: 0.06,
                goals: 0,
                yellowCards: 0.12,
                redCards: 0,
                yellowRedCards: 0,
                fouls: 1.18,
                foulsWon: 0.12,
                passes: 55.41,
                assists: 0.06,
                __typename: "FootballPlayerStat",
              },
              __typename: "FootballPlayerSeasonStats",
            },
            __typename: "FootballPlayer",
          },
          team: {
            id: "13",
            name: "Man Utd",
            color: "DA291C",
            __typename: "FootballTeamDetails",
          },
        },
        {
          __typename: "ObbFootballPlayer",
          urn: "ppb:obb:footballPlayer:19488/e/33755137",
          player: {
            id: "19488",
            name: "Casemiro",
            position: null,
            shirtNumber: null,
            seasonStats: {
              matchesPlayed: 15,
              averages: {
                shotsOnTarget: 0.4,
                totalShots: 1.6,
                goals: 0.27,
                yellowCards: 0.33,
                redCards: 0,
                yellowRedCards: 0.07,
                fouls: 1.47,
                foulsWon: 0.93,
                passes: 38.93,
                assists: 0.07,
                __typename: "FootballPlayerStat",
              },
              __typename: "FootballPlayerSeasonStats",
            },
            __typename: "FootballPlayer",
          },
          team: {
            id: "13",
            name: "Man Utd",
            color: "DA291C",
            __typename: "FootballTeamDetails",
          },
        },
        {
          __typename: "ObbFootballPlayer",
          urn: "ppb:obb:footballPlayer:53087/e/33755137",
          player: {
            id: "53087",
            name: "Mason Mount",
            position: null,
            shirtNumber: null,
            seasonStats: {
              matchesPlayed: 14,
              averages: {
                shotsOnTarget: 0.36,
                totalShots: 1.29,
                goals: 0.21,
                yellowCards: 0,
                redCards: 0,
                yellowRedCards: 0,
                fouls: 0.79,
                foulsWon: 0.64,
                passes: 20.5,
                assists: 0,
                __typename: "FootballPlayerStat",
              },
              __typename: "FootballPlayerSeasonStats",
            },
            __typename: "FootballPlayer",
          },
          team: {
            id: "13",
            name: "Man Utd",
            color: "DA291C",
            __typename: "FootballTeamDetails",
          },
        },
        {
          __typename: "ObbFootballPlayer",
          urn: "ppb:obb:footballPlayer:60419/e/33755137",
          player: {
            id: "60419",
            name: "Diogo Dalot",
            position: null,
            shirtNumber: null,
            seasonStats: {
              matchesPlayed: 15,
              averages: {
                shotsOnTarget: 0.2,
                totalShots: 0.53,
                goals: 0.07,
                yellowCards: 0.13,
                redCards: 0,
                yellowRedCards: 0,
                fouls: 0.73,
                foulsWon: 0.47,
                passes: 27.2,
                assists: 0.13,
                __typename: "FootballPlayerStat",
              },
              __typename: "FootballPlayerSeasonStats",
            },
            __typename: "FootballPlayer",
          },
          team: {
            id: "13",
            name: "Man Utd",
            color: "DA291C",
            __typename: "FootballTeamDetails",
          },
        },
      ],

      leg: {
        __typename: "ObbLeg",
        templateId: "squadVsSquad",
        templateParams: {
          __typename: "ObbSquadVsSquadParams",
          squadAParticipantIds: [
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:6860/e/33755137",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:53087/e/33755137",
            },
          ],

          squadBParticipantIds: [
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:19488/e/33755137",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:60419/e/33755137",
            },
          ],

          outcomeIds: ["SHOTS_ON_TARGET"],
          timePeriodId: "MATCH",
          quantifier: "MORE_THAN",
        },
        quote: {
          __typename: "ObbQuoteSuccess",
          price: {
            __typename: "ObbOdds",
            decimal: 1.91,
            fractional: {
              __typename: "FractionalOdds",
              numerator: 1,
              denominator: 4,
            },
          },
        },
        event: {
          __typename: "SportsEvent",
          urn: "ppb:event:33755137",
          name: "Man Utd v Newcastle",
          eventId: 33755137,
        },
      },
      __typename: "ObbPopularBettingOpportunity",
    },
    {
      betCount: 10,
      participants: [
        {
          __typename: "ObbFootballPlayer",
          urn: "ppb:obb:footballPlayer:6860/e/33755137",
          player: {
            id: "6860",
            name: "Luke Shaw",
            position: null,
            shirtNumber: null,
            seasonStats: {
              matchesPlayed: 17,
              averages: {
                shotsOnTarget: 0,
                totalShots: 0.06,
                goals: 0,
                yellowCards: 0.12,
                redCards: 0,
                yellowRedCards: 0,
                fouls: 1.18,
                foulsWon: 0.12,
                passes: 55.41,
                assists: 0.06,
                __typename: "FootballPlayerStat",
              },
              __typename: "FootballPlayerSeasonStats",
            },
            __typename: "FootballPlayer",
          },
          team: {
            id: "13",
            name: "Man Utd",
            color: "DA291C",
            __typename: "FootballTeamDetails",
          },
        },
        {
          __typename: "ObbFootballPlayer",
          urn: "ppb:obb:footballPlayer:19488/e/33755137",
          player: {
            id: "19488",
            name: "Casemiro",
            position: null,
            shirtNumber: null,
            seasonStats: {
              matchesPlayed: 15,
              averages: {
                shotsOnTarget: 0.4,
                totalShots: 1.6,
                goals: 0.27,
                yellowCards: 0.33,
                redCards: 0,
                yellowRedCards: 0.07,
                fouls: 1.47,
                foulsWon: 0.93,
                passes: 38.93,
                assists: 0.07,
                __typename: "FootballPlayerStat",
              },
              __typename: "FootballPlayerSeasonStats",
            },
            __typename: "FootballPlayer",
          },
          team: {
            id: "13",
            name: "Man Utd",
            color: "DA291C",
            __typename: "FootballTeamDetails",
          },
        },
      ],

      leg: {
        __typename: "ObbLeg",
        templateId: "participantsCombined",
        templateParams: {
          __typename: "ObbSquadBetParams",
          participantIds: [
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:6860/e/33755137",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:19488/e/33755137",
            },
          ],

          outcomeIds: ["GOALS"],
          value: 2,
          timePeriodId: "MATCH",
          quantifier: "AT_LEAST",
        },
        quote: {
          __typename: "ObbQuoteSuccess",
          price: {
            __typename: "ObbOdds",
            decimal: 1.91,
            fractional: {
              __typename: "FractionalOdds",
              numerator: 1,
              denominator: 4,
            },
          },
        },
        event: {
          __typename: "SportsEvent",
          urn: "ppb:event:33755137",
          name: "Man Utd v Newcastle",
          eventId: 33755137,
        },
      },
      __typename: "ObbPopularBettingOpportunity",
    },
    {
      betCount: 20,
      participants: [
        {
          __typename: "ObbFootballPlayer",
          urn: "ppb:obb:footballPlayer:6860/e/33755137",
          player: {
            id: "6860",
            name: "Luke Shaw",
            position: null,
            shirtNumber: null,
            seasonStats: {
              matchesPlayed: 17,
              averages: {
                shotsOnTarget: 0,
                totalShots: 0.06,
                goals: 0,
                yellowCards: 0.12,
                redCards: 0,
                yellowRedCards: 0,
                fouls: 1.18,
                foulsWon: 0.12,
                passes: 55.41,
                assists: 0.06,
                __typename: "FootballPlayerStat",
              },
              __typename: "FootballPlayerSeasonStats",
            },
            __typename: "FootballPlayer",
          },
          team: {
            id: "13",
            name: "Man Utd",
            color: "DA291C",
            __typename: "FootballTeamDetails",
          },
        },
        {
          __typename: "ObbFootballPlayer",
          urn: "ppb:obb:footballPlayer:19488/e/33755137",
          player: {
            id: "19488",
            name: "Casemiro",
            position: null,
            shirtNumber: null,
            seasonStats: {
              matchesPlayed: 15,
              averages: {
                shotsOnTarget: 0.4,
                totalShots: 1.6,
                goals: 0.27,
                yellowCards: 0.33,
                redCards: 0,
                yellowRedCards: 0.07,
                fouls: 1.47,
                foulsWon: 0.93,
                passes: 38.93,
                assists: 0.07,
                __typename: "FootballPlayerStat",
              },
              __typename: "FootballPlayerSeasonStats",
            },
            __typename: "FootballPlayer",
          },
          team: {
            id: "13",
            name: "Man Utd",
            color: "DA291C",
            __typename: "FootballTeamDetails",
          },
        },
      ],

      leg: {
        __typename: "ObbLeg",
        templateId: "playerVsPlayer",
        templateParams: {
          __typename: "ObbPvpParams",
          participantIdA: {
            __typename: "ObbFootballPlayer",
            urn: "ppb:obb:footballPlayer:6860/e/33755137",
          },
          participantIdB: {
            __typename: "ObbFootballPlayer",
            urn: "ppb:obb:footballPlayer:19488/e/33755137",
          },
          outcomeId: "GOALS",
          timePeriodId: "MATCH",
        },
        quote: {
          __typename: "ObbQuoteSuccess",
          price: {
            __typename: "ObbOdds",
            decimal: 1.91,
            fractional: {
              __typename: "FractionalOdds",
              numerator: 1,
              denominator: 4,
            },
          },
        },
        event: {
          __typename: "SportsEvent",
          urn: "ppb:event:33755137",
          name: "Man Utd v Newcastle",
          eventId: 33755137,
        },
      },
      __typename: "ObbPopularBettingOpportunity",
    },
    {
      betCount: 10,
      participants: [
        {
          __typename: "ObbFootballPlayer",
          urn: "ppb:obb:footballPlayer:6860/e/33755137",
          player: {
            id: "6860",
            name: "Luke Shaw",
            position: null,
            shirtNumber: null,
            seasonStats: {
              matchesPlayed: 17,
              averages: {
                shotsOnTarget: 0,
                totalShots: 0.06,
                goals: 0,
                yellowCards: 0.12,
                redCards: 0,
                yellowRedCards: 0,
                fouls: 1.18,
                foulsWon: 0.12,
                passes: 55.41,
                assists: 0.06,
                __typename: "FootballPlayerStat",
              },
              __typename: "FootballPlayerSeasonStats",
            },
            __typename: "FootballPlayer",
          },
          team: {
            id: "13",
            name: "Man Utd",
            color: "DA291C",
            __typename: "FootballTeamDetails",
          },
        },
        {
          __typename: "ObbFootballPlayer",
          urn: "ppb:obb:footballPlayer:19488/e/33755137",
          player: {
            id: "19488",
            name: "Casemiro",
            position: null,
            shirtNumber: null,
            seasonStats: {
              matchesPlayed: 15,
              averages: {
                shotsOnTarget: 0.4,
                totalShots: 1.6,
                goals: 0.27,
                yellowCards: 0.33,
                redCards: 0,
                yellowRedCards: 0.07,
                fouls: 1.47,
                foulsWon: 0.93,
                passes: 38.93,
                assists: 0.07,
                __typename: "FootballPlayerStat",
              },
              __typename: "FootballPlayerSeasonStats",
            },
            __typename: "FootballPlayer",
          },
          team: {
            id: "13",
            name: "Man Utd",
            color: "DA291C",
            __typename: "FootballTeamDetails",
          },
        },
      ],

      leg: {
        __typename: "ObbLeg",
        templateId: "playerVsPlayer",
        templateParams: {
          __typename: "ObbPvpParams",
          participantIdA: {
            __typename: "ObbFootballPlayer",
            urn: "ppb:obb:footballPlayer:19488/e/33755137",
          },
          participantIdB: {
            __typename: "ObbFootballPlayer",
            urn: "ppb:obb:footballPlayer:6860/e/33755137",
          },
          outcomeId: "GOALS",
          timePeriodId: "MATCH",
        },
        quote: {
          __typename: "ObbQuoteSuccess",
          price: {
            __typename: "ObbOdds",
            decimal: 1.91,
            fractional: {
              __typename: "FractionalOdds",
              numerator: 1,
              denominator: 4,
            },
          },
        },
        event: {
          __typename: "SportsEvent",
          urn: "ppb:event:33755137",
          name: "Man Utd v Newcastle",
          eventId: 33755137,
        },
      },
      __typename: "ObbPopularBettingOpportunity",
    },
  ],
};

const BFF_RESPONSE = {
  data: {
    View: {
      __typename: "EventView",
      urn: "ppb:tbd:view:event:33755137",
      url: "football/uefa-nations-league/north-macedonia-v-latvia/e-33755137",
      sportevent: {
        __typename: "SportsEvent",
        urn: "ppb:event:33755137",
        eventId: 33755137,
        name: "North Macedonia v Latvia",
        openDate: EVENT_OPEN_DATE,
        competition: {
          __typename: "Competition",
          urn: "ppb:competition:11984200",
          name: "UEFA Nations League",
          competitionId: 11984200,
          sport: {
            __typename: "Sport",
            urn: "ppb:eventType:1",
            name: "Football",
            shortName: null,
            sportId: 1,
          },
          logo: {},
          country: {
            urn: "",
            code: "",
            flag: {
              vector: "",
            },
          },
        },
      },
      leftSidebar: {
        __typename: "LeftSidebar",
        items: {
          edges: [],
        },
        pageInfo: null,
      },
      items: {
        pageInfo: {
          nextPageCursor: "TUFUQ0hfT0REUyxDT1JSRUNUX1NDT1JFLE9WRVJfVU5ERVJfMDUsT1ZFUl9VTkRFUl8xNQ==",
        },
        edges: [
          {
            node: OBB_EVENT_POPULARS_CARD,
          },
        ],
      },
      partialItems: {
        pageInfo: null,
        edges: [
          {
            node: {
              __typename: "ObbEventPopularsCard",
              urn: "ppb:obb:card:eventPopulars:aTlm5hIAACIAfTQD/e/33755137",
            },
          },
        ],
      },
      bottomBar: {
        __typename: "BottomBar",
        tiles: [
          {
            tileType: "HOME",
            viewLink: {
              viewUrn: "ppb:tbd:view:generic:home",
              viewUrl: "",
            },
          },
          {
            tileType: "BROWSE",
            viewLink: {
              viewUrn: "ppb:tbd:view:browse:sports",
              viewUrl: "browse/b-sports",
            },
          },
          {
            tileType: "MY_BETS",
            viewLink: {
              viewUrn: "ppb:tbd:view:myBets:open",
              viewUrl: "mybets/mybets-open",
            },
          },
          {
            tileType: "GAMING",
            viewLink: {
              viewUrn: "ppb:tbd:view:gaming:1",
              viewUrl: "casino/gm-1",
            },
          },
        ],

        hasProductSwitcher: false,
      },
    },
  },
};

function responseToTemplate(json) {
  return {
    urn: json.data.View.urn,
    url: json.data.View.url,
    sportevent: json.data.View.sportevent,
    edges: json.data.View.items.edges,
    partialEdges: json.data.View.partialItems.edges,
  };
}

const SCA_PRE_MATCH_MOCK = {
  fixture: [
    {
      eventId: 33755137,
      scheduledAt: EVENT_OPEN_DATE,
      score: {},
      duration: {
        period: "REGULAR",
        status: "PRE_MATCH",
      },
    },
  ],
};

const SUCCESSFUL_WAS_REQUEST = [{ walletName: "MAIN", amount: "123" }];

const BFF_MOCK = responseToTemplate(BFF_RESPONSE);

describe("OBB - Event Populars - Card", () => {
  describe("Given I'm on the event page with a OBB Event Populars Card", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getWallets(SUCCESSFUL_WAS_REQUEST));
      await mockService.mockHttpRequest(getScaResponse(SCA_PRE_MATCH_MOCK));

      const url = `sport/competition/event/e-${EVENT_ID}`;
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(obbEventPopularsCardSO.element);
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-9349]_should_render_card_correctly`);
    });

    it("[PRPI-9349]_should_render_card_correctly", async () => {
      expect(
        (await browser.compareScreen(`${MODULE_NAME}_[PRPI-9349]_should_render_card_correctly`)).misMatchPercentage,
      ).toEqual(0);
    });
  });
});
