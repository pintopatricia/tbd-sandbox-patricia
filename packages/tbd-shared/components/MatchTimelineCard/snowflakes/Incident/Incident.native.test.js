import { render } from "@testing-library/react-native";

import { IncidentIconType } from "@ppb/the-wall-common/types";
import { IncidentIcon } from "@ppb/the-wall-native/components/IncidentIcon/IncidentIcon";
import { IncidentDisplayOrder } from "./Incident.types";
import { Incident } from "./Incident.native";
import { INCIDENT, INCIDENT_ICON, INCIDENT_MINUTE, INCIDENT_PLAYER } from "./Incident.native.selectors";
import styles from "./Incident.native.styles";

jest.mock("@ppb/the-wall-native/components/IncidentIcon/IncidentIcon", () => ({
  IncidentIcon: jest.fn(() => <incident-icon-mock />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {
    IncidentHorizontalGapSmall: "IncidentHorizontalGapSmall",
    IncidentTextContentTextColour: "black",
    IncidentContentTextTypography: {},
    IncidentHorizontalGap: "IncidentHorizontalGap",
    IncidentTextLabelColour: "gray",
    IncidentLabelTypography: {},
  },
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

const propsHome = {
  icon: IncidentIconType.GOAL,
  player: "Player 1",
  minute: 89,
  displayOrder: IncidentDisplayOrder.REVERSED,
};
const propsAway = {
  icon: IncidentIconType.OWN_GOAL,
  player: "Player 2",
  minute: 89,
  displayOrder: IncidentDisplayOrder.NORMAL,
};

function renderIncident(props) {
  const { queryByTestId, queryAllByTestId } = render(<Incident {...props} />);

  return {
    incident: queryByTestId(INCIDENT),
    incidentIcon: queryByTestId(INCIDENT_ICON),
    incidentMinute: queryAllByTestId(INCIDENT_MINUTE),
    incidentPlayer: queryByTestId(INCIDENT_PLAYER),
  };
}

describe("Incident", () => {
  it("should not render when there is no minute or minutes prop", () => {
    const { incident } = renderIncident({ ...propsHome, minute: undefined });

    expect(incident).toBeNull();
  });

  describe("Home incident", () => {
    it("should render the component with the correct style", () => {
      const { incident } = renderIncident(propsHome);

      expect(incident).toHaveStyle({ ...styles.container, ...styles.reverse });
    });

    it("should render the icon with the correct style", () => {
      const { incidentIcon } = renderIncident(propsHome);

      expect(incidentIcon).toHaveStyle({ ...styles.iconWrapper, ...styles.reverseIconWrapper });
    });

    it("should render the minute with the correct style", () => {
      const { incidentMinute } = renderIncident(propsHome);

      expect(incidentMinute[0]).toHaveTextContent(`${propsHome.minute}'`);
      expect(incidentMinute[0]).toHaveStyle(styles.minute);
    });

    it("should render the player with the correct style", () => {
      const { incidentPlayer } = renderIncident(propsHome);

      expect(incidentPlayer).toHaveTextContent(propsHome.player);
      expect(incidentPlayer).toHaveStyle({ ...styles.player, ...styles.playerReverse });
    });

    it("should call the IncidentIcon component with the correct type", () => {
      renderIncident(propsHome);

      expect(IncidentIcon).toHaveBeenCalledWith({ type: IncidentIconType.GOAL, isHighlighted: true }, undefined);
    });
  });

  describe("Home incident with lines", () => {
    const propsHomeLines = {
      ...propsHome,
      displayOrder: IncidentDisplayOrder.REVERSED_LINES,
      minutes: [45, 60, 90],
    };

    it("should render correctly with multiple minutes reversed", () => {
      const { incidentMinute } = renderIncident(propsHomeLines);

      expect(incidentMinute[0]).toHaveTextContent("45', 60', 90'");
    });
  });

  describe("Away incident", () => {
    it("should render the component with the correct style", () => {
      const { incident } = renderIncident(propsAway);

      expect(incident).toHaveStyle(styles.container);
    });

    it("should render the icon with the correct style", () => {
      const { incidentIcon } = renderIncident(propsAway);

      expect(incidentIcon).toHaveStyle(styles.icon);
    });

    it("should render the minute with the correct style", () => {
      const { incidentMinute } = renderIncident(propsAway);

      expect(incidentMinute[0]).toHaveTextContent("89'");
      expect(incidentMinute[0]).toHaveStyle(styles.minute);
    });

    it("should render the player with the correct style", () => {
      const { incidentPlayer } = renderIncident(propsAway);

      expect(incidentPlayer).toHaveTextContent("Player 2");
      expect(incidentPlayer).toHaveStyle(styles.player);
    });

    it("should call the IncidentIcon component with the correct type", () => {
      renderIncident(propsAway);

      expect(IncidentIcon).toHaveBeenCalledWith({ type: IncidentIconType.OWN_GOAL, isHighlighted: true }, undefined);
    });
  });

  describe("Away incident with lines", () => {
    const propsAwayLines = {
      ...propsAway,
      displayOrder: IncidentDisplayOrder.NORMAL_LINES,
      minutes: [45, 60, 90],
    };

    it("should render correctly with multiple minutes", () => {
      const { incidentMinute } = renderIncident(propsAwayLines);

      expect(incidentMinute[0]).toHaveTextContent("45', 60', 90'");
    });
  });
});
