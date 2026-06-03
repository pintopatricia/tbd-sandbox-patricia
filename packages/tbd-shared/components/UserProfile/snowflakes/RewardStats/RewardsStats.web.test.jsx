import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { TEST_ID, MONTH_REWARDS } from "./RewardsStats.web.selectors";
import { RewardsStats } from "./RewardsStats.web";

jest.mock("@ppb/the-wall-web/components/bricks/ProgressBar/ProgressBar", () => ({
  ProgressBar: jest.fn(() => <progress-bar-mock />),
}));

function renderRewardsStats(totalBets = 20, currentBets = 4) {
  const { container } = render(
    <RewardsStats totalBets={totalBets} currentBets={currentBets} rewardsTitle={"October"} />,
  );
  return container.querySelector(TEST_ID);
}

describe("render component", () => {
  describe("when total bets greater than current bets", () => {
    const rewardsStats = renderRewardsStats();

    it("should display month rewards title", () => {
      const rewardsCurrentMonthTitle = rewardsStats.querySelector(MONTH_REWARDS);
      expect(rewardsCurrentMonthTitle).toHaveTextContent("October");
    });

    it("should display current bets / total bets", () => {
      const rewardsCurrentMonth = rewardsStats.querySelector(MONTH_REWARDS);
      expect(rewardsCurrentMonth.querySelector("span")).toHaveTextContent("4/20");
    });
  });

  describe("when current bets greater than total bets", () => {
    const rewardsStats = renderRewardsStats(4, 20);

    it("should display current bets / total bets", () => {
      const rewardsCurrentMonth = rewardsStats.querySelector(MONTH_REWARDS);
      expect(rewardsCurrentMonth.querySelector("span")).toHaveTextContent("4/4");
    });
  });
});
