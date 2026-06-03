const { TEST_ID: BAR_STAT } = require("@ppb/the-wall-web/components/walls/BarStat/BarStat.selectors");
const {
  ActionLinkPO,
  HeadToHeadResultPO,
  BarStatPO,
  MinuteByMinutePO,
  NotificationPO,
  MatchTimelineDetailsPO,
  CardNotificationPO,
  GoalNotificationPO,
  PeriodStatusNotificationPO,
  SubstitutionNotificationPO,
  TeamNotificationPO,
  IncidentPO,
  IncidentEventsPO,
  MatchStatsPO,
} = require("../../../../../page-objects");
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const matchTimelineDetailsPO = new MatchTimelineDetailsPO();
const matchTimelineIncidentEventsPO = new IncidentEventsPO();
const minuteByMinuteFirstHalfPO = new MinuteByMinutePO(matchTimelineDetailsPO.listMinuteByMinute[3]);
const minuteByMinuteSecondHalfPO = new MinuteByMinutePO(matchTimelineDetailsPO.listMinuteByMinute[2]);
const minuteByMinuteETFirstHalfPO = new MinuteByMinutePO(matchTimelineDetailsPO.listMinuteByMinute[1]);
const minuteByMinuteETSecondHalfPO = new MinuteByMinutePO(matchTimelineDetailsPO.listMinuteByMinute[0]);
const firstHomeTimelineIncidentPO = new IncidentPO(matchTimelineIncidentEventsPO.incidents[0]);
const secondHomeTimelineIncidentPO = new IncidentPO(matchTimelineIncidentEventsPO.incidents[1]);
const thirdHomeTimelineIncidentPO = new IncidentPO(matchTimelineIncidentEventsPO.incidents[2]);
const firstAwayTimelineIncidentPO = new IncidentPO(matchTimelineIncidentEventsPO.incidents[3]);
const secondAwayTimelineIncidentPO = new IncidentPO(matchTimelineIncidentEventsPO.incidents[4]);
const thirdAwayTimelineIncidentPO = new IncidentPO(matchTimelineIncidentEventsPO.incidents[5]);
const kickOffPO = new NotificationPO(minuteByMinuteFirstHalfPO.notifications[1]);
const firstHalfEndsPO = new NotificationPO(minuteByMinuteFirstHalfPO.notifications[0]);
const cornerPO = new TeamNotificationPO(minuteByMinuteFirstHalfPO.teamNotifications[2]);
const blockedShotPO = new TeamNotificationPO(minuteByMinuteFirstHalfPO.teamNotifications[1]);
const foulPO = new TeamNotificationPO(minuteByMinuteFirstHalfPO.teamNotifications[0]);
const yellowCardPO = new CardNotificationPO(minuteByMinuteFirstHalfPO.cardNotifications[0]);
const firstHalfGoalPO = new GoalNotificationPO(minuteByMinuteFirstHalfPO.goalNotifications[0]);
const secondHalfStartsPO = new NotificationPO(minuteByMinuteSecondHalfPO.notifications[2]);
const injuryTimePO = new NotificationPO(minuteByMinuteSecondHalfPO.notifications[1]);
const secondHalfEndsPO = new NotificationPO(minuteByMinuteSecondHalfPO.notifications[0]);
const substitutionPO = new SubstitutionNotificationPO(minuteByMinuteSecondHalfPO.substitutionNotifications[0]);
const offsidePO = new TeamNotificationPO(minuteByMinuteSecondHalfPO.teamNotifications[5]);
const freeKickPO = new TeamNotificationPO(minuteByMinuteSecondHalfPO.teamNotifications[4]);
const throwInPO = new TeamNotificationPO(minuteByMinuteSecondHalfPO.teamNotifications[3]);
const goalKickPO = new TeamNotificationPO(minuteByMinuteSecondHalfPO.teamNotifications[2]);
const shotOffTargetPO = new TeamNotificationPO(minuteByMinuteSecondHalfPO.teamNotifications[1]);
const shotOnTargetPO = new TeamNotificationPO(minuteByMinuteSecondHalfPO.teamNotifications[0]);
const redCardPO = new CardNotificationPO(minuteByMinuteSecondHalfPO.cardNotifications[0]);
const ownGoalPO = new GoalNotificationPO(minuteByMinuteSecondHalfPO.goalNotifications[0]);
const kickOffETPO = new NotificationPO(minuteByMinuteETFirstHalfPO.notifications[1]);
const dangerousAttackPO = new TeamNotificationPO(minuteByMinuteETFirstHalfPO.teamNotifications[0]);
const secondYellowCardPO = new CardNotificationPO(minuteByMinuteETFirstHalfPO.cardNotifications[0]);
const firstHalfEndsETPO = new NotificationPO(minuteByMinuteETFirstHalfPO.notifications[0]);
const secondHalfEndsETPO = new NotificationPO(minuteByMinuteETSecondHalfPO.notifications[0]);
const secondHalfStartsETPO = new NotificationPO(minuteByMinuteETSecondHalfPO.notifications[1]);
const firstHalfStatsPO = new MatchStatsPO(matchTimelineDetailsPO.matchStatsNotifications[2]);
const firstHalfPossessionPO = new BarStatPO(firstHalfStatsPO.element.$$(BAR_STAT)[0]);
const fullTimeStatsPO = new MatchStatsPO(matchTimelineDetailsPO.matchStatsNotifications[1]);
const fullTimePossessionPO = new BarStatPO(fullTimeStatsPO.element.$$(BAR_STAT)[0]);
const firstHalfETStatsPO = new MatchStatsPO(matchTimelineDetailsPO.matchStatsNotifications[0]);
const firstHalfETPossessionPO = new BarStatPO(firstHalfETStatsPO.element.$$(BAR_STAT)[0]);
const penaltyPO = new TeamNotificationPO(minuteByMinuteETSecondHalfPO.teamNotifications[0]);
const penaltyGoalPO = new GoalNotificationPO(minuteByMinuteETSecondHalfPO.goalNotifications[0]);
const firstHalfPeriodStatusPO = new PeriodStatusNotificationPO(matchTimelineDetailsPO.periodStatusNotifications[2]);
const firstHalfResultPO = new HeadToHeadResultPO(firstHalfPeriodStatusPO.periodStatusResult);
const secondHalfPeriodStatusPO = new PeriodStatusNotificationPO(matchTimelineDetailsPO.periodStatusNotifications[1]);
const secondHalfResultPO = new HeadToHeadResultPO(secondHalfPeriodStatusPO.periodStatusResult);
const firstHalfETPeriodStatusPO = new PeriodStatusNotificationPO(matchTimelineDetailsPO.periodStatusNotifications[0]);
const firstHalfETResultPO = new HeadToHeadResultPO(firstHalfETPeriodStatusPO.periodStatusResult);
const newEventPO = new ActionLinkPO();

