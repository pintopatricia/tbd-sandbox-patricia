import { render } from "@testing-library/react-native";

import { PlacedBetCard } from "../PlacedBetCard/PlacedBetCard.native";
import { ExchangeMatchedCard } from "./ExchangeMatchedCard.native";

jest.mock("../PlacedBetCard/PlacedBetCard.native", () => ({
  PlacedBetCard: jest.fn(() => <placed-bet-card-mock />),
}));

function renderExchangeMatchedCard({
  price = "3.00",
  stake = "£5.00",
  outcome = "£10.00",
  side = "Back",
  bonus = "Used Bonus £10",
  hasFreeBets = false,
  labels = {},
}) {
  return render(
    <ExchangeMatchedCard
      price={price}
      stake={stake}
      outcome={outcome}
      side={side}
      bonus={bonus}
      hasFreeBets={hasFreeBets}
      labels={labels}
    ></ExchangeMatchedCard>,
  );
}

describe("ExchangeMatchedCard", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should proxy to PlacedBetCard", () => {
    renderExchangeMatchedCard({});

    expect(PlacedBetCard).toHaveBeenCalledWith(
      {
        price: "3.00",
        stake: "£5.00",
        outcome: "£10.00",
        side: "Back",
        bonus: "Used Bonus £10",
        hasFreeBets: false,
        labels: {},
      },
      undefined,
    );
  });
});
