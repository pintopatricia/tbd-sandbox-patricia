import { render } from "@testing-library/react-native";
import { MatchStats } from "@ppb/the-wall-native";
import { IncidentEvents } from "../IncidentEvents/IncidentEvents.native";
import { MatchTimelineViewMode } from "../MatchTimeline/MatchTimeline.types";
import { MinuteByMinute } from "../MinuteByMinute/MinuteByMinute.native";
import { MatchTimeline } from "../MatchTimeline/MatchTimeline.native";
import { PeriodStatusNotification } from "../PeriodStatusNotification/PeriodStatusNotification.native";
import { MatchTimelineDetails } from "./MatchTimelineDetails.native";

import styles from "./MatchTimelineDetails.native.styles";
import {
  MATCH_TIMELINE_DETAILS,
  MTD_MATCH_TIMELINE,
  MTD_INCIDENT_EVENTS,
  MTD_MINUTE_BY_MINUTE,
  MTD_MINUTE_BY_MINUTE_TITLE,
  MTD_MBM_EXTRA_TIME_SH,
  MTD_MBM_EXTRA_TIME_FH,
  MTD_MBM_SECOND_HALF,
  MTD_MBM_FIRST_HALF,
  MTD_MATCH_STATS,
  MTD_EXTRA_END_CONTAINER,
  MTD_EXTRA_FH_END_CONTAINER,
  MTD_FULL_TIME_END_CONTAINER,
  MTD_HALF_TIME_END_CONTAINER,
} from "./MatchTimelineDetails.native.selectors";