const mockService = new MockService();

const EVENT_ID = "29465861";

const BFF_MOCK = {
  nextPageCursor: "nextCursor",
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: EVENT_ID,
    name: "Wolves v Real Madrid",
  },
  edges: [
    {
      node: {
        __typename: "MatchTimelineCard",
        urn: "ppb:tbd:card:matchtimeline##29465861",
        contentTitle: "Match Timeline",
        sportevent: {
          eventName: "Wolves v Real Madrid",
          openDate: "2010-10-14T18:45",
          urn: "ppb:event:29465861",
          __typename: "SportsEvent",
        },
        footballFixture: {
          urn: "ppb:fixture:29465861",
          score: {},
          duration: {
            clock: {
              minute: 35,
              second: 24,
            },
            period: "REGULAR",
            status: "INPLAY_FIRST_HALF",
          },
          home: {
            name: "Wolves",
            color: "FDB913",
          },
          away: {
            name: "Real Madrid",
            color: "FFFFFF",
          },
          scheduledAt: "2010-10-14T18:45Z",
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "MatchTimelineCard",
        urn: "ppb:tbd:card:matchtimeline##29465861",
      },
    },
  ],
};

const SCA_MOCK_PRE_MATCH = {
  fixture: [
    {
      score: {
        home: 0,
        away: 0,
      },
      duration: {
        clock: {},
        status: "INPLAY_FIRST_HALF",
      },
    },
  ],
};

const FIRST_HALF_INCIDENTS = [
  {
    clock: {
      minute: 5,
    },
    details: {
      __typename: "ShotIncident",
      shotType: "SAVED_BLOCKED",
      side: "AWAY",
      player: {
        name: "Courtois",
      },
    },
    periodStatus: "INPLAY_FIRST_HALF",
  },
  {
    clock: {
      minute: 3,
    },
    details: {
      __typename: "GoalIncident",
      goalType: "POSSIBLE",
      side: "AWAY",
      goalScorer: {},
    },
    periodStatus: "INPLAY_FIRST_HALF",
  },
  {
    clock: {
      minute: 0,
      second: 0,
    },
    period: "REGULAR",
    periodStatus: "INPLAY_FIRST_HALF",
    details: {
      __typename: "PeriodIncident",
      periodType: "PERIOD_TRANSITION",
      period: "REGULAR",
      status: "INPLAY_FIRST_HALF",
    },
  },
];

