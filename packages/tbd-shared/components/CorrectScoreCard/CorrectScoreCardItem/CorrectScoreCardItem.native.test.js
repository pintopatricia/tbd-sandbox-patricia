import { render } from "@testing-library/react-native";
import CorrectScoreCardItem from "./CorrectScoreCardItem.native";
import ConnectedSportsbookBetButton from "../../SportsbookBetButton";
import SportsbookBetButton from "../../SportsbookBetButton/SportsbookBetButton.native";

jest.mock("../../SportsbookBetButton", () => jest.fn(() => <connected-bet-button />));

jest.mock("../../SportsbookBetButton/SportsbookBetButton.native", () => jest.fn(() => <bet-button />));

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
  visible = false,
}) {
  return render(
    <CorrectScoreCardItem
      cardUrn={cardUrn}
      runnerUrn={runnerUrn}
      marketUrn={marketUrn}
      marketId={marketId}
      visible={visible}
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

    renderCorrectScoreCardItem({ dispatchSportsbookMarketUpdatesSubscribe: mock, visible: true });

    expect(mock).toHaveBeenCalledWith("924.1111", "r:id");
  });

  it("should unsubscribe poller updates when not intercepting", () => {
    const mock = jest.fn();

    renderCorrectScoreCardItem({ dispatchSportsbookMarketUpdatesUnsubscribe: mock, visible: false });

    expect(mock).toHaveBeenCalledWith("924.1111", "r:id");
  });
});
