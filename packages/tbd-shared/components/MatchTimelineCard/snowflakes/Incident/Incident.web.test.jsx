import { render } from "@testing-library/react";
import { IncidentIconType } from "@ppb/the-wall-common/types";
import "jest-dom/extend-expect";
import { IncidentDisplayOrder } from "./Incident.types";
import { Incident } from "./Incident.web";
import { TEST_ID, INCIDENT_MINUTE, INCIDENT_PLAYER } from "./Incident.web.selectors";
import styles from "./Incident.web.css";

jest.mock("@ppb/the-wall-web/components/bricks/IncidentIcon/IncidentIcon", () => ({
  IncidentIcon: jest.fn(() => <incident-icon-mock />),
}));

const incidentProps = {
  icon: IncidentIconType.GOAL,
  player: "Player",
  minute: 89,
  displayOrder: IncidentDisplayOrder.REVERSED,
};

function renderIncident(props = incidentProps) {
  const { container } = render(<Incident {...props} />);

  return container.querySelector(TEST_ID);
}

describe("Incident", () => {
  it("should not render when there is no minute or minutes prop", () => {
    const incidentComponent = renderIncident({ ...incidentProps, minute: undefined });

    expect(incidentComponent).toBeNull();
  });

  describe("default incident", () => {
    it("should render correctly", () => {
      const incidentComponent = renderIncident();

      const incidentMinute = incidentComponent.querySelector(INCIDENT_MINUTE);
      const incidentPlayer = incidentComponent.querySelector(INCIDENT_PLAYER);

      expect(incidentComponent).toHaveClass(styles.container);

      expect(incidentMinute).toHaveTextContent(`${incidentProps.minute}'`);
      expect(incidentPlayer).toHaveTextContent(incidentProps.player);
    });
  });

  describe("scoreboard incident", () => {
    const scoreboardIncidentProps = {
      ...incidentProps,
      displayOrder: IncidentDisplayOrder.NORMAL_LINES,
      minutes: [45, 60, 90],
    };

    it("should render correctly", () => {
      const incidentComponent = renderIncident(scoreboardIncidentProps);

      const incidentMinute = incidentComponent.querySelectorAll(INCIDENT_MINUTE);
      const incidentPlayer = incidentComponent.querySelector(INCIDENT_PLAYER);

      expect(incidentComponent).toHaveClass(styles.container);

      expect(incidentMinute[0]).toHaveTextContent("45', 60', 90'");
      expect(incidentPlayer).toHaveTextContent(incidentProps.player);
    });

    it("should render correctly when reversed", () => {
      const incidentComponent = renderIncident({
        ...scoreboardIncidentProps,
        displayOrder: IncidentDisplayOrder.REVERSED_LINES,
      });

      const incidentMinute = incidentComponent.querySelectorAll(INCIDENT_MINUTE);
      const incidentPlayer = incidentComponent.querySelector(INCIDENT_PLAYER);

      expect(incidentComponent).toHaveClass(styles.container);

      expect(incidentMinute[0]).toHaveTextContent("45', 60', 90'");
      expect(incidentPlayer).toHaveTextContent(incidentProps.player);
    });
  });
});
