const StatsContentCardGroupPO = require("@ppb/tbd-shared/components/StatsContentCardGroup/view/StatsContentCardGroup.po");
const { SegmentedControlPO, SubstitutionsCardPO, CaptionPO } = require("../../../../page-objects");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getCardResults, getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const MODULE_NAME = "stats_lineups_card";
const mockService = new MockService();
const statsContentCardGroupPO = new StatsContentCardGroupPO();
const segmentedControlPO = new SegmentedControlPO();
const substitutionsCardPO = new SubstitutionsCardPO();
const captionPO = new CaptionPO();

const createPlayer = (home, number, name, position, isLinedUp, matchName) => ({
  __typename: "FootballPlayer",
  id: `ppb:tbd:player:${home ? "home" : "away"}:${number}`,
  name,
  matchName,
  position,
  shirtNumber: number,
  startingType: isLinedUp ? "LINEUP" : "BENCH",
  formationPlace: isLinedUp ? `${number}` : null,
});

const homePlayers = [
  createPlayer(true, 1, "Iker Casillas", "GOALKEEPER", true, "Casillas"),
  createPlayer(true, 2, "Maicon", "DEFENDER", true, "Maicon"),
  createPlayer(true, 3, "Ricardo Carvalho", "DEFENDER", true, "R. Carvalho"),
  createPlayer(true, 4, "Lucio", "DEFENDER", true, "Lucio"),
  createPlayer(true, 5, "Marcelo", "DEFENDER", true, "Marcelo"),
  createPlayer(true, 6, "Michael Essien", "MIDFIELDER", true, "M. Essien"),
  createPlayer(true, 7, "Luka Modric", "MIDFIELDER", true, "L. Modric"),
  createPlayer(true, 8, "Deco", "MIDFIELDER", true, "Deco"),
  createPlayer(true, 9, "Di Maria", "FORWARD", true, "Di Maria"),
  createPlayer(true, 10, "Cristiano Ronaldo", "FORWARD", true, "C. Ronaldo"),
  createPlayer(true, 11, "Drogba", "FORWARD", true, "Drogba"),
  createPlayer(true, 12, "Julio Cesar", "GOALKEEPER", false, "J. Cesar"),
  createPlayer(true, 13, "Materazzi", "DEFENDER", false, "Materazzi"),
  createPlayer(true, 14, "Sergio Ramos", "DEFENDER", false, "Ramos"),
  createPlayer(true, 15, "Mesut Ozil", "MIDFIELDER", false, "M. Ozil"),
  createPlayer(true, 16, "Fredrik Aursness", "MIDFIELDER", false, "F. Aursness"),
  createPlayer(true, 17, "Gianluca Prestianni", "FORWARD", false, "G. Prestianni"),
  createPlayer(true, 18, "Karim Benzema", "FORWARD", false, "Benzema"),
];

const awayPlayers = [
  createPlayer(false, 1, "Donnarumma", "GOALKEEPER", true, "Donnarumma"),
  createPlayer(false, 2, "Dani Alves", "DEFENDER", true, "D. Alves"),
  createPlayer(false, 3, "Kompany", "DEFENDER", true, "Kompany"),
  createPlayer(false, 4, "Ruben Dias", "DEFENDER", true, "R. Dias"),
  createPlayer(false, 5, "Jordi Alba", "DEFENDER", true, "J. Alba"),
  createPlayer(false, 6, "Sergio Busquets", "MIDFIELDER", true, "S. Busquets"),
  createPlayer(false, 7, "Xavi", "MIDFIELDER", true, "Xavi"),
  createPlayer(false, 8, "Iniesta", "MIDFIELDER", true, "Iniesta"),
  createPlayer(false, 9, "Phil Foden", "FORWARD", true, "P. Foden"),
  createPlayer(false, 10, "Lionel Messi", "FORWARD", true, "L. Messi"),
  createPlayer(false, 11, "Haaland", "FORWARD", true, "Haaland"),
  createPlayer(false, 12, "Ederson", "GOALKEEPER", false, "Ederson"),
  createPlayer(false, 13, "Maicon", "DEFENDER", false, "Maicon"),
  createPlayer(false, 14, "Puyol", "DEFENDER", false, "Puyol"),
  createPlayer(false, 15, "Yaya Toure", "MIDFIELDER", false, "Y. Toure"),
  createPlayer(false, 16, "David Silva", "MIDFIELDER", false, "D. Silva"),
  createPlayer(false, 17, "Mahrez", "FORWARD", false, "Mahrez"),
  createPlayer(false, 18, "Aguero", "FORWARD", false, "Aguero"),
];

