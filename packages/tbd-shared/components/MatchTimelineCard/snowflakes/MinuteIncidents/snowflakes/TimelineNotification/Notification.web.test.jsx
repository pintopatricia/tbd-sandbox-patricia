import "jest-dom/extend-expect";
import { render } from "@testing-library/react";

import { Notification } from "./Notification.web";
import { TEST_ID, DESCRIPTION } from "./Notification.web.selectors";
import styles from "./Notification.web.css";

function renderNotification({ title = "notification", description = "" }) {
  const { container } = render(<Notification title={title} description={description} />);
  return container.querySelector(TEST_ID);
}

describe("Match Timeline - Notification", () => {
  it("should have the title", () => {
    const expected = renderNotification({});
    expect(expected).toHaveTextContent("notification");
    expect(expected).toHaveClass(styles.card);
  });

  it("should have Description", () => {
    const announcement = renderNotification({ description: "Announced" });
    const expected = announcement.querySelector(DESCRIPTION);
    expect(expected).toHaveTextContent("Announced");
  });
});
