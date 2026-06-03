const { getGenericLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const { swipeUp } = require("../../../../../helpers/gestures");
const {
  SupportingContentButtonSO,
  GenericScreenSO,
  CaptionSO,
  PlayerSO,
  FootballTeamLineupsDetailsSO,
} = require("../../../../../screen-objects");

const CARD_NAME = "stats_lineups_card";
const mockService = new MockService();
const genericScreenSO = new GenericScreenSO();
const supportingContentButtonSO = new SupportingContentButtonSO();

const footballTeamLineupsCaptionSO = new CaptionSO();

const footballTeamLineupsDetailsSO = new FootballTeamLineupsDetailsSO();

const playerSO = new PlayerSO(footballTeamLineupsDetailsSO.playersRowContainers[0]);

const generateIncident = (min, sec, playerId, type, dataType, assist) => {
  let details = {};

  if (type === "PenaltyShootoutIncident") {
    details = {
      penaltyShootoutType: dataType,
      player: {
        __typename: "FootballPlayer",
        id: playerId,
      },
    };
  }

  if (type === "CardIncident") {
    details = {
      player: {
        __typename: "FootballPlayer",
        id: playerId,
      },
      cardType: dataType,
    };
  }

  if (type === "GoalIncident") {
    details = {
      goalType: dataType,
      goalScorer: {
        __typename: "FootballPlayer",
        id: playerId,
      },
      assist: {
        __typename: "FootballPlayer",
        id: assist,
      },
    };
  }

  if (type === "SubstitutionIncident") {
    details = {
      playerIn: {
        __typename: "FootballPlayer",
        id: playerId,
      },
      playerOut: {
        __typename: "FootballPlayer",
        id: dataType,
      },
    };
  }

  return {
    __typename: "FootballIncident",
    clock: {
      __typename: "Clock",
      minute: min,
      second: sec,
    },
    details: {
      __typename: type,
      ...details,
    },
  };
};

const INCIDENTS_MOCK = [
  generateIncident(89, 25, "201", "CardIncident", "YELLOW_RED"),
  generateIncident(80, 57, "201", "CardIncident", "YELLOW"),
  generateIncident(94, 57, "101", "CardIncident", "RED"),
  generateIncident(90, 0, "210", "SubstitutionIncident", "200"),
  generateIncident(74, 25, "205", "GoalIncident", "NORMAL", "206"),
  generateIncident(69, 25, "110", "GoalIncident", "NORMAL", "null"),
  generateIncident(72, 25, "110", "GoalIncident", "NORMAL", "108"),
  generateIncident(67, 25, "108", "GoalIncident", "POSSIBLE", "null"),
  generateIncident(49, 41, "101", "GoalIncident", "OWN", "null"),
  generateIncident(95, 23, "208", "PenaltyShootoutIncident", "MISSED"),
  generateIncident(0, 0, "208", "GoalIncident", "NORMAL", "null"),
];

const generatePlayer = (id, name, shirtNumber, position, startingType) => ({
  __typename: "FootballPlayer",
  id,
  name,
  shirtNumber,
  position,
  startingType,
});

const HOME_SQUAD = [
  generatePlayer("200", "Rui Patricio", 11, "GOALKEEPER", "LINEUP"),
  generatePlayer("201", "Matt Doherty", 2, "DEFENDER", "LINEUP"),
  generatePlayer("202", "Willy Boly", 15, "DEFENDER", "LINEUP"),
  generatePlayer("203", "Connor Coady", 16, "DEFENDER", "LINEUP"),
  generatePlayer("204", "Rúben Vinagre", 29, "DEFENDER", "LINEUP"),
  generatePlayer("205", "Rúben Neves", 8, "MIDFIELDER", "LINEUP"),
  generatePlayer("206", "João Moutinho", 28, "MIDFIELDER", "LINEUP"),
  generatePlayer("207", "Leander Dendoncker", 32, "MIDFIELDER", "LINEUP"),
  generatePlayer("208", "Diogo Jota", 18, "MIDFIELDER", "LINEUP"),
  generatePlayer("209", "Adama Traoré", 37, "MIDFIELDER", "LINEUP"),
  generatePlayer("210", "John Ruddy", 21, "GOALKEEPER", "BENCH"),
  generatePlayer("211", "Max Kilman", 49, "DEFENDER", "BENCH"),
  generatePlayer("212", "Romain Saïss", 27, "DEFENDER", "BENCH"),
  generatePlayer("213", "Morgan Gibbs-White", 17, "MIDFIELDER", "BENCH"),
  generatePlayer("214", "Pedro Neto", 20, "MIDFIELDER", "BENCH"),
  generatePlayer("215", "Rúben Vinagre", 29, "MIDFIELDER", "BENCH"),
  generatePlayer("216", "Patrick Cutrone", 10, "FORWARD", "BENCH"),
  generatePlayer("217", "Leonardo Campana", 30, "FORWARD", "NOT_AVAILABLE"),
];

const AWAY_SQUAD = [
  generatePlayer("100", "Thibaut Courtois", 13, "GOALKEEPER", "LINEUP"),
  generatePlayer("101", "Daniel Carvajal", 2, "DEFENDER", "LINEUP"),
  generatePlayer("102", "Marcelo", 12, "DEFENDER", "LINEUP"),
  generatePlayer("103", "Sergio Ramos", 4, "DEFENDER", "LINEUP"),
  generatePlayer("104", "Raphaël Varane", 5, "DEFENDER", "LINEUP"),
  generatePlayer("105", "Casemiro", 14, "MIDFIELDER", "LINEUP"),
  generatePlayer("106", "Luka Modric", 10, "MIDFIELDER", "LINEUP"),
  generatePlayer("107", "Isco", 22, "MIDFIELDER", "LINEUP"),
  generatePlayer("108", "Rodrygo", 27, "MIDFIELDER", "LINEUP"),
  generatePlayer("109", "Eden Hazard", 7, "MIDFIELDER", "LINEUP"),
  generatePlayer("110", "Karim Benzema", 9, "FORWARD", "LINEUP"),
  generatePlayer("111", "Alphonse Areola", 1, "GOALKEEPER", "BENCH"),
  generatePlayer("112", "Éder Militão", 3, "DEFENDER", "BENCH"),
  generatePlayer("113", "Ferland Mendy", 23, "DEFENDER", "BENCH"),
  generatePlayer("114", "Federico Valverde", 15, "MIDFIELDER", "BENCH"),
  generatePlayer("115", "Vinícius Júnior", 25, "MIDFIELDER", "BENCH"),
  generatePlayer("116", "Luka Jovic", 18, "FORWARD", "BENCH"),
  generatePlayer("117", "Marco Asensio", 20, "MIDFIELDER", "NOT_AVAILABLE"),
];

const EVENT_ID = 1;

const STATS_LINEUPS_CARD_MOCK = {
  __typename: "StatsLineupsCard",
  urn: `ppb:tbd:stats:card:lineups:${EVENT_ID}`,
  status: "PRE_MATCH",
  fixture: {
    __typename: "FootballFixture",
    urn: `ppb:fixture:${EVENT_ID}`,
    home: {
      name: "Home Team",
      squad: {
        manager: "Home Coach",
        players: HOME_SQUAD,
      },
      formation: "4-3-3",
    },
    away: {
      name: "Away Team",
      squad: {
        manager: "Away Coach",
        players: AWAY_SQUAD,
      },
      formation: "4-2-2",
    },
  },
};

const BFF_VIEW_MOCK = {
  urn: "ppb:tbd:view:generic:home",
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
      incidents: INCIDENTS_MOCK,
      eventId: EVENT_ID,
    },
  ],
};