const SECOND_HALF_INCIDENTS = [
  {
    clock: {
      minute: 90,
    },
    details: {
      __typename: "PeriodIncident",
      periodType: "INJURY_TIME_UPDATE",
      status: "INPLAY_SECOND_HALF",
      injuryTime: 3,
    },
    periodStatus: "INPLAY_SECOND_HALF",
  },
  {
    clock: {
      minute: 88,
    },
    details: {
      __typename: "GoalIncident",
      goalType: "OWN",
      side: "HOME",
      goalScorer: {},
    },
    periodStatus: "INPLAY_SECOND_HALF",
  },
  {
    clock: {
      minute: 85,
    },
    details: {
      __typename: "GoalIncident",
      goalType: "CANCELLED",
      side: "AWAY",
      goalScorer: {},
    },
    periodStatus: "INPLAY_SECOND_HALF",
  },
  {
    clock: {
      minute: 80,
    },
    details: {
      __typename: "CardIncident",
      cardType: "RED",
      player: {
        name: "Traore",
      },
    },
    periodStatus: "INPLAY_SECOND_HALF",
  },
  {
    clock: {
      minute: 75,
    },
    details: {
      __typename: "ShotIncident",
      shotType: "SAVED",
      side: "AWAY",
      player: {
        name: "Casemiro",
      },
    },
    periodStatus: "INPLAY_SECOND_HALF",
  },
  {
    clock: {
      minute: 72,
    },
    details: {
      __typename: "ShotIncident",
      shotType: "OFF_TARGET",
      side: "AWAY",
      player: {
        name: "Modric",
      },
    },
    periodStatus: "INPLAY_SECOND_HALF",
  },
  {
    clock: {
      minute: 66,
    },
    details: {
      __typename: "SetPieceIncident",
      setPieceType: "GOAL_KICK",
    },
    periodStatus: "INPLAY_SECOND_HALF",
  },
  {
    clock: {
      minute: 66,
    },
    details: {
      __typename: "SetPieceIncident",
      setPieceType: "THROW_IN",
    },
    periodStatus: "INPLAY_SECOND_HALF",
  },
  {
    clock: {
      minute: 66,
    },
    details: {
      __typename: "SetPieceIncident",
      setPieceType: "FREE_KICK",
    },
    periodStatus: "INPLAY_SECOND_HALF",
  },
  {
    clock: {
      minute: 59,
    },
    details: {
      __typename: "FoulIncident",
      foulType: "OFFSIDE",
      side: "AWAY",
      player: {
        name: "Hazard",
      },
    },
    periodStatus: "INPLAY_SECOND_HALF",
  },
  {
    clock: {
      minute: 55,
    },
    details: {
      __typename: "SubstitutionIncident",
      playerIn: {
        name: "Ronaldinho",
      },
      playerOut: {},
    },
    periodStatus: "INPLAY_SECOND_HALF",
  },
  {
    clock: {
      minute: 45,
    },
    details: {
      __typename: "PeriodIncident",
      periodType: "PERIOD_TRANSITION",
      status: "INPLAY_SECOND_HALF",
    },
    periodStatus: "INPLAY_SECOND_HALF",
  },
  {
    clock: {
      minute: 45,
    },
    details: {
      __typename: "PeriodIncident",
      periodType: "PERIOD_TRANSITION",
      status: "HALF",
    },
    periodStatus: "HALF",
  },
  {
    clock: {
      minute: 42,
    },
    details: {
      __typename: "GoalIncident",
      goalType: "NORMAL",
      goalScorer: {},
      assist: {},
    },
    periodStatus: "INPLAY_FIRST_HALF",
  },
  {
    clock: {
      minute: 29,
    },
    details: {
      __typename: "CardIncident",
      cardType: "YELLOW",
      side: "AWAY",
      player: {
        name: "Sergio Ramos",
      },
    },
    periodStatus: "INPLAY_FIRST_HALF",
  },
  {
    clock: {
      minute: 29,
    },
    details: {
      __typename: "FoulIncident",
      foulType: "FOUL",
      side: "AWAY",
      player: {
        name: "Sergio Ramos",
      },
    },
    periodStatus: "INPLAY_FIRST_HALF",
  },
  {
    clock: {
      minute: 5,
    },
    details: {
      __typename: "ShotIncident",
      shotType: "SAVED_BLOCKED",
      side: "AWAY",
      player: {
        name: "Courtois",
      },
    },
    periodStatus: "INPLAY_FIRST_HALF",
  },
  {
    clock: {
      minute: 5,
    },
    details: {
      __typename: "SetPieceIncident",
      setPieceType: "CORNER",
    },
    periodStatus: "INPLAY_FIRST_HALF",
  },
  {
    clock: {
      minute: 0,
      second: 0,
    },
    periodStatus: "INPLAY_FIRST_HALF",
    details: {
      __typename: "PeriodIncident",
      periodType: "PERIOD_TRANSITION",
      status: "INPLAY_FIRST_HALF",
    },
  },
];

