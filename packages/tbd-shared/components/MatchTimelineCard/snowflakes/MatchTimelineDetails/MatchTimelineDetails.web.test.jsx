import "jest-dom/extend-expect";
import { render } from "@testing-library/react";

import { IncidentIconType, FixtureTeamSide } from "@ppb/the-wall-common/types";

import { MatchStats } from "@ppb/the-wall-web";

import { CardNotificationType } from "../MinuteIncidents/snowflakes/CardNotification/CardNotification.types";
import { IncidentDisplayOrder } from "../Incident/Incident.types";
import { IncidentEvents } from "../IncidentEvents/IncidentEvents.web";
import { MatchTimelineViewMode } from "../MatchTimeline/MatchTimeline.types";
import { TimelineBarViewMode } from "../TimelineBar/TimelineBar.types";
import { MinuteIncidentsEventType } from "../MinuteIncidents/MinuteIncidents.types";
import { MinuteByMinute } from "../MinuteByMinute/MinuteByMinute.web";
import { PeriodStatusNotification } from "../PeriodStatusNotification/PeriodStatusNotification.web";

import { MatchTimelineDetails } from "./MatchTimelineDetails.web";
import { TEST_ID } from "./MatchTimelineDetails.web.selectors";
import { MatchTimeline } from "../MatchTimeline/MatchTimeline.web";

jest.mock("@ppb/the-wall-web", () => ({
  MatchStats: jest.fn(() => <match-stats />),
}));

jest.mock("../MatchTimeline/MatchTimeline.web", () => ({
  MatchTimeline: jest.fn(() => <match-timeline-mock />),
}));

jest.mock("../IncidentEvents/IncidentEvents.web", () => ({
  IncidentEvents: jest.fn(() => <incident-events-mock />),
}));

jest.mock("../MinuteByMinute/MinuteByMinute.web", () => ({
  MinuteByMinute: jest.fn(() => <minute-by-minute-mock />),
}));

jest.mock("../PeriodStatusNotification/PeriodStatusNotification.web", () => ({
  PeriodStatusNotification: jest.fn(() => <period-status-notification-mock />),
}));

const translations = {
  prematch: "KO",
};

const timelines = [
  {
    periodLength: 45,
    minute: 45,
    homeIncidents: [
      {
        minute: 8,
        icon: IncidentIconType.YELLOW_CARD,
      },
    ],
    awayIncidents: [
      {
        minute: 33,
        icon: IncidentIconType.GOAL,
      },
    ],
    viewMode: TimelineBarViewMode.NORMAL,
    caption: "HT",
  },
  {
    periodLength: 45,
    minute: 40,
    homeIncidents: [
      {
        minute: 12,
        icon: IncidentIconType.GOAL,
      },
    ],
    awayIncidents: [
      {
        minute: 37,
        icon: IncidentIconType.RED_CARD,
      },
    ],
    viewMode: TimelineBarViewMode.NORMAL,
    caption: "FT",
  },
];

const homeIncidents = [
  {
    icon: IncidentIconType.YELLOW_CARD,
    minute: 8,
    player: "Robbie Fowler",
    displayOrder: IncidentDisplayOrder.REVERSED,
  },
  {
    icon: IncidentIconType.GOAL,
    minute: 33,
    player: "Steven Gerrard",
    displayOrder: IncidentDisplayOrder.REVERSED,
  },
];
const awayIncidents = [
  {
    icon: IncidentIconType.GOAL,
    minute: 57,
    player: "Sergio Aguero",
    displayOrder: IncidentDisplayOrder.NORMAL,
  },
  {
    icon: IncidentIconType.RED_CARD,
    minute: 82,
    player: "Kevin De Bruyne",
    displayOrder: IncidentDisplayOrder.NORMAL,
  },
];

const matchTimelineProps = {
  homeCrest: "",
  awayCrest: "",
  lastIncident: undefined,
  timelines,
  translations,
  viewMode: MatchTimelineViewMode.CONDENSED,
};

const incidentEventsProps = {
  homeIncidents,
  awayIncidents,
};

