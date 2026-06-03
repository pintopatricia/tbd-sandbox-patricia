const { ObbEventPopularsCardPO, ScrollableSwimlanePO } = require("../../../../../page-objects");

const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");

const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const obbEventPopularsCardPO = new ObbEventPopularsCardPO();
const scrollableSwimlanePO = new ScrollableSwimlanePO();

const mockService = new MockService();

const EVENT_ID = "33755137";
const EVENT_OPEN_DATE = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();

const SCA_PRE_MATCH_MOCK = {
  fixture: [
    {
      eventId: 33755137,
      score: {},
      duration: {
        period: "REGULAR",
        status: "PRE_MATCH",
        clock: {
          minute: 0,
          second: 1,
        },
      },
    },
  ],
};

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
  numberOfVisibleBettingOpportunities: 2,
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

const BFF_MOCK = responseToTemplate(BFF_RESPONSE);

describe("OBB - Event Populars - Card", () => {
  describe("When the OBB Event Populars Card is displayed", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      const eventLayout = getEventLayout(BFF_MOCK);
      await mockService.mockHttpRequest(getScaResponse(SCA_PRE_MATCH_MOCK));
      await mockService.mockHttpRequest(eventLayout);
      const url = routes.getEventViewUrl(EVENT_ID);

      await browser.url(url);

      await browser.waitUntilDisplayed(obbEventPopularsCardPO.element);

      await browser.waitUntilEquals(scrollableSwimlanePO.title, "Popular Picks");
    });

    it("[PRPI-9313] should display the title", async () => {
      expect(await scrollableSwimlanePO.title.getText()).toBe("Popular Picks");
    });

    it("[PRPI-9314] should display the badge when badgeText is provided", async () => {
      expect(await obbEventPopularsCardPO.badge.getText()).toBe("New");
    });

    it("[PRPI-9315] should show only the initial number of betting opportunities", async () => {
      const visibleBettingOpportunities = await obbEventPopularsCardPO.visibleBettingOpportunities;
      expect(await visibleBettingOpportunities.length).toBe(
        OBB_EVENT_POPULARS_CARD.numberOfVisibleBettingOpportunities,
      );
    });

    it("[PRPI-9316] should display Show More when there are more items", async () => {
      expect(await obbEventPopularsCardPO.showMore.getText()).toBe("Show More");
    });

    describe("When I click on the show more button", () => {
      beforeAll(async () => {
        await obbEventPopularsCardPO.showMore.click();

        await browser.waitUntilEquals(obbEventPopularsCardPO.showMore, "Show Less");
      });

      it("[PRPI-9317] should expand and show all betting opportunities", async () => {
        const expandedItems = await obbEventPopularsCardPO.visibleBettingOpportunities;
        expect(await expandedItems.length).toBe(OBB_EVENT_POPULARS_CARD.popularBettingOpportunities.length);
        expect(await obbEventPopularsCardPO.showMore.getText()).toBe("Show Less");
      });

      it("[PRPI-9318] should display a title and subtitle for each betting opportunity", async () => {
        const visibleMatchStatTitle = await obbEventPopularsCardPO.matchStatTitle;
        const visibleMatchStatSubtitle = await obbEventPopularsCardPO.matchStatSubtitle;
        const count = await visibleMatchStatTitle.length;
        const titles = [];
        const subtitles = [];

        for (let i = 0; i < count; i++) {
          titles.push(await visibleMatchStatTitle[i].getText());
          subtitles.push(await visibleMatchStatSubtitle[i].getText());
        }

        expect(titles).toEqual(["Casemiro & Diogo Dalot", "Luke Shaw & Casemiro", "Luke Shaw"]);
        expect(subtitles).toEqual([
          "To Have More Shots On Target Than Luke Shaw & Mason Mount",
          "To Score 2+ Goals Between Them",
          "To Score More Goals Than Casemiro",
        ]);
        expect(count).toBe(OBB_EVENT_POPULARS_CARD.popularBettingOpportunities.length);
      });

      it("[PRPI-9319] should collapse and show only the initial number of betting opportunities when Show Less is clicked", async () => {
        await obbEventPopularsCardPO.showMore.click();

        const collapsedItems = await obbEventPopularsCardPO.visibleBettingOpportunities;
        expect(await collapsedItems.length).toBe(OBB_EVENT_POPULARS_CARD.numberOfVisibleBettingOpportunities);
        expect(await obbEventPopularsCardPO.showMore.getText()).toBe("Show More");
      });
    });

    describe("When showStats is true", () => {
      it("[PRPI-9320] should display Times Backed with correct texts", async () => {
        const visibleTimesBacked = await obbEventPopularsCardPO.timesBackedLabel;
        const texts = [];
        const count = await visibleTimesBacked.length;

        for (let i = 0; i < count; i++) {
          texts.push(await visibleTimesBacked[i].getText());
        }

        expect(texts).toEqual(["10 Times Backed", "10 Times Backed"]);
        expect(count).toBe(2);
      });
    });

    describe("When showPopularEvidence is true", () => {
      it("[PRPI-9321] should display Contextual Stats with correct texts", async () => {
        const visibleContextualStats = await obbEventPopularsCardPO.contextualStats;
        const texts = [];
        const count = await visibleContextualStats.length;

        for (let i = 0; i < count; i++) {
          texts.push(await visibleContextualStats[i].getText());
        }

        expect(texts).toEqual(["0.3 Avg goals, combined"]);
        expect(count).toBe(1);
      });
    });
  });

  describe("When there are no extra betting opportunities", () => {
    beforeAll(async () => {
      const limitedEventPopularsCard = {
        ...OBB_EVENT_POPULARS_CARD,
        numberOfVisibleBettingOpportunities: 3,
        showPopularEvidence: false,
        showStats: false,
      };
      const limitedResponse = { ...BFF_RESPONSE };
      limitedResponse.data.View.items.edges[0].node = { ...limitedEventPopularsCard };
      const limitedMock = responseToTemplate(limitedResponse);

      await mockService.mockHttpRequest(await getIndexHTML(limitedMock.urn));
      const eventLayout = getEventLayout(limitedMock);
      await mockService.mockHttpRequest(getScaResponse(SCA_PRE_MATCH_MOCK));
      await mockService.mockHttpRequest(eventLayout);
      const url = routes.getEventViewUrl(EVENT_ID);

      await browser.url(url);

      await browser.waitUntilDisplayed(obbEventPopularsCardPO.element);

      await browser.waitUntilEquals(scrollableSwimlanePO.title, "Popular Picks");
    });

    it("[PRPI-9322] should not display Show More", async () => {
      expect(await obbEventPopularsCardPO.showMore.isExisting()).toBe(false);
    });

    describe("When showStats is false", () => {
      it("[PRPI-9323] should not display Times Backed", async () => {
        const visibleTimesBacked = await obbEventPopularsCardPO.timesBackedLabel;
        expect(await visibleTimesBacked.length).toBe(0);
      });
    });

    describe("When showPopularEvidence is false", () => {
      it("[PRPI-9324] should not display Contextual Stats", async () => {
        const visibleContextualStats = await obbEventPopularsCardPO.contextualStats;
        expect(await visibleContextualStats.length).toBe(0);
      });
    });
  });
});
