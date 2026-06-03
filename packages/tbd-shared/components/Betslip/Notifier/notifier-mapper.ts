import { createSelector } from "reselect";
import { BettingState, VALIDATION_SEVERITIES, VALIDATION_TYPES, Validations } from "@ppb/betslip-core";
import { hasSpecialValidation, isTerritoryApplicableValidation } from "@ppb/tbd-store/helpers/sportsbook-betting";
import {
  getSportsbookBettingState,
  getSportsbookBettingValidations,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { AlertProps, AlertViewModel } from "@ppb/the-wall-common/types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { SportsbookBettingState } from "@ppb/tbd-store/state/betting/sportsbook-betting/SportsbookBetting.types";
import { getBetslipCard } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { productConfiguration } from "@ppb/tbd-store";

import { TranslationKey } from "../../../translations/keys";
import {
  getAboveMaxPayoutGroupErrorNotification,
  getAboveMaxPayoutGroupWarningNotification,
  getAboveMaxPayoutNotification,
  getAboveMaxStakeNotification,
  getBelowMinStakeNotification,
  getIncrementOutOfRangeNotification,
  getMaxPayoutNotification,
  isMaxPayoutNotificationSupported,
} from "../../../helpers/notifier-helper";

const VALIDATIONS_GROUPING = [[VALIDATION_TYPES.ABOVE_MAX_PAYOUT, VALIDATION_TYPES.ABOVE_MAX_STAKE]];

export enum NOTIFICATION_TYPES {
  MAX_PAYOUT = "MAX_PAYOUT",
}

export type SportsbookValidation = {
  type: VALIDATION_TYPES | NOTIFICATION_TYPES;
  notification: AlertViewModel | null;
};

type CombinationValidation = {
  id: string;
  validation: Validations.CombinationsValidations;
};

type ValidationsByTypeMap = {
  [k in VALIDATION_TYPES]?: CombinationValidation;
};

export const createNotificationFromCombinationValidation = (
  validation: Validations.CombinationsValidations,
  userDetails: UserDetails,
  combination: BettingState.Combination,
): AlertProps | null => {
  switch (validation.type) {
    case VALIDATION_TYPES.BELOW_MIN_STAKE: {
      return getBelowMinStakeNotification(validation.data.min, userDetails);
    }
    case VALIDATION_TYPES.ABOVE_MAX_STAKE: {
      return getAboveMaxStakeNotification(validation.data.max, userDetails);
    }
    case VALIDATION_TYPES.ABOVE_MAX_PAYOUT: {
      return getAboveMaxPayoutNotification(validation.data.max, userDetails);
    }
    case VALIDATION_TYPES.INCREMENT_OUT_OF_RANGE: {
      return getIncrementOutOfRangeNotification(combination.minStakeIncrement, userDetails);
    }
    default:
      return null;
  }
};

export const createNotificationFromGroupValidation = (
  validation: Validations.CombinationsValidations,
  userDetails: UserDetails,
): AlertProps | null => {
  const maxPayoutKey = productConfiguration.getPayoutLimit(userDetails.currencyCode)?.hardCapKey as
    | keyof TranslationKey
    | undefined;

  switch (validation.type) {
    case VALIDATION_TYPES.ABOVE_MAX_PAYOUT: {
      if (validation.severity === VALIDATION_SEVERITIES.ERROR && maxPayoutKey) {
        return getAboveMaxPayoutGroupErrorNotification(userDetails, maxPayoutKey);
      }

      if (validation.severity === VALIDATION_SEVERITIES.WARNING && maxPayoutKey) {
        return getAboveMaxPayoutGroupWarningNotification(userDetails, maxPayoutKey);
      }

      return null;
    }
    default:
      return null;
  }
};

export const buildSportsbookValidation = (
  combinationValidation: CombinationValidation,
  notification: AlertViewModel | null,
): SportsbookValidation => {
  if (!notification?.items) {
    return {
      type: combinationValidation.validation.type,
      notification: null,
    };
  }

  return {
    type: combinationValidation.validation.type,
    notification: {
      id: combinationValidation.id,
      ...notification,
    },
  };
};

export const mergeSportsbookValidation = (
  validationA: SportsbookValidation,
  validationB: SportsbookValidation,
): SportsbookValidation => {
  const { notification: notificationA } = validationA;
  const { notification: notificationB } = validationB;

  if (!notificationA || !notificationB) {
    return {
      ...validationA,
      ...validationB,
      notification: null,
    };
  }

  return {
    ...validationA,
    ...validationB,
    notification: {
      ...notificationA,
      ...notificationB,
      items: notificationA.items && notificationB.items && [...notificationA.items, ...notificationB.items],
    },
  };
};

const groupCombinationValidations = (combinationValidations: ValidationsByTypeMap): CombinationValidation[][] => {
  const localCombinationValidations = { ...combinationValidations };
  const groupedValidations = VALIDATIONS_GROUPING.map((validationGroup) =>
    validationGroup
      .map((type) => {
        const validation = localCombinationValidations[type];

        delete localCombinationValidations[type]; // eslint-disable-line @typescript-eslint/no-dynamic-delete

        return validation;
      })
      .filter((validation): validation is CombinationValidation => !!validation),
  );

  return [...groupedValidations, ...Object.values(localCombinationValidations).map((validation) => [validation])];
};

const buildUniqueCombinationValidationsByTypeMap = (
  combinationsValidations: BettingState.CombinationsValidationsMap,
  userDetails: UserDetails,
): ValidationsByTypeMap =>
  Object.keys(combinationsValidations).reduce<ValidationsByTypeMap>((acc, combinationId) => {
    const currentCombinationValidations = combinationsValidations[combinationId];

    const validationsByTypeMap = currentCombinationValidations.reduce((newValidationsMap, validation) => {
      if (!isTerritoryApplicableValidation(validation.type, userDetails)) {
        return newValidationsMap;
      }
      return {
        ...newValidationsMap,
        [validation.type]: {
          id: combinationId,
          validation,
        },
      };
    }, {});

    return {
      ...acc,
      ...validationsByTypeMap,
    };
  }, {});

const buildGroupValidations = (
  coreGroupValidations: Validations.GroupsValidations[],
  userDetails: UserDetails,
  hasAboveMaxStakeValidation: boolean,
): SportsbookValidation[] =>
  coreGroupValidations.reduce<SportsbookValidation[]>((allSportsbookValidations, currentGroupValidation) => {
    if (!hasSpecialValidation(currentGroupValidation.type, userDetails, hasAboveMaxStakeValidation)) {
      return allSportsbookValidations;
    }

    const sportsbookValidation = {
      type: currentGroupValidation.type,
      notification: createNotificationFromGroupValidation(currentGroupValidation, userDetails),
    };

    return [...allSportsbookValidations, sportsbookValidation];
  }, []);

const flattenValidationGroup = (
  validationGroups: CombinationValidation[],
  userDetails: UserDetails,
  sportsbookBettingState: SportsbookBettingState,
): SportsbookValidation => {
  const [firstCombinationValidation, ...remainingCombinationValidations] = validationGroups;
  const firstCombination = sportsbookBettingState.combinations[firstCombinationValidation.id];
  const firstNotification = createNotificationFromCombinationValidation(
    firstCombinationValidation.validation,
    userDetails,
    firstCombination,
  );

  const flattenedValidation = remainingCombinationValidations.reduce<SportsbookValidation>(
    (flatValidation, validationGroup) => {
      const combination = sportsbookBettingState.combinations[validationGroup.id];
      const notification = createNotificationFromCombinationValidation(
        validationGroup.validation,
        userDetails,
        combination,
      );
      const sportsbookValidation = buildSportsbookValidation(validationGroup, notification);

      return mergeSportsbookValidation(flatValidation, sportsbookValidation);
    },
    buildSportsbookValidation(firstCombinationValidation, firstNotification),
  );

  return flattenedValidation;
};

export const createValidationsSelector = () =>
  createSelector(
    [getSportsbookBettingValidations, getUserDetails, getSportsbookBettingState, getBetslipCard],
    (coreValidations, userDetails, sportsbookBettingState, betslipState) => {
      // in operator to narrow type to UserDetails instead of UserDetails | OfflineUserDetails
      // and stop validating when in offline mode
      if (!userDetails || !("jurisdiction" in userDetails)) {
        return [];
      }

      const uniqueCombinationValidations = buildUniqueCombinationValidationsByTypeMap(
        coreValidations.combinations,
        userDetails,
      );

      const groupedCombinationValidation = groupCombinationValidations(uniqueCombinationValidations);
      const sportsbookCombinationValidations = groupedCombinationValidation.reduce<SportsbookValidation[]>(
        (allFlattenedCombinationValidations, validationGroups) =>
          validationGroups.length
            ? [
                ...allFlattenedCombinationValidations,
                flattenValidationGroup(validationGroups, userDetails, sportsbookBettingState),
              ]
            : allFlattenedCombinationValidations,
        [],
      );

      const hasAboveMaxStakeValidation = sportsbookCombinationValidations.some(
        (validation) => validation.type === VALIDATION_TYPES.ABOVE_MAX_STAKE,
      );

      const sportsbookGroupValidations = buildGroupValidations(
        coreValidations.group,
        userDetails,
        hasAboveMaxStakeValidation,
      );

      const showMaxPayoutNotification =
        betslipState?.showMaxPayoutNotification && isMaxPayoutNotificationSupported(userDetails);
      const maxPayoutNotification = showMaxPayoutNotification
        ? [
            {
              type: NOTIFICATION_TYPES.MAX_PAYOUT,
              notification: getMaxPayoutNotification(userDetails),
            },
          ]
        : [];

      // Uniques, Groups & Flattens all validations into notifications
      return [...sportsbookCombinationValidations, ...sportsbookGroupValidations, ...maxPayoutNotification];
    },
  );
