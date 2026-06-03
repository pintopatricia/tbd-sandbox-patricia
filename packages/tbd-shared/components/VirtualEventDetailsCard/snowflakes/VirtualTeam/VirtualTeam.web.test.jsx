import { render } from "@testing-library/react";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import "jest-dom/extend-expect";
import { VirtualTeam } from "./VirtualTeam.web";
import { TEST_ID } from "./VirtualTeam.web.selectors";
import styles from "./VirtualTeam.web.css";

const teamA = {
  name: "home name",
};

function renderTeam({ team, viewMode = ScoreboardViewMode.DEFAULT, reverseOrder, football }) {
  const { container } = render(
    <VirtualTeam team={team} viewMode={viewMode} reverseOrder={reverseOrder} football={football} />,
  );
  return container.querySelector(TEST_ID);
}

describe("Team", () => {
  beforeEach(jest.clearAllMocks);
  it("should have team class", () => {
    const team = renderTeam({ team: teamA });
    expect(team).toHaveClass(styles.team);
  });

  describe("when reverseOrder is true", () => {
    it("should render team with reverseOrder class", () => {
      const team = renderTeam({ team: teamA, reverseOrder: true });

      expect(team).toHaveClass(styles.reverseOrder);
    });
  });
  describe("when virtualTeam's singleLine prop is true", () => {
    it("should render team with singleLine class", () => {
      const team = renderTeam({ team: { name: "utd" } });

      expect(team).toHaveClass(styles.singleLine);
    });
  });
  describe("when virtualTeam's singleLine prop is false", () => {
    it("should render team without singleLine class", () => {
      const team = renderTeam({ team: teamA });

      expect(team).not.toHaveClass(styles.singleLine);
    });
  });
});
