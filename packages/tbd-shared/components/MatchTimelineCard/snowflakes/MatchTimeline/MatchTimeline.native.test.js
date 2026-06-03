import { render, act } from "@testing-library/react-native";

import { IncidentIconType, FixtureTeamSide } from "@ppb/the-wall-common/types";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { MANCHESTER_UNITED } from "@ppb/the-wall-native/assets/images/base64/png/crests";
import { TBDImage } from "@ppb/the-wall-native";

import { IncidentNotification } from "../IncidentNotification/IncidentNotification.native";
import { TimelineBar } from "../TimelineBar/TimelineBar.native";
import { TimelineBarViewMode } from "../TimelineBar/TimelineBar.types";
import { MatchTimelineViewMode } from "./MatchTimeline.types";
import {
  MATCH_TIMELINE,
  MATCH_TIMELINE_PREMATCH,
  MATCH_TIMELINE_TIMELINE_CONTAINER,
  MATCH_TIMELINE_HOME_CREST,
  MATCH_TIMELINE_AWAY_CREST,
  MATCH_TIMELINE_HOME_SHIELD_CREST,
  MATCH_TIMELINE_TIMELINE,
} from "./MatchTimeline.native.selectors";
import styles from "./MatchTimeline.native.styles";
import { MatchTimeline } from "./MatchTimeline.native";

jest.mock("../TimelineBar/TimelineBar.native", () => ({
  TimelineBar: jest.fn(() => <timelinebar-mock />),
}));

jest.mock("../IncidentNotification/IncidentNotification.native", () => ({
  IncidentNotification: jest.fn(() => <incident-notification-mock />),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("@ppb/the-wall-native", () => ({
  TBDImage: jest.fn((props) => <tbd-image-mock {...props} />),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
  spacings: { "spacing-1": 4, "spacing-2": 8, "spacing-8": 32 },
  heights: {},
  tokens: {
    IncidentIconGoalColour: "Neutral",
    IncidentIconOwnGoalColour: "Negative",
  },
}));

const translations = {
  prematch: "KO",
};

const data1Timeline = [
  {
    periodLength: 45,
    minute: 32,
    homeIncidents: [
      {
        minute: 8,
        icon: IncidentIconType.YELLOW_CARD,
      },
    ],
    awayIncidents: [
      {
        minute: 9,
        icon: IncidentIconType.GOAL,
      },
    ],
    viewMode: TimelineBarViewMode.NORMAL,
    caption: "HT",
  },
];

const data2Timelines = [
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
        minute: 9,
        icon: IncidentIconType.GOAL,
      },
    ],
    viewMode: TimelineBarViewMode.NORMAL,
    caption: "HT",
  },
  {
    periodLength: 45,
    minute: 38,
    homeIncidents: [
      {
        minute: 1,
        icon: IncidentIconType.GOAL,
      },
    ],
    awayIncidents: [
      {
        minute: 10,
        icon: IncidentIconType.RED_CARD,
      },
    ],
    viewMode: TimelineBarViewMode.NORMAL,
    caption: "FT",
  },
];

const incident = {
  minute: 98,
  type: IncidentIconType.RED_CARD,
  label: "Red Card",
  player: "Johnson R.",
  side: FixtureTeamSide.HOME,
};

function renderFootballMatchTimeline(timelines, lastIncident, viewMode, crest = "") {
  const { getByTestId, queryByTestId, queryAllByTestId } = render(
    <MatchTimeline
      homeName={"Internazionale"}
      awayName={"Barcelona"}
      homeCrest={crest}
      awayCrest={crest}
      timelines={timelines}
      lastIncident={lastIncident}
      translations={translations}
      viewMode={viewMode}
    />,
  );

  return {
    matchTimeline: getByTestId(MATCH_TIMELINE),
    timelineContainer: getByTestId(MATCH_TIMELINE_TIMELINE_CONTAINER),
    homeShieldCrest: queryByTestId(MATCH_TIMELINE_HOME_SHIELD_CREST),
    prematch: queryByTestId(MATCH_TIMELINE_PREMATCH),
    timelines: queryAllByTestId(MATCH_TIMELINE_TIMELINE),
  };
}

