import { act, render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { Alert } from "@ppb/the-wall-web";
import { RacingResults } from "./snowflakes/RacingResults/RacingResults.web";
import RaceResultsCard from "./RaceResultsCard.web";
import {
  TEST_ID as RACE_RESULTS_CARD,
  WINNING_TIME_AND_BSP_ADVANTAGE_LABEL,
  WINNING_TIME_LABEL,
  WINNING_TIME,
  BSP_ADVANTAGE_LABEL,
  BSP_ADVANTAGE,
} from "./RaceResultsCard.web.selectors";

jest.mock("./snowflakes/RacingResults/RacingResults.web", () => ({
  RacingResults: jest.fn(() => <racing-results-mock data-testid="racing-results" />),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("@ppb/the-wall-web/components/bricks/Alert/Alert", () => ({
  Alert: jest.fn(({ props }) => <alert-mock {...props} />),
}));

function renderRaceResultsCard(raceResultCardProps) {
  return render(<RaceResultsCard {...raceResultCardProps} />);
}

describe("Race Results Card component", () => {
  beforeEach(jest.clearAllMocks);

  let component;
  const raceResultsCardPropsWithPerformance = {
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
        hasPerformance: true,
      },
      {
        position: 2,
        distance: "nd",
        saddleCloth: "8",
        horseName: "John Anderson ",
        silk: "silk url",
        draw: 1,
        jockeyName: " Camilo Stepehnson",
        startingPrice: "100/10",
        hasPerformance: false,
      },
    ],
    ranNumber: 8,
    winningTime: "3m 2s",
    bspAdvantage: "50%",
    dispatchSubscribeRaceUpdates: jest.fn(),
    dispatchUnsubscribeRaceUpdates: jest.fn(),
    dnfCodes: { PU: "Pulled up" },
  };

  const raceResultsCardPropsWithoutPerformance = {
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
        hasPerformance: false,
      },
      {
        position: 2,
        distance: "nd",
        saddleCloth: "8",
        horseName: "John Anderson ",
        silk: "silk url",
        draw: 1,
        jockeyName: " Camilo Stepehnson",
        startingPrice: "100/10",
        hasPerformance: false,
      },
    ],
    ranNumber: 8,
    winningTime: "3m 2s",
    raceUrn: "race:12345",
    dispatchSubscribeRaceUpdates: jest.fn(),
    dispatchUnsubscribeRaceUpdates: jest.fn(),
  };

  describe("when resultType is defined", () => {
    describe("when at least one runner has performance data", () => {
      describe("and it has FULL_RESULT value", () => {
        it("must render racing results component accordingly", () => {
          component = renderRaceResultsCard(raceResultsCardPropsWithPerformance).container;
          expect(component.querySelector(RACE_RESULTS_CARD)).toBeVisible();

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
                  hasPerformance: true,
                },
                {
                  position: 2,
                  distance: "nd",
                  saddleCloth: "8",
                  horseName: "John Anderson ",
                  silk: "silk url",
                  draw: 1,
                  jockeyName: " Camilo Stepehnson",
                  startingPrice: "100/10",
                  hasPerformance: false,
                },
              ],
              ranNumber: 8,
              dnfCodes: { PU: "Pulled up" },
            },
            undefined,
          );
        });
      });

      describe("and it has QUICK_RESULT value", () => {
        const raceResultsPropsModified = {
          ...raceResultsCardPropsWithPerformance,
          resultType: "QUICK_RESULT",
        };

        it("must render racing results component and fullResultToFollow label", () => {
          component = renderRaceResultsCard(raceResultsPropsModified).container;
          expect(component.querySelector(RACE_RESULTS_CARD)).toBeVisible();

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
                  hasPerformance: true,
                },
                {
                  position: 2,
                  distance: "nd",
                  saddleCloth: "8",
                  horseName: "John Anderson ",
                  silk: "silk url",
                  draw: 1,
                  jockeyName: " Camilo Stepehnson",
                  startingPrice: "100/10",
                  hasPerformance: false,
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

    describe("when no runner has performance data", () => {
      describe("and it has FULL_RESULT value", () => {
        it("shouldn't render racing results component", () => {
          component = renderRaceResultsCard(raceResultsCardPropsWithoutPerformance).container;

          expect(RacingResults).not.toHaveBeenCalled();
        });
      });

      describe("and it has QUICK_RESULT value", () => {
        const raceResultsPropsModified = {
          ...raceResultsCardPropsWithoutPerformance,
          resultType: "QUICK_RESULT",
        };

        it("must render racing results component and fullResultToFollow label", () => {
          component = renderRaceResultsCard(raceResultsPropsModified).container;

          expect(RacingResults).not.toHaveBeenCalled();
        });
      });

      describe("when resultType is not defined", () => {
        const raceResultsPropsUndefined = {
          ...raceResultsCardPropsWithoutPerformance,
          resultType: undefined,
        };

        it("shouldn't render racing results component accordingly", () => {
          component = renderRaceResultsCard(raceResultsPropsUndefined).container;

          expect(RacingResults).not.toHaveBeenCalled();
          expect(component.querySelector(RACE_RESULTS_CARD)).toBeVisible();
        });
      });
    });
  });

  describe("when resultType is not defined", () => {
    const raceResultsPropsUndefined = {
      ...raceResultsCardPropsWithPerformance,
      resultType: undefined,
    };

    it("shouldn't render racing results component", () => {
      component = renderRaceResultsCard(raceResultsPropsUndefined).container;
      expect(component.querySelector(RACE_RESULTS_CARD)).toBeVisible();

      expect(RacingResults).not.toHaveBeenCalled();
    });
  });

  describe("resultType Updates", () => {
    it("should call dispatchSubscribeRaceUpdates on mount", () => {
      renderRaceResultsCard(raceResultsCardPropsWithoutPerformance);

      expect(raceResultsCardPropsWithoutPerformance.dispatchSubscribeRaceUpdates).toHaveBeenCalledTimes(1);
      expect(raceResultsCardPropsWithoutPerformance.dispatchSubscribeRaceUpdates).toHaveBeenCalledWith("race:12345");
    });

    it("should call dispatchUnsubscribeRaceUpdates on unmount", () => {
      const { unmount } = renderRaceResultsCard(raceResultsCardPropsWithoutPerformance);
      act(() => unmount());

      expect(raceResultsCardPropsWithoutPerformance.dispatchUnsubscribeRaceUpdates).toHaveBeenCalledTimes(1);
      expect(raceResultsCardPropsWithoutPerformance.dispatchUnsubscribeRaceUpdates).toHaveBeenCalledWith("race:12345");
    });
  });

  describe("winningTime and bspAdvantage", () => {
    describe("when winningTime is defined", () => {
      it("should render the winningTime info", () => {
        component = renderRaceResultsCard(raceResultsCardPropsWithPerformance).container;
        expect(component.querySelector(RACE_RESULTS_CARD)).toBeVisible();
        expect(component.querySelector(WINNING_TIME_AND_BSP_ADVANTAGE_LABEL)).toBeVisible();
        expect(component.querySelector(WINNING_TIME_LABEL)).toBeVisible();
        expect(component.querySelector(WINNING_TIME).textContent).toEqual("3m 2s");
      });
    });

    describe("when bspAdvantage is defined", () => {
      it("should render the bspAdvantage info", () => {
        component = renderRaceResultsCard(raceResultsCardPropsWithPerformance).container;
        expect(component.querySelector(RACE_RESULTS_CARD)).toBeVisible();
        expect(component.querySelector(WINNING_TIME_AND_BSP_ADVANTAGE_LABEL)).toBeVisible();
        expect(component.querySelector(BSP_ADVANTAGE_LABEL)).toBeVisible();
        expect(component.querySelector(BSP_ADVANTAGE).textContent).toEqual("50%");
      });
    });

    describe("when bspAdvantage and winningTime are not defined", () => {
      const raceResultsCardWithoutProps = {
        ...raceResultsCardPropsWithPerformance,
        winningTime: undefined,
        bspAdvantage: undefined,
      };
      it("should not render the winningTime and bspAdvantage info", () => {
        component = renderRaceResultsCard(raceResultsCardWithoutProps).container;
        expect(component.querySelector(RACE_RESULTS_CARD)).toBeVisible();
        expect(component.querySelector(WINNING_TIME_AND_BSP_ADVANTAGE_LABEL)).toBe(null);
        expect(component.querySelector(WINNING_TIME_LABEL)).toBe(null);
        expect(component.querySelector(WINNING_TIME)).toBe(null);
        expect(component.querySelector(BSP_ADVANTAGE_LABEL)).toBe(null);
        expect(component.querySelector(BSP_ADVANTAGE)).toBe(null);
      });
    });
    describe("when winning time is defined but bsp is not", () => {
      it("should render the winning time but not render bsp info", () => {
        const raceResultsWithWinningButNotPerformance = { ...raceResultsCardPropsWithPerformance, bspAdvantage: null };

        component = renderRaceResultsCard(raceResultsWithWinningButNotPerformance).container;
        expect(component.querySelector(RACE_RESULTS_CARD)).toBeVisible();

        expect(component.querySelector(WINNING_TIME_AND_BSP_ADVANTAGE_LABEL)).toBeVisible();
        expect(component.querySelector(WINNING_TIME_LABEL)).toBeVisible();
        expect(component.querySelector(WINNING_TIME).textContent).toEqual("3m 2s");

        expect(component.querySelector(BSP_ADVANTAGE_LABEL)).toBe(null);
        expect(component.querySelector(BSP_ADVANTAGE)).toBe(null);
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
        ...raceResultsCardPropsWithPerformance,
        statusAlert,
      };

      component = renderRaceResultsCard(raceResultsWithStatusAlert).container;
      expect(Alert).toHaveBeenCalledWith(statusAlert, undefined);
    });
  });
});
