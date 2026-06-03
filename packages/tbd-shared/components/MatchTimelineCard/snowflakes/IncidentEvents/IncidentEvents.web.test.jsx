import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { IncidentIconType } from "@ppb/the-wall-common/types";
import { IncidentIcon } from "@ppb/the-wall-web/components/bricks/IncidentIcon/IncidentIcon";
import { IncidentDisplayOrder } from "../Incident/Incident.types";
import { Incident } from "../Incident/Incident.web";
import { IncidentEvents } from "./IncidentEvents.web";
import { TEST_ID } from "./IncidentEvents.web.selectors";

jest.mock("../Incident/Incident.web", () => ({
  Incident: jest.fn(() => <incident-mock />),
  IncidentDisplayOrder: {
    REVERSED: 1,
  },
}));

jest.mock("@ppb/the-wall-web/components/bricks/IncidentIcon/IncidentIcon", () => ({
  IncidentIcon: jest.fn(() => <incident-icon-mock />),
}));

const homeIncidents = [
  {
    type: IncidentIconType.GOAL,
    player: "Player 1",
    minute: 40,
    displayOrder: IncidentDisplayOrder.REVERSED,
  },
];
const awayIncidents = [
  {
    type: IncidentIconType.GOAL,
    player: "Player 2",
    minute: 41,
    displayOrder: IncidentDisplayOrder.NORMAL,
  },
];

function renderIncidentEvents(home, away, icon) {
  const { container } = render(<IncidentEvents homeIncidents={home} awayIncidents={away} categoryIcon={icon} />);

  return container.querySelector(TEST_ID);
}

describe("IncidentEvents", () => {
  it("should render correctly with 2 incidents", () => {
    renderIncidentEvents(homeIncidents, awayIncidents);

    expect(Incident).toHaveBeenCalledTimes(2);

    expect(Incident.mock.calls[0][0]).toEqual(homeIncidents[0]);
    expect(Incident.mock.calls[1][0]).toEqual(awayIncidents[0]);
  });

  it("should render correctly with icon", () => {
    renderIncidentEvents(homeIncidents, awayIncidents, IncidentIconType.GOAL);

    expect(IncidentIcon).toHaveBeenCalledTimes(1);
  });

  it("should not render when all incidents are empty", () => {
    const incidentEvents = renderIncidentEvents([], []);

    expect(incidentEvents).toBeNull();
  });
});
