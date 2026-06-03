import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { createSportsbookRunnerByURNSelector } from "@ppb/tbd-store/state/entities/sportsbook-runners/sportsbook-runner-selectors";
import { createSelector, ParametricSelector } from "reselect";
import { SportsbookOdds } from "@ppb/tbd-store/state/entities/SportsbookOdds.types";
import { formatOdds } from "@ppb/tbd-store/helpers/formatters";
import { OddsDisplayPreference } from "@ppb/tbd-store/state";

export type ContainerProps = {
  runnerUrn: URN;
  isMarketInplay?: boolean;
};

export type CardProps = {
  previousOdds: string;
};

export type StateProps = CardProps | Record<string, never>;

export const createPreviousHistoryViewModel = (): ParametricSelector<SportsbookOdds[], OddsDisplayPreference, string> =>
  createSelector(
    [
      (previousOdds: SportsbookOdds[]) => previousOdds,
      (_: SportsbookOdds[], sportsbookDisplayOddsPreferences: OddsDisplayPreference) =>
        sportsbookDisplayOddsPreferences,
    ],
    (previousOdds, sportsbookDisplayOddsPreferences) =>
      [...previousOdds]
        .reverse()
        .map((odd) => (odd ? formatOdds(odd, sportsbookDisplayOddsPreferences) : undefined))
        .filter((odd) => !!odd)
        .join(" ▸ "),
  );

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getSportsbookRunnerByURN = createSportsbookRunnerByURNSelector();
  const getPreviousHistoryViewModel = createPreviousHistoryViewModel();

  return (state: ApplicationState, { runnerUrn, isMarketInplay }: ContainerProps): StateProps => {
    if (isMarketInplay || !state.entities.preferences.sportsbookOddsDisplay) {
      return {};
    }

    const runner = getSportsbookRunnerByURN(state.entities.sportsbookrunners, runnerUrn);

    if (!runner?.previousOdds || runner.status === "REMOVED") {
      return {};
    }

    return {
      previousOdds: getPreviousHistoryViewModel(runner.previousOdds, state.entities.preferences.sportsbookOddsDisplay),
    };
  };
};