const createTeam = (name, manager, players, formation) => ({
  __typename: "FootballTeamDetails",
  name,
  formation,
  squad: {
    __typename: "FootballSquad",
    manager,
    players,
  },
});

const createIncidentBase = (minute, period, periodStatus, details) => ({
  __typename: "FootballIncident",
  period,
  periodStatus,
  clock: {
    __typename: "Clock",
    minute,
  },
  details,
});

export const createGoalIncident = ({
  minute = 45,
  period = "REGULAR",
  periodStatus = "INPLAY_FIRST_HALF",
  goalType = "NORMAL",
  side,
  goalScorer,
  assist,
}) =>
  createIncidentBase(minute, period, periodStatus, {
    __typename: "GoalIncident",
    goalType,
    side,
    goalScorer,
    assist: assist || null,
  });

export const createCardIncident = ({
  minute = 30,
  period = "REGULAR",
  periodStatus = "INPLAY_FIRST_HALF",
  cardType = "YELLOW",
  side,
  player,
}) =>
  createIncidentBase(minute, period, periodStatus, {
    __typename: "CardIncident",
    cardType,
    side,
    player,
  });

export const createSubstitutionIncident = ({
  minute = 60,
  period = "REGULAR",
  periodStatus = "INPLAY_SECOND_HALF",
  side,
  playerIn,
  playerOut,
}) =>
  createIncidentBase(minute, period, periodStatus, {
    __typename: "SubstitutionIncident",
    side,
    playerIn,
    playerOut,
  });

const incidentsMock = [
  createGoalIncident({
    side: "HOME",
    goalScorer: homePlayers[9],
    minute: 40,
  }),
  createGoalIncident({
    side: "HOME",
    goalScorer: homePlayers[9],
    minute: 89,
  }),
  createGoalIncident({
    side: "HOME",
    goalScorer: homePlayers[9],
    assist: homePlayers[7],
  }),
  createGoalIncident({
    minute: 80,
    side: "HOME",
    goalType: "PENALTY",
    goalScorer: homePlayers[9],
  }),
  createGoalIncident({
    side: "AWAY",
    goalScorer: awayPlayers[9],
    minute: 40,
  }),
  createGoalIncident({
    side: "AWAY",
    goalScorer: awayPlayers[9],
    minute: 89,
  }),
  createGoalIncident({
    side: "AWAY",
    goalScorer: awayPlayers[9],
    assist: awayPlayers[7],
  }),
  createCardIncident({
    side: "AWAY",
    player: awayPlayers[3],
  }),
  createCardIncident({
    side: "AWAY",
    cardType: "YELLOW_RED",
    player: awayPlayers[3],
  }),
  createSubstitutionIncident({
    side: "HOME",
    playerIn: homePlayers[13],
    playerOut: homePlayers[2],
  }),
  createSubstitutionIncident({
    side: "AWAY",
    playerIn: awayPlayers[13],
    playerOut: awayPlayers[8],
    minute: 70,
  }),
  createGoalIncident({
    side: "HOME",
    goalScorer: homePlayers[13],
    minute: 71,
  }),
  createCardIncident({
    side: "AWAY",
    player: awayPlayers[8],
    minute: 65,
  }),
  createGoalIncident({
    side: "AWAY",
    goalScorer: awayPlayers[8],
    assist: awayPlayers[7],
    minute: 65,
  }),
  createGoalIncident({
    side: "AWAY",
    goalScorer: awayPlayers[8],
    minute: 18,
  }),
  createGoalIncident({
    side: "AWAY",
    goalScorer: awayPlayers[8],
    goalType: "OWN",
    minute: 20,
  }),
  createCardIncident({
    side: "HOME",
    player: homePlayers[2],
  }),
  createGoalIncident({
    side: "HOME",
    goalScorer: homePlayers[2],
    assist: homePlayers[7],
  }),
  createGoalIncident({
    side: "HOME",
    goalScorer: homePlayers[2],
    minute: 60,
  }),
  createGoalIncident({
    side: "HOME",
    goalScorer: homePlayers[2],
    goalType: "OWN",
    minute: 60,
  }),
  createGoalIncident({
    minute: 80,
    side: "AWAY",
    goalType: "PENALTY",
    goalScorer: awayPlayers[9],
  }),
  createSubstitutionIncident({
    side: "HOME",
    playerIn: homePlayers[14],
    playerOut: homePlayers[8],
    minute: 90,
  }),
  createSubstitutionIncident({
    side: "AWAY",
    playerIn: awayPlayers[16],
    playerOut: awayPlayers[9],
    minute: 66,
  }),
  createSubstitutionIncident({
    side: "AWAY",
    playerIn: awayPlayers[12],
    playerOut: awayPlayers[5],
    minute: 66,
  }),
];

