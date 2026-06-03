import { render, act } from "@testing-library/react-native";
import MatchStatSelectionCard from "./MatchStatSelectionCard.native";
import { MATCH_STAT_SELECTION_CARD_CONTAINER } from "./MatchStatSelectionCard.native.selectors";
import { MatchStatSelection } from "./snowflakes/MatchStatSelection/MatchStatSelection.native";
import styles from "./snowflakes/MatchStatSelection/MatchStatSelection.native.styles";

import ConnectedSportsbookBetButton from "../SportsbookBetButton";

jest.mock("../SportsbookBetButton", () =>
  jest.fn(({ props }) => (
    <connected-sportsbook-bet-button-mock data-testid="connected-sportsbook-bet-button" {...props} />
  )),
);
jest.mock("../SportsbookBetButton/SportsbookBetButton.native", () =>
  jest.fn(({ props }) => <sportsbook-bet-button-mock {...props} />),
);

jest.mock("./snowflakes/MatchStatSelection/MatchStatSelection.native", () => ({
  MatchStatSelection: jest.fn(({ props, children }) => (
    <match-stat-selection-card-mock {...props}>{children}</match-stat-selection-card-mock>
  )),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

const BASE_PROPS = {
  isMarketClosed: "IS_MARKET_CLOSED",
  marketId: "MARKET_ID",
  runnerUrn: "RUNNER_URN",
  marketUrn: "MARKET_URN",
  title: {
    playerNames: ["Bruno Fernandes", "Marcus Rashford"],
    combiner: "OR",
  },
  subtitle: "SUBTITLE",
  urn: "URN",
  visible: true,
  statsDescription: "STATS_DESCRIPTION",
  incidentType: "INCIDENT_TYPE",
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
  return render(<MatchStatSelectionCard {...INITIAL_PROPS} />);
};

describe("MatchStatSelectionCard", () => {
  afterEach(() => jest.clearAllMocks());
  describe("match stat selection card container", () => {
    it("should draw the card container with the correct styling", () => {
      const matchStatSelectionCard = setup();
      const container = matchStatSelectionCard.queryByTestId(MATCH_STAT_SELECTION_CARD_CONTAINER);

      expect(container).not.toBe(null);
      expect(container).toHaveStyle(styles.container);
    });
  });

  describe("match stat selection", () => {
    it("should call MatchStatSelection snowflake with the correct parameters", () => {
      setup();

      expect(MatchStatSelection).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.arrayContaining([
            expect.objectContaining({
              key: "name-0-0",
              props: expect.objectContaining({ children: "Bruno", style: expect.any(Object) }),
            }),
            expect.objectContaining({
              key: "name-0-1",
              props: expect.objectContaining({ children: "Fernandes", style: expect.any(Object) }),
            }),
            expect.objectContaining({ key: "label-0" }),
            expect.objectContaining({
              key: "name-1-0",
              props: expect.objectContaining({ children: "Marcus", style: expect.any(Object) }),
            }),
            expect.objectContaining({
              key: "name-1-1",
              props: expect.objectContaining({ children: "Rashford", style: expect.any(Object) }),
            }),
          ]),

          subtitle: BASE_PROPS.subtitle,
          stats: BASE_PROPS.statsDescription,
          isMarketClosed: BASE_PROPS.isMarketClosed,
          icon: "Sports--Football",
        }),
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
        expect(dispatchMarketUpdatesSubscribeSpy).toHaveBeenCalledWith(BASE_PROPS.marketId, true);
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
        expect(dispatchMarketUpdatesSubscribeSpy).toHaveBeenCalledWith(BASE_PROPS.marketId, false);
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
        const matchStatSelectionCard = setup({ dispatchMarketUpdatesUnsubscribeSpy });

        act(() => {
          matchStatSelectionCard.unmount();
        });

        expect(dispatchMarketUpdatesUnsubscribeSpy).toHaveBeenCalledWith(BASE_PROPS.marketId);
      });
    });
  });
});
