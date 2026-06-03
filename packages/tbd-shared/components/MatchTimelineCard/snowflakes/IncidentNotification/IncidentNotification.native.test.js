import { render } from "@testing-library/react-native";

import { IncidentNotification } from "./IncidentNotification.native";
import { INCIDENT_NOTIFICATION } from "./IncidentNotification.native.selectors";
import styles from "./IncidentNotification.native.styles";

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

const renderNotification = (props) => {
  const { queryByTestId } = render(<IncidentNotification {...props} />);

  return {
    incidentNotification: queryByTestId(INCIDENT_NOTIFICATION),
  };
};

beforeEach(jest.clearAllMocks);

describe("Notification", () => {
  const setupValues = {
    minute: "98'",
    incidentLabel: "Red Card",
    playerName: "Johnson R.",
    teamName: "Internazionale",
  };

  describe("Render", () => {
    it("should display correctly", () => {
      const { incidentNotification } = renderNotification(setupValues);

      expect(incidentNotification).toHaveTextContent("98', Red Card! Johnson R., Internazionale");
    });

    it("should have the correct styling", () => {
      const { incidentNotification } = renderNotification(setupValues);

      expect(incidentNotification).toHaveStyle(styles.notification);
    });
  });
});
