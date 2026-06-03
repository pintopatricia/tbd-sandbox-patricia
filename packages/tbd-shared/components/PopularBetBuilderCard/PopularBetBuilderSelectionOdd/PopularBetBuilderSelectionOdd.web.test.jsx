import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import useOnIntersect from "@ppb/the-wall-web/hooks/useOnIntersect";
import PopularBetBuilderSelectionOdd from "./PopularBetBuilderSelectionOdd.web";
import styles from "./PopularBetBuilderSelectionOdd.web.css";
import { TEST_ID } from "./PopularBetBuilderSelectionOdd.web.selectors";

jest.mock("@ppb/the-wall-web/hooks/useOnIntersect");
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useId: () => "r:id",
}));

const dispatchSportsbookMarketUpdatesUnsubscribeMock = jest.fn();
const dispatchSportsbookMarketUpdatesSubscribeMock = jest.fn();
let isIntersecting = false;

function renderPopularBetBuilderSelectionOdd(overwrites) {
  const base = {
    dispatchSportsbookMarketUpdatesSubscribe: jest.fn(),
    dispatchSportsbookMarketUpdatesUnsubscribe: jest.fn(),
    marketId: "ppb:market:1",
    isRacing: true,
    odd: "22/11",
  };

  const props = { ...base, ...overwrites };
  useOnIntersect.mockReturnValue({ isIntersecting });

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
      });

      expect(dispatchSportsbookMarketUpdatesUnsubscribeMock).toHaveBeenCalledTimes(1);
      expect(dispatchSportsbookMarketUpdatesUnsubscribeMock).toHaveBeenCalledWith("ppb:market:1", "r:id");
    });
  });

  describe("when is visible", () => {
    beforeEach(() => {
      isIntersecting = true;
    });

    it("must dispatch dispatchSportsbookMarketUpdatesUnsubscribe", () => {
      renderPopularBetBuilderSelectionOdd({
        dispatchSportsbookMarketUpdatesSubscribe: dispatchSportsbookMarketUpdatesSubscribeMock,
      });

      expect(dispatchSportsbookMarketUpdatesSubscribeMock).toHaveBeenCalledTimes(1);
      expect(dispatchSportsbookMarketUpdatesSubscribeMock).toHaveBeenCalledWith("ppb:market:1", "r:id");
    });

    describe("when is racing", () => {
      const { container } = renderPopularBetBuilderSelectionOdd();
      const element = container.querySelector(TEST_ID);

      it("must render the component with correct data and styles", () => {
        expect(element).toHaveClass(styles.container);
        expect(element).toHaveClass("typography-h158");
        expect(element).toHaveTextContent("22/11");
      });
    });

    describe("when is not racing", () => {
      const { container } = renderPopularBetBuilderSelectionOdd({ isRacing: false });
      const element = container.querySelector(TEST_ID);

      it("must render the component with correct data and styles", () => {
        expect(element).toHaveClass(styles.container);
        expect(element).toHaveClass("typography-h180");

        expect(element).toHaveTextContent("22/11");
      });
    });
  });
});
