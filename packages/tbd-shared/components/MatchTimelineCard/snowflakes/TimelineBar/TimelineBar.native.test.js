import { render, within } from "@testing-library/react-native";

import { IncidentIconType } from "@ppb/the-wall-common/types";
import { IncidentIcon } from "@ppb/the-wall-native/components/IncidentIcon/IncidentIcon";

import { TimelineBarViewMode } from "./TimelineBar.types";
import { TimelineBar } from "./TimelineBar.native";
import styles from "./TimelineBar.native.styles";
import {
  TIMELINE_BAR,
  TIMELINE_BAR_INPLAY_BAR,
  TIMELINE_BAR_INCIDENTS_HOME,
  TIMELINE_BAR_INCIDENTS_AWAY,
  TIMELINE_BAR_CAPTION,
  TIMELINE_BAR_INCIDENTS_ICON,
} from "./TimelineBar.native.selectors";

jest.mock("@ppb/the-wall-native/components/IncidentIcon/IncidentIcon", () => ({
  IncidentIcon: jest.fn(() => <incident-icon-mock />),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
  spacings: {},
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
  const { getByTestId, queryByTestId } = render(
    <TimelineBar
      periodLength={length}
      minute={minute}
      homeIncidents={homeIncidents}
      awayIncidents={awayIncidents}
      caption={caption}
      viewMode={viewMode}
    />,
  );
  return {
    timelineBar: getByTestId(TIMELINE_BAR),
    inplayBar: getByTestId(TIMELINE_BAR_INPLAY_BAR),
    homeIncidents: queryByTestId(TIMELINE_BAR_INCIDENTS_HOME),
    awayIncidents: queryByTestId(TIMELINE_BAR_INCIDENTS_AWAY),
    caption: queryByTestId(TIMELINE_BAR_CAPTION),
  };
}

beforeEach(jest.clearAllMocks);

describe("TimelineBar", () => {
  describe("Render Inplay bar", () => {
    it("should have 0 witdh when minutes are 0", () => {
      const { inplayBar } = renderTimelineBar(45, 0, homeIncidentsMock, awayIncidentsMock);

      expect(inplayBar).toHaveStyle({ ...styles.bar, ...styles.inplay });
      expect(inplayBar).toHaveStyle({ width: "0%" });
    });

    it("should have 71.1% witdh when minutes are 32", () => {
      const { inplayBar } = renderTimelineBar(45, 32, homeIncidentsMock, awayIncidentsMock);

      expect(inplayBar).toHaveStyle({ width: "71.1%" });
    });

    it("should have 100% witdh when minutes is equal to length", () => {
      const { inplayBar } = renderTimelineBar(45, 45, homeIncidentsMock, awayIncidentsMock);

      expect(inplayBar).toHaveStyle({ width: "100%" });
    });
  });

  describe("Render Home Incidents", () => {
    it("should have the red card incident positioned correctly", () => {
      const { homeIncidents } = renderTimelineBar(45, 30, homeIncidentsMock, awayIncidentsMock);

      const homeIncidentIcons = within(homeIncidents).getAllByTestId(TIMELINE_BAR_INCIDENTS_ICON);

      expect(homeIncidentIcons[0]).toHaveStyle({ left: "2.2%" });
      expect(IncidentIcon).toHaveBeenCalledWith({ type: IncidentIconType.RED_CARD }, undefined);
    });
  });

  describe("Render Away Incidents", () => {
    it("should have the Goal incident positioned correctly", () => {
      const { awayIncidents } = renderTimelineBar(45, 30, homeIncidentsMock, awayIncidentsMock);

      const awayIndidentIcons = within(awayIncidents).getAllByTestId(TIMELINE_BAR_INCIDENTS_ICON);

      expect(awayIndidentIcons[0]).toHaveStyle({ left: "22.2%" });
      expect(IncidentIcon).toHaveBeenCalledWith({ type: IncidentIconType.RED_CARD }, undefined);
    });

    it("should have the Goal incident at positioned correctly", () => {
      const { awayIncidents } = renderTimelineBar(45, 30, homeIncidentsMock, awayIncidentsMock);

      const awayIndidentIcons = within(awayIncidents).getAllByTestId(TIMELINE_BAR_INCIDENTS_ICON);

      expect(awayIndidentIcons[1]).toHaveStyle({ left: "66.7%" });
      expect(IncidentIcon).toHaveBeenCalledWith({ type: IncidentIconType.RED_CARD }, undefined);
    });
  });

  describe("Render without incidents", () => {
    it("should have an empty home incidents container", () => {
      const { homeIncidents } = renderTimelineBar(45, 30);

      expect(homeIncidents.children.length).toBe(0);
    });

    it("should have an empty away incidents container", () => {
      const { awayIncidents } = renderTimelineBar(45, 30);

      expect(awayIncidents.children.length).toBe(0);
    });
  });

  describe("Render caption", () => {
    it("should display the caption when provided", () => {
      const { caption } = renderTimelineBar(
        45,
        30,
        homeIncidentsMock,
        awayIncidentsMock,
        "HT",
        TimelineBarViewMode.NORMAL,
      );

      expect(caption).toHaveTextContent("HT");
      expect(caption).toHaveStyle(styles.caption);
    });
  });
});