describe("Football Lineups Stats in Event Page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getGenericLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getScaResponse(SCA_MOCK));
    await mockService.mockHttpRequest(getCardResults(BFF_CARDGROUP_MOCK));

    await startApp("home");

    await browser.waitUntilDisplayed(genericScreenSO.element);
  });

  describe("when BFF returns a stats content card group to the event view", () => {
    describe("and the user clicks on the stats lineups button", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getCardResults(BFF_CARD_MOCK));
        await browser.waitUntilClickableNative(
          supportingContentButtonSO.element,
          "Stats Content Button is not clickable",
        );
        await supportingContentButtonSO.element.click();

        await browser.waitUntilDisplayed(playerSO.playerIncidentsContainer);

        await browser.waitUntilImageEquals(`${CARD_NAME}_[PRPI-4941]_should_display_starting__and_subs_players`);
      });

      it("[PRPI-4941]_should_display_starting__and_subs_players", async () => {
        expect(
          (await browser.compareScreen(`${CARD_NAME}_[PRPI-4941]_should_display_starting__and_subs_players`))
            .misMatchPercentage,
        ).toEqual(0);
      });
    });

    describe("and the user swipe until the end of the component", () => {
      beforeAll(async () => {
        await swipeUp();
        await browser.waitUntilDisplayed(footballTeamLineupsCaptionSO.element);
        await browser.waitUntilImageEquals(
          `${CARD_NAME}_[PRPI-4942]_should_display_the_substitutes_the_coach_and_caption_component`,
        );
      });
      it("[PRPI-4942]_should_display_the_substitutes_the_coach_and_caption_component", async () => {
        expect(
          (
            await browser.compareScreen(
              `${CARD_NAME}_[PRPI-4942]_should_display_the_substitutes_the_coach_and_caption_component`,
            )
          ).misMatchPercentage,
        ).toEqual(0);
      });
    });
  });
});
