import { createSelector } from "reselect";
import {
  getObbBettingValidations,
  getObbBettingState,
} from "@ppb/tbd-store/state/betting/obb-betting/obb-betting-selectors";
import { getBetslipCard } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { AlertProps, AlertViewModel } from "@ppb/the-wall-common/types";
import {
  ObbBetslipValidations,
  ObbBettingState,
  ObbPotentialBet,
  ObbPotentialBetsValidations,
  ObbValidations,
  ObbValidationSeverities,
  ObbValidationTypes,
} from "@ppb/tbd-store/state/betting/obb-betting/ObbBetting.types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { productConfiguration } from "@ppb/tbd-store";
import { isTerritoryApplicableValidation, hasSpecialValidation } from "@ppb/tbd-store/helpers/obb-betting";
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
import { TranslationKey } from "../../../translations/keys";

export enum NOTIFICATION_TYPES {
  MAX_PAYOUT = "MAX_PAYOUT",
}

const VALIDATIONS_GROUPING = [[ObbValidationTypes.ABOVE_MAX_PAYOUT, ObbValidationTypes.ABOVE_MAX_STAKE]];

export type ObbValidation = {
  type: ObbValidationTypes | NOTIFICATION_TYPES;
  notification: AlertViewModel | null;
};

type PotentialBetValidation = {
  id: string;
  validation: ObbPotentialBetsValidations;
};

type ValidationsByTypeMap = {
  [k in ObbValidationTypes]?: PotentialBetValidation;
};

export const createNotificationFromPotentialBetValidation = (
  validation: ObbPotentialBetsValidations,
  userDetails: UserDetails,
  potentialBet: ObbPotentialBet,
): AlertProps | null => {
  switch (validation.type) {
    case ObbValidationTypes.BELOW_MIN_STAKE: {
      return getBelowMinStakeNotification(validation.data.min, userDetails);
    }
    case ObbValidationTypes.ABOVE_MAX_STAKE: {
      return getAboveMaxStakeNotification(validation.data.max, userDetails);
    }
    case ObbValidationTypes.ABOVE_MAX_PAYOUT: {
      return getAboveMaxPayoutNotification(validation.data.max, userDetails);
    }
    case ObbValidationTypes.INCREMENT_OUT_OF_RANGE: {
      if (!potentialBet.minStakeIncrement) {
        return null;
      }
      return getIncrementOutOfRangeNotification(potentialBet.minStakeIncrement, userDetails);
    }
    default:
      return null;
  }
};

export const createNotificationFromBetslipValidation = (
  validation: ObbBetslipValidations,
  userDetails: UserDetails,
): AlertProps | null => {
  const maxPayoutKey = productConfiguration.getPayoutLimit(userDetails.currencyCode)?.hardCapKey as
    | keyof TranslationKey
    | undefined;

  switch (validation.type) {
    case ObbValidationTypes.ABOVE_MAX_PAYOUT: {
      if (validation.severity === ObbValidationSeverities.ERROR && maxPayoutKey) {
        return getAboveMaxPayoutGroupErrorNotification(userDetails, maxPayoutKey);
      }

      if (validation.severity === ObbValidationSeverities.WARNING && maxPayoutKey) {
        return getAboveMaxPayoutGroupWarningNotification(userDetails, maxPayoutKey);
      }

      return null;
    }
    default:
      return null;
  }
};

export const buildObbValidation = (
  potentialBetValidation: PotentialBetValidation,
  notification: AlertViewModel | null,
): ObbValidation => {
  if (!notification?.items) {
    return {
      type: potentialBetValidation.validation.type,
      notification: null,
    };
  }

  return {
    type: potentialBetValidation.validation.type,
    notification: {
      id: potentialBetValidation.id,
      ...notification,
    },
  };
};

