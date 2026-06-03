import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { HighlightedSelectionCard as HighlightedSelection } from "./snowflakes/HighlightedSelectionCard/HighlightedSelectionCard.web";
import HighlightedSelectionCard from "./HighlightedSelectionCard.web";
import ConnectedSportsbookBetButton from "../SportsbookBetButton";

jest.mock("@ppb/the-wall-web/hooks/useOnIntersect");

jest.mock("../SportsbookBetButton", () =>
  jest.fn(({ props }) => (
    <connected-sportsbook-bet-button-mock data-testid="connected-sportsbook-bet-button" {...props} />
  )),
);
jest.mock("../SportsbookBetButton/SportsbookBetButton.web", () =>
  jest.fn(({ props }) => <sportsbook-bet-button-mock {...props} />),
);

jest.mock("./snowflakes/HighlightedSelectionCard/HighlightedSelectionCard.web", () => ({
  HighlightedSelectionCard: jest.fn(({ children }) => <highlighted-selection>{children}</highlighted-selection>),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useId: () => "r:id",
}));

const dispatchMarketUpdatesSubscribeMock = jest.fn();
const dispatchMarketUpdatesUnsubscribeMock = jest.fn();

const HighlightedSelectionCardProps = {
  urn: "URN",
  runnerUrn: "runnerUrn",
  marketUrn: "marketUrn",
  title: "Card Title",
  marketId: "123",
  isMarketClosed: false,
  betButtondisplayPreviousOdd: true,
  dispatchMarketUpdatesSubscribe: dispatchMarketUpdatesSubscribeMock,
  dispatchMarketUpdatesUnsubscribe: dispatchMarketUpdatesUnsubscribeMock,
  visible: true,
};

function renderComponent(props) {
  return render(<HighlightedSelectionCard {...props} />);
}

describe("HighlightedSelectionCard", () => {
  beforeEach(jest.clearAllMocks);

  it("should return highlighted selection card with bet button", () => {
    renderComponent(HighlightedSelectionCardProps, false);

    expect(HighlightedSelection).toHaveBeenCalledWith(
      {
        text: "Card Title",
        isMarketClosed: false,
        children: expect.anything(),
      },
      undefined,
    );
    expect(ConnectedSportsbookBetButton).toHaveBeenCalledWith(
      {
        cardUrn: "URN",
        marketUrn: "marketUrn",
        runnerUrn: "runnerUrn",
        component: expect.anything(),
        displayPreviousOdd: true,
      },
      undefined,
    );
  });

  describe("when market is closed", () => {
    it("should return highlighted selection card with market closed as true", () => {
      renderComponent({ ...HighlightedSelectionCardProps, isMarketClosed: true });

      expect(HighlightedSelection).toHaveBeenCalledWith(
        {
          text: "Card Title",
          isMarketClosed: true,
          children: expect.anything(),
        },
        undefined,
      );
      expect(ConnectedSportsbookBetButton).toHaveBeenCalledWith(
        {
          cardUrn: "URN",
          marketUrn: "marketUrn",
          runnerUrn: "runnerUrn",
          component: expect.anything(),
          displayPreviousOdd: true,
        },
        undefined,
      );
    });
  });

  describe("dispatchSportsbookMarketUpdatesSubscribe", () => {
    it("should not dispatchSportsbookMarketUpdatesSubscribe when it does not have market Id", () => {
      renderComponent({ ...HighlightedSelectionCardProps, marketId: undefined });

      expect(dispatchMarketUpdatesSubscribeMock).not.toHaveBeenCalled();
    });

    it("should dispatchSportsbookMarketUpdatesSubscribe when it has market Id and it is visible", () => {
      renderComponent(HighlightedSelectionCardProps);

      expect(dispatchMarketUpdatesSubscribeMock).toHaveBeenCalledWith("123", "r:id", true);
    });
  });

  describe("dispatchSportsbookMarketUpdatesUnsubscribe", () => {
    it("should not dispatchSportsbookMarketUpdatesUnsubscribe when it does not have market Id", () => {
      renderComponent({ ...HighlightedSelectionCardProps, marketId: undefined });

      expect(dispatchMarketUpdatesUnsubscribeMock).not.toHaveBeenCalled();
    });

    it("should dispatchSportsbookMarketUpdatesUnsubscribe when it has market Id and it is not visible", () => {
      renderComponent({ ...HighlightedSelectionCardProps, visible: false });

      expect(dispatchMarketUpdatesSubscribeMock).toHaveBeenCalledWith("123", "r:id", false);
    });
  });
});