const FULL_TIME_INCIDENTS = [
  {
    clock: {
      minute: 120,
    },
    details: {
      __typename: "PeriodIncident",
      periodType: "PERIOD_TRANSITION",
      period: "EXTRA",
      status: "END",
    },
    period: "EXTRA",
    periodStatus: "END",
  },
  {
    clock: {
      minute: 120,
    },
    details: {
      __typename: "PeriodIncident",
      periodType: "PERIOD_TRANSITION",
      period: "EXTRA",
      status: "FULL",
    },
    period: "EXTRA",
    periodStatus: "FULL",
  },
  {
    clock: {
      minute: 109,
    },
    details: {
      __typename: "GoalIncident",
      goalType: "PENALTY",
      side: "AWAY",
      goalScorer: {
        name: "Gareth Bale",
      },
    },
    period: "EXTRA",
    periodStatus: "INPLAY_SECOND_HALF",
  },
  {
    clock: {
      minute: 108,
    },
    details: {
      __typename: "PenaltyIncident",
      penaltyType: "AWARDED",
      side: "AWAY",
    },
    periodStatus: "INPLAY_SECOND_HALF",
    period: "EXTRA",
  },
  {
    clock: {
      minute: 105,
    },
    details: {
      __typename: "PeriodIncident",
      periodType: "PERIOD_TRANSITION",
      period: "EXTRA",
      status: "INPLAY_SECOND_HALF",
    },
    periodStatus: "INPLAY_SECOND_HALF",
    period: "EXTRA",
  },
  {
    clock: {
      minute: 105,
    },
    details: {
      __typename: "PeriodIncident",
      periodType: "PERIOD_TRANSITION",
      period: "EXTRA",
      status: "HALF",
    },
    periodStatus: "HALF",
    period: "EXTRA",
  },
  {
    clock: {
      minute: 98,
    },
    details: {
      __typename: "CardIncident",
      cardType: "YELLOW_RED",
      side: "AWAY",
      player: {
        name: "Sergio Ramos",
      },
    },
    periodStatus: "INPLAY_FIRST_HALF",
    period: "EXTRA",
  },
  {
    clock: {
      minute: 97,
    },
    details: {
      __typename: "AttackIncident",
      attackType: "DANGEROUS_ATTACK",
      side: "AWAY",
    },
    period: "EXTRA",
    periodStatus: "INPLAY_FIRST_HALF",
  },
  {
    clock: {
      minute: 90,
    },
    details: {
      __typename: "PeriodIncident",
      periodType: "PERIOD_TRANSITION",
      period: "EXTRA",
      status: "INPLAY_FIRST_HALF",
    },
    periodStatus: "INPLAY_FIRST_HALF",
    period: "EXTRA",
  },
  {
    clock: {
      minute: 90,
    },
    details: {
      __typename: "PeriodIncident",
      periodType: "PERIOD_TRANSITION",
      status: "FULL",
    },
    periodStatus: "FULL",
  },
  ...SECOND_HALF_INCIDENTS,
];

const SCA_MOCK_INPLAY_FIRST_HALF = {
  fixture: [
    {
      score: {
        home: 0,
        away: 0,
      },
      duration: {
        clock: {},
        status: "INPLAY_FIRST_HALF",
      },
      incidents: FIRST_HALF_INCIDENTS,
    },
  ],
};

const SCA_MOCK_SECOND_HALF = {
  fixture: [
    {
      score: {
        home: 1,
        away: 2,
      },
      duration: {
        clock: {
          minute: 89,
          second: 1,
        },
        status: "INPLAY_SECOND_HALF",
        period: "REGULAR",
      },
      incidents: SECOND_HALF_INCIDENTS,
      stats: [
        {
          periodStatus: "INPLAY_FIRST_HALF",
          period: "EXTRA",
          home: {
            possession: 30,
          },
          away: {
            possession: 70,
          },
        },
        {
          period: "REGULAR",
          periodStatus: "INPLAY_FIRST_HALF",
          home: {
            possession: 65,
            goals: 1,
          },
          away: {
            possession: 35,
          },
        },
      ],
    },
  ],
};

const SCA_MOCK_END_STATE = {
  fixture: [
    {
      score: {
        home: 1,
        away: 2,
      },
      duration: {
        clock: {
          minute: 120,
          second: 0,
        },
        status: "END",
        period: "EXTRA",
      },
      incidents: FULL_TIME_INCIDENTS,
      stats: [
        {
          periodStatus: "FULL",
          home: {
            goals: 1,
          },
          away: {
            goals: 2,
          },
        },
        {
          periodStatus: "INPLAY_FIRST_HALF",
          period: "EXTRA",
          home: {
            possession: 30,
          },
          away: {
            possession: 70,
          },
        },
        {
          period: "REGULAR",
          periodStatus: "INPLAY_SECOND_HALF",
          home: {
            possession: 30,
          },
          away: {
            possession: 70,
            goals: 1,
          },
        },
        {
          period: "REGULAR",
          periodStatus: "INPLAY_FIRST_HALF",
          home: {
            possession: 65,
            goals: 1,
          },
          away: {
            possession: 35,
          },
        },
      ],
    },
  ],
};

const BFF_MOCK_EMPTY_EDGES = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  edges: [],
};