const minutebyMinuteFirstHalfProps = [
  {
    minute: 10,
    events: [
      {
        notificationEventType: MinuteIncidentsEventType.CARD,
        notificationEventProps: {
          title: "Card",
          side: FixtureTeamSide.HOME,
          description: "yellow card description",
          secondDescription: "secondDescription",
          cardType: CardNotificationType.YELLOW,
        },
      },
      {
        notificationEventType: MinuteIncidentsEventType.GOAL,
        notificationEventProps: {
          title: "Goal",
          side: FixtureTeamSide.AWAY,
          description: "goal description",
          secondDescription: "secondDescription",
        },
      },
      {
        notificationEventType: MinuteIncidentsEventType.TEAM,
        notificationEventProps: {
          title: "Team notification",
          side: FixtureTeamSide.AWAY,
          description: "notification description",
          secondDescription: "secondDescription",
        },
      },
    ],
  },
  {
    minute: 40,
    events: [
      {
        notificationEventType: MinuteIncidentsEventType.TEAM,
        notificationEventProps: {
          title: "Team notification",
          side: FixtureTeamSide.AWAY,
          description: "notification description",
          secondDescription: "secondDescription",
        },
      },
    ],
  },
  {
    minute: 45,
    extraTimeMinute: 3,
    events: [
      {
        notificationEventType: MinuteIncidentsEventType.TEAM,
        notificationEventProps: {
          title: "Team notification",
          side: FixtureTeamSide.HOME,
          description: "notification description",
          secondDescription: "secondDescription",
        },
      },
    ],
  },
  {
    minute: 49,
    events: [
      {
        notificationEventType: MinuteIncidentsEventType.NOTIFICATION,
        notificationEventProps: {
          title: "First half Ends",
          description: "goal description",
          secondDescription: "secondDescription",
        },
      },
    ],
  },
];

const minutebyMinuteSecondHalfProps = [
  {
    minute: 70,
    events: [
      {
        notificationEventType: MinuteIncidentsEventType.CARD,
        notificationEventProps: {
          title: "Card",
          side: FixtureTeamSide.HOME,
          description: "yellow card description",
          secondDescription: "secondDescription",
          cardType: CardNotificationType.YELLOW,
        },
      },
      {
        notificationEventType: MinuteIncidentsEventType.GOAL,
        notificationEventProps: {
          title: "Goal",
          side: FixtureTeamSide.AWAY,
          description: "goal description",
          secondDescription: "secondDescription",
        },
      },
      {
        notificationEventType: MinuteIncidentsEventType.TEAM,
        notificationEventProps: {
          title: "Team notification",
          side: FixtureTeamSide.AWAY,
          description: "notification description",
          secondDescription: "secondDescription",
        },
      },
    ],
  },
];

const minuteByMinutesETFH = [
  {
    minute: 100,
    events: [
      {
        notificationEventType: MinuteIncidentsEventType.CARD,
        notificationEventProps: {
          title: "Card",
          side: FixtureTeamSide.HOME,
          description: "yellow card description",
          secondDescription: "secondDescription",
          cardType: CardNotificationType.YELLOW,
        },
      },
      {
        notificationEventType: MinuteIncidentsEventType.GOAL,
        notificationEventProps: {
          title: "Goal",
          side: FixtureTeamSide.AWAY,
          description: "goal description",
          secondDescription: "secondDescription",
        },
      },
      {
        notificationEventType: MinuteIncidentsEventType.TEAM,
        notificationEventProps: {
          title: "Team notification",
          side: FixtureTeamSide.AWAY,
          description: "notification description",
          secondDescription: "secondDescription",
        },
      },
    ],
  },
];

const minuteByMinutesETFT = [
  {
    minute: 100,
    events: [
      {
        notificationEventType: MinuteIncidentsEventType.CARD,
        notificationEventProps: {
          title: "Card",
          side: FixtureTeamSide.HOME,
          description: "yellow card description",
          secondDescription: "secondDescription",
          cardType: CardNotificationType.YELLOW,
        },
      },
      {
        notificationEventType: MinuteIncidentsEventType.GOAL,
        notificationEventProps: {
          title: "Goal",
          side: FixtureTeamSide.AWAY,
          description: "goal description",
          secondDescription: "secondDescription",
        },
      },
      {
        notificationEventType: MinuteIncidentsEventType.TEAM,
        notificationEventProps: {
          title: "Team notification",
          side: FixtureTeamSide.AWAY,
          description: "notification description",
          secondDescription: "secondDescription",
        },
      },
    ],
  },
];

const barStats = [
  {
    home: 23,
    away: 77,
    label: "Possession %",
  },
  {
    home: 3,
    away: 5,
    label: "Shots On Target",
  },
  {
    home: 18,
    away: 12,
    label: "Shots Off Target",
  },
  {
    home: 15,
    away: 25,
    label: "Dangerous Attacks",
  },
];

