import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { MatchStatSelection } from "./snowflakes/MatchStatSelection/MatchStatSelection.web";
import MatchStatSelectionCard from "./MatchStatSelectionCard.web";
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

jest.mock("./snowflakes/MatchStatSelection/MatchStatSelection.web", () => ({
  MatchStatSelection: jest.fn(({ children }) => <match-stat-selection>{children}</match-stat-selection>),
}));

const dispatchMarketUpdatesSubscribeMock = jest.fn();
const dispatchMarketUpdatesUnsubscribeMock = jest.fn();

const MatchStatSelectionCardProps = {
  urn: "URN",
  runnerUrn: "runnerUrn",
  marketUrn: "marketUrn",
  title: {
    playerNames: ["PLAYER A", "PLAYER B"],
    combiner: "AND",
  },
  subtitle: "SUBTITLE",
  marketId: "123",
  isMarketClosed: false,
  incidentType: "IncidentType",
  statsDescription: "StatsDescription",
  dispatchMarketUpdatesSubscribe: dispatchMarketUpdatesSubscribeMock,
  dispatchMarketUpdatesUnsubscribe: dispatchMarketUpdatesUnsubscribeMock,
  visible: true,
};

function renderComponent(props) {
  return render(<MatchStatSelectionCard {...props} />);
}

describe("MatchStatSelectionCard", () => {
  beforeEach(jest.clearAllMocks);

  it("should call MatchStatSelection snowflake with the correct parameters", () => {
    renderComponent(MatchStatSelectionCardProps, false);

    expect(MatchStatSelection).toHaveBeenCalledWith(
      expect.objectContaining({
        subtitle: "SUBTITLE",
        stats: "StatsDescription",
        isMarketClosed: false,
        icon: "Sports--Football",
      }),
      undefined,
    );

    expect(ConnectedSportsbookBetButton).toHaveBeenCalledWith(
      expect.objectContaining({
        cardUrn: "URN",
        marketUrn: "marketUrn",
        runnerUrn: "runnerUrn",
      }),
      undefined,
    );
  });

  describe("when market is closed", () => {
    it("should return MatchStat selection card with market closed as true", () => {
      renderComponent({ ...MatchStatSelectionCardProps, isMarketClosed: true });

      expect(MatchStatSelection).toHaveBeenCalledWith(
        expect.objectContaining({
          subtitle: "SUBTITLE",
          stats: "StatsDescription",
          isMarketClosed: true,
          icon: "Sports--Football",
        }),
        undefined,
      );
      expect(ConnectedSportsbookBetButton).toHaveBeenCalledWith(
        expect.objectContaining({
          cardUrn: "URN",
          marketUrn: "marketUrn",
          runnerUrn: "runnerUrn",
        }),
        undefined,
      );
    });
  });

  describe("dispatchSportsbookMarketUpdatesSubscribe", () => {
    it("should not call dispatchSportsbookMarketUpdatesSubscribe when it does not have market Id", () => {
      renderComponent({ ...MatchStatSelectionCardProps, marketId: undefined });

      expect(dispatchMarketUpdatesSubscribeMock).not.toHaveBeenCalled();
    });

    it("should call dispatchSportsbookMarketUpdatesSubscribe when it has market Id and it is visible", () => {
      renderComponent(MatchStatSelectionCardProps);

      expect(dispatchMarketUpdatesSubscribeMock).toHaveBeenCalledWith("123", true);
    });
  });

  describe("dispatchSportsbookMarketUpdatesUnsubscribe", () => {
    it("should not call dispatchSportsbookMarketUpdatesUnsubscribe when it does not have market Id", () => {
      renderComponent({ ...MatchStatSelectionCardProps, marketId: undefined });

      expect(dispatchMarketUpdatesUnsubscribeMock).not.toHaveBeenCalled();
    });

    it("should call dispatchSportsbookMarketUpdatesUnsubscribe when it has market Id and it is not visible", () => {
      renderComponent({ ...MatchStatSelectionCardProps, visible: false });

      expect(dispatchMarketUpdatesSubscribeMock).toHaveBeenCalledWith("123", false);
    });
  });
});
