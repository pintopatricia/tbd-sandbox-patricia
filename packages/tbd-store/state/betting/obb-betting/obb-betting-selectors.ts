import { ParametricSelector, createSelector } from "reselect";
import {
  ObbBettingState,
  ObbPotentialBetMap,
  ObbLegMap,
  ObbLegMetadata,
  ObbPotentialBet,
  ObbValidations,
  FailuresMap,
  ObbXOfNLegParams,
} from "./ObbBetting.types";
import {
  BETSLIP_LEVEL_NOTIFICATIONS_BLOCKLIST,
  BET_LEVEL_NOTIFICATIONS_BLOCKLIST,
  LEG_LEVEL_NOTIFICATIONS_BLOCKLIST,
} from "./obb-betting.constants";
import { ApplicationState } from "../../ApplicationState.types";
import { ObbLegTemplateIds } from "../../constants";
import { areObjectsDeepEqual } from "../../../helpers/obj-deep-equal-comparator";

export const getObbBettingState = (state: ApplicationState): ObbBettingState => state.betting.obbBetting;

export const getObbBettingLegs = (state: ApplicationState): ObbLegMap => state.betting.obbBetting.legs;

export const getObbBettingPotentialBets = (state: ApplicationState): ObbPotentialBetMap =>
  state.betting.obbBetting.potentialBets;

export const getObbBettingPrimeLegs = (state: ApplicationState): ObbLegMap =>
  Object.fromEntries(
    Object.entries(state.betting.obbBetting.legs ?? {}).filter(
      ([, leg]) => leg.templateId !== ObbLegTemplateIds.X_OF_N,
    ),
  );

export const createGetObbLegInBetslipByIdSelector = (): ParametricSelector<ApplicationState, string, boolean> =>
  createSelector([getObbBettingLegs, (_: ApplicationState, id: string) => id], (legs, id) => !!legs[id]);

export const createGetObbLegsUrnsByPotentialBetIdSelector = (): ParametricSelector<
  ApplicationState,
  string,
  string[]
> =>
  createSelector(
    [getObbBettingPotentialBets, (_: ApplicationState, potentialBetId: string) => potentialBetId],
    (potentialBets, potentialBetId) => {
      const potentialBet = potentialBets[potentialBetId];
      return potentialBet ? potentialBet.legs : [];
    },
  );

export const createGetXofNDataByPotentialBetIdSelector = (): ParametricSelector<
  ApplicationState,
  string[],
  Array<{ id: string; x: number }>
> =>
  createSelector(
    [
      getObbBettingPotentialBets,
      getObbBettingLegs,
      (_: ApplicationState, potentialBetIds: string[]) => potentialBetIds,
    ],
    (potentialBets, legs, potentialBetIds) => {
      const result = potentialBetIds.reduce<Array<{ id: string; x: number }>>((acc, potentialBetId) => {
        const potentialBet = potentialBets[potentialBetId];
        if (!potentialBet || !potentialBet.quote) return acc;

        potentialBet.legs.forEach((legId) => {
          const leg = legs[legId];
          if (leg && "x" in leg.params) {
            acc.push({
              id: potentialBetId,
              x: leg.params.x,
            });
          }
        });

        return acc;
      }, []);

      return result.sort((a, b) => a.x - b.x);
    },
  );

export const getObbBettingValidations = (state: ApplicationState): ObbValidations =>
  state.betting.obbBetting.validations;

export const getObbBetslipFailure = (state: ApplicationState): FailuresMap["betslip"] =>
  state.betting.obbBetting.failures.betslip &&
  !BETSLIP_LEVEL_NOTIFICATIONS_BLOCKLIST.includes(state.betting.obbBetting.failures.betslip)
    ? state.betting.obbBetting.failures.betslip
    : null;

