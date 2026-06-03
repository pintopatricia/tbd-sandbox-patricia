import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { FixtureTeamSide } from "@ppb/the-wall-common/types";
import { SportsIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { GoalNotification } from "./GoalNotification.web";
import { TEST_ID, DESCRIPTION, TITLE, SECOND_DESCRIPTION } from "./GoalNotification.web.selectors";
import styles from "./GoalNotification.web.css";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

function renderMatchEvent({
  title = "Team Lineups",
  description = "",
  secondDescription = "",
  side = FixtureTeamSide.HOME,
  isOwnGoal = false,
}) {
  const { container } = render(
    <GoalNotification
      title={title}
      description={description}
      secondDescription={secondDescription}
      side={side}
      isOwnGoal={isOwnGoal}
    />,
  );
  return container.querySelector(TEST_ID);
}

describe("Match Timeline - Goal Notification", () => {
  it("should have goal style for home team", () => {
    const expected = renderMatchEvent({
      title: "GOAL!",
      description: "Player name",
      secondDescription: "assist",
    });
    expect(expected).toHaveClass(styles.goal);
    expect(expected).toHaveTextContent("GOAL!");
    expect(GenericIcon).toHaveBeenCalledWith(
      {
        name: SportsIconName.FOOTBALL,
        color: "var(--signposting-indicators-rich-content-icon-warning2)",
      },
      undefined,
    );
    expect(expected.querySelector(TITLE)).toHaveTextContent("GOAL!");
    expect(expected.querySelector(DESCRIPTION)).toHaveTextContent("Player name");
    expect(expected.querySelector(SECOND_DESCRIPTION)).toHaveTextContent("assist");
  });

  it("should have goal style for away team", () => {
    const expected = renderMatchEvent({
      title: "GOAL!",
      side: FixtureTeamSide.AWAY,
    });
    expect(expected).toHaveClass(styles.goal);
    expect(expected).toHaveClass(styles.away);
    expect(expected).toHaveTextContent("GOAL!");
    expect(GenericIcon).toHaveBeenCalledWith(
      {
        name: SportsIconName.FOOTBALL,
        color: "var(--signposting-indicators-rich-content-icon-warning2)",
      },
      undefined,
    );
  });

  it("should have ownGoal style for home team", () => {
    const expected = renderMatchEvent({
      title: "OWN GOAL!",
      description: "Player name",
      secondDescription: "assist",
      isOwnGoal: true,
    });
    expect(expected).toHaveClass(styles.ownGoal);
    expect(expected).toHaveTextContent("OWN GOAL!");
    expect(GenericIcon).toHaveBeenCalledWith(
      {
        name: SportsIconName.FOOTBALL,
        color: "var(--signposting-indicators-rich-content-icon-negative2)",
      },
      undefined,
    );
    expect(expected.querySelector(TITLE)).toHaveTextContent("OWN GOAL!");
  });
});
