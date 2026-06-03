import {
  FootballMatchStatus,
  FootballMatchPeriod,
} from "@ppb/tbd-store/state/entities/football-fixture/FootballFixture.types";
import {
  getPropsForMatchTimeline,
  getIncidentEvents,
  getMinutesByMinutesEvents,
  getMatchStatsForTimeline,
} from "./match-timeline";
import {
  TEST_INCIDENTS_SMALL,
  TEST_GOAL_INCIDENT,
  TEST_OWN_GOAL_INCIDENT,
  TEST_RED_CARD_INCIDENT,
  TEST_GOAL_INCIDENT_WITH_ASSIST,
  TEST_GOAL_INCIDENT_WITHOUT_SCORER,
  TEST_YELLOW_CARD_INCIDENT,
  TEST_SECOND_YELLOW_CARD_INCIDENT,
  TEST_CORNER_INCIDENT,
  TEST_FREE_KICK_INCIDENT,
  TEST_GOAL_KICK_INCIDENT,
  TEST_THROW_IN_INCIDENT,
  TEST_FOUL_INCIDENT,
  TEST_OFFSIDE_INCIDENT,
  TEST_ATTACK_INCIDENT,
  TEST_FOUL_INCIDENT_WITH_PLAYER,
  TEST_SHOT_BLOCKED_INCIDENT,
  TEST_SHOT_OFF_TARGET_INCIDENT,
  TEST_SHOT_ON_TARGET_INCIDENT,
  TEST_SHOT_OFF_TARGET_INCIDENT_WITH_PLAYER,
  TEST_SHOT_SAVED_BLOCKED_INCIDENT,
  TEST_SUBSTITUTION_INCIDENT,
  TEST_PERIOD_INCIDENT_REGULAR_INPLAY_FIRST_HALF,
  TEST_PERIOD_INCIDENT_REGULAR_INPLAY_SECOND_HALF,
  TEST_PERIOD_INCIDENT_REGULAR_HALF,
  TEST_PERIOD_INCIDENT_EXTRA_INPLAY_FIRST_HALF,
  TEST_PERIOD_INCIDENT_EXTRA_INPLAY_SECOND_HALF,
  TEST_PERIOD_INCIDENT_EXTRA_HALF,
  TEST_PERIOD_INCIDENT_REGULAR_FULL,
  TEST_PERIOD_INCIDENT_EXTRA_FULL,
  TEST_PERIOD_INCIDENT_END,
  TEST_PERIOD_INCIDENT_INJURY_TIME,
  TEST_MATCH_STATS,
  TEST_MATCH_STATS_GOALS,
} from "./mocked-incidents";

jest.mock("../helpers/i18n", () => ({
  i18n: ({ key }) => key,
}));

global.Date.now = jest.fn(() => new Date("2019-12-23T12:15:00Z"));