const EVENT_ID = 1;

const STATS_LINEUPS_CARD_MOCK = {
  __typename: "StatsLineupsCard",
  hasFormationInfo: true,
  urn: `ppb:tbd:stats:card:lineups:${EVENT_ID}`,
  status: "PRE_MATCH",
  fixture: {
    __typename: "FootballFixture",
    urn: `ppb:fixture:${EVENT_ID}`,
    home: {
      ...createTeam("Legends Home", "Jose Mourinho", homePlayers, "4231"),
    },
    away: {
      ...createTeam("Legends Away", "Pep Guardiola", awayPlayers, "433"),
    },
  },
};

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  url: routes.getEventViewUrl(EVENT_ID, false),
  edges: [
    {
      node: {
        __typename: "StatsContentCardGroup",
        urn: `ppb:tbd:stats:cardgroup:statsContent:prismic_doc/e/${EVENT_ID}`,
        partials: {
          edges: [
            {
              displayName: {
                translationKey: "Team Lineups",
                __typename: "DisplayNameTranslationKey",
              },
              type: "LINEUPS",
              node: {
                __typename: "StatsLineupsCard",
                urn: `ppb:tbd:stats:card:lineups:${EVENT_ID}`,
              },
              __typename: "StatsLineupsItemEdge",
            },
          ],

          __typename: "StatsContentItemsConnection",
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "StatsContentCardGroup",
        urn: `ppb:tbd:stats:cardgroup:statsContent:prismic_doc/e/${EVENT_ID}`,
      },
    },
  ],
};

const BFF_CARD_MOCK = {
  cards: [STATS_LINEUPS_CARD_MOCK],
};

const BFF_CARDGROUP_MOCK = {
  cards: [
    {
      __typename: "StatsContentCardGroup",
      urn: `ppb:tbd:stats:cardgroup:statsContent:prismic_doc/e/${EVENT_ID}`,
      partials: {
        edges: [
          {
            displayName: {
              translationKey: "Team Lineups",
              __typename: "DisplayNameTranslationKey",
            },
            type: "LINEUPS",
            node: {
              __typename: "StatsLineupsCard",
              urn: `ppb:tbd:stats:card:lineups:${EVENT_ID}`,
            },
            __typename: "StatsLineupsItemEdge",
          },
        ],
        __typename: "StatsContentItemsConnection",
      },
    },
  ],
};

const SCA_MOCK = {
  fixture: [
    {
      duration: {},
      incidents: incidentsMock,
      eventId: EVENT_ID,
    },
  ],
};

describe("StatsLineupsCard V2", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
    await mockService.mockHttpRequest(getEventLayout(BFF_VIEW_MOCK, { withBottomBar: false }));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getScaResponse(SCA_MOCK));
    await mockService.mockHttpRequest(getCardResults(BFF_CARDGROUP_MOCK));
    await browser.url(routes.getEventViewUrl(EVENT_ID));
  });

  describe("when BFF returns a `StatsLineupsCard` card", () => {
    describe("and the user clicks on the stats content", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getCardResults(BFF_CARD_MOCK));
        await browser.tickFakeClock();
        await statsContentCardGroupPO.element.waitForClickable();
        await statsContentCardGroupPO.element.click();

        await browser.waitUntilDisplayed(segmentedControlPO.element);
        await browser.waitUntilImageEquals(`${MODULE_NAME}_[UNDRLRD-509]_should_display_starting__and_subs_players`);
      });

      it("[UNDRLRD-509]_should_display_starting__and_subs_players", async () => {
        expect(
          await browser.checkScreen(`${MODULE_NAME}_[UNDRLRD-509]_should_display_starting__and_subs_players`),
        ).toBe(0);
      });

      describe("Then user scrolls to the substitutes section", () => {
        beforeAll(async () => {
          await substitutionsCardPO.element.scrollIntoView({ inline: "start" });
          await browser.waitUntilDisplayed(substitutionsCardPO.element);

          await browser.waitUntilDisplayed(captionPO.element);

          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[UNDRLRD-509]_should_display_the_substitutitions_substitutes_and_the_coach`,
          );
        });

        it("[UNDRLRD-509]_should_display_the_substitutitions_substitutes_and_the_coach", async () => {
          expect(
            await browser.checkScreen(
              `${MODULE_NAME}_[UNDRLRD-509]_should_display_the_substitutitions_substitutes_and_the_coach`,
            ),
          ).toEqual(0);
        });
      });
    });
  });
});
