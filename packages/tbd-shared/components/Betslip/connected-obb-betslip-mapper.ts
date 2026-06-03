import { ApplicationState } from "@ppb/tbd-store";
import { AlertProps, AlertType } from "@ppb/the-wall-common/types";
import {
  getAllUniqueLegFailures,
  getAllUniquePotentialBetFailures,
  getObbErrorCode,
} from "@ppb/tbd-store/helpers/obb-betting";
import {
  getObbLegFailures,
  getObbPotentialBetFailures,
  getObbBetslipFailure,
  getObbBettingPotentialBets,
  getObbCombinedLegFailures,
  getObbCombinedPotentialBetFailures,
} from "@ppb/tbd-store/state/betting/obb-betting/obb-betting-selectors";
import { createSelector } from "reselect";
import { FailuresMap, ObbPotentialBetMap } from "@ppb/tbd-store/state/betting/obb-betting/ObbBetting.types";
import {
  SUSPENDED_FAILURE_CODES,
  COMBINED_LEGS_FAILURES_BLOCKLIST,
} from "@ppb/tbd-store/state/betting/obb-betting/obb-betting.constants";
import { NotificationCode } from "./betslip-notification-code";
import { TranslationKey } from "../../translations/keys";
import { i18n } from "../../helpers/i18n";

export const createAvailabilityNotificationSelector = () =>
  createSelector([getObbLegFailures], (failedLegs: FailuresMap["legs"]) => {
    const notification = { id: NotificationCode.Availability, type: AlertType.Warning };

    const suspendedFailureCode = Object.values(failedLegs).find((failure) => SUSPENDED_FAILURE_CODES.includes(failure));

    if (suspendedFailureCode) {
      return {
        ...notification,
        message: i18n({ key: `I18N.BETSLIP.OBB.${suspendedFailureCode}` as keyof TranslationKey }),
      };
    }

    return undefined;
  });

export const createGetAvailabilityFailuresOnStakedBetsSelector = () =>
  createSelector(
    [getObbBettingPotentialBets, getObbLegFailures],
    (potentialBets: ObbPotentialBetMap, failedLegs: FailuresMap["legs"]) => {
      const stakedPotentialBets = Object.values(potentialBets).filter((potentialBet) => !!potentialBet.stake);

      return stakedPotentialBets.some((potentialBet) =>
        potentialBet.legs.some((leg) => failedLegs[leg] && SUSPENDED_FAILURE_CODES.includes(failedLegs[leg])),
      );
    },
  );

export const buildObbFailuresNotifications = (appState: ApplicationState): AlertProps[] | undefined => {
  const potentialBetFailures = getObbPotentialBetFailures(appState);
  const legFailures = getObbLegFailures(appState);
  const betslipFailure = getObbBetslipFailure(appState);

  const combinedLegFailures = getObbCombinedLegFailures(appState);
  const combinedPotentialBetFailures = getObbCombinedPotentialBetFailures(appState);

  // this will filter out the Not Combinable error, in order to avoid showing the notification and the ObbMultiple component UI change
  const filteredLegFailures = Object.fromEntries(
    Object.entries(legFailures).filter(
      ([legId, failure]) => !(combinedLegFailures[legId] && COMBINED_LEGS_FAILURES_BLOCKLIST.includes(failure)),
    ),
  );

  const filteredPotentialBetFailures = Object.fromEntries(
    Object.entries(potentialBetFailures).filter(
      ([potentialBetId, failure]) =>
        !(combinedPotentialBetFailures[potentialBetId] && COMBINED_LEGS_FAILURES_BLOCKLIST.includes(failure)),
    ),
  );

  const errorCodes = getObbErrorCode({
    betslipFailure,
    uniquePotentialBetFailures: getAllUniquePotentialBetFailures(filteredPotentialBetFailures),
    uniqueLegFailures: getAllUniqueLegFailures(filteredLegFailures),
  });

  const filteredErrorCodes = errorCodes?.filter((code) => !SUSPENDED_FAILURE_CODES.includes(code));

  return filteredErrorCodes?.map((errorCode) => ({
    id: NotificationCode.TransactionalError,
    type: AlertType.Error,
    message: i18n({ key: `I18N.BETSLIP.OBB.ERROR.${errorCode}` as keyof TranslationKey }),
  }));
};