beforeEach(jest.clearAllMocks);

describe("MatchTimeline", () => {
  describe("Render TimelineBar", () => {
    describe("CONDENSED ViewMode", () => {
      it("should have condensed styles", () => {
        const { matchTimeline, timelineContainer, homeShieldCrest, timelines } = renderFootballMatchTimeline(
          data2Timelines,
          null,
          MatchTimelineViewMode.CONDENSED,
        );

        expect(matchTimeline).toHaveStyle(styles.matchTimelineCondensed);
        expect(timelineContainer).toHaveStyle(styles.timelineContainerCondensed);
        expect(homeShieldCrest).toHaveStyle(styles.homeTeamCondensed);
        expect(timelines[0]).toHaveStyle(styles.timelineCondensed);
      });

      it("should display TimelineBar correctly when minute is in first half", () => {
        renderFootballMatchTimeline(data1Timeline, null, MatchTimelineViewMode.CONDENSED);
        expect(TimelineBar).toHaveBeenCalledTimes(1);
        expect(TimelineBar.mock.calls[0][0]).toEqual({
          periodLength: 45,
          minute: 32,
          viewMode: TimelineBarViewMode.CONDENSED,
          homeIncidents: [
            {
              minute: 8,
              icon: IncidentIconType.YELLOW_CARD,
            },
          ],
          awayIncidents: [
            {
              minute: 9,
              icon: IncidentIconType.GOAL,
            },
          ],
          caption: "HT",
        });
      });

      it("should display TimelineBar correctly when minute is in second half", () => {
        renderFootballMatchTimeline(data2Timelines, null, MatchTimelineViewMode.CONDENSED);
        expect(TimelineBar).toHaveBeenCalledTimes(2);
        expect(TimelineBar.mock.calls[0][0]).toEqual({
          periodLength: 45,
          minute: 45,
          viewMode: TimelineBarViewMode.CONDENSED,
          homeIncidents: [
            {
              minute: 8,
              icon: IncidentIconType.YELLOW_CARD,
            },
          ],
          awayIncidents: [
            {
              minute: 9,
              icon: IncidentIconType.GOAL,
            },
          ],
          caption: "HT",
        });
        expect(TimelineBar.mock.calls[1][0]).toEqual({
          periodLength: 45,
          minute: 38,
          viewMode: TimelineBarViewMode.CONDENSED,
          homeIncidents: [
            {
              minute: 1,
              icon: IncidentIconType.GOAL,
            },
          ],
          awayIncidents: [
            {
              minute: 10,
              icon: IncidentIconType.RED_CARD,
            },
          ],
          caption: "FT",
        });
      });

      it("shouldn't display the Prematch label", () => {
        const { prematch } = renderFootballMatchTimeline(data2Timelines, null, MatchTimelineViewMode.CONDENSED);
        expect(prematch).toBe(null);
      });
    });

    describe("Default ViewMode (NORMAL)", () => {
      it("shouldn't have condensed styles", () => {
        const { matchTimeline, timelineContainer, homeShieldCrest, timelines } =
          renderFootballMatchTimeline(data2Timelines);

        expect(matchTimeline).not.toHaveStyle(styles.matchTimelineCondensed);
        expect(timelineContainer).not.toHaveStyle(styles.timelineContainerCondensed);
        expect(homeShieldCrest).not.toHaveStyle(styles.homeTeamCondensed);
        expect(timelines[0]).not.toHaveStyle(styles.timelineCondensed);
      });

      it("should display TimelineBar correctly when minute is in first half", () => {
        renderFootballMatchTimeline(data1Timeline, null, MatchTimelineViewMode.NORMAL);
        expect(TimelineBar).toHaveBeenCalledTimes(1);
        expect(TimelineBar.mock.calls[0][0]).toEqual({
          periodLength: 45,
          minute: 32,
          viewMode: TimelineBarViewMode.NORMAL,
          homeIncidents: [
            {
              minute: 8,
              icon: IncidentIconType.YELLOW_CARD,
            },
          ],
          awayIncidents: [
            {
              minute: 9,
              icon: IncidentIconType.GOAL,
            },
          ],
          caption: "HT",
        });
      });

      it("should display TimelineBar correctly when minute is in second half", () => {
        renderFootballMatchTimeline(data2Timelines, null, MatchTimelineViewMode.NORMAL);
        expect(TimelineBar).toHaveBeenCalledTimes(2);
        expect(TimelineBar.mock.calls[0][0]).toEqual({
          periodLength: 45,
          minute: 45,
          viewMode: TimelineBarViewMode.NORMAL,
          homeIncidents: [
            {
              minute: 8,
              icon: IncidentIconType.YELLOW_CARD,
            },
          ],
          awayIncidents: [
            {
              minute: 9,
              icon: IncidentIconType.GOAL,
            },
          ],
          caption: "HT",
        });
        expect(TimelineBar.mock.calls[1][0]).toEqual({
          periodLength: 45,
          minute: 38,
          viewMode: TimelineBarViewMode.NORMAL,
          homeIncidents: [
            {
              minute: 1,
              icon: IncidentIconType.GOAL,
            },
          ],
          awayIncidents: [
            {
              minute: 10,
              icon: IncidentIconType.RED_CARD,
            },
          ],
          caption: "FT",
        });
      });

      it("should display the Prematch label", () => {
        const { prematch } = renderFootballMatchTimeline(data2Timelines, null, MatchTimelineViewMode.NORMAL);
        expect(prematch).toHaveTextContent("KO");
      });
    });

    describe("Crests", () => {
      it("should render Shields when crests are not provided", () => {
        renderFootballMatchTimeline(data2Timelines, null, MatchTimelineViewMode.CONDENSED, "");
        expect(GenericIcon.mock.calls.length).toEqual(2);
      });

      it("should render Shields when crests fail to load", () => {
        renderFootballMatchTimeline(data2Timelines, null, MatchTimelineViewMode.CONDENSED, MANCHESTER_UNITED);

        act(() => {
          TBDImage.mock.calls[0][0].onError();
          TBDImage.mock.calls[1][0].onError();
        });

        expect(GenericIcon.mock.calls.length).toEqual(2);
      });

      it("should render crests when image is provided", () => {
        renderFootballMatchTimeline(data2Timelines, null, MatchTimelineViewMode.CONDENSED, MANCHESTER_UNITED);
        expect(TBDImage.mock.calls[0][0]).toMatchObject({
          testID: MATCH_TIMELINE_HOME_CREST,
          source: MANCHESTER_UNITED,
        });
        expect(TBDImage.mock.calls[1][0]).toMatchObject({
          testID: MATCH_TIMELINE_AWAY_CREST,
          source: MANCHESTER_UNITED,
        });
      });
    });
  });

  describe("IncidentNotification", () => {
    describe("CONDENSED ViewMode", () => {
      it("should render IncidentNotification when provided", () => {
        renderFootballMatchTimeline(data1Timeline, incident, MatchTimelineViewMode.CONDENSED);
        expect(IncidentNotification).toHaveBeenCalledTimes(1);
      });

      it("shouldn't render IncidentNotification if not provided", () => {
        renderFootballMatchTimeline(data1Timeline, null, MatchTimelineViewMode.CONDENSED);
        expect(IncidentNotification).not.toHaveBeenCalled();
      });
    });

    describe("Default ViewMode (NORMAL)", () => {
      it("shouldn't render IncidentNotification", () => {
        renderFootballMatchTimeline(data1Timeline, incident);
        expect(IncidentNotification).not.toHaveBeenCalled();
      });
    });
  });
});
