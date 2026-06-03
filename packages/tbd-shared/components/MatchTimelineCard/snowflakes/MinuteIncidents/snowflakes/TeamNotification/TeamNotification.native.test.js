import { render } from "@testing-library/react-native";
import { FixtureTeamSide } from "@ppb/the-wall-common/types";

import { TeamNotification } from "./TeamNotification.native";
import styles from "./TeamNotification.native.styles";
import {
  TEAM_NOTIFICATION,
  TEAM_NOTIFICATION_TITLE,
  TEAM_NOTIFICATION_DESCRIPTION,
} from "./TeamNotification.native.selectors";

const propsHome = {
  title: "home title",
  description: "home description",
  side: FixtureTeamSide.HOME,
};
const propsAway = {
  title: "away title",
  description: "away description",
  side: FixtureTeamSide.AWAY,
};

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
  spacings: {},
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

function renderNotification(props) {
  const { getByTestId } = render(<TeamNotification {...props} />);
  return {
    notification: getByTestId(TEAM_NOTIFICATION),
    title: getByTestId(TEAM_NOTIFICATION_TITLE),
    description: getByTestId(TEAM_NOTIFICATION_DESCRIPTION),
  };
}

describe("Match Timeline - TeamNotification", () => {
  describe("Home TeamNotification", () => {
    it("should have title", () => {
      const { title } = renderNotification(propsHome);
      expect(title).toHaveTextContent("home title");
    });

    it("should have description", () => {
      const { description } = renderNotification(propsHome);
      expect(description).toHaveTextContent("home description");
    });

    it("should have correct styles", () => {
      const { notification, title, description } = renderNotification(propsHome);

      expect(notification).toHaveStyle(styles.container);
      expect(title).toHaveStyle(styles.title);
      expect(title).toHaveStyle(styles.home);
      expect(description).toHaveStyle(styles.description);
      expect(description).toHaveStyle(styles.home);
    });
  });

  describe("Away TeamNotification", () => {
    it("should have title", () => {
      const { title } = renderNotification(propsAway);
      expect(title).toHaveTextContent("away title");
    });

    it("should have description", () => {
      const { description } = renderNotification(propsAway);
      expect(description).toHaveTextContent("away description");
    });

    it("should have correct styles", () => {
      const { notification, title, description } = renderNotification(propsAway);

      expect(notification).toHaveStyle(styles.container);
      expect(title).toHaveStyle(styles.title);
      expect(title).toHaveStyle(styles.away);
      expect(description).toHaveStyle(styles.description);
      expect(description).toHaveStyle(styles.away);
    });
  });
});
