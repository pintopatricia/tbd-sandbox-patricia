import { render } from "@testing-library/react-native";
import { Notification } from "./Notification.native";

import styles from "./Notification.native.styles";
import { NOTIFICATION, NOTIFICATION_TITLE, NOTIFICATION_DESCRIPTION } from "./Notification.native.selectors";

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
  spacings: {},
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

function renderNotification({ title = "notification", description = "" }) {
  const { getByTestId, queryByTestId } = render(<Notification title={title} description={description} />);
  return {
    notification: getByTestId(NOTIFICATION),
    title: getByTestId(NOTIFICATION_TITLE),
    description: queryByTestId(NOTIFICATION_DESCRIPTION),
  };
}

describe("Match Timeline - Notification", () => {
  it("should have title", () => {
    const { title } = renderNotification({});
    expect(title).toHaveTextContent("notification");
  });

  it("should have description", () => {
    const { description } = renderNotification({ description: "Announced" });
    expect(description).toHaveTextContent("Announced");
  });

  it("should have correct styles", () => {
    const { notification, title, description } = renderNotification({
      description: "description",
    });

    expect(notification).toHaveStyle(styles.card);
    expect(title).toHaveStyle(styles.title);
    expect(description).toHaveStyle(styles.description);
  });
});
