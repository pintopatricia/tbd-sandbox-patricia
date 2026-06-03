import { act, render } from "@testing-library/react-native";
import { Alert } from "@ppb/the-wall-native/components/Alert/Alert";
import { RacingResults } from "./snowflakes/RacingResults/RacingResults.native";
import {
  RACE_RESULTS_CARD,
  WINNING_TIME_AND_BSP_ADVANTAGE_LABEL,
  BSP_ADVANTAGE_LABEL,
  BSP_ADVANTAGE,
  WINNING_TIME_LABEL,
  WINNING_TIME,
  STATUS_ALERT,
} from "./RaceResultsCard.native.selectors";
import RaceResultsCard from "./RaceResultsCard.native";

jest.mock("./snowflakes/RacingResults/RacingResults.native", () => ({
  RacingResults: jest.fn(() => <racing-results-mock data-testid="racing-results" />),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
  spacings: {},
  heights: {},
}));

jest.mock("@ppb/the-wall-native/components/Alert/Alert", () => ({
  Alert: jest.fn(() => <alert-mock />),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("@ppb/tbd-router", () => ({
  navigate: jest.fn(),
}));

function renderRaceResultsCard(raceResultCardProps) {
  return render(<RaceResultsCard {...raceResultCardProps} />);
}

function createSetupProps({ subsFunc = jest.fn(), unSubsFunc = jest.fn() } = {}) {
  return {
    title: "Full Results",
    resultType: "FULL_RESULT",
    resultLabels: {
      fullResultsToFollowLabel: "I18N.RACING.REFRESH_FOR_RESULTS",
      winningAndBspAdvantageLabel: "I18N.RACING.WINNING_AND_BSP_ADVANTAGE",
      winningTimeLabel: "I18N.RACING.WINNING_TIME",
      bspAdvantageLabel: "I18N.RACING.BSP_ADVANTAGE",
    },
    labels: {
      positionLabel: "POS",
      distanceLabel: "DIST",
      horseLabel: "HORSE",
      startingPriceLabel: "SP",
      ranLabel: "Ran",
    },
    runners: [
      {
        position: 1,
        distance: "nk",
        saddleCloth: "7",
        horseName: "Camilo Anderson",
        silk: "silk url",
        draw: 1,
        jockeyName: "John Stepehnson",
        startingPrice: "100/10",
      },
    ],
    ranNumber: 8,
    winningTime: "3m 2s",
    bspAdvantage: "50%",
    raceUrn: "race:12345",
    dispatchSubscribeRaceUpdates: subsFunc,
    dispatchUnsubscribeRaceUpdates: unSubsFunc,
    dnfCodes: { PU: "Pulled up" },
  };
}

describe("Race Results Card component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when resultType is defined", () => {
    describe("when it has FULL_RESULT value", () => {
      it("must render racing results component accordingly", () => {
        const raceResultsCardProps = createSetupProps();
        const { queryByTestId } = renderRaceResultsCard(raceResultsCardProps);

        expect(queryByTestId(RACE_RESULTS_CARD)).not.toBeNull();

        expect(RacingResults).toHaveBeenCalledWith(
          {
            title: "Full Results",
            labels: {
              positionLabel: "POS",
              distanceLabel: "DIST",
              horseLabel: "HORSE",
              startingPriceLabel: "SP",
              ranLabel: "Ran",
            },
            runners: [
              {
                position: 1,
                distance: "nk",
                saddleCloth: "7",
                horseName: "Camilo Anderson",
                silk: "silk url",
                draw: 1,
                jockeyName: "John Stepehnson",
                startingPrice: "100/10",
              },
            ],
            ranNumber: 8,
            dnfCodes: { PU: "Pulled up" },
          },
          undefined,
        );
      });
    });

    describe("when it has QUICK_RESULT value", () => {
      const raceResultsPropsModified = {
        ...createSetupProps(),
        resultType: "QUICK_RESULT",
      };

      it("must render racing results component and fullResultToFollow label", () => {
        const { queryByTestId } = renderRaceResultsCard(raceResultsPropsModified);

        expect(queryByTestId(RACE_RESULTS_CARD)).not.toBeNull();

        expect(RacingResults).toHaveBeenCalledWith(
          {
            title: "Full Results",
            labels: {
              positionLabel: "POS",
              distanceLabel: "DIST",
              horseLabel: "HORSE",
              startingPriceLabel: "SP",
              ranLabel: "Ran",
            },
            runners: [
              {
                position: 1,
                distance: "nk",
                saddleCloth: "7",
                horseName: "Camilo Anderson",
                silk: "silk url",
                draw: 1,
                jockeyName: "John Stepehnson",
                startingPrice: "100/10",
              },
            ],
            ranNumber: 8,
            dnfCodes: { PU: "Pulled up" },
          },
          undefined,
        );
      });
    });
  });

  describe("when resultType is not defined", () => {
    const raceResultsPropsUndefined = {
      ...createSetupProps(),
      resultType: undefined,
    };

    it("shouldn't render racing results component accordingly", () => {
      const { queryByTestId } = renderRaceResultsCard(raceResultsPropsUndefined);

      expect(queryByTestId(RACE_RESULTS_CARD)).not.toBeNull();

      expect(RacingResults).not.toHaveBeenCalled();
    });
  });

  describe("resultType Updates", () => {
    it("should call dispatchSubscribeRaceUpdates on mount", () => {
      const raceResultsCardProps = createSetupProps();

      renderRaceResultsCard(raceResultsCardProps);

      expect(raceResultsCardProps.dispatchSubscribeRaceUpdates).toHaveBeenCalledTimes(1);
      expect(raceResultsCardProps.dispatchSubscribeRaceUpdates).toHaveBeenCalledWith("race:12345");
    });

    it("should call dispatchUnsubscribeRaceUpdates on unmount", () => {
      const raceResultsCardProps = createSetupProps();
      const { unmount } = renderRaceResultsCard(raceResultsCardProps);
      act(() => unmount());

      expect(raceResultsCardProps.dispatchUnsubscribeRaceUpdates).toHaveBeenCalledTimes(1);
      expect(raceResultsCardProps.dispatchUnsubscribeRaceUpdates).toHaveBeenCalledWith("race:12345");
    });
  });

  describe("winningTime and bspAdvantage", () => {
    describe("when winningTime is defined", () => {
      it("should render the winningTime info", () => {
        const raceResultsCardProps = createSetupProps();
        const { queryByTestId } = renderRaceResultsCard(raceResultsCardProps);

        expect(queryByTestId(WINNING_TIME_AND_BSP_ADVANTAGE_LABEL)).not.toBeNull();
        expect(queryByTestId(WINNING_TIME_LABEL)).not.toBeNull();
        expect(queryByTestId(WINNING_TIME)).toHaveTextContent("3m 2s");
      });
    });

    describe("when bspAdvantage is defined", () => {
      it("should render the bspAdvantage info", () => {
        const raceResultsCardProps = createSetupProps();

        const { queryByTestId } = renderRaceResultsCard(raceResultsCardProps);

        expect(queryByTestId(WINNING_TIME_AND_BSP_ADVANTAGE_LABEL)).not.toBeNull();
        expect(queryByTestId(BSP_ADVANTAGE_LABEL)).not.toBeNull();
        expect(queryByTestId(BSP_ADVANTAGE)).toHaveTextContent("50%");
      });
    });

    describe("when bspAdvantage and winningTime are not defined", () => {
      const raceResultsCardWithoutProps = {
        ...createSetupProps(),
        winningTime: undefined,
        bspAdvantage: undefined,
      };
      it("should not render the winningTime and bspAdvantage info", () => {
        const { queryByTestId } = renderRaceResultsCard(raceResultsCardWithoutProps);

        expect(queryByTestId(WINNING_TIME_AND_BSP_ADVANTAGE_LABEL)).toBeNull();
        expect(queryByTestId(WINNING_TIME_LABEL)).toBeNull();
        expect(queryByTestId(WINNING_TIME)).toBeNull();
        expect(queryByTestId(BSP_ADVANTAGE_LABEL)).toBeNull();
        expect(queryByTestId(BSP_ADVANTAGE)).toBeNull();
      });
    });

    describe("when winning time is defined but bsp is not", () => {
      it("should render the winning time but not render bsp info", () => {
        const raceResultsWithWinningButNotPerformanceProps = { ...createSetupProps(), bspAdvantage: null };

        const { queryByTestId } = renderRaceResultsCard(raceResultsWithWinningButNotPerformanceProps);
        expect(queryByTestId(RACE_RESULTS_CARD)).not.toBe(null);

        expect(queryByTestId(WINNING_TIME_AND_BSP_ADVANTAGE_LABEL)).not.toBe(null);
        expect(queryByTestId(WINNING_TIME_LABEL)).not.toBe(null);
        expect(queryByTestId(WINNING_TIME)).toHaveTextContent("3m 2s");

        expect(queryByTestId(BSP_ADVANTAGE_LABEL)).toBe(null);
        expect(queryByTestId(BSP_ADVANTAGE)).toBe(null);
      });
    });
  });

  describe("when a result status alert is non undefined", () => {
    it("should render an alert with type and message matching", () => {
      const statusAlert = {
        type: "INFO",
        message: "Message",
      };
      const raceResultsWithStatusAlert = {
        ...createSetupProps(),
        statusAlert,
      };
      renderRaceResultsCard(raceResultsWithStatusAlert);
      expect(Alert).toHaveBeenCalledWith(
        {
          ...statusAlert,
          accessible: true,
          testID: STATUS_ALERT,
          url: expect.any(String),
          onUrlClick: expect.any(Function),
        },
        undefined,
      );
    });
  });
});