const head2headHT = {
  homeTeamName: "Team A",
  awayTeamName: "Team B",
  score: "2 - 1",
  i18n: {
    penalties: "Penalties",
    aet: "AET",
  },
  viewMode: "MIN",
};

const matchStatsHalfTime = {
  periodStat: {
    title: "Half Time",
    resultProps: head2headHT,
  },
  stats: barStats,
};

const matchStatsFullTime = {
  periodStat: {
    title: "Full Time",
    resultProps: head2headHT,
  },
  stats: barStats,
};

const matchStatsExtraFH = {
  periodStat: {
    title: "ET Half Time",
    resultProps: head2headHT,
  },
  stats: barStats,
};

const matchStatsExtraEnd = {
  periodStat: {
    title: "ET Full Time",
    resultProps: head2headHT,
  },
  stats: barStats,
};

const i18N = {
  minuteByMinuteTitle: "Minute by Minute",
};

function renderMatchTimelineDetails(
  matchTimeline,
  incidentEvents,
  minuteByMinutesFirstHalf,
  minuteByMinutesSecondHalf,
  minuteByMinutesExtraHalf,
  minuteByMinutesExtraSecondHalf,
  matchStatsHT,
  matchStatsFT,
  matchStatsETHT,
  matchStatsETFT,
) {
  const { container } = render(
    <MatchTimelineDetails
      matchTimeline={matchTimeline}
      incidentEvents={incidentEvents}
      minutesByMinutesFirstHalf={minuteByMinutesFirstHalf}
      minutesByMinutesSecondHalf={minuteByMinutesSecondHalf}
      minutesByMinutesExtraTimeFH={minuteByMinutesExtraHalf}
      minutesByMinutesExtraTimeSH={minuteByMinutesExtraSecondHalf}
      matchStatsHalfTime={matchStatsHT}
      matchStatsFullTime={matchStatsFT}
      matchStatsExtraFH={matchStatsETHT}
      matchStatsExtraEnd={matchStatsETFT}
      i18N={i18N}
    />,
  );
  return container.querySelector(TEST_ID);
}