describe("Football Incidents view model factory", () => {
  describe("getPropsForMatchTimeline", () => {
    describe("general", () => {
      it("should return the correct props when data is not available", () => {
        const home = {
          name: "Team A",
          crest: {
            vector: "http://sca.qa.internal/Assets/Team%20Logo/English%20Premier%20League/Aston%20Villa.svg",
            small: "http://sca.qa.internal/Assets/logo/small/40.png",
            medium: "http://sca.qa.internal/Assets/logo/medium/40.png",
            large: "http://sca.qa.internal/Assets/logo/big/40.png",
          },
        };
        const away = {
          name: "Team B",
          crest: {
            small: "http://sca.qa.internal/Assets/logo/small/34.png",
            medium: "http://sca.qa.internal/Assets/logo/medium/34.png",
            large: "http://sca.qa.internal/Assets/logo/big/34.png",
          },
        };
        const incidents = [];
        const duration = {};

        expect(getPropsForMatchTimeline(duration, incidents, home, away)).toEqual({
          awayCrest: "http://sca.qa.internal/Assets/logo/big/34.png",
          homeCrest: "http://sca.qa.internal/Assets/Team%20Logo/English%20Premier%20League/Aston%20Villa.svg",
          lastIncident: undefined,
          timelines: [
            {
              awayIncidents: [],
              caption: "I18N.FOOTBALL_SCOREBOARD.HALF",
              homeIncidents: [],
              minute: 0,
              periodLength: 45,
              viewMode: "NORMAL",
            },
            {
              awayIncidents: [],
              caption: "I18N.FOOTBALL_SCOREBOARD.FULL",
              homeIncidents: [],
              minute: 0,
              periodLength: 45,
              viewMode: "NORMAL",
            },
          ],
          translations: {
            prematch: "I18N.MATCH_TIMELINE.PREMATCH",
          },
          viewMode: "CONDENSED",
        });
      });

      it("should return undefined when the event is in PRE_MATCH state", () => {
        const home = {};
        const away = {};
        const incidents = [];
        const duration = {
          status: "PRE_MATCH",
        };

        expect(getPropsForMatchTimeline(duration, incidents, home, away)).toEqual(undefined);
      });

      it("should return lastIncident when available", () => {
        const home = {};
        const away = {};
        const incidents = [
          {
            period: "REGULAR",
            periodStatus: "INPLAY_SECOND_HALF",
            clock: {
              minute: 72,
              second: 53,
            },
            type: "CardIncident",
            details: {
              __typename: "CardIncident",
              cardType: "YELLOW",
              side: "HOME",
              player: {
                id: 2,
                name: "Marius Simion",
                position: "DEFENDER",
                shirtNumber: 8,
                startingType: "LINEUP",
              },
            },
          },
        ];
        const duration = {
          status: "INPLAY_SECOND_HALF",
          period: "REGULAR",
          clock: {
            minute: 67,
            second: 12,
          },
        };
        const { lastIncident } = getPropsForMatchTimeline(duration, incidents, home, away);
        expect(lastIncident).not.toBe(undefined);
        expect(lastIncident.label).toEqual("I18N.MATCH_TIMELINE.CARD_YELLOW");
        expect(lastIncident.minute).toEqual(73);
        expect(lastIncident.player).toEqual("Marius Simion");
      });

      it("should return lastIncident when available - Goal", () => {
        const home = {};
        const away = {};
        const incidents = [
          {
            period: "REGULAR",
            periodStatus: "INPLAY_SECOND_HALF",
            clock: {
              minute: 72,
              second: 53,
            },
            type: "GoalIncident",
            details: {
              __typename: "GoalIncident",
              goalType: "NORMAL",
              side: "HOME",
              goalScorer: {
                id: 2,
                name: "Marius Simion",
                position: "DEFENDER",
                shirtNumber: 8,
                startingType: "LINEUP",
              },
            },
          },
        ];
        const duration = {
          status: "INPLAY_SECOND_HALF",
          period: "REGULAR",
          clock: {
            minute: 67,
            second: 12,
          },
        };
        const { lastIncident } = getPropsForMatchTimeline(duration, incidents, home, away);
        expect(lastIncident).not.toBe(undefined);
        expect(lastIncident.label).toEqual("I18N.MATCH_TIMELINE.GOAL");
        expect(lastIncident.minute).toEqual(73);
        expect(lastIncident.player).toEqual("Marius Simion");
      });

      it("should not return lastIncident when incident is FOUL_INCIDENT", () => {
        const home = {};
        const away = {};
        const incidents = [
          {
            period: "REGULAR",
            periodStatus: "INPLAY_SECOND_HALF",
            clock: {
              minute: 72,
              second: 53,
            },
            type: "FoulIncident",
            details: {
              __typename: "FoulIncident",
              foulType: "FOUL",
              side: "HOME",
            },
          },
        ];
        const duration = {
          status: "INPLAY_SECOND_HALF",
          period: "REGULAR",
          clock: {
            minute: 67,
            second: 12,
          },
        };
        const { lastIncident } = getPropsForMatchTimeline(duration, incidents, home, away);
        expect(lastIncident).toBe(undefined);
      });
    });

    describe("timelines", () => {
      it("should render timelines correctly when INPLAY_FIRST_HALF/REGULAR", () => {
        const home = {};
        const away = {};
        const incidents = [
          {
            period: "REGULAR",
            periodStatus: "INPLAY_FIRST_HALF",
            clock: {
              minute: 15,
              second: 53,
            },
            type: "CardIncident",
            details: {
              __typename: "CardIncident",
              cardType: "YELLOW",
              side: "AWAY",
              player: {
                id: 2,
                name: "Marius Simion",
                position: "DEFENDER",
                shirtNumber: 8,
                startingType: "LINEUP",
              },
            },
          },
          {
            period: "REGULAR",
            periodStatus: "INPLAY_FIRST_HALF",
            clock: {
              minute: 30,
              second: 53,
            },
            type: "CardIncident",
            details: {
              __typename: "CardIncident",
              cardType: "YELLOW_RED",
              side: "AWAY",
              player: {
                id: 2,
                name: "Marius Simion",
                position: "DEFENDER",
                shirtNumber: 8,
                startingType: "LINEUP",
              },
            },
          },
          {
            period: "REGULAR",
            periodStatus: "INPLAY_FIRST_HALF",
            clock: {
              minute: 19,
              second: 53,
            },
            type: "PenaltyShootoutIncident",
            details: {
              __typename: "PenaltyShootoutIncident",
              side: "AWAY",
              penaltyShootoutType: "SCORED",
              player: {
                id: "7",
                name: "Marius Simion",
                position: "DEFENDER",
                shirtNumber: 8,
                startingType: "LINEUP",
              },
            },
          },
        ];
        const duration = {
          status: "INPLAY_FIRST_HALF",
          period: "REGULAR",
          clock: {
            minute: 23,
            second: 12,
          },
        };
        const { timelines } = getPropsForMatchTimeline(duration, incidents, home, away);
        expect(timelines.length).toBe(2);
        expect(timelines[0].minute).toBe(23);
        expect(timelines[0].periodLength).toBe(45);
        expect(timelines[1].minute).toBe(0);
        expect(timelines[1].periodLength).toBe(45);
      });

      it("should render timelines correctly when INPLAY_FIRST_HALF/EXTRA", () => {
        const home = {};
        const away = {};
        const incidents = [
          {
            period: "EXTRA",
            periodStatus: "INPLAY_FIRST_HALF",
            clock: {
              minute: 97,
              second: 53,
            },
            type: "CardIncident",
            details: {
              __typename: "CardIncident",
              cardType: "YELLOW",
              side: "AWAY",
              player: {
                id: 2,
                name: "Marius Simion",
                position: "DEFENDER",
                shirtNumber: 8,
                startingType: "LINEUP",
              },
            },
          },
        ];
        const duration = {
          status: "INPLAY_FIRST_HALF",
          period: "EXTRA",
          clock: {
            minute: 98,
            second: 12,
          },
        };
        const { timelines } = getPropsForMatchTimeline(duration, incidents, home, away);
        expect(timelines.length).toBe(4);
        expect(timelines[0].minute).toBe(45);
        expect(timelines[0].periodLength).toBe(45);
        expect(timelines[1].minute).toBe(45);
        expect(timelines[1].periodLength).toBe(45);
        expect(timelines[2].minute).toBe(8);
        expect(timelines[2].periodLength).toBe(15);
        expect(timelines[3].minute).toBe(0);
        expect(timelines[3].periodLength).toBe(15);
      });

      it("should render timelines correctly when status is HALF/REGULAR", () => {
        const home = {};
        const away = {};
        const incidents = [];
        const duration = {
          status: "HALF",
          period: "REGULAR",
          clock: {
            minute: 45,
            second: 12,
          },
        };
        const { timelines } = getPropsForMatchTimeline(duration, incidents, home, away);
        expect(timelines.length).toBe(2);
        expect(timelines[0].minute).toBe(45);
        expect(timelines[0].periodLength).toBe(45);
        expect(timelines[1].minute).toBe(0);
        expect(timelines[1].periodLength).toBe(45);
      });

      it("should render timelines correctly when status is HALF/EXTRA", () => {
        const home = {};
        const away = {};
        const incidents = [];
        const duration = {
          status: "HALF",
          period: "EXTRA",
          clock: {
            minute: 105,
            second: 12,
          },
        };
        const { timelines } = getPropsForMatchTimeline(duration, incidents, home, away);
        expect(timelines.length).toBe(4);
        expect(timelines[0].minute).toBe(45);
        expect(timelines[0].periodLength).toBe(45);
        expect(timelines[1].minute).toBe(45);
        expect(timelines[1].periodLength).toBe(45);
        expect(timelines[2].minute).toBe(15);
        expect(timelines[2].periodLength).toBe(15);
        expect(timelines[3].minute).toBe(0);
        expect(timelines[3].periodLength).toBe(15);
      });

      it("should render timelines correctly when status is FULL/REGULAR", () => {
        const home = {};
        const away = {};
        const incidents = [];
        const duration = {
          status: "FULL",
          period: "REGULAR",
          clock: {
            minute: 92,
            second: 12,
          },
        };
        const { timelines } = getPropsForMatchTimeline(duration, incidents, home, away);
        expect(timelines.length).toBe(2);
        expect(timelines[0].minute).toBe(45);
        expect(timelines[0].periodLength).toBe(45);
        expect(timelines[1].minute).toBe(45);
        expect(timelines[1].periodLength).toBe(45);
      });

      it("should render timelines correctly when status is FULL/EXTRA", () => {
        const home = {};
        const away = {};
        const incidents = [];
        const duration = {
          status: "FULL",
          period: "EXTRA",
          clock: {
            minute: 92,
            second: 12,
          },
        };
        const { timelines } = getPropsForMatchTimeline(duration, incidents, home, away);
        expect(timelines.length).toBe(4);
        expect(timelines[0].minute).toBe(45);
        expect(timelines[0].periodLength).toBe(45);
        expect(timelines[1].minute).toBe(45);
        expect(timelines[1].periodLength).toBe(45);
        expect(timelines[2].minute).toBe(15);
        expect(timelines[2].periodLength).toBe(15);
        expect(timelines[3].minute).toBe(15);
        expect(timelines[3].periodLength).toBe(15);
      });

      it("should render timelines correctly when INPLAY_SECOND_HALF/REGULAR", () => {
        const home = {};
        const away = {};
        const incidents = [];
        const duration = {
          status: "INPLAY_SECOND_HALF",
          period: "REGULAR",
          clock: {
            minute: 49,
            second: 12,
          },
        };
        const { timelines } = getPropsForMatchTimeline(duration, incidents, home, away);
        expect(timelines.length).toBe(2);
        expect(timelines[0].minute).toBe(45);
        expect(timelines[0].periodLength).toBe(45);
        expect(timelines[1].minute).toBe(4);
        expect(timelines[1].periodLength).toBe(45);
      });

      it("should render timelines correctly when INPLAY_SECOND_HALF/EXTRA", () => {
        const home = {};
        const away = {};
        const incidents = [];
        const duration = {
          status: "INPLAY_SECOND_HALF",
          period: "EXTRA",
          clock: {
            minute: 107,
            second: 12,
          },
        };
        const { timelines } = getPropsForMatchTimeline(duration, incidents, home, away);
        expect(timelines.length).toBe(4);
        expect(timelines[0].minute).toBe(45);
        expect(timelines[0].periodLength).toBe(45);
        expect(timelines[1].minute).toBe(45);
        expect(timelines[1].periodLength).toBe(45);
        expect(timelines[2].minute).toBe(15);
        expect(timelines[2].periodLength).toBe(15);
        expect(timelines[3].minute).toBe(2);
        expect(timelines[3].periodLength).toBe(15);
      });
    });
  });

  describe("getIncidentEvents", () => {
    it("should return the correct number of incidents", () => {
      const { homeIncidents, awayIncidents } = getIncidentEvents(TEST_INCIDENTS_SMALL);
      expect(homeIncidents.length).toBe(2);
      expect(awayIncidents.length).toBe(3);
    });

    it("should return the correct incidents details", () => {
      const { homeIncidents, awayIncidents } = getIncidentEvents(TEST_INCIDENTS_SMALL);
      expect(homeIncidents[1].minutes).toEqual(["90 +4"]);
      expect(homeIncidents[1].player).toBe("Roger D.");
      expect(homeIncidents[1].displayOrder).toBe("REVERSED");

      expect(awayIncidents[0].minutes).toEqual(["45 +3"]);
      expect(awayIncidents[0].player).toBe("Cristiano R.");
      expect(awayIncidents[0].displayOrder).toBe("NORMAL");
    });
  });

  describe("getMinutesByMinutesEvents", () => {
    describe("should return the correct props", () => {
      it("should return the correct number of incidents", () => {
        const { minutesByMinutesFirstHalf, minutesByMinutesSecondHalf } =
          getMinutesByMinutesEvents(TEST_INCIDENTS_SMALL);
        expect(minutesByMinutesFirstHalf.length).toBe(4);
        expect(minutesByMinutesSecondHalf.length).toBe(1);
      });
    });

    describe("mapFootballIncidentToIncidentNotification", () => {
      it("should map correctly the Goal Incident", () => {
        const { minutesByMinutesFirstHalf } = getMinutesByMinutesEvents([TEST_GOAL_INCIDENT]);
        const goalEvent = minutesByMinutesFirstHalf[0];
        expect(goalEvent).toEqual({
          minute: 27,
          events: [
            {
              notificationEventType: "GOAL",
              notificationEventProps: {
                title: "I18N.MATCH_TIMELINE.GOAL_NOTIFICATION",
                description: "Cristiano R.",
                secondDescription: "",
                side: "AWAY",
                isOwnGoal: false,
              },
            },
          ],
        });
      });

      it("should map correctly the Goal Incident With Assist", () => {
        const { minutesByMinutesFirstHalf } = getMinutesByMinutesEvents([TEST_GOAL_INCIDENT_WITH_ASSIST]);
        const goalEvent = minutesByMinutesFirstHalf[0];
        expect(goalEvent).toEqual({
          minute: 27,
          events: [
            {
              notificationEventType: "GOAL",
              notificationEventProps: {
                title: "I18N.MATCH_TIMELINE.GOAL_NOTIFICATION",
                description: "Cristiano R.",
                secondDescription: "I18N.MATCH_TIMELINE.ASSIST Marcelo D.",
                side: "AWAY",
                isOwnGoal: false,
              },
            },
          ],
        });
      });

      it("should map correctly the Goal Incident Without Scorer", () => {
        const { minutesByMinutesFirstHalf } = getMinutesByMinutesEvents([TEST_GOAL_INCIDENT_WITHOUT_SCORER]);
        const goalEvent = minutesByMinutesFirstHalf[0];
        expect(goalEvent).toEqual({
          minute: 27,
          events: [
            {
              notificationEventType: "GOAL",
              notificationEventProps: {
                title: "I18N.MATCH_TIMELINE.GOAL_NOTIFICATION",
                description: "",
                secondDescription: "",
                side: "AWAY",
                isOwnGoal: false,
              },
            },
          ],
        });
      });

      it("should map correctly the Own Goal Incident", () => {
        const { minutesByMinutesFirstHalf } = getMinutesByMinutesEvents([TEST_OWN_GOAL_INCIDENT]);
        const goalEvent = minutesByMinutesFirstHalf[0];
        expect(goalEvent).toEqual({
          minute: 27,
          events: [
            {
              notificationEventType: "GOAL",
              notificationEventProps: {
                title: "I18N.MATCH_TIMELINE.OWN_GOAL_NOTIFICATION",
                description: "Cristiano R.",
                secondDescription: "",
                side: "AWAY",
                isOwnGoal: true,
              },
            },
          ],
        });
      });

      it("should map correctly the Red Card Incident", () => {
        const { minutesByMinutesSecondHalf } = getMinutesByMinutesEvents([TEST_RED_CARD_INCIDENT]);
        const cardEvent = minutesByMinutesSecondHalf[0];
        expect(cardEvent).toEqual({
          minute: 55,
          events: [
            {
              notificationEventType: "CARD",
              notificationEventProps: {
                title: "I18N.MATCH_TIMELINE.CARD_RED",
                description: "Roger D.",
                cardType: "RED",
                side: "HOME",
              },
            },
          ],
        });
      });

      it("should map correctly the Yellow Card Incident", () => {
        const { minutesByMinutesSecondHalf } = getMinutesByMinutesEvents([TEST_YELLOW_CARD_INCIDENT]);
        const cardEvent = minutesByMinutesSecondHalf[0];
        expect(cardEvent).toEqual({
          minute: 55,
          events: [
            {
              notificationEventType: "CARD",
              notificationEventProps: {
                title: "I18N.MATCH_TIMELINE.CARD_YELLOW",
                description: "Roger D.",
                cardType: "YELLOW",
                side: "HOME",
              },
            },
          ],
        });
      });

      it("should map correctly the Second Yellow Card Incident", () => {
        const { minutesByMinutesSecondHalf } = getMinutesByMinutesEvents([TEST_SECOND_YELLOW_CARD_INCIDENT]);
        const cardEvent = minutesByMinutesSecondHalf[0];
        expect(cardEvent).toEqual({
          minute: 55,
          events: [
            {
              notificationEventType: "CARD",
              notificationEventProps: {
                title: "I18N.MATCH_TIMELINE.CARD_SECOND_YELLOW",
                description: "Roger D.",
                cardType: "SECOND_YELLOW",
                side: "HOME",
              },
            },
          ],
        });
      });

      it("should map correctly the CORNER Incident", () => {
        const { minutesByMinutesFirstHalf } = getMinutesByMinutesEvents([TEST_CORNER_INCIDENT]);
        const cardEvent = minutesByMinutesFirstHalf[0];
        expect(cardEvent).toEqual({
          minute: 11,
          events: [
            {
              notificationEventType: "TEAM",
              notificationEventProps: {
                title: "I18N.MATCH_TIMELINE.CORNER",
                description: "",
                side: "HOME",
              },
            },
          ],
        });
      });

      it("should map correctly the FREE_KICK Incident", () => {
        const { minutesByMinutesFirstHalf } = getMinutesByMinutesEvents([TEST_FREE_KICK_INCIDENT]);
        const cardEvent = minutesByMinutesFirstHalf[0];
        expect(cardEvent).toEqual({
          minute: 11,
          events: [
            {
              notificationEventType: "TEAM",
              notificationEventProps: {
                title: "I18N.MATCH_TIMELINE.FREE_KICK",
                description: "",
                side: "HOME",
              },
            },
          ],
        });
      });

      it("should map correctly the THROW_IN Incident", () => {
        const { minutesByMinutesFirstHalf } = getMinutesByMinutesEvents([TEST_THROW_IN_INCIDENT]);
        const cardEvent = minutesByMinutesFirstHalf[0];
        expect(cardEvent).toEqual({
          minute: 11,
          events: [
            {
              notificationEventType: "TEAM",
              notificationEventProps: {
                title: "I18N.MATCH_TIMELINE.THROW_IN",
                description: "",
                side: "HOME",
              },
            },
          ],
        });
      });

      it("should map correctly the GOAL_KICK Incident", () => {
        const { minutesByMinutesFirstHalf } = getMinutesByMinutesEvents([TEST_GOAL_KICK_INCIDENT]);
        const cardEvent = minutesByMinutesFirstHalf[0];
        expect(cardEvent).toEqual({
          minute: 11,
          events: [
            {
              notificationEventType: "TEAM",
              notificationEventProps: {
                title: "I18N.MATCH_TIMELINE.GOAL_KICK",
                description: "",
                side: "HOME",
              },
            },
          ],
        });
      });

      it("should map correctly the FOUL Incident", () => {
        const { minutesByMinutesFirstHalf } = getMinutesByMinutesEvents([TEST_FOUL_INCIDENT]);
        const cardEvent = minutesByMinutesFirstHalf[0];
        expect(cardEvent).toEqual({
          minute: 11,
          events: [
            {
              notificationEventType: "TEAM",
              notificationEventProps: {
                title: "I18N.MATCH_TIMELINE.FOUL",
                description: "",
                side: "HOME",
              },
            },
          ],
        });
      });

      it("should map correctly the FOUL Incident with Player", () => {
        const { minutesByMinutesFirstHalf } = getMinutesByMinutesEvents([TEST_FOUL_INCIDENT_WITH_PLAYER]);
        const cardEvent = minutesByMinutesFirstHalf[0];
        expect(cardEvent).toEqual({
          minute: 11,
          events: [
            {
              notificationEventType: "TEAM",
              notificationEventProps: {
                title: "I18N.MATCH_TIMELINE.FOUL",
                description: "Stanescu H.",
                side: "HOME",
              },
            },
          ],
        });
      });

      it("should map correctly the OFFSIDE Incident", () => {
        const { minutesByMinutesFirstHalf } = getMinutesByMinutesEvents([TEST_OFFSIDE_INCIDENT]);
        const cardEvent = minutesByMinutesFirstHalf[0];
        expect(cardEvent).toEqual({
          minute: 11,
          events: [
            {
              notificationEventType: "TEAM",
              notificationEventProps: {
                title: "I18N.MATCH_TIMELINE.OFFSIDE",
                description: "",
                side: "HOME",
              },
            },
          ],
        });
      });

      it("should map correctly the ATTACK Incident", () => {
        const { minutesByMinutesFirstHalf } = getMinutesByMinutesEvents([TEST_ATTACK_INCIDENT]);
        const cardEvent = minutesByMinutesFirstHalf[0];
        expect(cardEvent).toEqual({
          minute: 11,
          events: [
            {
              notificationEventType: "TEAM",
              notificationEventProps: {
                title: "I18N.MATCH_TIMELINE.DANGEROUS_ATTACK",
                description: "",
                side: "HOME",
              },
            },
          ],
        });
      });

      it("should map correctly the SHOT OFF TARGET Incident", () => {
        const { minutesByMinutesFirstHalf } = getMinutesByMinutesEvents([TEST_SHOT_OFF_TARGET_INCIDENT]);
        const cardEvent = minutesByMinutesFirstHalf[0];
        expect(cardEvent).toEqual({
          minute: 11,
          events: [
            {
              notificationEventType: "TEAM",
              notificationEventProps: {
                title: "I18N.MATCH_TIMELINE.SHOTS_OFF_TARGET",
                description: "",
                side: "HOME",
              },
            },
          ],
        });
      });

      it("should map correctly the SHOT OFF TARGET Incident with Player", () => {
        const { minutesByMinutesFirstHalf } = getMinutesByMinutesEvents([TEST_SHOT_OFF_TARGET_INCIDENT_WITH_PLAYER]);
        const cardEvent = minutesByMinutesFirstHalf[0];
        expect(cardEvent).toEqual({
          minute: 11,
          events: [
            {
              notificationEventType: "TEAM",
              notificationEventProps: {
                title: "I18N.MATCH_TIMELINE.SHOTS_OFF_TARGET",
                description: "Hagi G.",
                side: "HOME",
              },
            },
          ],
        });
      });

      it("should map correctly the SHOT ON TARGET Incident", () => {
        const { minutesByMinutesFirstHalf } = getMinutesByMinutesEvents([TEST_SHOT_ON_TARGET_INCIDENT]);
        const cardEvent = minutesByMinutesFirstHalf[0];
        expect(cardEvent).toEqual({
          minute: 11,
          events: [
            {
              notificationEventType: "TEAM",
              notificationEventProps: {
                title: "I18N.MATCH_TIMELINE.SHOTS_ON_TARGET",
                description: "",
                side: "HOME",
              },
            },
          ],
        });
      });

      it("should map correctly the SHOT SAVED Incident", () => {
        const { minutesByMinutesFirstHalf } = getMinutesByMinutesEvents([TEST_SHOT_BLOCKED_INCIDENT]);
        const cardEvent = minutesByMinutesFirstHalf[0];
        expect(cardEvent).toEqual({
          minute: 11,
          events: [
            {
              notificationEventType: "TEAM",
              notificationEventProps: {
                title: "I18N.MATCH_TIMELINE.BLOCKED_SHOT",
                description: "",
                side: "HOME",
              },
            },
          ],
        });
      });

      it("should map correctly the SHOT SAVED BLOCKED Incident", () => {
        const { minutesByMinutesFirstHalf } = getMinutesByMinutesEvents([TEST_SHOT_SAVED_BLOCKED_INCIDENT]);
        const cardEvent = minutesByMinutesFirstHalf[0];
        expect(cardEvent).toEqual({
          minute: 11,
          events: [
            {
              notificationEventType: "TEAM",
              notificationEventProps: {
                title: "I18N.MATCH_TIMELINE.BLOCKED_SHOT",
                description: "",
                side: "HOME",
              },
            },
          ],
        });
      });

      it("should map correctly the SUBSTITUTION Incident", () => {
        const { minutesByMinutesFirstHalf } = getMinutesByMinutesEvents([TEST_SUBSTITUTION_INCIDENT]);
        const cardEvent = minutesByMinutesFirstHalf[0];
        expect(cardEvent).toEqual({
          minute: 11,
          events: [
            {
              notificationEventType: "SUBSTITUTION",
              notificationEventProps: {
                title: "I18N.MATCH_TIMELINE.SUBSTITUTION",
                playerIn: "Player In",
                playerOut: "Player Out",
                side: "HOME",
              },
            },
          ],
        });
      });

      it("should map correctly the PERIOD Incident - Regular inplay_first_half", () => {
        const { minutesByMinutesFirstHalf } = getMinutesByMinutesEvents([
          TEST_PERIOD_INCIDENT_REGULAR_INPLAY_FIRST_HALF,
        ]);
        const cardEvent = minutesByMinutesFirstHalf[0];
        expect(cardEvent).toEqual({
          minute: 1,
          events: [
            {
              notificationEventType: "NOTIFICATION",
              notificationEventProps: {
                title: "I18N.MATCH_TIMELINE.KICK_OFF",
                description: "",
              },
            },
          ],
        });
      });

      it("should map correctly the PERIOD Incident - Regular inplay_second_half", () => {
        const { minutesByMinutesSecondHalf } = getMinutesByMinutesEvents([
          TEST_PERIOD_INCIDENT_REGULAR_INPLAY_SECOND_HALF,
        ]);
        const cardEvent = minutesByMinutesSecondHalf[0];
        expect(cardEvent).toEqual({
          minute: 46,
          events: [
            {
              notificationEventType: "NOTIFICATION",
              notificationEventProps: {
                title: "I18N.MATCH_TIMELINE.SECOND_HALF",
                description: "I18N.MATCH_TIMELINE.STARTS",
              },
            },
          ],
        });
      });

      it("should map correctly the PERIOD Incident - Regular HALF", () => {
        const { minutesByMinutesFirstHalf } = getMinutesByMinutesEvents([TEST_PERIOD_INCIDENT_REGULAR_HALF]);
        const cardEvent = minutesByMinutesFirstHalf[0];
        expect(cardEvent).toEqual({
          minute: 46,
          events: [
            {
              notificationEventType: "NOTIFICATION",
              notificationEventProps: {
                title: "I18N.MATCH_TIMELINE.FIRST_HALF",
                description: "I18N.MATCH_TIMELINE.ENDS",
              },
            },
          ],
        });
      });

      it("should map correctly the PERIOD Incident - EXTRA inplay_first_half", () => {
        const { minutesByMinutesExtraTimeFH } = getMinutesByMinutesEvents([
          TEST_PERIOD_INCIDENT_EXTRA_INPLAY_FIRST_HALF,
        ]);
        const cardEvent = minutesByMinutesExtraTimeFH[0];
        expect(cardEvent).toEqual({
          minute: 91,
          events: [
            {
              notificationEventType: "NOTIFICATION",
              notificationEventProps: {
                title: "I18N.MATCH_TIMELINE.ET_KICK_OFF",
                description: "",
              },
            },
          ],
        });
      });

      it("should map correctly the PERIOD Incident - EXTRA HALF", () => {
        const { minutesByMinutesExtraTimeFH } = getMinutesByMinutesEvents([TEST_PERIOD_INCIDENT_EXTRA_HALF]);
        const cardEvent = minutesByMinutesExtraTimeFH[0];
        expect(cardEvent).toEqual({
          minute: 46,
          events: [
            {
              notificationEventType: "NOTIFICATION",
              notificationEventProps: {
                title: "I18N.MATCH_TIMELINE.ET_FIRST_HALF",
                description: "I18N.MATCH_TIMELINE.ENDS",
              },
            },
          ],
        });
      });

      it("should map correctly the PERIOD Incident - EXTRA inplay_second_half", () => {
        const { minutesByMinutesExtraTimeSH } = getMinutesByMinutesEvents([
          TEST_PERIOD_INCIDENT_EXTRA_INPLAY_SECOND_HALF,
        ]);
        const cardEvent = minutesByMinutesExtraTimeSH[0];
        expect(cardEvent).toEqual({
          minute: 106,
          events: [
            {
              notificationEventType: "NOTIFICATION",
              notificationEventProps: {
                title: "I18N.MATCH_TIMELINE.ET_SECOND_HALF",
                description: "I18N.MATCH_TIMELINE.STARTS",
              },
            },
          ],
        });
      });

      it("should map correctly the PERIOD Incident - REGULAR FULL", () => {
        const { minutesByMinutesSecondHalf } = getMinutesByMinutesEvents([TEST_PERIOD_INCIDENT_REGULAR_FULL]);
        const cardEvent = minutesByMinutesSecondHalf[0];
        expect(cardEvent).toEqual({
          minute: 91,
          events: [
            {
              notificationEventType: "NOTIFICATION",
              notificationEventProps: {
                title: "I18N.MATCH_TIMELINE.SECOND_HALF",
                description: "I18N.MATCH_TIMELINE.ENDS",
              },
            },
          ],
        });
      });

      it("should map correctly the PERIOD Incident - EXTRA FULL", () => {
        const { minutesByMinutesExtraTimeSH } = getMinutesByMinutesEvents([TEST_PERIOD_INCIDENT_EXTRA_FULL]);
        const cardEvent = minutesByMinutesExtraTimeSH[0];
        expect(cardEvent).toEqual({
          minute: 121,
          events: [
            {
              notificationEventType: "NOTIFICATION",
              notificationEventProps: {
                title: "I18N.MATCH_TIMELINE.ET_SECOND_HALF",
                description: "I18N.MATCH_TIMELINE.ENDS",
              },
            },
          ],
        });
      });

      it("should map correctly the PERIOD Incident - END", () => {
        const { minutesByMinutesSecondHalf } = getMinutesByMinutesEvents([TEST_PERIOD_INCIDENT_END]);
        const cardEvent = minutesByMinutesSecondHalf[0];
        expect(cardEvent).toEqual({
          minute: 91,
          events: [
            {
              notificationEventType: "NOTIFICATION",
              notificationEventProps: {
                title: "I18N.MATCH_TIMELINE.SECOND_HALF",
                description: "I18N.MATCH_TIMELINE.ENDS",
              },
            },
          ],
        });
      });

      it("should map correctly the PERIOD Incident - Injury time", () => {
        const { minutesByMinutesFirstHalf } = getMinutesByMinutesEvents([TEST_PERIOD_INCIDENT_INJURY_TIME]);
        const cardEvent = minutesByMinutesFirstHalf[0];
        expect(cardEvent).toEqual({
          minute: 45,
          events: [
            {
              notificationEventType: "NOTIFICATION",
              notificationEventProps: {
                title: "I18N.MATCH_TIMELINE.INJURY_TIME",
                description: "+3'",
              },
            },
          ],
        });
      });
    });
  });

  describe("getMatchStatsForTimeline", () => {
    const homeTeam = {
      name: "Team A",
    };
    const awayTeam = {
      name: "Team B",
    };

    it("should return undefined when status is INPLAY_FIRST_HALF and period is REGULAR", () => {
      const duration = {
        status: FootballMatchStatus.INPLAY_FIRST_HALF,
        period: FootballMatchPeriod.REGULAR,
      };
      const { matchStatsHalfTime } = getMatchStatsForTimeline(TEST_MATCH_STATS, homeTeam, awayTeam, duration);

      expect(matchStatsHalfTime).toEqual(undefined);
    });

    it("should return undefined when status is PRE_MATCH and period is REGULAR", () => {
      const duration = {
        status: FootballMatchStatus.PRE_MATCH,
        period: FootballMatchPeriod.REGULAR,
      };
      const { matchStatsHalfTime } = getMatchStatsForTimeline(TEST_MATCH_STATS, homeTeam, awayTeam, duration);

      expect(matchStatsHalfTime).toEqual(undefined);
    });

    it("should return correclty when status is HALF and period is REGULAR", () => {
      const duration = {
        status: FootballMatchStatus.HALF,
        period: FootballMatchPeriod.REGULAR,
      };
      const { matchStatsHalfTime, matchStatsFullTime, matchStatsExtraFH, matchStatsExtraEnd } =
        getMatchStatsForTimeline(TEST_MATCH_STATS, duration, homeTeam, awayTeam);

      expect(matchStatsHalfTime).toEqual({
        periodStat: {
          title: "I18N.MATCH_TIMELINE.FIRST_HALF",
          resultProps: {
            homeTeamName: "Team A",
            homeTeamCrest: "",
            awayTeamName: "Team B",
            awayTeamCrest: "",
            score: "0 - 0",
            viewMode: "MIN",
            i18n: {
              aet: "I18N.HEAD_TO_HEAD.AFTER_EXTRA_TIME",
              penalties: "I18N.HEAD_TO_HEAD.PENALTIES",
            },
          },
        },
        stats: [
          {
            home: 39,
            away: 61,
            homeColor: "",
            awayColor: "",
            label: "I18N.MATCH_STATS.POSSESSION",
          },
          {
            home: 1,
            away: 4,
            homeColor: "",
            awayColor: "",
            label: "I18N.MATCH_STATS.SHOTS_ON_TARGET",
          },
          {
            home: 5,
            away: 7,
            homeColor: "",
            awayColor: "",
            label: "I18N.MATCH_STATS.SHOTS_OFF_TARGET",
          },
          {
            home: 2,
            away: 4,
            homeColor: "",
            awayColor: "",
            label: "I18N.MATCH_STATS.DANGEROUS_ATTACKS",
          },
        ],
      });

      expect(matchStatsFullTime).toBe(undefined);
      expect(matchStatsExtraFH).toBe(undefined);
      expect(matchStatsExtraEnd).toBe(undefined);
    });

    it("should return correclty when status is FULL and period is REGULAR", () => {
      const duration = {
        status: FootballMatchStatus.FULL,
        period: FootballMatchPeriod.REGULAR,
      };
      const { matchStatsHalfTime, matchStatsFullTime, matchStatsExtraFH, matchStatsExtraEnd } =
        getMatchStatsForTimeline(TEST_MATCH_STATS, duration, homeTeam, awayTeam);

      expect(matchStatsHalfTime).toEqual({
        periodStat: {
          title: "I18N.MATCH_TIMELINE.FIRST_HALF",
          resultProps: {
            homeTeamName: "Team A",
            homeTeamCrest: "",
            awayTeamName: "Team B",
            awayTeamCrest: "",
            score: "0 - 0",
            viewMode: "MIN",
            i18n: {
              aet: "I18N.HEAD_TO_HEAD.AFTER_EXTRA_TIME",
              penalties: "I18N.HEAD_TO_HEAD.PENALTIES",
            },
          },
        },
        stats: [
          {
            home: 39,
            away: 61,
            homeColor: "",
            awayColor: "",
            label: "I18N.MATCH_STATS.POSSESSION",
          },
          {
            home: 1,
            away: 4,
            homeColor: "",
            awayColor: "",
            label: "I18N.MATCH_STATS.SHOTS_ON_TARGET",
          },
          {
            home: 5,
            away: 7,
            homeColor: "",
            awayColor: "",
            label: "I18N.MATCH_STATS.SHOTS_OFF_TARGET",
          },
          {
            home: 2,
            away: 4,
            homeColor: "",
            awayColor: "",
            label: "I18N.MATCH_STATS.DANGEROUS_ATTACKS",
          },
        ],
      });

      expect(matchStatsFullTime).toEqual({
        periodStat: {
          title: "I18N.MATCH_TIMELINE.FULL_TIME",
          resultProps: {
            homeTeamName: "Team A",
            homeTeamCrest: "",
            awayTeamName: "Team B",
            awayTeamCrest: "",
            score: "0 - 0",
            viewMode: "MIN",
            i18n: {
              aet: "I18N.HEAD_TO_HEAD.AFTER_EXTRA_TIME",
              penalties: "I18N.HEAD_TO_HEAD.PENALTIES",
            },
          },
        },
      });
      expect(matchStatsExtraFH).toBe(undefined);
      expect(matchStatsExtraEnd).toBe(undefined);
    });

    it("should return correclty when status is INPLAY_FIRST_HALF and period is EXTRA", () => {
      const duration = {
        status: FootballMatchStatus.INPLAY_FIRST_HALF,
        period: FootballMatchPeriod.EXTRA,
      };
      const { matchStatsFullTime, matchStatsExtraFH, matchStatsExtraEnd } = getMatchStatsForTimeline(
        TEST_MATCH_STATS,
        duration,
        homeTeam,
        awayTeam,
      );

      expect(matchStatsFullTime).toEqual({
        periodStat: {
          title: "I18N.MATCH_TIMELINE.FULL_TIME",
          resultProps: {
            homeTeamName: "Team A",
            homeTeamCrest: "",
            awayTeamName: "Team B",
            awayTeamCrest: "",
            score: "0 - 0",
            viewMode: "MIN",
            i18n: {
              aet: "I18N.HEAD_TO_HEAD.AFTER_EXTRA_TIME",
              penalties: "I18N.HEAD_TO_HEAD.PENALTIES",
            },
          },
        },
        stats: [
          {
            home: 1,
            away: 4,
            homeColor: "",
            awayColor: "",
            label: "I18N.MATCH_STATS.SHOTS_ON_TARGET",
          },
          {
            home: 0,
            away: 0,
            homeColor: "",
            awayColor: "",
            label: "I18N.MATCH_STATS.SHOTS_OFF_TARGET",
          },
          {
            home: 0,
            away: 0,
            homeColor: "",
            awayColor: "",
            label: "I18N.MATCH_STATS.DANGEROUS_ATTACKS",
          },
        ],
      });
      expect(matchStatsExtraFH).toBe(undefined);
      expect(matchStatsExtraEnd).toBe(undefined);
    });

    it("should return correclty when status is HALF and period is EXTRA", () => {
      const duration = {
        status: FootballMatchStatus.HALF,
        period: FootballMatchPeriod.EXTRA,
      };
      const { matchStatsFullTime, matchStatsExtraFH, matchStatsExtraEnd } = getMatchStatsForTimeline(
        TEST_MATCH_STATS,
        duration,
        homeTeam,
        awayTeam,
      );

      expect(matchStatsFullTime).toEqual({
        periodStat: {
          title: "I18N.MATCH_TIMELINE.FULL_TIME",
          resultProps: {
            homeTeamName: "Team A",
            homeTeamCrest: "",
            awayTeamName: "Team B",
            awayTeamCrest: "",
            score: "0 - 0",
            viewMode: "MIN",
            i18n: {
              aet: "I18N.HEAD_TO_HEAD.AFTER_EXTRA_TIME",
              penalties: "I18N.HEAD_TO_HEAD.PENALTIES",
            },
          },
        },
        stats: [
          {
            home: 1,
            away: 4,
            homeColor: "",
            awayColor: "",
            label: "I18N.MATCH_STATS.SHOTS_ON_TARGET",
          },
          {
            home: 0,
            away: 0,
            homeColor: "",
            awayColor: "",
            label: "I18N.MATCH_STATS.SHOTS_OFF_TARGET",
          },
          {
            home: 0,
            away: 0,
            homeColor: "",
            awayColor: "",
            label: "I18N.MATCH_STATS.DANGEROUS_ATTACKS",
          },
        ],
      });
      expect(matchStatsExtraFH).toEqual({
        periodStat: {
          title: "I18N.MATCH_TIMELINE.ET_FIRST_HALF",
          resultProps: {
            homeTeamName: "Team A",
            homeTeamCrest: "",
            awayTeamName: "Team B",
            awayTeamCrest: "",
            score: "0 - 0",
            viewMode: "MIN",
            i18n: {
              aet: "I18N.HEAD_TO_HEAD.AFTER_EXTRA_TIME",
              penalties: "I18N.HEAD_TO_HEAD.PENALTIES",
            },
          },
        },
      });
      expect(matchStatsExtraEnd).toBe(undefined);
    });

    it("should return correclty when status is INPLAY_SECOND_HALF and period is EXTRA", () => {
      const duration = {
        status: FootballMatchStatus.INPLAY_SECOND_HALF,
        period: FootballMatchPeriod.EXTRA,
      };
      const { matchStatsExtraFH, matchStatsExtraEnd } = getMatchStatsForTimeline(
        TEST_MATCH_STATS,
        duration,
        homeTeam,
        awayTeam,
      );

      expect(matchStatsExtraFH).toEqual({
        periodStat: {
          title: "I18N.MATCH_TIMELINE.ET_FIRST_HALF",
          resultProps: {
            homeTeamName: "Team A",
            homeTeamCrest: "",
            awayTeamName: "Team B",
            awayTeamCrest: "",
            score: "0 - 0",
            viewMode: "MIN",
            i18n: {
              aet: "I18N.HEAD_TO_HEAD.AFTER_EXTRA_TIME",
              penalties: "I18N.HEAD_TO_HEAD.PENALTIES",
            },
          },
        },
        stats: [
          {
            home: 1,
            away: 4,
            homeColor: "",
            awayColor: "",
            label: "I18N.MATCH_STATS.SHOTS_ON_TARGET",
          },
          {
            home: 0,
            away: 0,
            homeColor: "",
            awayColor: "",
            label: "I18N.MATCH_STATS.SHOTS_OFF_TARGET",
          },
          {
            home: 0,
            away: 0,
            homeColor: "",
            awayColor: "",
            label: "I18N.MATCH_STATS.DANGEROUS_ATTACKS",
          },
        ],
      });
      expect(matchStatsExtraEnd).toBe(undefined);
    });

    it("should return correclty when status is FULL and period is EXTRA", () => {
      const duration = {
        status: FootballMatchStatus.FULL,
        period: FootballMatchPeriod.EXTRA,
      };
      const { matchStatsExtraFH, matchStatsExtraEnd } = getMatchStatsForTimeline(
        TEST_MATCH_STATS,
        duration,
        homeTeam,
        awayTeam,
      );

      expect(matchStatsExtraFH).toEqual({
        periodStat: {
          title: "I18N.MATCH_TIMELINE.ET_FIRST_HALF",
          resultProps: {
            homeTeamName: "Team A",
            homeTeamCrest: "",
            awayTeamName: "Team B",
            awayTeamCrest: "",
            score: "0 - 0",
            viewMode: "MIN",
            i18n: {
              aet: "I18N.HEAD_TO_HEAD.AFTER_EXTRA_TIME",
              penalties: "I18N.HEAD_TO_HEAD.PENALTIES",
            },
          },
        },
        stats: [
          {
            home: 1,
            away: 4,
            homeColor: "",
            awayColor: "",
            label: "I18N.MATCH_STATS.SHOTS_ON_TARGET",
          },
          {
            home: 0,
            away: 0,
            homeColor: "",
            awayColor: "",
            label: "I18N.MATCH_STATS.SHOTS_OFF_TARGET",
          },
          {
            home: 0,
            away: 0,
            homeColor: "",
            awayColor: "",
            label: "I18N.MATCH_STATS.DANGEROUS_ATTACKS",
          },
        ],
      });
      expect(matchStatsExtraEnd).toEqual(undefined);
    });

    it("should return correclty the Goals Stats", () => {
      const duration = {
        status: FootballMatchStatus.FULL,
        period: FootballMatchPeriod.EXTRA,
      };
      const { matchStatsHalfTime, matchStatsFullTime, matchStatsExtraFH, matchStatsExtraEnd } =
        getMatchStatsForTimeline(TEST_MATCH_STATS_GOALS, duration, homeTeam, awayTeam);

      expect(matchStatsHalfTime.periodStat).toEqual({
        title: "I18N.MATCH_TIMELINE.FIRST_HALF",
        resultProps: {
          homeTeamName: "Team A",
          homeTeamCrest: "",
          awayTeamName: "Team B",
          awayTeamCrest: "",
          score: "0 - 1",
          viewMode: "MIN",
          i18n: {
            aet: "I18N.HEAD_TO_HEAD.AFTER_EXTRA_TIME",
            penalties: "I18N.HEAD_TO_HEAD.PENALTIES",
          },
        },
      });
      expect(matchStatsFullTime.periodStat).toEqual({
        title: "I18N.MATCH_TIMELINE.FULL_TIME",
        resultProps: {
          homeTeamName: "Team A",
          homeTeamCrest: "",
          awayTeamName: "Team B",
          awayTeamCrest: "",
          score: "1 - 1",
          viewMode: "MIN",
          i18n: {
            aet: "I18N.HEAD_TO_HEAD.AFTER_EXTRA_TIME",
            penalties: "I18N.HEAD_TO_HEAD.PENALTIES",
          },
        },
      });
      expect(matchStatsExtraFH.periodStat).toEqual({
        title: "I18N.MATCH_TIMELINE.ET_FIRST_HALF",
        resultProps: {
          homeTeamName: "Team A",
          homeTeamCrest: "",
          awayTeamName: "Team B",
          awayTeamCrest: "",
          score: "2 - 2",
          viewMode: "MIN",
          i18n: {
            aet: "I18N.HEAD_TO_HEAD.AFTER_EXTRA_TIME",
            penalties: "I18N.HEAD_TO_HEAD.PENALTIES",
          },
        },
      });
      expect(matchStatsExtraEnd).toEqual(undefined);
    });

    it("should return crests correctly when defined", () => {
      const duration = {
        status: FootballMatchStatus.HALF,
        period: FootballMatchPeriod.REGULAR,
      };

      const { matchStatsHalfTime } = getMatchStatsForTimeline(
        TEST_MATCH_STATS,
        duration,
        { ...homeTeam, crest: { vector: "homeCrestVector" } },
        { ...awayTeam, crest: { small: "awayCrestSmall" } },
      );

      expect(matchStatsHalfTime.periodStat.resultProps.homeTeamCrest).toBe("homeCrestVector");
      expect(matchStatsHalfTime.periodStat.resultProps.awayTeamCrest).toBe("awayCrestSmall");
    });
  });
});
