import { createSelector, ParametricSelector, Selector } from "reselect";

import { BettingState, COMBINABLE_LEG_TYPES_LIST } from "@ppb/betslip-core";
import {
  ApplicationState,
  BetslipCastContext,
  createGetThrottleSelector,
  getThrottles,
  UserDetails,
} from "@ppb/tbd-store";
import { createShallowEqualSelector } from "@ppb/tbd-store/helpers/selectors";
import {
  generateCastGroupIds,
  generateCastRunnersIds,
  groupCombinationsByMarketId,
  groupCombinationsByMultiLineTypes,
  isMultiple,
  isSingleLike,
  MultipleCombinations,
} from "@ppb/tbd-store/helpers/sportsbook-betting";
import {
  getBetslipStep,
  getSportsbookConfirmation,
  getSportsbookConfirmationCastContext,
  getSportsbookConfirmationCombinations,
  getSportsbookConfirmationIgnoredBets,
  getSportsbookConfirmationLegs,
  getSportsbookConfirmationRunners,
} from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { RunnersMetadata } from "@ppb/tbd-store/state/betting/sportsbook-betting/SportsbookBetting.types";
import { getBettingResolvers } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { CastBetCastTypeItem } from "@ppb/the-wall-common/types";

import { buildCastBet, CastBet, generateCastTypes } from "./betslip-mapper";

export const createIsConfirmStepActive = (): Selector<ApplicationState, boolean> => {
  const getThrottle = createGetThrottleSelector();

  return createSelector(
    [getThrottles],
    (throttles): boolean => !!getThrottle(throttles, "BET_CONFIRMATION_STEP")?.isActive,
  );
};

export const createIsConfirmStep = (): Selector<ApplicationState, boolean> =>
  createSelector([getBetslipStep], (step): boolean => step === "CONFIRM_POTENTIAL");

export const createGetConfirmationMultipleCombinations = (): Selector<ApplicationState, MultipleCombinations> =>
  createSelector(
    [getSportsbookConfirmationCombinations],
    (combinations): MultipleCombinations => groupCombinationsByMultiLineTypes(combinations),
  );

export const createGetConfirmationOneLineMultiple = (): Selector<
  ApplicationState,
  BettingState.Combination | undefined
> =>
  createSelector([getSportsbookConfirmationCombinations], (combinations = {}): BettingState.Combination | undefined => {
    const [firstValidAccumulator] = Object.values(combinations)
      .filter((combination): boolean => isMultiple(combination))
      .sort((combinationA, combinationB): number => combinationA.numLines - combinationB.numLines);

    if (!firstValidAccumulator?.id || !combinations?.[firstValidAccumulator?.id]) {
      return undefined;
    }

    return combinations[firstValidAccumulator.id];
  });

export const createGetConfirmationSelectionIdsSelector = (): Selector<ApplicationState, string[]> =>
  createShallowEqualSelector(
    [getSportsbookConfirmationLegs, getSportsbookConfirmationIgnoredBets],
    (legs, ignoredBets = []): string[] =>
      Object.values(legs)
        .filter(
          ({ legType, runners }): boolean =>
            COMBINABLE_LEG_TYPES_LIST.includes(legType) &&
            !ignoredBets.some((runner): boolean => runner.id === runners[0]),
        )
        .map(({ id }): string => id),
  );

export const getSingleCombinationIdsConfirm = createShallowEqualSelector(
  createSelector(
    [getSportsbookConfirmationLegs, getSportsbookConfirmationCombinations],
    (legs, combinations): string[] =>
      Object.values(combinations)
        .filter((combination): boolean => isSingleLike(combination, legs))
        .sort((combinationA, combinationB): number => combinationA.creationTimestamp - combinationB.creationTimestamp)
        .map(({ id }): string => id),
  ),
  (combinationIds: string[]): string[] => combinationIds,
);

export const createGetConfirmationCastGroupIdsSelector = (): Selector<ApplicationState, string[]> =>
  createShallowEqualSelector(
    createSelector(
      [
        getSportsbookConfirmation,
        (state): RunnersMetadata => getBettingResolvers(state.betslip?.group).getMetadata(state),
      ],
      (confirmationState, bettingMetadata): string[] =>
        generateCastGroupIds(groupCombinationsByMarketId(confirmationState), bettingMetadata),
    ),
    (combinationIds: string[]): string[] => combinationIds,
  );

export const createGetConfirmationCastRunnerIdsSelector = (): ParametricSelector<
  ApplicationState,
  string | undefined,
  string[]
> =>
  createShallowEqualSelector(
    createSelector(
      [
        getSportsbookConfirmationCombinations,
        getSportsbookConfirmationLegs,
        getSportsbookConfirmationRunners,
        (_: ApplicationState, combinationId?: string): string | undefined => combinationId,
      ],
      generateCastRunnersIds,
    ),
    (runnerIds: string[]): string[] => runnerIds,
  );

export const createGetConfirmationCastContextSelector = (): Selector<
  ApplicationState,
  BetslipCastContext | undefined
> =>
  createSelector([getSportsbookConfirmationCastContext], (castContext): BetslipCastContext | undefined => castContext);

export const createGetConfirmationCastBetSelector = (): ParametricSelector<
  ApplicationState,
  string,
  CastBet | undefined
> => {
  const getCastContext = createGetConfirmationCastContextSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();

  return createSelector(
    [
      getSportsbookConfirmation,
      (_: ApplicationState, castGroupId: string): string => castGroupId,
      getCastContext,
      (state: ApplicationState): RunnersMetadata => getBettingResolvers(state.betslip?.group).getMetadata(state),
      getUserDetailsSelector,
    ],
    (confirmationState, castGroupId, castContext, metadata, userDetails): CastBet | undefined => {
      if (!confirmationState) {
        return undefined;
      }

      const castGroup = groupCombinationsByMarketId(confirmationState)[castGroupId];

      if (!castGroup) {
        return undefined;
      }

      const context = castContext || { [castGroup.id]: castGroup.combinations[0].id };

      return buildCastBet(castGroup, context, confirmationState, metadata, <UserDetails>userDetails, false);
    },
  );
};

export const createGetConfirmationCastTypesSelector = (): ParametricSelector<
  ApplicationState,
  string,
  CastBetCastTypeItem[]
> =>
  createSelector(
    [getSportsbookConfirmation, (_: ApplicationState, castGroupId: string): string => castGroupId],
    (confirmationState, castGroupId): CastBetCastTypeItem[] => {
      if (!confirmationState) {
        return [];
      }

      const castGroup = groupCombinationsByMarketId(confirmationState)[castGroupId];

      if (!castGroup) {
        return [];
      }

      return generateCastTypes(confirmationState.legs, castGroup);
    },
  );
