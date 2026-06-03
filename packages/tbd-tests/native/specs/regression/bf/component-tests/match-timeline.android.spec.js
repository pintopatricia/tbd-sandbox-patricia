const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getEventLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { swipeUp, swipeFromElementToElement, swipeDown } = require("../../../../helpers/gestures");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const {
  MatchStatsSO,
  ActionLinkSO,
  FootballScoreboardSO,
  HeadToHeadResultSO,
  MatchTimelineSO,
  MatchTimelineDetailsSO,
  TimelineBarSO,
  IncidentEventsSO,
  IncidentSO,
  MinuteByMinuteSO,
  MinuteIncidentsSO,
  CardNotificationSO,
  GoalNotificationSO,
  PeriodStatusNotificationSO,
  BarStatSO,
  SubstitutionNotificationSO,
  TeamNotificationSO,
  NotificationSO,
} = require("../../../../screen-objects");

const mockService = new MockService();
const mockServerPort = mockService.getMockServerPort();
const mockServerHost = mockService.getMockServerHost();

const matchTimelineDetailsSO = new MatchTimelineDetailsSO();
const footballScoreboardSO = new FootballScoreboardSO();
const timelineBarMatchTimelineDetailsSO = new MatchTimelineSO(matchTimelineDetailsSO.matchTimeline);
const firstHalfTimelineBarSO = new TimelineBarSO(timelineBarMatchTimelineDetailsSO.timelines[0]);
const secondHalfTimelineBarSO = new TimelineBarSO(timelineBarMatchTimelineDetailsSO.timelines[1]);
const firstHalfExtraTimeTimelineBarSO = new TimelineBarSO(timelineBarMatchTimelineDetailsSO.timelines[2]);
const secondHalfExtraTimeTimelineBarSO = new TimelineBarSO(timelineBarMatchTimelineDetailsSO.timelines[3]);
const homeIncidentsFirstHalfSO = new TimelineBarSO(firstHalfTimelineBarSO.timelineBarHomeIncidents);
const awayIncidentsFirstHalfSO = new TimelineBarSO(firstHalfTimelineBarSO.timelineBarAwayIncidents);
const homeIncidentsSecondHalfSO = new TimelineBarSO(secondHalfTimelineBarSO.timelineBarHomeIncidents);
const incidentEventsSO = new IncidentEventsSO(matchTimelineDetailsSO.incidentEvents);
const firstIncidentSO = new IncidentSO(incidentEventsSO.incidents[0]);
const firstHalfMinuteIncidentsSO = new MinuteIncidentsSO(matchTimelineDetailsSO.minuteByMinuteFirstHalf);
// On match timeline the incidents are displayed in a reverse order
const firstMinuteIncidentFirstHalfSO = new NotificationSO(firstHalfMinuteIncidentsSO.minuteIncidentsContainers[3]);
const minuteByMinuteSO = new MinuteByMinuteSO();
const secondMinuteIncidentFirstHalfSO = new MinuteIncidentsSO(firstHalfMinuteIncidentsSO.minuteIncidentsContainers[2]);
const firstCardNotificationFirstHalfSO = new CardNotificationSO(
  firstHalfMinuteIncidentsSO.minuteIncidentsContainers[2],
);
const fourthMinuteIncidentFirstHalfSO = new MinuteIncidentsSO(firstHalfMinuteIncidentsSO.minuteIncidentsContainers[0]);
const goalNotificationFirstHalfSO = new GoalNotificationSO(firstHalfMinuteIncidentsSO.minuteIncidentsContainers[0]);
const firstHalfPeriodStatusNotificationSO = new PeriodStatusNotificationSO(matchTimelineDetailsSO.halfTimeEndContainer);
const firstHalfHeadToHeadResultSO = new HeadToHeadResultSO(firstHalfPeriodStatusNotificationSO.element);
const firstHalfMatchStatsSO = new MatchStatsSO(matchTimelineDetailsSO.halfTimeEndContainer);
const firstHalfStatContainerSO = new MatchStatsSO(firstHalfMatchStatsSO.barStatContainer);
const firstBarBarStatContainerSO = new BarStatSO(firstHalfStatContainerSO.barsWrapper[0]);
const secondHalfMinuteIncidentsSO = new MinuteIncidentsSO(matchTimelineDetailsSO.minuteByMinuteSecondHalf);
const secondMinuteIncidentSecondHalfSO = new MinuteIncidentsSO(
  secondHalfMinuteIncidentsSO.minuteIncidentsContainers[3],
);
const substitutionNotificationSecondHalfSO = new SubstitutionNotificationSO(
  secondHalfMinuteIncidentsSO.minuteIncidentsContainers[3],
);
const teamNotificationSecondHalfSO = new TeamNotificationSO(secondHalfMinuteIncidentsSO.minuteIncidentsContainers[3]);
const thirdMinuteIncidentSecondHalfSO = new NotificationSO(secondHalfMinuteIncidentsSO.minuteIncidentsContainers[2]);
const fourthMinuteIncidentSecondHalfSO = new MinuteIncidentsSO(
  secondHalfMinuteIncidentsSO.minuteIncidentsContainers[1],
);
const goalNotificationSecondHalfSO = new GoalNotificationSO(secondHalfMinuteIncidentsSO.minuteIncidentsContainers[1]);
const secondHalfPeriodStatusNotificationSO = new PeriodStatusNotificationSO(
  matchTimelineDetailsSO.fullTimeEndContainer,
);
const secondHalfMatchStatsSO = new MatchStatsSO(matchTimelineDetailsSO.fullTimeEndContainer);
const actionLinkSO = new ActionLinkSO();

