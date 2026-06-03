import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { useOnIntersect } from "@ppb/the-wall-web";
import CorrectScoreCardItem from "./CorrectScoreCardItem.web";
import ConnectedSportsbookBetButton from "../../SportsbookBetButton";
import SportsbookBetButton from "../../SportsbookBetButton/SportsbookBetButton.web";

jest.mock("../../SportsbookBetButton", () => jest.fn(() => <connected-bet-button />));

jest.mock("../../SportsbookBetButton/SportsbookBetButton.web", () => jest.fn(() => <bet-button />));

jest.mock("@ppb/the-wall-web", () => ({
  useOnIntersect: jest.fn(),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useId: () => "r:id",
}));

function renderCorrectScoreCardItem({
  cardUrn = "ppb:tbd:card:grid:12345",
  marketUrn = "ppb:tbd:sbkMarket:924.1111",
  runnerUrn = "ppb:tbd:sbkRunner:924.1111/12345",
  marketId = "924.1111",
  dispatchSportsbookMarketUpdatesSubscribe = () => {},
  dispatchSportsbookMarketUpdatesUnsubscribe = () => {},
  isIntersecting = false,
}) {
  useOnIntersect.mockReturnValue({ isIntersecting });
  return render(
    <CorrectScoreCardItem
      cardUrn={cardUrn}
      runnerUrn={runnerUrn}
      marketUrn={marketUrn}
      marketId={marketId}
      dispatchSportsbookMarketUpdatesSubscribe={dispatchSportsbookMarketUpdatesSubscribe}
      dispatchSportsbookMarketUpdatesUnsubscribe={dispatchSportsbookMarketUpdatesUnsubscribe}
    />,
  );
}

describe("CorrectScoreCardItem", () => {
  beforeEach(jest.clearAllMocks);

  it("should render the SportsbookBetButton component", () => {
    renderCorrectScoreCardItem({});

    expect(ConnectedSportsbookBetButton).toHaveBeenCalledTimes(1);
    expect(ConnectedSportsbookBetButton).toHaveBeenCalledWith(
      {
        cardUrn: "ppb:tbd:card:grid:12345",
        component: SportsbookBetButton,
        displayPreviousOdd: false,
        marketUrn: "ppb:tbd:sbkMarket:924.1111",
        runnerUrn: "ppb:tbd:sbkRunner:924.1111/12345",
        rounded: false,
      },
      undefined,
    );
  });

  it("should subscribe poller updates when intercepting", () => {
    const mock = jest.fn();

    renderCorrectScoreCardItem({ dispatchSportsbookMarketUpdatesSubscribe: mock, isIntersecting: true });

    expect(mock).toHaveBeenCalledWith("924.1111", "r:id");
  });

  it("should unsubscribe poller updates when not intercepting", () => {
    const mock = jest.fn();

    renderCorrectScoreCardItem({ dispatchSportsbookMarketUpdatesUnsubscribe: mock, isIntersecting: false });

    expect(mock).toHaveBeenCalledWith("924.1111", "r:id");
  });
});