describe("MatchTimelineDetails", () => {
  describe("render Football Timeline Detailed view", () => {
    beforeEach(jest.clearAllMocks);

    it("should render the MatchTimeline component with the correct props", () => {
      renderMatchTimelineDetails(
        matchTimelineProps,
        incidentEventsProps,
        minutebyMinuteFirstHalfProps,
        minutebyMinuteSecondHalfProps,
        undefined,
        undefined,
        matchStatsHalfTime,
      );

      expect(MatchTimeline.mock.calls[0][0]).toEqual({
        awayCrest: "",
        homeCrest: "",
        lastIncident: undefined,
        timelines: [
          {
            awayIncidents: [
              {
                icon: IncidentIconType.GOAL,
                minute: 33,
              },
            ],
            caption: "HT",
            homeIncidents: [
              {
                icon: IncidentIconType.YELLOW_CARD,
                minute: 8,
              },
            ],
            minute: 45,
            periodLength: 45,
            viewMode: "NORMAL",
          },
          {
            awayIncidents: [
              {
                icon: IncidentIconType.RED_CARD,
                minute: 37,
              },
            ],
            caption: "FT",
            homeIncidents: [
              {
                icon: IncidentIconType.GOAL,
                minute: 12,
              },
            ],
            minute: 40,
            periodLength: 45,
            viewMode: "NORMAL",
          },
        ],
        translations: {
          prematch: "KO",
        },
        viewMode: "NORMAL",
      });

      expect(IncidentEvents.mock.calls[0][0]).toEqual(incidentEventsProps);
      expect(MinuteByMinute.mock.calls.length).toEqual(2);
      expect(MinuteByMinute.mock.calls[1][0]).toEqual({ incidents: minutebyMinuteFirstHalfProps });
      expect(PeriodStatusNotification.mock.calls.length).toEqual(1);
      expect(PeriodStatusNotification.mock.calls[0][0]).toEqual(matchStatsHalfTime.periodStat);
    });

    it("should render the MatchTimeline component without MinuteByMinute", () => {
      renderMatchTimelineDetails(
        matchTimelineProps,
        incidentEventsProps,
        minutebyMinuteFirstHalfProps[0],
        undefined,
        undefined,
        undefined,
      );

      expect(MatchTimeline.mock.calls.length).toBe(1);
      expect(IncidentEvents.mock.calls.length).toBe(1);
      expect(MinuteByMinute.mock.calls.length).toBe(0);
      expect(PeriodStatusNotification.mock.calls.length).toBe(0);
    });

    it("should render the MatchTimeline component with one MatchStats component", () => {
      renderMatchTimelineDetails(
        matchTimelineProps,
        incidentEventsProps,
        minutebyMinuteFirstHalfProps,
        minutebyMinuteSecondHalfProps,
        undefined,
        undefined,
        matchStatsHalfTime,
      );

      expect(MatchTimeline.mock.calls.length).toBe(1);
      expect(IncidentEvents.mock.calls.length).toBe(1);
      expect(MinuteByMinute.mock.calls.length).toBe(2);
      expect(MatchStats.mock.calls.length).toBe(1);
      expect(PeriodStatusNotification.mock.calls.length).toBe(1);
    });

    it("should render the MatchTimeline component with two MatchStats components", () => {
      renderMatchTimelineDetails(
        matchTimelineProps,
        incidentEventsProps,
        minutebyMinuteFirstHalfProps,
        minutebyMinuteSecondHalfProps,
        undefined,
        undefined,
        matchStatsHalfTime,
        matchStatsFullTime,
      );

      expect(MatchTimeline.mock.calls.length).toBe(1);
      expect(IncidentEvents.mock.calls.length).toBe(1);
      expect(MinuteByMinute.mock.calls.length).toBe(2);
      expect(MatchStats.mock.calls.length).toBe(2);
      expect(PeriodStatusNotification.mock.calls.length).toBe(2);
    });

    it("should render the MatchTimeline component with three MatchStats components", () => {
      renderMatchTimelineDetails(
        matchTimelineProps,
        incidentEventsProps,
        minutebyMinuteFirstHalfProps,
        minutebyMinuteSecondHalfProps,
        minuteByMinutesETFH,
        undefined,
        matchStatsHalfTime,
        matchStatsFullTime,
        matchStatsExtraFH,
      );

      expect(MatchTimeline.mock.calls.length).toBe(1);
      expect(IncidentEvents.mock.calls.length).toBe(1);
      expect(MinuteByMinute.mock.calls.length).toBe(3);
      expect(MatchStats.mock.calls.length).toBe(3);
      expect(PeriodStatusNotification.mock.calls.length).toBe(3);
    });

    it("should render the MatchTimeline component with four MinuteByMinutes components", () => {
      renderMatchTimelineDetails(
        matchTimelineProps,
        incidentEventsProps,
        minutebyMinuteFirstHalfProps,
        minutebyMinuteSecondHalfProps,
        minuteByMinutesETFH,
        minuteByMinutesETFT,
        matchStatsHalfTime,
        matchStatsFullTime,
        matchStatsExtraFH,
        matchStatsExtraEnd,
      );

      expect(MatchTimeline.mock.calls.length).toBe(1);
      expect(IncidentEvents.mock.calls.length).toBe(1);
      expect(MinuteByMinute.mock.calls.length).toBe(4);
      expect(MatchStats.mock.calls.length).toBe(3);
      expect(PeriodStatusNotification.mock.calls.length).toBe(4);
    });

    it("should render PeriodStatusNotification without MatchStats when only periodStats are available", () => {
      renderMatchTimelineDetails(
        matchTimelineProps,
        incidentEventsProps,
        minutebyMinuteFirstHalfProps,
        minutebyMinuteSecondHalfProps,
        minuteByMinutesETFH,
        minuteByMinutesETFT,
        {
          periodStat: {
            title: "Half Time",
            resultProps: head2headHT,
          },
        },
        {
          periodStat: {
            title: "Half Time",
            resultProps: head2headHT,
          },
        },
        {
          periodStat: {
            title: "Half Time",
            resultProps: head2headHT,
          },
        },
        matchStatsExtraEnd,
      );

      expect(MatchTimeline.mock.calls.length).toBe(1);
      expect(IncidentEvents.mock.calls.length).toBe(1);
      expect(MinuteByMinute.mock.calls.length).toBe(4);
      expect(MatchStats.mock.calls.length).toBe(0);
      expect(PeriodStatusNotification.mock.calls.length).toBe(4);
    });
  });
});
