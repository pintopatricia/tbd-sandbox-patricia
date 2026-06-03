const { ActionLinkPO, MatchTimelineDetailsPO, MinuteByMinutePO, NotificationPO } = require("../../../../page-objects");
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const matchTimelineDetailsPO = new MatchTimelineDetailsPO();
const minuteByMinuteFirstHalfPO = new MinuteByMinutePO(matchTimelineDetailsPO.listMinuteByMinute[3]);
const kickOffPO = new NotificationPO(minuteByMinuteFirstHalfPO.notifications[1]);
const newEventPO = new ActionLinkPO();

const mockService = new MockService();

const MOCKED_IMAGE = "http://example.test.com/mockedImage/image.png";
const EVENT_ID = "29465861";
const MODULE_NAME = "match_timeline_details";

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
          openDate: "2010-10-14T18:45Z",
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
            crest: {
              vector: MOCKED_IMAGE,
              small: MOCKED_IMAGE,
              medium: MOCKED_IMAGE,
              large: MOCKED_IMAGE,
            },
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
  {
    clock: {
      minute: 15,
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
      minute: 13,
    },
    details: {
      __typename: "GoalIncident",
      goalType: "POSSIBLE",
      side: "AWAY",
      goalScorer: {},
    },
    periodStatus: "INPLAY_FIRST_HALF",
  },
  ...FIRST_HALF_INCIDENTS,
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
      minute: 30,
    },
    details: {
      __typename: "PieceIncident",
      foulType: "FREE KICK",
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
    status: "FULL",
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
      stats: [
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
      ],
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
            possession: 50,
          },
          away: {
            possession: 50,
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
          periodStatus: "INPLAY_FIRST_HALF",
          home: {
            possession: 65,
          },
          away: {
            possession: 35,
          },
        },
      ],
    },
  ],
};

describe("Given user navigates on INPLAY football event with less than 4 incidents", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { disableCSSAnimations: true }));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getScaResponse(SCA_MOCK_INPLAY_FIRST_HALF));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(routes.getEventViewUrl(EVENT_ID));
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1408]_should_display_only_match_timeline_bar_component`);
  });

  it("[PRPI-1408]_should_display_only_match_timeline_bar_component", async () => {
    expect(
      await browser.checkScreen(`${MODULE_NAME}_[PRPI-1408]_should_display_only_match_timeline_bar_component`),
    ).toEqual(0);
  });

  describe("When the game goes to the Half Time", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getScaResponse(SCA_MOCK_HALF_TIME));
      await browser.tickFakeClock();
      await browser.waitUntilDisplayed(matchTimelineDetailsPO.minuteByMinuteTitle);
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1409]_the_period_notification_and_the_stats_from_first_half_should_be_displayed`,
      );
    });

    it("[PRPI-1409]_the_period_notification_and_the_stats_from_first_half_should_be_displayed", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1409]_the_period_notification_and_the_stats_from_first_half_should_be_displayed`,
        ),
      ).toEqual(0);
    });

    describe("When the game is on Second Half Time with a lot more incidents", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_MOCK_SECOND_HALF));
        await browser.tickFakeClock();
        await browser.waitUntilDisplayed(matchTimelineDetailsPO.minuteByMinuteTitle);
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1410]_the_match_timeline_details_and_minute_by_minute_component_should_be_updated_with_new_incidents`,
        );
      });

      it("[PRPI-1410]_the_match_timeline_details_and_minute_by_minute_component_should_be_updated_with_new_incidents", async () => {
        expect(
          await browser.checkScreen(
            `${MODULE_NAME}_[PRPI-1410]_the_match_timeline_details_and_minute_by_minute_component_should_be_updated_with_new_incidents`,
          ),
        ).toEqual(0);
      });

      describe("When the user scrolls down and then the event goes to the End State", () => {
        beforeAll(async () => {
          await kickOffPO.element.scrollIntoView();
          await browser.waitUntilInViewport(kickOffPO.element);
          await mockService.mockHttpRequest(getScaResponse(SCA_MOCK_END_STATE));
          await browser.tickFakeClock();
          await browser.waitUntilInViewport(newEventPO.element);
          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-1411]_the_new_event_notification_should_be_displayed`,
          );
        });

        it("[PRPI-1411]_the_new_event_notification_should_be_displayed", async () => {
          expect(
            await browser.checkScreen(`${MODULE_NAME}_[PRPI-1411]_the_new_event_notification_should_be_displayed`),
          ).toEqual(0);
        });
      });
    });
  });
});