describe("Match Timeline Details", () => {
  describe("When the user lands on a football event in PRE_MATCH state", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_MOCK_PRE_MATCH));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
    });

    describe("And then SCA updates the game with INPLAY_FIRST_HALF status", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_MOCK_INPLAY_FIRST_HALF));
        await browser.tickFakeClock();
        await mockService.mockHttpRequest(getEventLayout(BFF_MOCK_EMPTY_EDGES));
        await browser.waitUntilDisplayed(matchTimelineDetailsPO.element);
      });

      it("[PRPI-6841] The timeline bar component should be displayed", async () => {
        expect(await matchTimelineDetailsPO.timelineWrapper.isDisplayed()).toBe(true);
      });

      it("[PRPI-6842] The timeline details component should not be displayed", async () => {
        expect(await matchTimelineDetailsPO.incidentsWrapper.isDisplayed()).toBe(false);
      });

      it("[PRPI-6843] The Minute By Minute component should not exist because there are not at least 4 incidents", async () => {
        expect(await matchTimelineDetailsPO.listMinuteByMinute.length).toBe(0);
      });

      describe("And then the game goes to End State and incidents will be displayed in Timeline Details", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getScaResponse(SCA_MOCK_END_STATE));
          await browser.tickFakeClock();
          await browser.waitUntilDisplayed(matchTimelineDetailsPO.minuteByMinuteTitle);
        });

        it("[PRPI-6844] The first timeline home incident should be: Goal scored by: Cristiano Ronaldo in 43'", async () => {
          expect(await firstHomeTimelineIncidentPO.getIncidentPlayer.getText()).toBe("Cristiano Ronaldo");
          expect(await firstHomeTimelineIncidentPO.getIncidentMinute.getText()).toBe("43'");
        });

        it("[PRPI-6844] The second timeline home incident should be: Red Card for: Traore in 81'", async () => {
          expect(await secondHomeTimelineIncidentPO.getIncidentPlayer.getText()).toBe("Traore");
          expect(await secondHomeTimelineIncidentPO.getIncidentMinute.getText()).toBe("81'");
        });

        it("[PRPI-6844] The third timeline home incident should be: Own Goal scored by: Cristiano Ronaldo in 89'", async () => {
          expect(await thirdHomeTimelineIncidentPO.getIncidentPlayer.getText()).toBe("Cristiano Ronaldo");
          expect(await thirdHomeTimelineIncidentPO.getIncidentMinute.getText()).toBe("89'");
        });

        it("[PRPI-6844] The first timeline away incident should be: Yellow Card for: Sergio Ramos in 30'", async () => {
          expect(await firstAwayTimelineIncidentPO.getIncidentPlayer.getText()).toBe("Sergio Ramos");
          expect(await firstAwayTimelineIncidentPO.getIncidentMinute.getText()).toBe("30'");
        });

        it("[PRPI-6844] The second timeline away incident should be: Second Yellow Card for: Sergio Ramos in 99'", async () => {
          expect(await secondAwayTimelineIncidentPO.getIncidentPlayer.getText()).toBe("Sergio Ramos");
          expect(await secondAwayTimelineIncidentPO.getIncidentMinute.getText()).toBe("99'");
        });

        it("[PRPI-6844] The third timeline away incident should be: Penalty Goal scored by: Gareth Bale in 110'", async () => {
          expect(await thirdAwayTimelineIncidentPO.getIncidentPlayer.getText()).toBe("Gareth Bale");
          expect(await thirdAwayTimelineIncidentPO.getIncidentMinute.getText()).toBe("110'");
        });
      });
    });
  });
});