jest.mock("@ppb/the-wall-native", () => ({
  MatchStats: jest.fn(() => <match-stats-mock />),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("../IncidentEvents/IncidentEvents.native", () => ({
  IncidentEvents: jest.fn(() => <incident-events-mock />),
}));

jest.mock("../MatchTimeline/MatchTimeline.native", () => ({
  MatchTimeline: jest.fn(() => <match-timeline-mock />),
}));

jest.mock("../MinuteByMinute/MinuteByMinute.native", () => ({
  MinuteByMinute: jest.fn(() => <minute-by-minute-mock />),
}));

jest.mock("../PeriodStatusNotification/PeriodStatusNotification.native", () => ({
  PeriodStatusNotification: jest.fn(() => <period-status-notification-mock />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
  spacings: {},
}));

function renderMatchTimelineDetails(props) {
  const component = render(<MatchTimelineDetails {...props} />);

  const { queryByTestId, queryAllByTestId } = component;

  return {
    matchTimelineDetails: queryByTestId(MATCH_TIMELINE_DETAILS),
    matchTimeline: queryByTestId(MTD_MATCH_TIMELINE),
    incidentEvents: queryByTestId(MTD_INCIDENT_EVENTS),
    minuteByMinute: queryByTestId(MTD_MINUTE_BY_MINUTE),
    minuteByMinuteTitle: queryByTestId(MTD_MINUTE_BY_MINUTE_TITLE),
    minuteByMinuteExtraTimeSH: queryByTestId(MTD_MBM_EXTRA_TIME_SH),
    minuteByMinuteExtraTimeFH: queryByTestId(MTD_MBM_EXTRA_TIME_FH),
    minuteByMinuteSecondHalf: queryByTestId(MTD_MBM_SECOND_HALF),
    minuteByMinuteFirstHalf: queryByTestId(MTD_MBM_FIRST_HALF),
    matchStats: queryAllByTestId(MTD_MATCH_STATS),
    extraEndContainer: queryByTestId(MTD_EXTRA_END_CONTAINER),
    extraFhEndContainer: queryByTestId(MTD_EXTRA_FH_END_CONTAINER),
    fullTimeEndContainer: queryByTestId(MTD_FULL_TIME_END_CONTAINER),
    halfTimeEndContainer: queryByTestId(MTD_HALF_TIME_END_CONTAINER),
  };
}

describe("MatchTimelineDetails", () => {
  const MATCH_TIMELINE = {
    the: "THE",
    timeline: "TIMELINE",
  };
  const INCIDENT_EVENTS = {
    homeIncidents: ["HOME INCIDENT"],
    awayIncidents: ["AWAY INCIDENT"],
  };
  const SETUP_VALUES = {
    matchTimeline: MATCH_TIMELINE,
    incidentEvents: INCIDENT_EVENTS,
    minutesByMinutesFirstHalf: [],
  };

  afterEach(jest.clearAllMocks);

  it("should display the match timeline details container with the correct styling", () => {
    const { matchTimelineDetails } = renderMatchTimelineDetails({ ...SETUP_VALUES });
    expect(matchTimelineDetails).toHaveStyle(styles.matchTimelineDetails);
  });

  it("should render the match timeline container", () => {
    const { matchTimeline } = renderMatchTimelineDetails({ ...SETUP_VALUES });
    expect(matchTimeline).not.toBe(null);
  });

  it("should call the MatchTimeline component with the correct arguments", () => {
    renderMatchTimelineDetails({ ...SETUP_VALUES });
    expect(MatchTimeline).toHaveBeenCalledWith(
      {
        ...SETUP_VALUES.matchTimeline,
        viewMode: MatchTimelineViewMode.NORMAL,
      },
      undefined,
    );
  });

  it("should render the incident events container", () => {
    const { incidentEvents } = renderMatchTimelineDetails({ ...SETUP_VALUES });
    expect(incidentEvents).not.toBe(null);
  });

  it("should call the IncidentEvents component with the correct arguments", () => {
    renderMatchTimelineDetails({ ...SETUP_VALUES });
    expect(IncidentEvents).toHaveBeenCalledWith(
      {
        ...SETUP_VALUES.incidentEvents,
      },
      undefined,
    );
  });

  it("should not render the minute by minute", () => {
    const { minuteByMinute } = renderMatchTimelineDetails({ ...SETUP_VALUES });
    expect(minuteByMinute).toBe(null);
  });

  it("should not draw the minute by minute first half container", () => {
    const { minuteByMinuteFirstHalf } = renderMatchTimelineDetails({ ...SETUP_VALUES });
    expect(minuteByMinuteFirstHalf).toBe(null);
  });

  describe("and there are only away incidents", () => {
    const INCIDENT_EVENTS_ONLY_AWAY = {
      homeIncidents: [],
      awayIncidents: ["AWAY INCIDENT"],
    };
    const SETUP_VALUES_ONLY_AWAY_INCIDENTS = {
      ...SETUP_VALUES,
      incidentEvents: INCIDENT_EVENTS_ONLY_AWAY,
    };

    it("should render the incident events container", () => {
      const { incidentEvents } = renderMatchTimelineDetails({ ...SETUP_VALUES_ONLY_AWAY_INCIDENTS });
      expect(incidentEvents).not.toBe(null);
    });

    it("should call the IncidentEvents component with the correct arguments", () => {
      renderMatchTimelineDetails({ ...SETUP_VALUES_ONLY_AWAY_INCIDENTS });
      expect(IncidentEvents).toHaveBeenCalledWith(
        {
          ...SETUP_VALUES_ONLY_AWAY_INCIDENTS.incidentEvents,
        },
        undefined,
      );
    });
  });

  describe("and there are no incident events", () => {
    const NO_INCIDENT_EVENTS = {
      homeIncidents: [],
      awayIncidents: [],
    };
    const SETUP_VALUES_NO_INCIDENTS = {
      ...SETUP_VALUES,
      incidentEvents: NO_INCIDENT_EVENTS,
    };

    it("should not render the incident events container", () => {
      const { incidentEvents } = renderMatchTimelineDetails({ ...SETUP_VALUES_NO_INCIDENTS });
      expect(incidentEvents).toBe(null);
    });

    it("should not call the IncidentEvents component", () => {
      renderMatchTimelineDetails({ ...SETUP_VALUES_NO_INCIDENTS });
      expect(IncidentEvents).not.toHaveBeenCalled();
    });
  });

  describe("and there are at least 4 incidents in the minutesByMinutesFirstHalf", () => {
    const I18N = { minuteByMinuteTitle: "MINUTE BY MINUTE TITLE" };
    const MINUTES_BY_MINUTES_FIRST_HALF = [
      "FIRST HALF ENTRY #1",
      "FIRST HALF ENTRY #2",
      "FIRST HALF ENTRY #3",
      "FIRST HALF ENTRY #4",
    ];
    const SETUP_VALUES_4_INCIDENTS = {
      ...SETUP_VALUES,
      minutesByMinutesFirstHalf: MINUTES_BY_MINUTES_FIRST_HALF,
      i18N: I18N,
    };

    it("should render the minute by minute container", () => {
      const { minuteByMinute } = renderMatchTimelineDetails({ ...SETUP_VALUES_4_INCIDENTS });
      expect(minuteByMinute).not.toBe(null);
    });

    it("should render the minute by minute title with the correct styling and text content", () => {
      const { minuteByMinuteTitle } = renderMatchTimelineDetails({ ...SETUP_VALUES_4_INCIDENTS });
      expect(minuteByMinuteTitle).toHaveStyle(styles.minuteByMinuteTitle);
      expect(minuteByMinuteTitle).toHaveTextContent(I18N.minuteByMinuteTitle);
    });

    it("should draw the minute by minute first half container with the correct styling", () => {
      const { minuteByMinuteFirstHalf } = renderMatchTimelineDetails({ ...SETUP_VALUES_4_INCIDENTS });
      expect(minuteByMinuteFirstHalf).not.toBe(null);
      expect(minuteByMinuteFirstHalf).toHaveStyle([]);
    });

    it("should call the MinuteByMinute component with the correct props", () => {
      renderMatchTimelineDetails({ ...SETUP_VALUES_4_INCIDENTS });
      expect(MinuteByMinute).toHaveBeenCalledWith(
        {
          incidents: MINUTES_BY_MINUTES_FIRST_HALF,
          lineExtensionStyle: [],
        },
        undefined,
      );
    });

    it("should not render the half time end container", () => {
      const { halfTimeEndContainer } = renderMatchTimelineDetails({ ...SETUP_VALUES_4_INCIDENTS });
      expect(halfTimeEndContainer).toBe(null);
    });

    it("should not render the full time end container", () => {
      const { fullTimeEndContainer } = renderMatchTimelineDetails({ ...SETUP_VALUES_4_INCIDENTS });
      expect(fullTimeEndContainer).toBe(null);
    });

    it("should not render the extra time first half end container", () => {
      const { extraFhEndContainer } = renderMatchTimelineDetails({ ...SETUP_VALUES_4_INCIDENTS });
      expect(extraFhEndContainer).toBe(null);
    });

    it("should not render the extra end container", () => {
      const { extraEndContainer } = renderMatchTimelineDetails({ ...SETUP_VALUES_4_INCIDENTS });
      expect(extraEndContainer).toBe(null);
    });

    describe("and matchStatsHalfTime is defined", () => {
      describe("and stats is an empty array", () => {
        const MATCH_STATS_HALF_TIME = {
          stats: [],
          periodStat: {
            period: "PERIOD",
            stat: "STAT",
          },
        };
        const SETUP_VALUES_EMPTY_MS_HALF_TIME = {
          ...SETUP_VALUES_4_INCIDENTS,
          matchStatsHalfTime: MATCH_STATS_HALF_TIME,
        };

        it("should draw the half time end container with the correct styling", () => {
          const { halfTimeEndContainer } = renderMatchTimelineDetails({ ...SETUP_VALUES_EMPTY_MS_HALF_TIME });
          expect(halfTimeEndContainer).toHaveStyle(styles.periodEndContainer);
        });

        it("should call the PeriodStatusNotification component with the correct arguments", () => {
          renderMatchTimelineDetails({ ...SETUP_VALUES_EMPTY_MS_HALF_TIME });
          expect(PeriodStatusNotification).toHaveBeenCalledWith(
            {
              ...MATCH_STATS_HALF_TIME.periodStat,
            },
            undefined,
          );
        });

        it("should not draw any match stats container", () => {
          const { matchStats } = renderMatchTimelineDetails({ ...SETUP_VALUES_EMPTY_MS_HALF_TIME });
          expect(matchStats[0]).toBeUndefined();
        });

        it("should not call the MatchStats component", () => {
          renderMatchTimelineDetails({ ...SETUP_VALUES_EMPTY_MS_HALF_TIME });
          expect(MatchStats).not.toHaveBeenCalled();
        });
      });

      describe("and stats is not an empty array", () => {
        const MATCH_STATS_HALF_TIME = {
          stats: ["FIRST STAT", "SECOND STAT"],
          periodStat: {
            period: "PERIOD",
            stat: "STAT",
          },
        };
        const SETUP_VALUES_MS_HALF_TIME = {
          ...SETUP_VALUES_4_INCIDENTS,
          matchStatsHalfTime: MATCH_STATS_HALF_TIME,
        };

        it("should draw a match stats container with the correct styling", () => {
          const { matchStats } = renderMatchTimelineDetails({ ...SETUP_VALUES_MS_HALF_TIME });
          expect(matchStats.length).toBe(1);
          expect(matchStats[0]).toHaveStyle(styles.matchStatsContainer);
        });

        it("should call the MatchStats component with the correct arguments", () => {
          renderMatchTimelineDetails({ ...SETUP_VALUES_MS_HALF_TIME });
          expect(MatchStats).toHaveBeenCalledWith(
            {
              barStats: MATCH_STATS_HALF_TIME.stats,
            },
            undefined,
          );
        });

        it("should call the MinuteByMinute component with the correct props", () => {
          renderMatchTimelineDetails({ ...SETUP_VALUES_MS_HALF_TIME });
          expect(MinuteByMinute).toHaveBeenCalledWith(
            {
              incidents: MINUTES_BY_MINUTES_FIRST_HALF,
              lineExtensionStyle: [styles.lineExtensionTop],
            },
            undefined,
          );
        });
      });
    });

    describe("and minutesByMinutesSecondHalf is defined", () => {
      const MINUTES_BY_MINUTES_SECOND_HALF = [
        "SECOND HALF ENTRY #1",
        "SECOND HALF ENTRY #2",
        "SECOND HALF ENTRY #3",
        "SECOND HALF ENTRY #4",
      ];
      const SETUP_VALUES_MBM_SECOND_HALF = {
        ...SETUP_VALUES_4_INCIDENTS,
        minutesByMinutesSecondHalf: MINUTES_BY_MINUTES_SECOND_HALF,
      };

      it("should draw the minute by minute second half container with the correct styling", () => {
        const { minuteByMinuteSecondHalf } = renderMatchTimelineDetails({ ...SETUP_VALUES_MBM_SECOND_HALF });
        expect(minuteByMinuteSecondHalf).not.toBe(null);
        expect(minuteByMinuteSecondHalf).toHaveStyle([]);
      });

      it("should draw the minute by minute first half with the correct styling", () => {
        const { minuteByMinuteFirstHalf } = renderMatchTimelineDetails({ ...SETUP_VALUES_MBM_SECOND_HALF });
        expect(minuteByMinuteFirstHalf).not.toBe(null);
        expect(minuteByMinuteFirstHalf).toHaveStyle([styles.sequentialMinByMin]);
      });

      it("should call MinuteByMinute component with the correct props", () => {
        renderMatchTimelineDetails({ ...SETUP_VALUES_MBM_SECOND_HALF });
        expect(MinuteByMinute).toHaveBeenCalledWith(
          {
            incidents: MINUTES_BY_MINUTES_SECOND_HALF,
            lineExtensionStyle: [],
          },
          undefined,
        );
      });

      describe("and matchStatsHalfTime is also defined", () => {
        const MATCH_STATS_HALF_TIME = {
          stats: [],
          periodStat: {
            period: "PERIOD",
            stat: "STAT",
          },
        };
        const SETUP_VALUES_SECOND_HALF_WITH_MS_HALF_TIME = {
          ...SETUP_VALUES_MBM_SECOND_HALF,
          matchStatsHalfTime: MATCH_STATS_HALF_TIME,
        };

        it("should call MinuteByMinute component with the correct props", () => {
          renderMatchTimelineDetails({ ...SETUP_VALUES_SECOND_HALF_WITH_MS_HALF_TIME });
          expect(MinuteByMinute).toHaveBeenCalledWith(
            {
              incidents: MINUTES_BY_MINUTES_SECOND_HALF,
              lineExtensionStyle: [styles.lineExtensionBottom],
            },
            undefined,
          );
        });
      });
    });

    describe("and matchStatsFullTime is defined", () => {
      describe("and stats is an empty array", () => {
        const MATCH_STATS_FULL_TIME = {
          stats: [],
          periodStat: {
            period: "PERIOD",
            stat: "STAT",
          },
        };
        const SETUP_VALUES_EMPTY_MS_FULL_TIME = {
          ...SETUP_VALUES_4_INCIDENTS,
          matchStatsFullTime: MATCH_STATS_FULL_TIME,
        };

        it("should draw the full time end container with the correct styling", () => {
          const { fullTimeEndContainer } = renderMatchTimelineDetails({ ...SETUP_VALUES_EMPTY_MS_FULL_TIME });
          expect(fullTimeEndContainer).toHaveStyle(styles.periodEndContainer);
        });

        it("should call the PeriodStatusNotification component with the correct arguments", () => {
          renderMatchTimelineDetails({ ...SETUP_VALUES_EMPTY_MS_FULL_TIME });
          expect(PeriodStatusNotification).toHaveBeenCalledWith(
            {
              ...MATCH_STATS_FULL_TIME.periodStat,
            },
            undefined,
          );
        });

        it("should not draw any match stats container", () => {
          const { matchStats } = renderMatchTimelineDetails({ ...SETUP_VALUES_EMPTY_MS_FULL_TIME });
          expect(matchStats[0]).toBeUndefined();
        });

        it("should not call the MatchStats component", () => {
          renderMatchTimelineDetails({ ...SETUP_VALUES_EMPTY_MS_FULL_TIME });
          expect(MatchStats).not.toHaveBeenCalled();
        });
      });

      describe("and stats is not an empty array", () => {
        const MATCH_STATS_FULL_TIME = {
          stats: ["FIRST STAT", "SECOND STAT"],
          periodStat: {
            period: "PERIOD",
            stat: "STAT",
          },
        };
        const SETUP_VALUES_MS_FULL_TIME = {
          ...SETUP_VALUES_4_INCIDENTS,
          matchStatsFullTime: MATCH_STATS_FULL_TIME,
        };

        it("should draw a match stats container with the correct styling", () => {
          const { matchStats } = renderMatchTimelineDetails({ ...SETUP_VALUES_MS_FULL_TIME });
          expect(matchStats.length).toBe(1);
          expect(matchStats[0]).toHaveStyle(styles.matchStatsContainer);
        });

        it("should call the MatchStats component with the correct arguments", () => {
          renderMatchTimelineDetails({ ...SETUP_VALUES_MS_FULL_TIME });
          expect(MatchStats).toHaveBeenCalledWith(
            {
              barStats: MATCH_STATS_FULL_TIME.stats,
            },
            undefined,
          );
        });
      });
    });

    describe("and minutesByMinutesExtraTimeFH is defined", () => {
      const MINUTES_BY_MINUTES_EXTRA_TIME_FH = [
        "EXTRA TIME FIRST HALF ENTRY #1",
        "EXTRA TIME FIRST HALF ENTRY #2",
        "EXTRA TIME FIRST HALF ENTRY #3",
        "EXTRA TIME FIRST HALF ENTRY #4",
      ];
      const SETUP_VALUES_MBM_EXTRA_TIME_FH = {
        ...SETUP_VALUES_4_INCIDENTS,
        minutesByMinutesExtraTimeFH: MINUTES_BY_MINUTES_EXTRA_TIME_FH,
      };

      it("should draw the minute by minute extra time first half container", () => {
        const { minuteByMinuteExtraTimeFH } = renderMatchTimelineDetails({ ...SETUP_VALUES_MBM_EXTRA_TIME_FH });
        expect(minuteByMinuteExtraTimeFH).not.toBe(null);
        expect(minuteByMinuteExtraTimeFH).toHaveStyle([]);
      });

      it("should call MinuteByMinute component with the correct props", () => {
        renderMatchTimelineDetails({ ...SETUP_VALUES_MBM_EXTRA_TIME_FH });
        expect(MinuteByMinute).toHaveBeenCalledWith(
          {
            incidents: MINUTES_BY_MINUTES_EXTRA_TIME_FH,
            lineExtensionStyle: [],
          },
          undefined,
        );
      });

      describe("and matchStatsFullTime is also defined", () => {
        const MATCH_STATS_FULL_TIME = {
          stats: [],
          periodStat: {
            period: "PERIOD",
            stat: "STAT",
          },
        };
        const SETUP_VALUES_ET_HF_WITH_MS_FULL_TIME = {
          ...SETUP_VALUES_MBM_EXTRA_TIME_FH,
          matchStatsFullTime: MATCH_STATS_FULL_TIME,
        };

        it("should call MinuteByMinute component with the correct props", () => {
          renderMatchTimelineDetails({ ...SETUP_VALUES_ET_HF_WITH_MS_FULL_TIME });
          expect(MinuteByMinute).toHaveBeenCalledWith(
            {
              incidents: MINUTES_BY_MINUTES_EXTRA_TIME_FH,
              lineExtensionStyle: [styles.lineExtensionBottom],
            },
            undefined,
          );
        });
      });
    });

    describe("and matchStatsExtraFH is defined", () => {
      describe("and stats is an empty array", () => {
        const MATCH_STATS_EXTRA_TIME_FH = {
          stats: [],
          periodStat: {
            period: "PERIOD",
            stat: "STAT",
          },
        };
        const SETUP_VALUES_EMPTY_MS_EXTRA_FH = {
          ...SETUP_VALUES_4_INCIDENTS,
          matchStatsExtraFH: MATCH_STATS_EXTRA_TIME_FH,
        };

        it("should draw the match stats extra first half end container with the correct styling", () => {
          const { extraFhEndContainer } = renderMatchTimelineDetails({ ...SETUP_VALUES_EMPTY_MS_EXTRA_FH });
          expect(extraFhEndContainer).toHaveStyle(styles.periodEndContainer);
        });

        it("should call the PeriodStatusNotification component with the correct arguments", () => {
          renderMatchTimelineDetails({ ...SETUP_VALUES_EMPTY_MS_EXTRA_FH });
          expect(PeriodStatusNotification).toHaveBeenCalledWith(
            {
              ...MATCH_STATS_EXTRA_TIME_FH.periodStat,
            },
            undefined,
          );
        });

        it("should not draw any match stats container", () => {
          const { matchStats } = renderMatchTimelineDetails({ ...SETUP_VALUES_EMPTY_MS_EXTRA_FH });
          expect(matchStats[0]).toBeUndefined();
        });

        it("should not call the MatchStats component", () => {
          renderMatchTimelineDetails({ ...SETUP_VALUES_EMPTY_MS_EXTRA_FH });
          expect(MatchStats).not.toHaveBeenCalled();
        });
      });

      describe("and stats is not an empty array", () => {
        const MATCH_STATS_EXTRA_TIME_FH = {
          stats: ["FIRST STAT", "SECOND STAT"],
          periodStat: {
            period: "PERIOD",
            stat: "STAT",
          },
        };
        const SETUP_VALUES_MS_EXTRA_TIME_FH = {
          ...SETUP_VALUES_4_INCIDENTS,
          matchStatsExtraFH: MATCH_STATS_EXTRA_TIME_FH,
        };

        it("should draw a match stats container with the correct styling", () => {
          const { matchStats } = renderMatchTimelineDetails({ ...SETUP_VALUES_MS_EXTRA_TIME_FH });
          expect(matchStats.length).toBe(1);
          expect(matchStats[0]).toHaveStyle(styles.matchStatsContainer);
        });

        it("should call the MatchStats component with the correct arguments", () => {
          renderMatchTimelineDetails({ ...SETUP_VALUES_MS_EXTRA_TIME_FH });
          expect(MatchStats).toHaveBeenCalledWith(
            {
              barStats: MATCH_STATS_EXTRA_TIME_FH.stats,
            },
            undefined,
          );
        });
      });
    });

    describe("and minutesByMinutesExtraTimeSH is defined", () => {
      const MINUTES_BY_MINUTES_EXTRA_TIME_SH = [
        "EXTRA TIME SECOND HALF ENTRY #1",
        "EXTRA TIME SECOND HALF ENTRY #2",
        "EXTRA TIME SECOND HALF ENTRY #3",
        "EXTRA TIME SECOND HALF ENTRY #4",
      ];
      const SETUP_VALUES_MBM_EXTRA_TIME_SH = {
        ...SETUP_VALUES_4_INCIDENTS,
        minutesByMinutesExtraTimeSH: MINUTES_BY_MINUTES_EXTRA_TIME_SH,
      };

      it("should draw the minute by minute extra time first half container", () => {
        const { minuteByMinuteExtraTimeSH } = renderMatchTimelineDetails({ ...SETUP_VALUES_MBM_EXTRA_TIME_SH });
        expect(minuteByMinuteExtraTimeSH).not.toBe(null);
        expect(minuteByMinuteExtraTimeSH).toHaveStyle([]);
      });

      it("should call MinuteByMinute component with the correct props", () => {
        renderMatchTimelineDetails({ ...SETUP_VALUES_MBM_EXTRA_TIME_SH });
        expect(MinuteByMinute).toHaveBeenCalledWith(
          {
            incidents: MINUTES_BY_MINUTES_EXTRA_TIME_SH,
            lineExtensionStyle: [],
          },
          undefined,
        );
      });

      describe("and matchStatsExtraTimeFH is also defined", () => {
        const MATCH_STATS_ET_FH = {
          stats: [],
          periodStat: {
            period: "PERIOD",
            stat: "STAT",
          },
        };
        const SETUP_VALUES_ET_SH_WITH_STATS_ET_FH = {
          ...SETUP_VALUES_MBM_EXTRA_TIME_SH,
          matchStatsExtraFH: MATCH_STATS_ET_FH,
        };

        it("should call MinuteByMinute component with the correct props", () => {
          renderMatchTimelineDetails({ ...SETUP_VALUES_ET_SH_WITH_STATS_ET_FH });
          expect(MinuteByMinute).toHaveBeenCalledWith(
            {
              incidents: MINUTES_BY_MINUTES_EXTRA_TIME_SH,
              lineExtensionStyle: [styles.lineExtensionBottom],
            },
            undefined,
          );
        });
      });
    });

    describe("and matchStatsExtraEnd is defined", () => {
      describe("and stats is an empty array", () => {
        const MATCH_STATS_EXTRA_END = {
          stats: [],
          periodStat: {
            period: "PERIOD",
            stat: "STAT",
          },
        };
        const SETUP_VALUES_MS_EXTRA_END = {
          ...SETUP_VALUES_4_INCIDENTS,
          matchStatsExtraEnd: MATCH_STATS_EXTRA_END,
        };

        it("should draw the match stats extra end container with the correct styling", () => {
          const { extraEndContainer } = renderMatchTimelineDetails({ ...SETUP_VALUES_MS_EXTRA_END });
          expect(extraEndContainer).toHaveStyle(styles.periodEndContainer);
        });

        it("should call the PeriodStatusNotification component with the correct arguments", () => {
          renderMatchTimelineDetails({ ...SETUP_VALUES_MS_EXTRA_END });
          expect(PeriodStatusNotification).toHaveBeenCalledWith(
            {
              ...MATCH_STATS_EXTRA_END.periodStat,
            },
            undefined,
          );
        });

        it("should not draw any match stats container", () => {
          const { matchStats } = renderMatchTimelineDetails({ ...SETUP_VALUES_MS_EXTRA_END });
          expect(matchStats[0]).toBeUndefined();
        });

        it("should not call the MatchStats component", () => {
          renderMatchTimelineDetails({ ...SETUP_VALUES_MS_EXTRA_END });
          expect(MatchStats).not.toHaveBeenCalled();
        });
      });

      describe("and stats is not an empty array", () => {
        const MATCH_STATS_EXTRA_END = {
          stats: ["FIRST STAT", "SECOND STAT"],
          periodStat: {
            period: "PERIOD",
            stat: "STAT",
          },
        };
        const SETUP_VALUES_MS_EXTRA_TIME_FH = {
          ...SETUP_VALUES_4_INCIDENTS,
          matchStatsExtraFH: MATCH_STATS_EXTRA_END,
        };

        it("should draw a match stats container with the correct styling", () => {
          const { matchStats } = renderMatchTimelineDetails({ ...SETUP_VALUES_MS_EXTRA_TIME_FH });
          expect(matchStats.length).toBe(1);
          expect(matchStats[0]).toHaveStyle(styles.matchStatsContainer);
        });

        it("should call the MatchStats component with the correct arguments", () => {
          renderMatchTimelineDetails({ ...SETUP_VALUES_MS_EXTRA_TIME_FH });
          expect(MatchStats).toHaveBeenCalledWith(
            {
              barStats: MATCH_STATS_EXTRA_END.stats,
            },
            undefined,
          );
        });
      });
    });
  });
});