export const mergeObbValidation = (validationA: ObbValidation, validationB: ObbValidation): ObbValidation => {
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

const groupPotentialBetValidations = (potentialBetValidations: ValidationsByTypeMap): PotentialBetValidation[][] => {
  const localPotentialBetValidations = { ...potentialBetValidations };
  const groupedValidations = VALIDATIONS_GROUPING.map((validationGroup) =>
    validationGroup
      .map((type) => {
        const validation = localPotentialBetValidations[type];

        delete localPotentialBetValidations[type]; // eslint-disable-line @typescript-eslint/no-dynamic-delete

        return validation;
      })
      .filter((validation): validation is PotentialBetValidation => !!validation),
  );

  return [...groupedValidations, ...Object.values(localPotentialBetValidations).map((validation) => [validation])];
};

const buildUniquePotentialBetValidationsByTypeMap = (
  potentialBetsValidations: ObbValidations["potentialBets"],
  userDetails: UserDetails,
): ValidationsByTypeMap =>
  Object.keys(potentialBetsValidations).reduce<ValidationsByTypeMap>((acc, potentialBetId) => {
    const currentPotentialBetValidations = potentialBetsValidations[potentialBetId];

    const validationsByTypeMap = currentPotentialBetValidations.reduce((newValidationsMap, validation) => {
      if (!isTerritoryApplicableValidation(validation.type, userDetails)) {
        return newValidationsMap;
      }
      return {
        ...newValidationsMap,
        [validation.type]: {
          id: potentialBetId,
          validation,
        },
      };
    }, {});

    return {
      ...acc,
      ...validationsByTypeMap,
    };
  }, {});

const buildBetslipValidations = (
  coreBetslipValidations: ObbBetslipValidations[],
  userDetails: UserDetails,
  hasAboveMaxStakeValidation: boolean,
): ObbValidation[] =>
  coreBetslipValidations.reduce<ObbValidation[]>((allObbValidations, currentBetslipValidation) => {
    if (!hasSpecialValidation(currentBetslipValidation.type, userDetails, hasAboveMaxStakeValidation)) {
      return allObbValidations;
    }

    const obbValidation = {
      type: currentBetslipValidation.type,
      notification: createNotificationFromBetslipValidation(currentBetslipValidation, userDetails),
    };

    return [...allObbValidations, obbValidation];
  }, []);

const flattenPotentialBetsValidations = (
  potentialBetValidations: PotentialBetValidation[],
  userDetails: UserDetails,
  obbBettingState: ObbBettingState,
): ObbValidation => {
  const [firstPotentialBetValidation, ...remainingPotentialBetValidations] = potentialBetValidations;
  const firstPotentialBet = obbBettingState.potentialBets[firstPotentialBetValidation.id];
  const firstNotification = createNotificationFromPotentialBetValidation(
    firstPotentialBetValidation.validation,
    userDetails,
    firstPotentialBet,
  );

  const flattenedValidation = remainingPotentialBetValidations.reduce<ObbValidation>(
    (flatValidation, validationGroup) => {
      const potentialBet = obbBettingState.potentialBets[validationGroup.id];
      const notification = createNotificationFromPotentialBetValidation(
        validationGroup.validation,
        userDetails,
        potentialBet,
      );
      const obbValidation = buildObbValidation(validationGroup, notification);

      return mergeObbValidation(flatValidation, obbValidation);
    },
    buildObbValidation(firstPotentialBetValidation, firstNotification),
  );

  return flattenedValidation;
};

export const createValidationsSelector = () =>
  createSelector(
    [getObbBettingValidations, getUserDetails, getObbBettingState, getBetslipCard],
    (obbValidations, userDetails, obbBettingState, betslipState) => {
      // in operator to narrow type to UserDetails instead of UserDetails | OfflineUserDetails
      // and stop validating when in offline mode
      if (!userDetails || !("jurisdiction" in userDetails)) {
        return [];
      }

      const uniquePotentialBetValidations = buildUniquePotentialBetValidationsByTypeMap(
        obbValidations.potentialBets,
        userDetails,
      );

      const groupedPotentialBetValidation = groupPotentialBetValidations(uniquePotentialBetValidations);
      const obbPotentialBetValidations = groupedPotentialBetValidation.reduce<ObbValidation[]>(
        (allFlattenedPotentialBetValidations, potentialBetValidations) =>
          potentialBetValidations.length
            ? [
                ...allFlattenedPotentialBetValidations,
                flattenPotentialBetsValidations(potentialBetValidations, userDetails, obbBettingState),
              ]
            : allFlattenedPotentialBetValidations,
        [],
      );

      const hasAboveMaxStakeValidation = obbPotentialBetValidations.some(
        (validation) => validation.type === ObbValidationTypes.ABOVE_MAX_STAKE,
      );

      const obbBetslipValidations = buildBetslipValidations(
        obbValidations.betslip,
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
      return [...obbPotentialBetValidations, ...obbBetslipValidations, ...maxPayoutNotification];
    },
  );