describe("Minute By Minute", () => {
  describe("When user lands on a football event in SECOND HALF TIME and clicks on Match Timeline card", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_MOCK_SECOND_HALF));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilDisplayed(matchTimelineDetailsPO.minuteByMinuteTitle);
    });

    it("[PRPI-6845] The Minute by Minute container title should be: Minute By Minute", async () => {
      expect(await matchTimelineDetailsPO.minuteByMinuteTitle.getText()).toBe("Minute By Minute");
    });

    describe("When the user scrolls down to first notification", () => {
      beforeAll(async () => {
        await kickOffPO.element.scrollIntoView();
        await browser.waitUntilInViewport(kickOffPO.element);
      });

      it("[PRPI-6846] The first notification from First Half should be: Kick Off", async () => {
        expect(await kickOffPO.notificationTitle.getText()).toBe("Kick Off");
      });

      it("[PRPI-6847] The New Event notification should not be displayed", async () => {
        expect(await newEventPO.element.isDisplayed()).toBe(false);
      });

      describe("And then the event goes to the END State", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getScaResponse(SCA_MOCK_END_STATE));
          await browser.tickFakeClock();
          await browser.waitUntilInViewport(newEventPO.element);
        });

        it("[PRPI-6848] The New Event notification should be displayed in view port", async () => {
          expect(await newEventPO.element.isDisplayedInViewport()).toBe(true);
        });

        describe("When the user clicks on New Event notification and it goes to the top of the page", () => {
          beforeAll(async () => {
            await newEventPO.element.waitForClickable();
            await newEventPO.element.click();
            await browser.waitUntilNotDisplayed(newEventPO.element);
          });

          it("[PRPI-6849] The New Event notification should not be displayed anymore", async () => {
            expect(await newEventPO.element.isDisplayed()).toBe(false);
          });

          it("[PRPI-6849] The 6' home team should be: Corner", async () => {
            expect(await cornerPO.teamNotificationTitle.getText()).toBe("Corner");
            expect(await browser.containsClass(cornerPO.element, TeamNotificationPO.states.HOME)).toBe(true);
            expect(await minuteByMinuteFirstHalfPO.minutes[2].getText()).toBe("6'");
          });

          it("[PRPI-6849] The 30' away team should be: Blocked Shot by: Courtois", async () => {
            expect(await blockedShotPO.teamNotificationTitle.getText()).toBe("Blocked Shot");
            expect(await blockedShotPO.teamNotificationDescription.getText()).toBe("Courtois");
            expect(await browser.containsClass(blockedShotPO.element, TeamNotificationPO.states.AWAY)).toBe(true);
            expect(await minuteByMinuteFirstHalfPO.minutes[1].getText()).toBe("30'");
          });

          it("[PRPI-6849] The 30' away team should be: Foul by: Sergio Ramos", async () => {
            expect(await foulPO.teamNotificationTitle.getText()).toBe("Foul");
            expect(await foulPO.teamNotificationDescription.getText()).toBe("Sergio Ramos");
            expect(await browser.containsClass(foulPO.element, TeamNotificationPO.states.AWAY)).toBe(true);
            expect(await minuteByMinuteFirstHalfPO.minutes[1].getText()).toBe("30'");
          });

          it("[PRPI-6849] The 30' away team should be: Yellow Card by: Sergio Ramos", async () => {
            expect(await yellowCardPO.cardNotificationTitle.getText()).toBe("Yellow Card");
            expect(await yellowCardPO.cardNotificationDescription.getText()).toBe("Sergio Ramos");
            expect(await browser.containsClass(yellowCardPO.element, CardNotificationPO.states.AWAY)).toBe(true);
            expect(await minuteByMinuteFirstHalfPO.minutes[1].getText()).toBe("30'");
          });

          it("[PRPI-6849] The 43' home team should be: Goal! scored by: Cristiano Ronaldo and assisted by: Cristiano Ronaldo", async () => {
            expect(await firstHalfGoalPO.goalNotificationTitle.getText()).toBe("Goal!");
            expect(await firstHalfGoalPO.goalNotificationDescription.getText()).toBe("Cristiano Ronaldo");
            expect(await firstHalfGoalPO.goalNotificationSecondDescription.getText()).toBe("Assist: Cristiano Ronaldo");

            expect(await browser.containsClass(firstHalfGoalPO.element, GoalNotificationPO.states.GOAL)).toBe(true);
            expect(await minuteByMinuteFirstHalfPO.minutes[0].getText()).toBe("43'");
          });

          it("[PRPI-6849] The last notification from first half should be First Half Ends", async () => {
            expect(await firstHalfEndsPO.notificationTitle.getText()).toBe("First Half");
            expect(await firstHalfEndsPO.notificationDescription.getText()).toBe("Ends");
          });

          it("[PRPI-6849] The First Half Period Status Notification should be: Wolves 1 - 0 Real Madrid", async () => {
            expect(await firstHalfPeriodStatusPO.periodStatusTitle.getText()).toBe("First Half");
            expect(await firstHalfResultPO.score.getText()).toBe("1 - 0");
            expect(await firstHalfResultPO.homeTeam.getText()).toBe("Wolves");
            expect(await firstHalfResultPO.awayTeam.getText()).toBe("Real Madrid");
            expect(await firstHalfResultPO.homeShield.isDisplayed()).toBe(true);
            expect(await firstHalfResultPO.awayShield.isDisplayed()).toBe(true);
          });

          it("[PRPI-6849] The First Half Possession should be: Wolves 65% - 35% Real Madrid", async () => {
            expect(await firstHalfPossessionPO.getLabel.getText()).toBe("Possession %");
            expect(await firstHalfPossessionPO.statisticsHome.getText()).toBe("65");
            expect(await firstHalfPossessionPO.statisticsAway.getText()).toBe("35");
          });

          describe("When the user scrolls to Second Half Starts section", () => {
            it("[PRPI-6849] The first notification from second half should be: Second Half Starts", async () => {
              expect(await secondHalfStartsPO.notificationTitle.getText()).toBe("Second Half");
              expect(await secondHalfStartsPO.notificationDescription.getText()).toBe("Starts");
            });

            it("[PRPI-6849] The 56' home team should be: Substitution | Player In: Ronaldinho | Player Out: Cristiano Ronaldo", async () => {
              expect(await substitutionPO.substitutionNotificationTitle.getText()).toBe("Substitution");
              expect(await substitutionPO.substitutionPlayerIn.getText()).toBe("Ronaldinho");
              expect(await substitutionPO.substitutionPlayerOut.getText()).toBe("Cristiano Ronaldo");
              expect(await browser.containsClass(cornerPO.element, TeamNotificationPO.states.HOME)).toBe(true);
              expect(await minuteByMinuteSecondHalfPO.minutes[6].getText()).toBe("56'");
            });

            it("[PRPI-6849] The 60' away team should be: Offside by: Hazard", async () => {
              expect(await offsidePO.teamNotificationTitle.getText()).toBe("Offside");
              expect(await offsidePO.teamNotificationDescription.getText()).toBe("Hazard");
              expect(await browser.containsClass(offsidePO.element, TeamNotificationPO.states.AWAY)).toBe(true);
              expect(await minuteByMinuteSecondHalfPO.minutes[5].getText()).toBe("60'");
            });

            it("[PRPI-6849] The 67' home team should be: Free Kick", async () => {
              expect(await freeKickPO.teamNotificationTitle.getText()).toBe("Free Kick");
              expect(await browser.containsClass(freeKickPO.element, TeamNotificationPO.states.HOME)).toBe(true);
              expect(await minuteByMinuteSecondHalfPO.minutes[4].getText()).toBe("67'");
            });

            it("[PRPI-6849] The 67' home team should be: Throw In", async () => {
              expect(await throwInPO.teamNotificationTitle.getText()).toBe("Throw In");
              expect(await browser.containsClass(freeKickPO.element, TeamNotificationPO.states.HOME)).toBe(true);
              expect(await minuteByMinuteSecondHalfPO.minutes[4].getText()).toBe("67'");
            });

            it("[PRPI-6849] The 67' home team should be: Goal Kick", async () => {
              expect(await goalKickPO.teamNotificationTitle.getText()).toBe("Goal Kick");
              expect(await browser.containsClass(goalKickPO.element, TeamNotificationPO.states.HOME)).toBe(true);
              expect(await minuteByMinuteSecondHalfPO.minutes[4].getText()).toBe("67'");
            });

            it("[PRPI-6849] The 73' away team should be: Shot Off Target by: Modric", async () => {
              expect(await shotOffTargetPO.teamNotificationTitle.getText()).toBe("Shot Off Target");
              expect(await shotOffTargetPO.teamNotificationDescription.getText()).toBe("Modric");
              expect(await browser.containsClass(shotOffTargetPO.element, TeamNotificationPO.states.AWAY)).toBe(true);
              expect(await minuteByMinuteSecondHalfPO.minutes[3].getText()).toBe("73'");
            });

            it("[PRPI-6849] The 76' away team should be: Shot On Target by: Casemiro", async () => {
              expect(await shotOnTargetPO.teamNotificationTitle.getText()).toBe("Shot On Target");
              expect(await shotOnTargetPO.teamNotificationDescription.getText()).toBe("Casemiro");
              expect(await browser.containsClass(shotOnTargetPO.element, TeamNotificationPO.states.AWAY)).toBe(true);
              expect(await minuteByMinuteSecondHalfPO.minutes[2].getText()).toBe("76'");
            });

            it("[PRPI-6849] The 81' home team should be: Red Card by: Traore", async () => {
              expect(await redCardPO.cardNotificationTitle.getText()).toBe("Red Card");
              expect(await redCardPO.cardNotificationDescription.getText()).toBe("Traore");
              expect(await browser.containsClass(redCardPO.element, CardNotificationPO.states.HOME)).toBe(true);
              expect(await minuteByMinuteSecondHalfPO.minutes[1].getText()).toBe("81'");
            });

            it("[PRPI-6849] The 89' home team should be: Own Goal! by: Cristiano Ronaldo", async () => {
              expect(await ownGoalPO.goalNotificationTitle.getText()).toBe("Own Goal!");
              expect(await ownGoalPO.goalNotificationDescription.getText()).toBe("Cristiano Ronaldo");
              expect(await browser.containsClass(ownGoalPO.element, GoalNotificationPO.states.OWN_GOAL)).toBe(true);
              expect(await minuteByMinuteSecondHalfPO.minutes[0].getText()).toBe("89'");
            });

            it("[PRPI-6849] The Injury Time should display: +3'", async () => {
              expect(await injuryTimePO.notificationTitle.getText()).toBe("Injury Time");
              expect(await injuryTimePO.notificationDescription.getText()).toBe("+3'");
            });

            it("[PRPI-6849] The last notification from second half should be Second Half Ends", async () => {
              expect(await secondHalfEndsPO.notificationTitle.getText()).toBe("Second Half");
              expect(await secondHalfEndsPO.notificationDescription.getText()).toBe("Ends");
            });

            it("[PRPI-6849] The Full Time Period Status Notification should be: Wolves 1 - 1 Real Madrid", async () => {
              expect(await secondHalfPeriodStatusPO.periodStatusTitle.getText()).toBe("Full Time");
              expect(await secondHalfResultPO.score.getText()).toBe("1 - 1");
              expect(await secondHalfResultPO.homeTeam.getText()).toBe("Wolves");
              expect(await secondHalfResultPO.awayTeam.getText()).toBe("Real Madrid");
            });

            it("[PRPI-6849] The Full Time Possession should be: Wolves 50% - 50% Real Madrid", async () => {
              expect(await fullTimePossessionPO.getLabel.getText()).toBe("Possession %");
              expect(await fullTimePossessionPO.statisticsHome.getText()).toBe("50");
              expect(await fullTimePossessionPO.statisticsAway.getText()).toBe("50");
            });

            describe("When the user scrolls to Extra Time period section", () => {
              it("[PRPI-6849] The first notification from ET First Half should be: ET Kick Off", async () => {
                expect(await kickOffETPO.notificationTitle.getText()).toBe("ET Kick Off");
              });

              it("[PRPI-6849] The 98' away team should be: Dangerous Attack", async () => {
                expect(await dangerousAttackPO.teamNotificationTitle.getText()).toBe("Dangerous Attack");
                expect(await browser.containsClass(dangerousAttackPO.element, TeamNotificationPO.states.AWAY)).toBe(
                  true,
                );

                expect(await minuteByMinuteETFirstHalfPO.minutes[1].getText()).toBe("98'");
              });

              it("[PRPI-6849] The 99' away team has: Second Yellow Card by: Sergio Ramos", async () => {
                expect(await secondYellowCardPO.cardNotificationTitle.getText()).toBe("Second Yellow Card");
                expect(await secondYellowCardPO.cardNotificationDescription.getText()).toBe("Sergio Ramos");
                expect(await browser.containsClass(secondYellowCardPO.element, CardNotificationPO.states.AWAY)).toBe(
                  true,
                );

                expect(await minuteByMinuteETFirstHalfPO.minutes[0].getText()).toBe("99'");
              });

              it("[PRPI-6849] The last notification from ET First Half should be: ET First Half Ends", async () => {
                expect(await firstHalfEndsETPO.notificationTitle.getText()).toBe("ET First Half");
                expect(await firstHalfEndsETPO.notificationDescription.getText()).toBe("Ends");
              });

              it("[PRPI-6849] The ET First Half Period Status Notification should be: Wolves 1 - 1 Real Madrid", async () => {
                expect(await firstHalfETPeriodStatusPO.periodStatusTitle.getText()).toBe("ET First Half");
                expect(await firstHalfETResultPO.score.getText()).toBe("1 - 1");
                expect(await firstHalfETResultPO.homeTeam.getText()).toBe("Wolves");
                expect(await firstHalfETResultPO.awayTeam.getText()).toBe("Real Madrid");
              });

              it("[PRPI-6849] The ET First Half Possession should be: Wolves 30% - 70% Real Madrid", async () => {
                expect(await firstHalfETPossessionPO.getLabel.getText()).toBe("Possession %");
                expect(await firstHalfETPossessionPO.statisticsHome.getText()).toBe("30");
                expect(await firstHalfETPossessionPO.statisticsAway.getText()).toBe("70");
              });

              it("[PRPI-6849] The first notification from ET Second Half should be: ET Second Half Starts", async () => {
                expect(await secondHalfStartsETPO.notificationTitle.getText()).toBe("ET Second Half");
                expect(await secondHalfStartsETPO.notificationDescription.getText()).toBe("Starts");
              });

              it("[PRPI-6849] The 109' away team should be: Penalty", async () => {
                expect(await penaltyPO.teamNotificationTitle.getText()).toBe("Penalty");
                expect(await minuteByMinuteETSecondHalfPO.minutes[1].getText()).toBe("109'");
              });

              it("[PRPI-6849] The 110' away team should be: Goal! scored by: Gareth Bale", async () => {
                expect(await penaltyGoalPO.goalNotificationTitle.getText()).toBe("Goal!");
                expect(await penaltyGoalPO.goalNotificationDescription.getText()).toBe("Gareth Bale");
                expect(await browser.containsClass(penaltyGoalPO.element, GoalNotificationPO.states.GOAL)).toBe(true);
                expect(await minuteByMinuteETSecondHalfPO.minutes[0].getText()).toBe("110'");
              });

              it("[PRPI-6849] The last notification from ET Second Half should be: ET Second Half Ends", async () => {
                expect(await secondHalfEndsETPO.notificationTitle.getText()).toBe("ET Second Half");
                expect(await secondHalfEndsETPO.notificationDescription.getText()).toBe("Ends");
              });
            });
          });
        });
      });
    });
  });
});
