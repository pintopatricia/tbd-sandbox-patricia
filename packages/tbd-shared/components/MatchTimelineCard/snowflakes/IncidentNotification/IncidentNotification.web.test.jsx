import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { IncidentNotification } from "./IncidentNotification.web";
import { TEST_ID } from "./IncidentNotification.web.selectors";

function renderNotification(minute, incidentLabel, playerName, teamName) {
  const { container } = render(
    <IncidentNotification minute={minute} incidentLabel={incidentLabel} playerName={playerName} teamName={teamName} />,
  );
  return container.querySelector(TEST_ID);
}

beforeEach(jest.clearAllMocks);

describe("Notification", () => {
  describe("Render", () => {
    it("should display correctly", () => {
      const notification = renderNotification("98'", "Red Card", "Johnson R.", "Internazionale");

      expect(notification).toHaveTextContent("98', Red Card! Johnson R., Internazionale");
    });
  });
});
