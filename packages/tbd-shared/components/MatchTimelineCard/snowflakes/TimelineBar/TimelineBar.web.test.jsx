import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { IncidentIconType } from "@ppb/the-wall-common/types";
import { IncidentIcon } from "@ppb/the-wall-web/components/bricks/IncidentIcon/IncidentIcon";

import { TimelineBarViewMode } from "./TimelineBar.types";
import { TimelineBar } from "./TimelineBar.web";
import {
  TEST_ID,
  INPLAY_BAR,
  HOME_INCIDENTS_CONTAINER,
  AWAY_INCIDENTS_CONTAINER,
  CAPTION,
} from "./TimelineBar.web.selectors";

jest.mock("@ppb/the-wall-web/components/bricks/IncidentIcon/IncidentIcon", () => ({
  IncidentIcon: jest.fn(() => <incident-icon-mock />),
}));

const homeIncidentsMock = [
  {
    minute: 1,
    icon: IncidentIconType.RED_CARD,
  },
];

const awayIncidentsMock = [
  {
    minute: 10,
    icon: IncidentIconType.GOAL,
  },
  {
    minute: 30,
    icon: IncidentIconType.GOAL,
  },
];

function renderTimelineBar(length, minute, homeIncidents, awayIncidents, caption, viewMode) {
  const { container } = render(
    <TimelineBar
      periodLength={length}
      minute={minute}
      homeIncidents={homeIncidents}
      awayIncidents={awayIncidents}
      caption={caption}
      viewMode={viewMode}
    />,
  );
  return container.querySelector(TEST_ID);
}

beforeEach(jest.clearAllMocks);

describe("TimelineBar", () => {
  describe("Render Inplay bar", () => {
    it("should have 0 witdh when minutes is 0", () => {
      const timelineBar = renderTimelineBar(45, 0, homeIncidentsMock, awayIncidentsMock);
      const inPlayBar = timelineBar.querySelector(INPLAY_BAR);

      expect(inPlayBar).toHaveStyle("width: 0.0%");
    });

    it("should have 71.1% witdh when minutes 30", () => {
      const timelineBar = renderTimelineBar(45, 32, homeIncidentsMock, awayIncidentsMock);
      const inPlayBar = timelineBar.querySelector(INPLAY_BAR);

      expect(inPlayBar).toHaveStyle("width: 71.1%");
    });

    it("should have 100% witdh when minutes is equal to length", () => {
      const timelineBar = renderTimelineBar(45, 45, homeIncidentsMock, awayIncidentsMock);
      const inPlayBar = timelineBar.querySelector(INPLAY_BAR);

      expect(inPlayBar).toHaveStyle("width: 100.0%");
    });
  });

  describe("Render Home Incidents", () => {
    it("should have the red card incident positioned correctly", () => {
      const timelineBar = renderTimelineBar(45, 30, homeIncidentsMock, awayIncidentsMock);
      const firstIncident = timelineBar.querySelector(HOME_INCIDENTS_CONTAINER).childNodes[0];

      expect(firstIncident.innerHTML).toEqual("<incident-icon-mock></incident-icon-mock>");
      expect(firstIncident).toHaveStyle("left: 0.0%");
      expect(IncidentIcon).toHaveBeenCalledWith({ type: IncidentIconType.RED_CARD }, undefined);
    });
  });

  describe("Render AWAY Incidents", () => {
    it("should have the Goal incident positioned correctly", () => {
      const timelineBar = renderTimelineBar(45, 30, homeIncidentsMock, awayIncidentsMock);
      const firstIncident = timelineBar.querySelector(AWAY_INCIDENTS_CONTAINER).childNodes[0];

      expect(firstIncident.innerHTML).toEqual("<incident-icon-mock></incident-icon-mock>");
      expect(firstIncident).toHaveStyle("left: 22.2%");
    });

    it("should have the Goal incident at positioned correctly", () => {
      const timelineBar = renderTimelineBar(45, 30, homeIncidentsMock, awayIncidentsMock);
      const goalIncident = timelineBar.querySelector(AWAY_INCIDENTS_CONTAINER).childNodes[1];

      expect(goalIncident.innerHTML).toEqual("<incident-icon-mock></incident-icon-mock>");
      expect(goalIncident).toHaveStyle("left: 66.7%");
    });
  });

  describe("Render without incidents", () => {
    it("should have an empty home incidents container", () => {
      const timelineBar = renderTimelineBar(45, 30);
      const incidents = timelineBar.querySelector(HOME_INCIDENTS_CONTAINER);

      expect(incidents.innerHTML).toBe("");
    });

    it("should have an empty away incidents container", () => {
      const timelineBar = renderTimelineBar(45, 30);
      const incidents = timelineBar.querySelector(AWAY_INCIDENTS_CONTAINER);

      expect(incidents.innerHTML).toBe("");
    });
  });

  describe("Render caption", () => {
    it("should display the caption when provided", () => {
      const timelineBar = renderTimelineBar(
        45,
        30,
        homeIncidentsMock,
        awayIncidentsMock,
        "HT",
        TimelineBarViewMode.NORMAL,
      );
      const caption = timelineBar.querySelector(CAPTION);

      expect(caption).toHaveTextContent("HT");
    });
  });
});
