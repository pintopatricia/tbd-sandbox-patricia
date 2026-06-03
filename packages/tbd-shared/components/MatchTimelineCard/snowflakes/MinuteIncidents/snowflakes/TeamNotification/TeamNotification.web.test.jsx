import "jest-dom/extend-expect";
import { FixtureTeamSide } from "@ppb/the-wall-common/types";
import { render } from "@testing-library/react";
import { TeamNotification } from "./TeamNotification.web";

import { TEST_ID, DESCRIPTION } from "./TeamNotification.web.selectors";
import styles from "./TeamNotification.web.css";

function renderMatchEvent({ title = "Team Notification", description = "", side = FixtureTeamSide.HOME }) {
  const { container } = render(<TeamNotification title={title} description={description} side={side} />);
  return container.querySelector(TEST_ID);
}

describe("Match Timeline - Team Notification", () => {
  it("should have the title", () => {
    const expected = renderMatchEvent({});
    expect(expected).toHaveTextContent("Team Notification");
    expect(expected).toHaveClass(styles.home);
  });

  it("should have Description", () => {
    const notification = renderMatchEvent({ description: "Announced", side: FixtureTeamSide.AWAY });
    expect(notification).toHaveClass(styles.away);
    const expected = notification.querySelector(DESCRIPTION);
    expect(expected).toHaveTextContent("Announced");
  });
});