export const getObbPotentialBetFailures = (state: ApplicationState): FailuresMap["potentialBets"] =>
  Object.fromEntries(
    Object.entries(state.betting.obbBetting.failures.potentialBets).filter(
      ([, failure]) => !BET_LEVEL_NOTIFICATIONS_BLOCKLIST.includes(failure),
    ),
  );

export const getObbLegFailures = (state: ApplicationState): FailuresMap["legs"] =>
  Object.fromEntries(
    Object.entries(state.betting.obbBetting.failures.legs).filter(
      ([, failure]) => !LEG_LEVEL_NOTIFICATIONS_BLOCKLIST.includes(failure),
    ),
  );

export const getObbCombinedLegFailures = (state: ApplicationState): FailuresMap["legs"] =>
  Object.fromEntries(
    Object.entries(state.betting.obbBetting.failures.legs).filter(
      ([legId, failure]) =>
        !LEG_LEVEL_NOTIFICATIONS_BLOCKLIST.includes(failure) &&
        "baseBets" in state.betting.obbBetting.legs[legId].params,
    ),
  );

export const getObbCombinedPotentialBetFailures = (state: ApplicationState): FailuresMap["potentialBets"] =>
  Object.fromEntries(
    Object.entries(state.betting.obbBetting.failures.potentialBets).filter(
      ([potentialBetId, failure]) =>
        !BET_LEVEL_NOTIFICATIONS_BLOCKLIST.includes(failure) &&
        state.betting.obbBetting.potentialBets[potentialBetId].legs.some(
          (leg) => "baseBets" in state.betting.obbBetting.legs[leg].params,
        ),
    ),
  );

export const createGetObbLegsMetadataByPotentialBetIdSelector = (): ParametricSelector<
  ApplicationState,
  string,
  Record<string, ObbLegMetadata & { eventName: string }>
> =>
  createSelector(
    [getObbBettingPotentialBets, getObbBettingLegs, (_: ApplicationState, potentialBetId: string) => potentialBetId],
    (potentialBets, legs, potentialBetId) => {
      const potentialBetLegs = potentialBets[potentialBetId] ? potentialBets[potentialBetId].legs : [];

      return potentialBetLegs.reduce<Record<string, ObbLegMetadata & { eventName: string }>>((acc, leg) => {
        const { metadata: legMetadata, event } = legs[leg];

        acc[leg] = { ...legMetadata, eventName: event.name };
        return acc;
      }, {});
    },
  );

export const createGetObbCombinedLegsMetadataByPotentialBetIdSelector = (): ParametricSelector<
  ApplicationState,
  string,
  Record<string, ObbLegMetadata & { eventName: string }>
> =>
  createSelector(
    [getObbBettingPotentialBets, getObbBettingLegs, (_: ApplicationState, potentialBetId: string) => potentialBetId],
    (potentialBets, legs, potentialBetId) => {
      const potentialBetLegs = potentialBets[potentialBetId] ? potentialBets[potentialBetId].legs : [];

      return potentialBetLegs.reduce<Record<string, ObbLegMetadata & { eventName: string }>>((acc, potentialBetLeg) => {
        if ("baseBets" in legs[potentialBetLeg].params) {
          const { baseBets } = legs[potentialBetLeg].params as ObbXOfNLegParams;
          baseBets.forEach((baseBet) => {
            const stateLeg = Object.entries(legs).find(([, leg]) =>
              areObjectsDeepEqual({ templateId: leg.templateId, params: leg.params }, baseBet),
            );

            if (stateLeg) {
              const [legId, leg] = stateLeg;
              const { metadata: legMetadata, event } = leg;
              acc[legId] = { ...legMetadata, eventName: event.name };
            }
          });
        }
        return acc;
      }, {});
    },
  );

export const createGetObbPotentialBetsByIdSelector = (): ParametricSelector<
  ApplicationState,
  string,
  ObbPotentialBet
> =>
  createSelector(
    [getObbBettingPotentialBets, (_: ApplicationState, id: string) => id],
    (potentialBets, potentialBetId) => potentialBets[potentialBetId],
  );
