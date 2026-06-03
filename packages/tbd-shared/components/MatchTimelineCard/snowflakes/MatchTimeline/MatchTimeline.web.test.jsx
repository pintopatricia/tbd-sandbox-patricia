import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { IncidentIconType, FixtureTeamSide } from "@ppb/the-wall-common/types";

import { TimelineBarViewMode } from "../TimelineBar/TimelineBar.types";
import { MatchTimelineViewMode } from "./MatchTimeline.types";

import { TimelineBar } from "../TimelineBar/TimelineBar.web";
import { TEST_ID, PREMATCH } from "./MatchTimeline.web.selectors";

import { MatchTimeline } from "./MatchTimeline.web";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("../TimelineBar/TimelineBar.web", () => ({
  TimelineBar: jest.fn(() => <timelinebar-mock />),
  TimelineBarViewMode: {
    CONDENSED: "CONDENSED",
    NORMAL: "NORMAL",
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

function renderFootballMatchTimeline(timelines, lastIncident, viewMode) {
  const { container } = render(
    <MatchTimeline
      homeName={"Internazionale"}
      awayName={"Barcelona"}
      homeCrest={""}
      awayCrest={""}
      timelines={timelines}
      lastIncident={lastIncident}
      translations={translations}
      viewMode={viewMode}
    />,
  );
  return container.querySelector(TEST_ID);
}

beforeEach(jest.clearAllMocks);

describe("MatchTimeline", () => {
  describe("Render TimelineBar", () => {
    it("should display TimelineBar correctly when minute is in first half", () => {
      renderFootballMatchTimeline(data1Timeline, null, MatchTimelineViewMode.CONDENSED);
      expect(TimelineBar).toHaveBeenCalledTimes(1);
      expect(TimelineBar.mock.calls[0][0]).toEqual({
        periodLength: 45,
        minute: 32,
        viewMode: "CONDENSED",
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
        viewMode: "CONDENSED",
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
        viewMode: TimelineBarViewMode.CONDENSED,
        caption: "FT",
      });
    });

    it("should display the Prematch label for NORMAL viewMode", () => {
      const matchTimeline = renderFootballMatchTimeline(data2Timelines, incident, MatchTimelineViewMode.NORMAL);
      const prematchLabel = matchTimeline.querySelector(PREMATCH);

      expect(prematchLabel).toHaveTextContent("KO");
    });
  });
});