const EVENT_ID = "29682729";

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
        urn: `ppb:tbd:card:matchtimeline:${EVENT_ID}`,
        contentTitle: "Match Timeline",
        sportevent: {
          eventName: "Wolves v Real Madrid",
          openDate: "2010-10-14T18:45Z",
          urn: `ppb:event:${EVENT_ID}`,
          __typename: "SportsEvent",
        },
        footballFixture: {
          urn: `ppb:fixture:${EVENT_ID}`,
          home: {
            name: "Wolves",
            crest: {
              vector: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
              small: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
              medium: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
              large: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
            },
          },
          away: { name: "Real Madrid" },
          scheduledAt: "2010-10-14T18:45Z",
          duration: {
            period: "REGULAR",
            status: "INPLAY_FIRST_HALF",
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "MatchTimelineCard",
        urn: `ppb:tbd:card:matchtimeline:${EVENT_ID}`,
      },
    },
  ],
};

const FIRST_HALF_INCIDENTS = [
  {
    details: {
      __typename: "GoalIncident",
      side: "AWAY",
      goalType: "NORMAL",
      goalScorer: { name: "Cristiano Ronaldo" },
      assist: { name: "Eden Hazard" },
    },
    periodStatus: "INPLAY_FIRST_HALF",
    clock: { minute: 40 },
  },
  {
    details: {
      __typename: "CardIncident",
      cardType: "YELLOW",
      side: "AWAY",
      player: {
        name: "Cristiano Ronaldo",
      },
    },
    periodStatus: "INPLAY_FIRST_HALF",
    clock: { minute: 35 },
  },
  {
    details: {
      __typename: "CardIncident",
      cardType: "RED",
      side: "HOME",
      player: {
        name: "Pedro Neto",
      },
    },
    periodStatus: "INPLAY_FIRST_HALF",
    clock: { minute: 30 },
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

const HALF_TIME_INCIDENTS = [
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
  ...FIRST_HALF_INCIDENTS,
];

const SECOND_HALF_INCIDENTS = [
  {
    clock: {
      minute: 93,
    },
    details: {
      __typename: "PeriodIncident",
      periodType: "PERIOD_TRANSITION",
      status: "FULL",
    },
    periodStatus: "FULL",
  },
  {
    clock: {
      minute: 92,
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
      minute: 90,
    },
    details: {
      __typename: "PeriodIncident",
      periodType: "INJURY_TIME_UPDATE",
      status: "INPLAY_SECOND_HALF",
      injuryTime: 2,
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
      minute: 75,
    },
    details: {
      __typename: "SubstitutionIncident",
      playerIn: {
        name: "Ronaldinho",
      },
      playerOut: {
        name: "Lionel Messi",
      },
    },
    periodStatus: "INPLAY_SECOND_HALF",
  },
  {
    clock: {
      minute: 45,
      second: 0,
    },
    periodStatus: "INPLAY_SECOND_HALF",
    details: {
      __typename: "PeriodIncident",
      periodType: "PERIOD_TRANSITION",
      status: "INPLAY_SECOND_HALF",
    },
  },
  ...HALF_TIME_INCIDENTS,
];

const EXTRA_TIME_SECOND_HALF_NEW_INCIDENTS_1 = [
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
  ...SECOND_HALF_INCIDENTS,
];

const EXTRA_TIME_SECOND_HALF_NEW_INCIDENTS_2 = [
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
  ...EXTRA_TIME_SECOND_HALF_NEW_INCIDENTS_1,
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
  ...EXTRA_TIME_SECOND_HALF_NEW_INCIDENTS_2,
];

const STATS = [
  {
    period: "REGULAR",
    periodStatus: "INPLAY_FIRST_HALF",
    home: {
      possession: 65,
    },
    away: {
      possession: 35,
      goals: 1,
    },
  },
];

const SCA_MOCK_FIRST_HALF = {
  fixture: [
    {
      eventId: EVENT_ID,
      score: {
        home: 0,
        away: 1,
      },
      duration: {
        period: "REGULAR",
        status: "INPLAY_FIRST_HALF",
        clock: {
          minute: 40,
          second: 24,
        },
      },
      incidents: FIRST_HALF_INCIDENTS,
      stats: STATS,
    },
  ],
};

const SCA_MOCK_HALF_TIME = {
  fixture: [
    {
      eventId: EVENT_ID,
      score: {
        home: 0,
        away: 1,
      },
      duration: {
        period: "REGULAR",
        status: "HALF",
        clock: {
          minute: 45,
          second: 24,
        },
      },
      incidents: HALF_TIME_INCIDENTS,
      stats: STATS,
    },
  ],
};

const SCA_MOCK_END_SECOND_HALF = {
  fixture: [
    {
      eventId: EVENT_ID,
      score: {
        home: 1,
        away: 1,
      },
      duration: {
        period: "REGULAR",
        status: "FULL",
        clock: {
          minute: 90,
          second: 24,
        },
        stoppageMinutes: 2,
      },
      incidents: SECOND_HALF_INCIDENTS,
      stats: STATS,
    },
  ],
};

const SCA_MOCK_EXTRA_TIME_NEW_EVENT_1 = {
  fixture: [
    {
      eventId: EVENT_ID,
      score: {
        home: 1,
        away: 1,
      },
      duration: {
        clock: {
          minute: 110,
          second: 0,
        },
        status: "INPLAY_SECOND_HALF",
        period: "EXTRA",
      },
      incidents: EXTRA_TIME_SECOND_HALF_NEW_INCIDENTS_1,
      stats: STATS,
    },
  ],
};

const SCA_MOCK_EXTRA_TIME_NEW_EVENT_2 = {
  fixture: [
    {
      eventId: EVENT_ID,
      score: {
        home: 1,
        away: 1,
      },
      duration: {
        clock: {
          minute: 115,
          second: 0,
        },
        status: "INPLAY_SECOND_HALF",
        period: "EXTRA",
      },
      incidents: EXTRA_TIME_SECOND_HALF_NEW_INCIDENTS_2,
      stats: STATS,
    },
  ],
};

const SCA_MOCK_END_STATE = {
  fixture: [
    {
      eventId: EVENT_ID,
      score: {
        home: 1,
        away: 1,
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
      stats: STATS,
    },
  ],
};

describe("Match timeline details card", () => {
  describe("When the user is in a football event with match timeline card available", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_MOCK_FIRST_HALF));
      const url = `sport/competition/event/e-${EVENT_ID}`;
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(timelineBarMatchTimelineDetailsSO.element);
    });

    it("[PRPI-2289] The timeline bar component should be displayed with 2 timeline bars", async () => {
      expect(await timelineBarMatchTimelineDetailsSO.timelines.length).toBe(2);
    });

    it("[PRPI-2290] The home and the away team shields should be displayed on timeline bar component", async () => {
      expect(await timelineBarMatchTimelineDetailsSO.homeCrest.isDisplayed()).toBe(true);
      expect(await timelineBarMatchTimelineDetailsSO.awayShieldCrest.isDisplayed()).toBe(true);
    });

    it("[PRPI-2291] The kick-off label should be displayed on timeline bar component as 'KO'", async () => {
      expect(await timelineBarMatchTimelineDetailsSO.prematch.getText()).toBe("KO");
    });

    it("[PRPI-2292] The half time label should be displayed in the end of first timeline bar as 'HT'", async () => {
      expect(await firstHalfTimelineBarSO.timelineBarCaption.getText()).toBe("HT");
    });

    it("[PRPI-2293] The full time label should be displayed in the end of second timeline bar as 'FT'", async () => {
      expect(await secondHalfTimelineBarSO.timelineBarCaption.getText()).toBe("FT");
    });

    it("[PRPI-2294] The first half timeline bar should display 1 home incident", async () => {
      expect(await homeIncidentsFirstHalfSO.incidentsIcon.length).toBe(1);
    });

    it("[PRPI-2295] The first half timeline bar should display 2 away incidents", async () => {
      expect(await awayIncidentsFirstHalfSO.incidentsIcon.length).toBe(2);
    });

    it("[PRPI-2296] The incident events container should be displayed with 3 incidents", async () => {
      expect(await incidentEventsSO.incidents.length).toBe(3);
    });

    it("[PRPI-2297] The first incident event should display an icon, the time that occurred and the player's name: '31' Pedro Neto'", async () => {
      expect(await firstIncidentSO.incidentIcon.isDisplayed()).toBe(true);
      expect(await firstIncidentSO.incidentMinute.getText()).toBe("31'");
      expect(await firstIncidentSO.incidentPlayer.getText()).toBe("Pedro Neto");
    });

    it("[PRPI-2298] The minute by minute component should be displayed with the title: 'Minute By Minute'", async () => {
      expect(await matchTimelineDetailsSO.minuteByMinuteTitle.getText()).toBe("Minute By Minute");
    });

    it("[PRPI-2299] The first half on minute by minute should display 4 minute incident containers", async () => {
      expect(await firstHalfMinuteIncidentsSO.minuteIncidentsContainers.length).toBe(4);
    });

    it("[PRPI-2300] The first minute incident container should be the notification 'Kick Off'", async () => {
      expect(await firstMinuteIncidentFirstHalfSO.notificationTitle.getText()).toBe("Kick Off");
    });

    it("[PRPI-2301] The second and third minute incident container should be the two card notifications", async () => {
      expect(await minuteByMinuteSO.cardNofitications.length).toBe(2);
    });

    it("[PRPI-2302] The second minute incident container that contains the first card notification should be at 31 minutes", async () => {
      expect(await secondMinuteIncidentFirstHalfSO.timeLabel.getText()).toBe("31'");
    });

    it("[PRPI-2303] The first card notification should display an icon and the description 'Red Card Pedro Neto'", async () => {
      expect(await firstCardNotificationFirstHalfSO.cardNotificationIcon.isDisplayed()).toBe(true);
      expect(await firstCardNotificationFirstHalfSO.cardNotificationTitle.getText()).toBe("Red Card");
      expect(await firstCardNotificationFirstHalfSO.cardNotificationDescription.getText()).toBe("Pedro Neto");
    });

    it("[PRPI-2304] The fourth minute incident container that contains the goal notification should be at 41 minutes", async () => {
      expect(await fourthMinuteIncidentFirstHalfSO.timeLabel.getText()).toBe("41'");
    });

    it("[PRPI-2305] The goal notification should display an icon and the description 'Goal! Cristiano Ronaldo Assist: Eden Hazard'", async () => {
      expect(await goalNotificationFirstHalfSO.goalNotificationIcon.isDisplayed()).toBe(true);
      expect(await goalNotificationFirstHalfSO.goalNotificationTitle.getText()).toBe("Goal!");
      expect(await goalNotificationFirstHalfSO.goalNotificationDescription.getText()).toBe("Cristiano Ronaldo");
      expect(await goalNotificationFirstHalfSO.goalNotificationSecondDescription.getText()).toBe("Assist: Eden Hazard");
    });

    describe("And then the event goes to half time", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_MOCK_HALF_TIME));
        await browser.waitUntilDisplayed(firstHalfPeriodStatusNotificationSO.title);
      });

      it("[PRPI-2306] The first half head to head results should be displayed with the title 'First Half'", async () => {
        expect(await firstHalfPeriodStatusNotificationSO.title.getText()).toBe("First Half");
      });

      it("[PRPI-2307] The head to head results should be: 'Wolves 0 - 1 Real Madrid'", async () => {
        expect(await firstHalfHeadToHeadResultSO.homeTeamName.getText()).toBe("Wolves");
        expect(await firstHalfHeadToHeadResultSO.awayTeamName.getText()).toBe("Real Madrid");
        expect(await firstHalfHeadToHeadResultSO.score.getText()).toBe("0 - 1");
        expect(await firstHalfHeadToHeadResultSO.homeCrest.isDisplayed()).toBe(true);
        expect(await firstHalfHeadToHeadResultSO.awayCrest.isDisplayed()).toBe(false);
        expect(await firstHalfHeadToHeadResultSO.shieldCrests.length).toBe(1);
        expect(await firstHalfHeadToHeadResultSO.shieldCrests[0].isDisplayed()).toBe(true);
      });

      it("[PRPI-2308] The first half stats should be displayed with 3 bar stats", async () => {
        expect(await firstHalfStatContainerSO.progressBars.length).toBe(3);
      });

      it("[PRPI-2309] The first bar stat should display: '65 Possession % 35'", async () => {
        expect(await firstBarBarStatContainerSO.homeStats.getText()).toBe("65");
        expect(await firstBarBarStatContainerSO.label.getText()).toBe("Possession %");
        expect(await firstBarBarStatContainerSO.awayStats.getText()).toBe("35");
      });

      describe("And then the event goes to the end of the second half", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getScaResponse(SCA_MOCK_END_SECOND_HALF));
          await browser.waitUntilDisplayed(goalNotificationSecondHalfSO.element);
        });

        it("[PRPI-2310] The incident events container should be updated to display 4 incidents", async () => {
          expect(await incidentEventsSO.incidents.length).toBe(4);
        });

        it("[PRPI-2311] The second half timeline bar should display 1 home incident", async () => {
          expect(await homeIncidentsSecondHalfSO.incidentsIcon.length).toBe(1);
        });

        describe("and the user scrolls minute by minute to the top", () => {
          beforeAll(async () => {
            await swipeFromElementToElement(
              matchTimelineDetailsSO.minuteByMinuteTitle,
              timelineBarMatchTimelineDetailsSO.element,
            );
          });

          afterAll(async () => {
            await swipeUp();
          });

          it("[PRPI-2312] The second half on minute by minute should display 5 minute incident containers", async () => {
            expect(await secondHalfMinuteIncidentsSO.minuteIncidentsContainers.length).toBe(5);
          });

          it("[PRPI-2312] The second minute incident container that contains a substitution and a team notification should be displayed at 76' minutes", async () => {
            expect(await secondMinuteIncidentSecondHalfSO.timeLabel.getText()).toBe("76'");
          });

          it("[PRPI-2312] The substitution notification should display the title: 'Substitution'", async () => {
            expect(await substitutionNotificationSecondHalfSO.title.getText()).toBe("Substitution");
          });

          it("[PRPI-2312] The substitution notification should display players in icon and information 'Ronaldinho'", async () => {
            expect(await substitutionNotificationSecondHalfSO.playerInIcon.isDisplayed()).toBe(true);
            expect(await substitutionNotificationSecondHalfSO.playerInText.getText()).toBe("Ronaldinho");
          });

          it("[PRPI-2312] The substitution notification should display players out icon and information 'Lionel Messi'", async () => {
            expect(await substitutionNotificationSecondHalfSO.playerOutIcon.isDisplayed()).toBe(true);
            expect(await substitutionNotificationSecondHalfSO.playerOutText.getText()).toBe("Lionel Messi");
          });

          it("[PRPI-2312] The team notification should display the following description: 'Shot On Target Casemiro'", async () => {
            expect(await teamNotificationSecondHalfSO.teamNotificationTitle.getText()).toBe("Shot On Target");
            expect(await teamNotificationSecondHalfSO.teamNotificationDescription.getText()).toBe("Casemiro");
          });

          it("[PRPI-2312] The third minute incident container should display the notification: 'Injury time +2'", async () => {
            expect(await thirdMinuteIncidentSecondHalfSO.notificationTitle.getText()).toBe("Injury Time");
            expect(await thirdMinuteIncidentSecondHalfSO.notificationDescription.getText()).toBe("+2'");
          });

          it("[PRPI-2312] The fourth minute incident container that contains an own goal notification should be displayed at 93' minutes", async () => {
            expect(await fourthMinuteIncidentSecondHalfSO.timeLabel.getText()).toBe("93'");
            expect(await goalNotificationSecondHalfSO.goalNotificationTitle.getText()).toBe("Own Goal!");
          });

          it("[PRPI-2312] The second half head to head results should be displayed despite of stats are not available", async () => {
            expect(await secondHalfPeriodStatusNotificationSO.title.getText()).toBe("Full Time");
            expect(await secondHalfMatchStatsSO.barStatContainer.isDisplayed()).toBe(false);
          });
        });

        // this feature is temporarily disabled until we have "Side-by-Side statistics - iteration 2" assignee: @BobTheBuilder
        xdescribe("when the user swipes up and a new event occurs", () => {
          beforeAll(async () => {
            await swipeUp();
            await mockService.mockHttpRequest(getScaResponse(SCA_MOCK_EXTRA_TIME_NEW_EVENT_1));
            await browser.waitUntilDisplayed(actionLinkSO.element);
          });

          it("[PRPI-2313] The 'New Event' button should be shown", async () => {
            expect(await actionLinkSO.element.isDisplayed()).toBe(true);
          });

          describe("And then the user presses New Event button", () => {
            beforeAll(async () => {
              await actionLinkSO.element.click();
              await browser.waitUntilDisplayed(footballScoreboardSO.element);
            });

            it("[PRPI-2314] the New Event button should be hidden", async () => {
              expect(await actionLinkSO.element.isExisting()).toBe(false);
            });

            describe("And then the user swipes up again and another new event occurs", () => {
              beforeAll(async () => {
                await swipeUp();
                await mockService.mockHttpRequest(getScaResponse(SCA_MOCK_EXTRA_TIME_NEW_EVENT_2));
                await browser.waitUntilDisplayed(actionLinkSO.element);
              });

              it("[PRPI-2314] the New Button should be displayed again", async () => {
                expect(await actionLinkSO.element.isDisplayed()).toBe(true);
              });

              describe("And then, after the extra time, the user swipes down and the event goes to the end state", () => {
                beforeAll(async () => {
                  await swipeDown(); // to the top
                  await mockService.mockHttpRequest(getScaResponse(SCA_MOCK_END_STATE));
                  await browser.waitUntilDisplayed(secondHalfExtraTimeTimelineBarSO.element);
                  await browser.waitUntilNotDisplayed(actionLinkSO.element);
                });

                it("[PRPI-2314] the New Event button should be hidden", async () => {
                  expect(await actionLinkSO.element.isDisplayed()).toBe(false);
                });

                it("[PRPI-2314] The timeline bar component should be display 4 timeline bars", async () => {
                  expect(await timelineBarMatchTimelineDetailsSO.timelines.length).toBe(4);
                });

                it("[PRPI-2314] The half time label should be displayed in the end of third timeline bar as 'HT'", async () => {
                  expect(await firstHalfExtraTimeTimelineBarSO.timelineBarCaption.getText()).toBe("HT");
                });

                it("[PRPI-2314] The full time label should be displayed in the end of fourth timeline bar as 'FT'", async () => {
                  expect(await secondHalfExtraTimeTimelineBarSO.timelineBarCaption.getText()).toBe("FT");
                });
              });
            });
          });
        });
      });
    });
  });
});
