import { render } from "@testing-library/react-native";
import ConnectedSportsbookBetButton from "../../SportsbookBetButton";
import SportsbookBetButton from "../../SportsbookBetButton/SportsbookBetButton.native";
import { GRID_CARD_ITEM } from "./GridCardItem.native.selectors";
import GridCardItem from "./GridCardItem.native";
import styles from "./GridCardItem.native.styles";

jest.mock("../../SportsbookBetButton", () => jest.fn(() => <connected-bet-button />));

jest.mock("../../SportsbookBetButton/SportsbookBetButton.native", () => jest.fn(() => <bet-button />));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  heights: {},
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useId: () => "r:id",
}));

function renderGridCardItem({
  cardUrn = "ppb:tbd:card:grid:12345",
  marketUrn = "ppb:tbd:sbkMarket:924.1111",
  runnerUrn = "ppb:tbd:sbkRunner:924.1111/12345",
  marketId = "924.1111",
  visible = true,
  dispatchSportsbookMarketUpdatesSubscribe = () => {},
  dispatchSportsbookMarketUpdatesUnsubscribe = () => {},
}) {
  return render(
    <GridCardItem
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

describe("GridCardItem", () => {
  beforeEach(jest.clearAllMocks);

  it("should draw the grid card item container with the appropriate styling", () => {
    const { queryByTestId } = renderGridCardItem({});

    expect(queryByTestId(GRID_CARD_ITEM)).toHaveStyle(styles.gridCardItem);
  });

  it("should render the SportsbookBetButton component", () => {
    renderGridCardItem({});

    expect(ConnectedSportsbookBetButton).toHaveBeenCalledTimes(1);
    expect(ConnectedSportsbookBetButton).toHaveBeenCalledWith(
      {
        cardUrn: "ppb:tbd:card:grid:12345",
        component: SportsbookBetButton,
        displayPreviousOdd: false,
        marketUrn: "ppb:tbd:sbkMarket:924.1111",
        runnerUrn: "ppb:tbd:sbkRunner:924.1111/12345",
        rounded: false,
        tall: true,
      },
      undefined,
    );
  });

  describe("when card is visible", () => {
    it("should subscribe poller updates", () => {
      const mock = jest.fn();

      renderGridCardItem({ dispatchSportsbookMarketUpdatesSubscribe: mock });

      expect(mock).toHaveBeenCalledWith("924.1111", "r:id");
    });
  });

  describe("when card is not visible", () => {
    it("should unsubscribe poller updates", () => {
      const mock = jest.fn();

      renderGridCardItem({ dispatchSportsbookMarketUpdatesUnsubscribe: mock, visible: false });

      expect(mock).toHaveBeenCalledWith("924.1111", "r:id");
    });
  });
});
