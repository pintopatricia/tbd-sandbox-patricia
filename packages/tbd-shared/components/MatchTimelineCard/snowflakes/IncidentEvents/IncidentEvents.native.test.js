import { render } from "@testing-library/react-native";

import { IncidentIconType, IncidentIconSize } from "@ppb/the-wall-common/types";
import { IncidentIcon } from "@ppb/the-wall-native/components/IncidentIcon/IncidentIcon";

import { IncidentDisplayOrder } from "../Incident/Incident.types";
import { Incident } from "../Incident/Incident.native";
import { IncidentEvents } from "./IncidentEvents.native";
import { INCIDENT_EVENTS, INCIDENT_EVENTS_HOME, INCIDENT_EVENTS_AWAY } from "./IncidentEvents.native.selectors";

import styles from "./IncidentEvents.native.styles";

jest.mock("../Incident/Incident.native", () => ({
  Incident: jest.fn((props) => <incident-mock {...props} />),
}));

jest.mock("@ppb/the-wall-native/components/IncidentIcon/IncidentIcon", () => ({
  IncidentIcon: jest.fn((props) => <incident-icon-mock {...props} />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  spacings: {},
  tokens: {
    IncidentEventsVerticalGap: {},
    IncidentEventsScoreboardLeftRightPadding: {},
    IncidentEventsDefaultLeftRightPadding: {},
    IncidentEventsBorder: {},
  },
}));

const DEFAULT_PROPS = {
  homeIncidents: [
    {
      icon: IncidentIconType.GOAL,
      minute: 10,
      player: "home player",
      displayOrder: IncidentDisplayOrder.NORMAL,
    },
  ],
  awayIncidents: [
    {
      icon: IncidentIconType.YELLOW_CARD,
      minute: 40,
      player: "away player",
      displayOrder: IncidentDisplayOrder.REVERSED,
    },
  ],
};

function renderIncidentEvents({ homeIncidents, awayIncidents, categoryIcon }) {
  const { queryByTestId, queryAllByTestId } = render(
    <IncidentEvents homeIncidents={homeIncidents} awayIncidents={awayIncidents} categoryIcon={categoryIcon} />,
  );

  return {
    container: queryByTestId(INCIDENT_EVENTS),
    homeIncidents: queryAllByTestId(INCIDENT_EVENTS_HOME),
    awayIncidents: queryAllByTestId(INCIDENT_EVENTS_AWAY),
  };
}

describe("Incident Events Component", () => {
  beforeEach(jest.clearAllMocks);

  it("should render Incident Events", () => {
    const { container } = renderIncidentEvents(DEFAULT_PROPS);

    expect(container).not.toBeNull();
  });

  describe("home incident", () => {
    it("should render one home incident", () => {
      const { homeIncidents } = renderIncidentEvents(DEFAULT_PROPS);

      expect(homeIncidents.length).toBe(1);
    });

    it("should apply the correct style", () => {
      const { homeIncidents } = renderIncidentEvents(DEFAULT_PROPS);

      expect(homeIncidents[0].props.style).toEqual([styles.incidentColumn, styles.scoreboardVariantHomeColumn]);
    });

    it("should call the Incident with the correct props", () => {
      renderIncidentEvents(DEFAULT_PROPS);

      expect(Incident).toHaveBeenCalledWith(
        {
          icon: IncidentIconType.GOAL,
          minute: 10,
          player: "home player",
          displayOrder: IncidentDisplayOrder.NORMAL,
        },
        undefined,
      );
    });
  });

  describe("away incident", () => {
    it("should render one away incident", () => {
      const { awayIncidents } = renderIncidentEvents(DEFAULT_PROPS);

      expect(awayIncidents.length).toBe(1);
    });

    it("should apply the correct style", () => {
      const { awayIncidents } = renderIncidentEvents(DEFAULT_PROPS);

      expect(awayIncidents[0].props.style).toEqual([styles.incidentColumn, styles.scoreboardVariantAwayColumn]);
    });

    it("should call the Incident with the correct props", () => {
      renderIncidentEvents(DEFAULT_PROPS);

      expect(Incident).toHaveBeenCalledWith(
        {
          icon: IncidentIconType.YELLOW_CARD,
          minute: 40,
          player: "away player",
          displayOrder: IncidentDisplayOrder.REVERSED,
        },
        undefined,
      );
    });
  });

  describe("incident icon", () => {
    const mockIncidentIcon = IncidentIconType.GOAL;

    it("should apply the correct style", () => {
      renderIncidentEvents({ ...DEFAULT_PROPS, categoryIcon: mockIncidentIcon });

      expect(IncidentIcon).toHaveBeenCalledWith(
        {
          accessible: false,
          testID: "incident-events-icon",
          isHighlighted: true,
          type: mockIncidentIcon,
          size: IncidentIconSize.BIG,
        },
        undefined,
      );
    });
  });
});
