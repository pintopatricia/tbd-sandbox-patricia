import { render, act } from "@testing-library/react-native";
import { HighlightedSelectionCard as HighlightedSelection } from "./snowflakes/HighlightedSelectionCard/HighlightedSelectionCard.native";
import HighlightedSelectionCard from "./HighlightedSelectionCard.native";
import { HIGHLIGHTED_SELECTION_CARD_CONTAINER } from "./HighlightedSelectionCard.native.selectors";
import styles from "./HighlightedSelectionCard.native.styles";
import ConnectedSportsbookBetButton from "../SportsbookBetButton";

jest.mock("../SportsbookBetButton", () =>
  jest.fn(({ props }) => (
    <connected-sportsbook-bet-button-mock data-testid="connected-sportsbook-bet-button" {...props} />
  )),
);
jest.mock("../SportsbookBetButton/SportsbookBetButton.native", () =>
  jest.fn(({ props }) => <sportsbook-bet-button-mock {...props} />),
);

jest.mock("./snowflakes/HighlightedSelectionCard/HighlightedSelectionCard.native", () => ({
  HighlightedSelectionCard: jest.fn(({ props, children }) => (
    <highlighted-selection-card-mock {...props}>{children}</highlighted-selection-card-mock>
  )),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useId: () => "r:id",
}));

const BASE_PROPS = {
  isMarketClosed: "IS_MARKET_CLOSED",
  marketId: "MARKET_ID",
  runnerUrn: "RUNNER_URN",
  marketUrn: "MARKET_URN",
  betButtondisplayPreviousOdd: true,
  title: "TITLE",
  urn: "URN",
  visible: true,
};

const setup = ({
  dispatchMarketUpdatesSubscribeSpy = jest.fn(),
  dispatchMarketUpdatesUnsubscribeSpy = jest.fn(),
  ...REST
} = {}) => {
  const INITIAL_PROPS = {
    ...BASE_PROPS,
    dispatchMarketUpdatesSubscribe: dispatchMarketUpdatesSubscribeSpy,
    dispatchMarketUpdatesUnsubscribe: dispatchMarketUpdatesUnsubscribeSpy,
    ...REST,
  };
  return render(<HighlightedSelectionCard {...INITIAL_PROPS} />);
};

describe("HighlightedSelectionCard", () => {
  afterEach(() => jest.clearAllMocks());
  describe("highlighted selection card container", () => {
    it("should draw the card container with the correct styling", () => {
      const highlightedSelectionCard = setup();
      const container = highlightedSelectionCard.queryByTestId(HIGHLIGHTED_SELECTION_CARD_CONTAINER);

      expect(container).not.toBe(null);
      expect(container).toHaveStyle(styles.container);
    });
  });

  describe("highlighted selection", () => {
    it("should call HighlightedSelectionCard with the correct parameters", () => {
      setup();

      expect(HighlightedSelection).toHaveBeenCalledWith(
        {
          children: expect.any(Object),
          text: BASE_PROPS.title,
          isMarketClosed: BASE_PROPS.isMarketClosed,
        },
        undefined,
      );
    });
  });

  describe("ConnectedSportsbookBetButton", () => {
    it("should call the ConnectedSportsbookBetButton", () => {
      setup();

      expect(ConnectedSportsbookBetButton).toHaveBeenCalledWith(
        {
          cardUrn: "URN",
          marketUrn: "MARKET_URN",
          runnerUrn: "RUNNER_URN",
          component: expect.anything(),
          displayPreviousOdd: true,
        },
        undefined,
      );
    });
  });

  describe("dispatchSportsbookMarketUpdatesSubscribe", () => {
    describe("when card is visible", () => {
      it("should call dispatchSportsbookMarketUpdatesSubscribe at render if marketId is defined", () => {
        const dispatchMarketUpdatesSubscribeSpy = jest.fn();
        setup({ dispatchMarketUpdatesSubscribeSpy, visible: true });
        expect(dispatchMarketUpdatesSubscribeSpy).toHaveBeenCalledWith(BASE_PROPS.marketId, "r:id", true);
      });

      it("should not call dispatchSportsbookMarketUpdatesSubscribe at render if marketId is undefined", () => {
        const dispatchMarketUpdatesSubscribeSpy = jest.fn();
        setup({ marketId: undefined, dispatchMarketUpdatesSubscribeSpy, visible: true });
        expect(dispatchMarketUpdatesSubscribeSpy).not.toHaveBeenCalled();
      });
    });

    describe("when card is not visible", () => {
      it("should call dispatchSportsbookMarketUpdatesUnsubscribe at render if marketId is defined", () => {
        const dispatchMarketUpdatesSubscribeSpy = jest.fn();
        setup({ dispatchMarketUpdatesSubscribeSpy, visible: false });
        expect(dispatchMarketUpdatesSubscribeSpy).toHaveBeenCalledWith(BASE_PROPS.marketId, "r:id", false);
      });
      it("should not call dispatchSportsbookMarketUpdatesSubscribe at render if marketId is undefined", () => {
        const dispatchMarketUpdatesSubscribeSpy = jest.fn();
        setup({ marketId: undefined, dispatchMarketUpdatesSubscribeSpy, visible: false });
        expect(dispatchMarketUpdatesSubscribeSpy).not.toHaveBeenCalled();
      });
    });

    describe("dispatchSportsbookMarketUpdatesUnsubscribe", () => {
      it("should call dispatchSportsbookMarketUpdatesUnsubscribe when the component is unmounted", () => {
        const dispatchMarketUpdatesUnsubscribeSpy = jest.fn();
        const highlightedSelectionCard = setup({ dispatchMarketUpdatesUnsubscribeSpy });

        act(() => {
          highlightedSelectionCard.unmount();
        });

        expect(dispatchMarketUpdatesUnsubscribeSpy).toHaveBeenCalledWith(BASE_PROPS.marketId, "r:id");
      });
    });
  });
});
