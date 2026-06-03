import { createSelector, OutputParametricSelector } from "reselect";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { AlertType, AlertViewModel } from "@ppb/the-wall-common/types";
import { getSportsbookBettingImplyRunnerFailures } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { BettingState, RUNNER_FAILURE_CODES } from "@ppb/betslip-core";
import { i18n } from "../../../../helpers/i18n";

type NotificationStrategy = {
  [failureCode: string]: AlertViewModel;
};

export const createNotificationsViewModelBuilder = (): OutputParametricSelector<
  ApplicationState,
  string[],
  AlertViewModel[],
  (failures: BettingState.ImplyRunnerFailuresMap, runnerIds: string[]) => AlertViewModel[]
> =>
  createSelector(
    [getSportsbookBettingImplyRunnerFailures, (_: ApplicationState, runnerIds: string[]) => runnerIds],
    (failures, runnerIds) => {
      const NOTIFICATION_STRATEGY: NotificationStrategy = {
        [RUNNER_FAILURE_CODES.INVALID_SGM_COMBINATION_SINGLE_ODDS]: {
          type: AlertType.Info,
          message: i18n({ key: "I18N.BETSLIP.BET_BUILDER_NOTIFICATION" }),
        },
      };

      const allFailures = runnerIds.reduce<RUNNER_FAILURE_CODES[]>((failureCodes, id) => {
        const runnerFailures = failures[id] || [];

        return [...failureCodes, ...runnerFailures.map(({ failureCode }) => failureCode)];
      }, []);
      const allUniqueFailures = Array.from(new Set(allFailures)).filter(
        (failureCode) => !!NOTIFICATION_STRATEGY[failureCode],
      );

      return allUniqueFailures.map((failureCode) => NOTIFICATION_STRATEGY[failureCode]);
    },
  );
