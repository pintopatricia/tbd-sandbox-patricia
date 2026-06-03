import { render, fireEvent } from "@testing-library/react";
import "jest-dom/extend-expect";
import { TEST_ID, REWARDS_MESSAGE, MESSAGE_VALUE } from "./Rewards.web.selectors";
import { Rewards } from "./Rewards.web";

const onRewardsClick = jest.fn();

function renderRewardsMarket() {
  const monthRewards = [
    {
      month: "October Rewards",
      monthMessage: (
        <p>
          You need to have bets settled on
          <span> 16 more markets </span> to qualify for benefits next month.{" "}
        </p>
      ),
      bets: {
        totalBets: 20,
        currentBets: 4,
      },
      url: "https://betfair.com",
      target: "blank",
    },
    {
      month: "September Rewards",
      monthMessage: (
        <p>
          You qualified for all your <span> Rewards+ </span> package. Use your ACCA and Free Spins by XX/XX/XX.
        </p>
      ),
      url: "https://promos.betfair.com",
      target: "blank",
    },
  ];

  const { container } = render(<Rewards monthRewards={monthRewards} onClick={onRewardsClick} />);

  return container.querySelector(TEST_ID);
}

describe("Rewards", () => {
  const rewardsMarketComponent = renderRewardsMarket();

  it("should display my rewards message for current month", () => {
    const rewardsCurrentMonth = rewardsMarketComponent.querySelector(REWARDS_MESSAGE);
    expect(rewardsCurrentMonth).toHaveTextContent(
      "You need to have bets settled on 16 more markets to qualify for benefits next month.",
    );
  });

  it("should display market bets numbers for current month", () => {
    const rewardsMarketBets = rewardsMarketComponent.querySelector(MESSAGE_VALUE);
    expect(rewardsMarketBets.querySelector("span")).toHaveTextContent("16 more markets");
  });

  it("should call onClick", () => {
    const container = renderRewardsMarket();
    const renderMonth = container.querySelector(REWARDS_MESSAGE);
    fireEvent.click(renderMonth);
    expect(onRewardsClick).toHaveBeenCalledTimes(1);
  });
});
