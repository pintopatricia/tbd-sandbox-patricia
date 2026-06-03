import { render } from "@testing-library/react-native";
import PopularBetBuilderSelectionOdd from "./PopularBetBuilderSelectionOdd.native";
import { ODD } from "./PopularBetBuilderSelectionOdd.native.selectors";
import styles from "./PopularBetBuilderSelectionOdd.native.styles";

jest.mock("../../../hooks/useNativeLazyLoading.native", () => ({
  useVisibilityStatus: jest.fn(() => false),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useId: () => "r:id",
}));

const dispatchSportsbookMarketUpdatesUnsubscribeMock = jest.fn();
const dispatchSportsbookMarketUpdatesSubscribeMock = jest.fn();

function renderPopularBetBuilderSelectionOdd(overwrites) {
  const base = {
    dispatchSportsbookMarketUpdatesSubscribe: jest.fn(),
    dispatchSportsbookMarketUpdatesUnsubscribe: jest.fn(),
    marketId: "ppb:market:1",
    isRacing: true,
    odd: "22/11",
    visible: false,
  };

  const props = { ...base, ...overwrites };

  return render(<PopularBetBuilderSelectionOdd {...props} />);
}

describe("PopularBetBuilderSelectionOdd component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when is not visible", () => {
    it("must dispatch dispatchSportsbookMarketUpdatesUnsubscribe", () => {
      renderPopularBetBuilderSelectionOdd({
        dispatchSportsbookMarketUpdatesUnsubscribe: dispatchSportsbookMarketUpdatesUnsubscribeMock,
        visible: false,
      });

      expect(dispatchSportsbookMarketUpdatesUnsubscribeMock).toHaveBeenCalledTimes(1);
      expect(dispatchSportsbookMarketUpdatesUnsubscribeMock).toHaveBeenCalledWith("ppb:market:1", "r:id");
    });
  });

  describe("when is visible", () => {
    it("must dispatch dispatchSportsbookMarketUpdatesUnsubscribe", () => {
      renderPopularBetBuilderSelectionOdd({
        dispatchSportsbookMarketUpdatesSubscribe: dispatchSportsbookMarketUpdatesSubscribeMock,
        visible: true,
      });

      expect(dispatchSportsbookMarketUpdatesSubscribeMock).toHaveBeenCalledTimes(1);
      expect(dispatchSportsbookMarketUpdatesSubscribeMock).toHaveBeenCalledWith("ppb:market:1", "r:id");
    });

    describe("when is racing", () => {
      it("must render the component with correct data and styles", () => {
        const { queryByTestId } = renderPopularBetBuilderSelectionOdd({
          visible: true,
        });

        const element = queryByTestId(ODD);

        expect(element).toHaveStyle(styles.container);
        expect(element).toHaveStyle(styles.racingTitle);
        expect(element).toHaveTextContent("22/11");
      });
    });

    describe("when is not racing", () => {
      it("must render the component with correct data and styles", () => {
        const { queryByTestId } = renderPopularBetBuilderSelectionOdd({ visible: true, isRacing: false });
        const element = queryByTestId(ODD);

        expect(element).toHaveStyle(styles.container);
        expect(element).toHaveStyle(styles.defaultTitle);
        expect(element).toHaveTextContent("22/11");
      });
    });
  });
});
