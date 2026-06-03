import { Dispatch, Middleware } from "redux";
import { getEventRegistry } from "eventemitter3-singleton";
import {
  addLeg,
  clearBonusWallets,
  clearPlaceFailures,
  generateLegId,
  generateRunnerId,
  incrementStake,
  init,
  LEG_TYPES,
  removeLeg,
  updateAccaInsurance,
  updateState,
  updateBonusUse,
  updateBonusWallets,
  updateCombinationReview,
  updateCombinations,
  updateCombinationsWithPlace,
  updateEachWay,
  updateGroupOptions,
  updateOrder,
  updatePlaceFailures,
  updatePriceBoost,
  updateSP,
  updateStake,
  VALIDATION_TYPES,
  Validations,
  BettingState,
  Updaters,
  updateMoneyBack,
  PlaceResponse,
  PlaceRequest,
  UPDATE_ACTIONS,
} from "@ppb/betslip-core";
import { codecs } from "@ppb/tbd-urn-codecs";

import {
  BETTING__OBB_CLEAR_ACTION,
  BETTING__SBK_ACCA_INSURANCE_TOGGLE,
  BETTING__SBK_GHOST_LEG_TOGGLE,
  BETTING__SBK_MONEY_BACK_TOGGLE,
  BETTING__SBK_ADD_SELECTION_TAGGING,
  BETTING__SBK_ADD_SELECTIONS,
  BETTING__SBK_ADD_SELECTIONS_SUCCESS,
  BETTING__SBK_BONUS_TOGGLE_ACTION,
  BETTING__SBK_CLEAR_ACTION,
  BETTING__SBK_COMBINATIONS_OUTDATED,
  BETTING__SBK_EACH_WAY_TOGGLE,
  BETTING__SBK_INCREMENT_STAKE_ACTION,
  BETTING__SBK_INVALID_LEGS_AMOUNT,
  BETTING__SBK_LOAD_STORAGE_SUCCESS,
  BETTING__SBK_ORDER_CHANGE,
  BETTING__SBK_PLACE_FAILED_UPDATE,
  BETTING__SBK_PRICE_BOOST_TOGGLE,
  BETTING__SBK_REMOVE_LEG_ACTION,
  BETTING__SBK_REMOVE_BOOSTED_COMBINATION_ACTION,
  BETTING__SBK_STARTING_PRICE_TOGGLE,
  BETTING__SBK_STATE_UPDATE,
  BETTING__SBK_SWITCH_GROUP,
  BETTING__SBK_TOGGLE_LEG_ACTION,
  BETTING__SBK_UPDATE_COMBINATION_STAKE_ACTION,
  BETTING__SBK_VALIDATE_STAKE,
  BETTING__SPORTSBOOK_FREE_BETS_WALLETS_APPLY_ACTION,
  UI__MARKET_SBK_BET_BUTTON_CLICK,
  BettingSportsbookAccaInsuranceToggleAction,
  BettingSportsbookMoneyBackToggleAction,
  BettingSportsbookAddSelectionAction,
  BettingSportsbookAddSelectionActionSuccess,
  BettingSportsbookAddSelectionTaggingAction,
  BettingSportsbookBonusToggleAction,
  BettingSportsbookClearAction,
  BettingSportsbookCombinationsOutdatedAction,
  BettingSportsbookEachWayToggleAction,
  BettingSportsbookEnsureSelectionDataSuccess,
  BettingSportsbookIncrementStakeAction,
  BettingSportsbookInvalidLegsAmountAction,
  BettingSportsbookLoadStorageActionSuccess,
  BettingSportsbookOrderChangeAction,
  BettingSportsbookPlaceFailedUpdateAction,
  BettingSportsbookPriceBoostToggleAction,
  BettingSportsbookRemoveLegAction,
  BettingSportsbookSPToggleAction,
  BettingSportsbookStateUpdateAction,
  BettingSportsbookSwitchGroup,
  BettingSportsbookToggleLegAction,
  BettingSportsbookUpdateCombinationStakeAction,
  BettingSportsbookValidateStake,
  MarketSportsbookBetButtonClickAction,
  BettingSportsbookApplyFreeBetsWalletsAction,
  BETTING__OBB_SBK_KEEP_ACTION,
  BETTING__OBB_SBK_CLEAR_ACTION,
  BETTING__SPORTSBOOK_REMOVE_ALL_FREE_BETS_WALLETS_ACTION,
  BETTING__SPORTSBOOK_REMOVE_ALL_COMBINATION_FREE_BETS_WALLETS_ACTION,
  BettingSportsbookRemoveAllWalletsAction,
  BettingSportsbookRemoveAllCombinationWalletsAction,
  BettingSportsbookRemoveBoostedCombinationAction,
  BetslipEvents,
  BETTING__SBK_TOGGLE_ONE_LINE_LEG_ACTION,
  BettingSportsbookToggleOneLineLegAction,
  BettingSportsbookGhostLegToggleAction,
} from "../actions/betting";
import {
  BetslipCollapseToggleAction,
  BetslipSportsbookReAddSelectionsClickAction,
  FetchCombinationsListSuccessAction,
  NETWORK__FETCH_COMBINATIONS_LIST_SUCCESS,
  NETWORK__PLACE_SBK_BET_FAILURE,
  NETWORK__PLACE_SBK_BET_IN_PROGRESS,
  NETWORK__PLACE_SBK_BET_SUCCESS,
  NETWORK__SBK_COMBINATIONS_UPDATE_SUCCESS,
  PlaceSportsbookBetFailureAction,
  PlaceSportsbookBetInProgressAction,
  PlaceSportsbookBetSuccessAction,
  SportsbookCombinationsUpdateSuccessAction,
  UI__BETSLIP_SBK_RE_ADD_SELECTIONS_CLICK,
  UI__BETSLIP_SET_COLLAPSE_ACTION,
  UI__BETSLIP_SET_LAST_SUCCESSFUL_STAKE,
  BetslipSetLastSuccessfulStakeAction,
} from "../actions/betslip";
import {
  createGetGreatestOddCombinationSelector,
  createQuickBetslipBetPickerSelector,
  getBettingResolvers,
  getSportsbookBettingCombinations,
  pickGreatestOddCombination,
} from "../state/betting/sportsbook-betting/sportsbook-betting-selectors";
import {
  FetchAppContextAuthFailureAction,
  FetchAppContextSuccessAction,
  InvalidSessionAction,
  NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE,
  NETWORK__FETCH_APP_CONTEXT_SUCCESS,
  NETWORK__INVALID_SESSION,
} from "../actions/app-context";
import { SBK_MAX_LEGS } from "../config/common-config";
import { getSportsbookReport } from "../state/betslip/betslip-card-selectors";
import { ConfirmationAction, UI__ACTION_CONFIRMATION } from "../actions/confirmation";
import { findSingleCombinationFromLegId, getSimpleSelectionLegs } from "../helpers/sportsbook-betting";
import { BettingSbkModuleLoadedAction, MODULES__SBK_BETTING_LOADED } from "../actions/modules";
import { SwitchProductPreferenceAction } from "../actions/preferences";
import { BettingGroup, SportsbookBettingState } from "../state/betting/sportsbook-betting/SportsbookBetting.types";
import {
  MyBetsSportsbookAddPreviousSelectionsClickAction,
  UI__MY_BETS_SBK_ADD_PREVIOUS_SELECTIONS_CLICK,
} from "../actions/my-bets";
import { ApplicationState, createGetThrottleSelector } from "../state";
import { EventType } from "../state/constants";
import { Limit, productConfiguration } from "../config";
import { createGetPopularCombination } from "../state/betslip/betslip-popular-bets-selectors";
import { getBasicSpan } from "../helpers/telemetry/betting-telemetry";
import { SpanStatusCode, trace } from "@opentelemetry/api";
import { createGetExperimentSelector } from "../state/entities/experiments/experiments-selectors";

type ActionTypes =
  | BetslipSportsbookReAddSelectionsClickAction
  | BettingSbkModuleLoadedAction
  | BettingSportsbookAccaInsuranceToggleAction
  | BettingSportsbookGhostLegToggleAction
  | BettingSportsbookMoneyBackToggleAction
  | BettingSportsbookAddSelectionAction
  | BettingSportsbookAddSelectionActionSuccess
  | BettingSportsbookBonusToggleAction
  | BettingSportsbookClearAction
  | BettingSportsbookEachWayToggleAction
  | BettingSportsbookEnsureSelectionDataSuccess
  | BettingSportsbookIncrementStakeAction
  | BettingSportsbookLoadStorageActionSuccess
  | BettingSportsbookOrderChangeAction
  | BettingSportsbookPriceBoostToggleAction
  | BettingSportsbookRemoveLegAction
  | BettingSportsbookRemoveBoostedCombinationAction
  | BettingSportsbookSPToggleAction
  | BettingSportsbookStateUpdateAction
  | BettingSportsbookSwitchGroup
  | BettingSportsbookToggleOneLineLegAction
  | BettingSportsbookToggleLegAction
  | BettingSportsbookUpdateCombinationStakeAction
  | BettingSportsbookApplyFreeBetsWalletsAction
  | BettingSportsbookValidateStake
  | FetchAppContextAuthFailureAction
  | FetchAppContextSuccessAction
  | FetchCombinationsListSuccessAction
  | InvalidSessionAction
  | MarketSportsbookBetButtonClickAction
  | MyBetsSportsbookAddPreviousSelectionsClickAction
  | PlaceSportsbookBetFailureAction
  | PlaceSportsbookBetInProgressAction
  | PlaceSportsbookBetSuccessAction
  | SportsbookCombinationsUpdateSuccessAction
  | SwitchProductPreferenceAction
  | BettingSportsbookRemoveAllWalletsAction
  | BettingSportsbookRemoveAllCombinationWalletsAction
  | BetslipCollapseToggleAction;

type ValidationHandler = (
  state: SportsbookBettingState,
  validation: Validations.CombinationsValidations,
) => SportsbookBettingState;
type Validators = {
  [type: string]: ValidationHandler;
};
type BettingStateTransformer = (state: SportsbookBettingState) => SportsbookBettingState;
type BettingStatePipeline = BettingStateTransformer[];

const { emit } = getEventRegistry<BetslipEvents>();
const getThrottle = createGetThrottleSelector();
const transactionalTracer = trace.getTracer("[TransactionalSaga]");
const getExperiment = createGetExperimentSelector();
const getQuickBet = createQuickBetslipBetPickerSelector();
const getGreatestOddCombination = createGetGreatestOddCombinationSelector();
const GROUP_RESET_PIPELINE: BettingStatePipeline = [
  (state) => clearBonusWallets(state),
  (state) => (state.isBonusSelected ? updateBonusUse(state, { isBonusSelected: false }) : state),
  (state) => clearPlaceFailures(state),
];

function getValidators(combinationId: string): Validators {
  const { BELOW_MIN_STAKE, ABOVE_MAX_STAKE, INCREMENT_OUT_OF_RANGE } = VALIDATION_TYPES;

  return {
    [BELOW_MIN_STAKE]: (bettingState: SportsbookBettingState, validation: Validations.CombinationsValidations) => {
      const castValidation = validation as Validations.BelowMinStakeValidation;

      return updateStake(bettingState, {
        combinationId,
        stake: castValidation.data.suggestedStake ?? 0,
      });
    },
    [ABOVE_MAX_STAKE]: (bettingState: SportsbookBettingState, validation: Validations.CombinationsValidations) => {
      const castValidation = validation as Validations.AboveMaxStakeValidation;

      return updateStake(bettingState, {
        combinationId,
        stake: castValidation.data.suggestedStake ?? 0,
      });
    },
    [INCREMENT_OUT_OF_RANGE]: (
      bettingState: SportsbookBettingState,
      validation: Validations.CombinationsValidations,
    ) => {
      const castValidation = validation as Validations.IncrementOutOfRangeValidation;

      return updateStake(bettingState, {
        combinationId,
        stake: castValidation.data.closest,
      });
    },
  };
}

/**
 * Whether the number of selections has reached the maximum allowed on betslip
 */
function hasReachedLimit(sportsbookBetting: SportsbookBettingState, legsToAdd: number): boolean {
  const simpleLegs = getSimpleSelectionLegs(sportsbookBetting.legs);
  const numberOfLegs = Object.keys(simpleLegs).length;

  return numberOfLegs + legsToAdd > SBK_MAX_LEGS;
}

function handleAutoCollapse(
  dispatch: Dispatch<BetslipCollapseToggleAction>,
  sportsbookBetting: SportsbookBettingState,
  minimizeBetslip: boolean,
): void {
  const simpleLegs = getSimpleSelectionLegs(sportsbookBetting.legs);
  const numberOfLegs = Object.keys(simpleLegs).length;

  if (minimizeBetslip) {
    dispatch<BetslipCollapseToggleAction>({
      type: UI__BETSLIP_SET_COLLAPSE_ACTION,
      payload: {
        collapse: true,
      },
    });
  } else if (numberOfLegs === 1) {
    dispatch<BetslipCollapseToggleAction>({
      type: UI__BETSLIP_SET_COLLAPSE_ACTION,
      payload: {
        collapse: false,
      },
    });
  } else if (numberOfLegs === 2) {
    dispatch<BetslipCollapseToggleAction>({
      type: UI__BETSLIP_SET_COLLAPSE_ACTION,
      payload: {
        collapse: true,
      },
    });
  }
}

function updateMaxPayoutGroupOptions(
  dispatch: Dispatch<BettingSportsbookStateUpdateAction>,
  sportsbookBetting: SportsbookBettingState,
  currentGroup: BettingGroup,
  limit: Limit,
): void {
  dispatch<BettingSportsbookStateUpdateAction>({
    type: BETTING__SBK_STATE_UPDATE,
    payload: {
      state: updateGroupOptions(sportsbookBetting, {
        maxPayoutLimits: { warning: limit.softCap, error: limit.hardCap },
      }),
      group: currentGroup,
    },
  });
}

function emitAllRunnersRemovedUpdate(sportsbookBetting: SportsbookBettingState) {
  const legState = sportsbookBetting.legs;

  Object.values(legState).forEach((leg) => {
    leg.runners?.forEach((runnerId) => {
      const { marketId, selectionId } = sportsbookBetting.runners[runnerId];
      emit("@@BETSLIP/SBK_RUNNER_REMOVED", { marketId, selectionId });
    });
  });
}

function isQuickBetslipExperimentActive(state: ApplicationState): boolean {
  const experiments = state.entities?.experiments;

  if (!experiments) {
    return false;
  }

  return getExperiment(experiments, "quick-betslip")?.variant === "quick-betslip-variant-a";
}

function createCombinationResetPipeline(combinationId: string): BettingStatePipeline {
  return [
    (state) => {
      const combination = state.combinations[combinationId];

      if (combination.stake === undefined) {
        return state;
      }

      return updateStake(state, { combinationId, stake: undefined });
    },
    (state) => {
      const combination = state.combinations[combinationId];

      if (!combination.isEachWaySelected) {
        return state;
      }

      return updateEachWay(state, { combinationId, isEachWaySelected: false });
    },
    (state) => {
      const combination = state.combinations[combinationId];

      if (!combination.isSPSelected) {
        return state;
      }

      return updateSP(state, { combinationId, isSPSelected: false });
    },
    (state) => {
      const combination = state.combinations[combinationId];

      if (!combination.isPriceBoostSelected) {
        return state;
      }

      return updatePriceBoost(state, {
        combinationId,
        selectedTokenId: undefined,
        isPriceBoostSelected: false,
      });
    },
    (state) => {
      const combination = state.combinations[combinationId];

      if (!combination.isAccaInsuranceSelected) {
        return state;
      }

      return updateAccaInsurance(state, {
        combinationId,
        selectedTokenId: undefined,
        isAccaInsuranceSelected: false,
      });
    },
    (state) => {
      const combination = state.combinations[combinationId];

      if (!combination.isMoneyBackSelected) {
        return state;
      }

      return updateMoneyBack(state, {
        combinationId,
        selectedTokenId: undefined,
        isMoneyBackSelected: false,
      });
    },
  ];
}

function resetState(bettingState: SportsbookBettingState): SportsbookBettingState {
  const combinationResetState = Object.keys(bettingState.combinations).reduce(
    (lastState, combinationId) =>
      createCombinationResetPipeline(combinationId).reduce((state, step) => step(state), lastState),
    bettingState,
  );

  return GROUP_RESET_PIPELINE.reduce((state, step) => step(state), combinationResetState);
}

function resetStateWithGreatestOddStake(bettingState: SportsbookBettingState): SportsbookBettingState {
  const greatestOddCombination = pickGreatestOddCombination(bettingState.combinations, bettingState.legs);
  const carryStake = greatestOddCombination?.stake ?? undefined;
  const resetBettingState = resetState(bettingState);

  if (!greatestOddCombination || !carryStake) {
    return resetBettingState;
  }

  return updateStake(resetBettingState, {
    combinationId: greatestOddCombination.id,
    stake: carryStake,
  });
}

function resetStake(
  newState: SportsbookBettingState,
  oldGreatestCombination?: BettingState.Combination,
): SportsbookBettingState {
  const greatest = pickGreatestOddCombination(newState.combinations, newState.legs);

  if (
    !greatest ||
    !oldGreatestCombination ||
    greatest.id === oldGreatestCombination.id ||
    oldGreatestCombination.stake === undefined
  ) {
    return newState;
  }

  const staleCombinationIds = Object.values(newState.combinations)
    .filter((combination) => combination.id !== greatest.id && combination.stake !== undefined)
    .map((combination) => combination.id);

  const nextState = staleCombinationIds.reduce(
    (acc, combinationId) => updateStake(acc, { combinationId, stake: undefined }),
    newState,
  );

  if (!greatest.stake) {
    return updateStake(nextState, { combinationId: greatest.id, stake: oldGreatestCombination.stake });
  }

  return nextState;
}

export const sportsbookBettingMiddleware: Middleware<Record<string, never>, ApplicationState> =
  ({ dispatch, getState }) =>
  (next) =>
  (action: ActionTypes) => {
    const state = getState();
    const {
      betting: { sportsbookBetting, obbBetting },
      betslip: { group: currentGroup } = { group: "REAL" },
      entities,
    } = state;
    const result = next(action);
    const userDetails = state.entities.userdetails;
    const limit =
      "currencyCode" in userDetails ? productConfiguration.getPayoutLimit(userDetails.currencyCode) : undefined;

    switch (action.type) {
      case BETTING__SBK_STATE_UPDATE: {
        // Compare old state with new state to determine if reset is needed.
        // Picks the last greatest-odd combination stake from the old state, as the one eligible for stake carryover.
        // Clear all stakes and re-applies to a new greatest-odd combination if the greatest-odd combination has changed.
        // This ensures the quick betslip view variant is maintained consistent.
        // Skip self intercepted dispatches to avoid infinite loops
        if (
          action.payload.intercepted ||
          !state.betslip?.isCollapsed ||
          !isQuickBetslipExperimentActive(state) ||
          getQuickBet(state)?.status !== "valid"
        ) {
          break;
        }

        const nextBettingState = action.payload.state;
        const previousGreatestOddCombination = pickGreatestOddCombination(
          sportsbookBetting.combinations,
          sportsbookBetting.legs,
        );
        const resetBettingState = resetStake(nextBettingState, previousGreatestOddCombination);

        // No updates performed, skip dispatch
        if (resetBettingState === nextBettingState) {
          break;
        }

        dispatch<BettingSportsbookStateUpdateAction>({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: resetBettingState,
            group: action.payload.group,
            intercepted: true,
          },
        });

        break;
      }

      case UI__BETSLIP_SET_COLLAPSE_ACTION: {
        const wasCollapsed = state.betslip?.isCollapsed ?? false;
        const { collapse } = action.payload;

        if (!isQuickBetslipExperimentActive(state) || getQuickBet(state)?.status !== "valid") {
          break;
        }

        // Only the greatest-odd combination may carry a stake.
        // Any stake the user typed in the normal betslip view is carried over onto that combination.
        // Normal -> Quick transition
        if (!wasCollapsed && collapse) {
          const cleanState = resetStateWithGreatestOddStake(sportsbookBetting);

          dispatch<BettingSportsbookStateUpdateAction>({
            type: BETTING__SBK_STATE_UPDATE,
            payload: {
              state: cleanState,
              group: currentGroup,
            },
          });
        }

        break;
      }

      case BETTING__SBK_SWITCH_GROUP: {
        const { urn, group } = action.payload;

        const resolvers = getBettingResolvers(group);
        const runnerIds = resolvers.getMarketRunnerIdAssociation(state.entities, urn);
        const payload = resolvers.getAddLegPayload(state.entities, urn);
        const { brandSettings } = state.entities;
        const dailyPayoutLimitThrottle = getThrottle(state.entities.throttles, "DAILY_PAYOUT_LIMIT");

        if (!runnerIds || !payload) {
          break;
        }

        emitAllRunnersRemovedUpdate(sportsbookBetting);

        const initState =
          dailyPayoutLimitThrottle?.isActive && limit
            ? init({ maxPayoutLimits: { warning: limit.softCap, error: limit.hardCap } })
            : init();

        const newBettingState = addLeg(initState, payload);

        handleAutoCollapse(dispatch, newBettingState, brandSettings?.MINIMIZE_BETSLIP ?? false);

        dispatch<BettingSportsbookStateUpdateAction>({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: newBettingState,
            group,
          },
        });

        break;
      }

      case BETTING__SBK_TOGGLE_ONE_LINE_LEG_ACTION: {
        const { urn, group, marketUrns, marketIds, selectionIds } = action.payload;
        if (!selectionIds?.length) {
          break;
        }

        const isSwitchingBetslipType = Object.values(obbBetting?.legs).length;
        if (isSwitchingBetslipType && urn) {
          dispatch<ConfirmationAction>({
            type: UI__ACTION_CONFIRMATION,
            payload: {
              id: "BETTING_BETSLIP_TYPE_SWITCH",
              cardUrn: urn,
              group,
              refuseActions: [],
              acceptActions: [
                {
                  type: BETTING__OBB_CLEAR_ACTION,
                },
                {
                  type: BETTING__SBK_TOGGLE_ONE_LINE_LEG_ACTION,
                  payload: { marketUrns, marketIds, selectionIds, group, urn },
                },
              ],
            },
          });

          break;
        }

        const isSwitchingGroup = group !== currentGroup && Object.values(sportsbookBetting.legs).length;
        if (isSwitchingGroup) {
          dispatch<ConfirmationAction>({
            type: UI__ACTION_CONFIRMATION,
            payload: {
              id: "BETTING_GROUP_SWITCH",
              refuseActions: [],
              acceptActions: [
                {
                  type: BETTING__SBK_CLEAR_ACTION,
                },
                {
                  type: BETTING__SBK_TOGGLE_ONE_LINE_LEG_ACTION,
                  payload: { marketUrns, marketIds, selectionIds, group, urn },
                },
              ],
            },
          });

          break;
        }

        const resolvers = getBettingResolvers(group);
        const legType = LEG_TYPES.ONE_LINE_BET;
        const { brandSettings } = state.entities;
        const runnerTuples: { [key: string]: string[] } = {};
        const runners: { [key: string]: BettingState.Runner[] } = {};
        const legIds: string[] = [];

        marketIds.forEach((marketId) => {
          const marketRunnerTuple: string[] = [];
          selectionIds.forEach((selectionId) => {
            marketRunnerTuple.push(generateRunnerId({ marketId, selectionId }));
          });
          runnerTuples[marketId] = marketRunnerTuple;
          legIds.push(generateLegId(legType, runnerTuples[marketId]));
          runners[marketId] = selectionIds.map((selectionId) => ({
            marketId,
            selectionId,
          }));
        });

        const isLegsInState = legIds.some((legId) => !!sportsbookBetting.legs[legId]);

        let newBettingState = clearPlaceFailures(sportsbookBetting);

        if (isLegsInState) {
          legIds
            .filter((legId) => !!sportsbookBetting.legs[legId])
            .forEach((legId) => {
              newBettingState = removeLeg(newBettingState, { legId });
            });

          const { legs, isBonusSelected } = newBettingState;
          if (isBonusSelected && !Object.entries(legs).length) {
            newBettingState = updateBonusUse(newBettingState, {
              isBonusSelected: false,
            });
          }
        }
        // Check for betslip limit before proceeding
        if (hasReachedLimit(sportsbookBetting, legIds.filter((legId) => !!sportsbookBetting.legs[legId]).length)) {
          dispatch<BettingSportsbookInvalidLegsAmountAction>({
            type: BETTING__SBK_INVALID_LEGS_AMOUNT,
            payload: { limit: SBK_MAX_LEGS },
          });

          break;
        }

        const payloads: (Updaters.AddLegPayload | undefined)[] = [];
        marketIds.forEach((marketId) => {
          payloads.push(resolvers.getAddOneLinePayload(runners[marketId], legType));
        });

        if (payloads.every((payload) => !payload)) {
          break;
        }

        payloads
          .filter((payload) => Boolean(payload))
          .forEach((payload) => {
            if (payload) {
              newBettingState = addLeg(newBettingState, payload);
            }
          });

        dispatch<BettingSportsbookStateUpdateAction>({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: newBettingState,
            group,
          },
        });

        dispatch<BettingSportsbookCombinationsOutdatedAction>({
          type: BETTING__SBK_COMBINATIONS_OUTDATED,
        });

        handleAutoCollapse(dispatch, newBettingState, brandSettings?.MINIMIZE_BETSLIP ?? false);
        break;
      }

      case BETTING__SBK_TOGGLE_LEG_ACTION: {
        const { urn, group, metadata } = action.payload;
        const isSwitchingBetslipType = Object.values(obbBetting?.legs).length;

        if (isSwitchingBetslipType && metadata?.cardUrn) {
          dispatch<ConfirmationAction>({
            type: UI__ACTION_CONFIRMATION,
            payload: {
              id: "BETTING_BETSLIP_TYPE_SWITCH",
              cardUrn: metadata.cardUrn,
              runnerUrn: urn,
              group,
              refuseActions: [
                {
                  type: BETTING__OBB_SBK_KEEP_ACTION,
                  payload: { cardUrn: metadata.cardUrn, clickedOutside: false, runnerUrn: urn, group },
                },
              ],
              acceptActions: [
                {
                  type: BETTING__OBB_CLEAR_ACTION,
                },
                {
                  type: BETTING__OBB_SBK_CLEAR_ACTION,
                  payload: { cardUrn: metadata.cardUrn, runnerUrn: urn, group },
                },
                {
                  type: BETTING__SBK_SWITCH_GROUP,
                  payload: { urn, group },
                },
              ],
            },
          });

          break;
        }

        const isSwitchingGroup = group !== currentGroup && Object.values(sportsbookBetting.legs).length;

        if (isSwitchingGroup) {
          dispatch<ConfirmationAction>({
            type: UI__ACTION_CONFIRMATION,
            payload: {
              id: "BETTING_GROUP_SWITCH",
              refuseActions: [],
              acceptActions: [
                {
                  type: BETTING__SBK_SWITCH_GROUP,
                  payload: { urn, group },
                },
              ],
            },
          });

          break;
        }

        const resolvers = getBettingResolvers(group);
        const runnerIds = resolvers.getMarketRunnerIdAssociation(state.entities, urn);

        if (!runnerIds) {
          break;
        }

        const legType = EventType.LOTTERIES === runnerIds.sportId ? LEG_TYPES.ONE_LINE_BET : LEG_TYPES.SIMPLE_SELECTION;
        const { marketId, selectionId } = runnerIds;
        const { brandSettings } = state.entities;
        const runnerTuple = [generateRunnerId({ marketId, selectionId })];
        const legId = generateLegId(legType, runnerTuple);
        const isLegInState = !!sportsbookBetting.legs[legId];

        let newBettingState = clearPlaceFailures(sportsbookBetting);

        if (isLegInState) {
          newBettingState = removeLeg(newBettingState, { legId });

          emit("@@BETSLIP/SBK_RUNNER_REMOVED", { marketId, selectionId });

          const { legs, isBonusSelected } = newBettingState;
          if (isBonusSelected && !Object.entries(legs).length) {
            newBettingState = updateBonusUse(newBettingState, {
              isBonusSelected: false,
            });
          }
        } else {
          if (hasReachedLimit(sportsbookBetting, 1)) {
            dispatch<BettingSportsbookInvalidLegsAmountAction>({
              type: BETTING__SBK_INVALID_LEGS_AMOUNT,
              payload: { limit: SBK_MAX_LEGS },
            });

            break;
          }

          const payload = resolvers.getAddLegPayload(state.entities, urn);

          if (!payload) {
            break;
          }

          newBettingState = addLeg(newBettingState, payload);

          emit("@@BETSLIP/SBK_RUNNER_ADDED", { marketId, selectionId });
        }

        dispatch<BettingSportsbookStateUpdateAction>({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: newBettingState,
            group,
          },
        });

        dispatch<BettingSportsbookCombinationsOutdatedAction>({
          type: BETTING__SBK_COMBINATIONS_OUTDATED,
        });

        handleAutoCollapse(dispatch, newBettingState, brandSettings?.MINIMIZE_BETSLIP ?? false);
        break;
      }

      case UI__BETSLIP_SBK_RE_ADD_SELECTIONS_CLICK: {
        const report = getSportsbookReport(state);

        if (!report) {
          break;
        }

        const getPopularCombination = createGetPopularCombination();
        const popularCombination = getPopularCombination(
          state,
          Object.values(report.result.runners).map((runner) => ({
            urn: codecs.sportsbookRunner.encode(runner.marketId, runner.selectionId).uid,
          })),
        );

        const resolvers = getBettingResolvers(currentGroup);
        const groupedSelections = resolvers.getAddSelectionsPayload(entities, report.result);

        Object.values(groupedSelections).forEach((group) => {
          const { selections } = group;

          if (selections.length) {
            dispatch<BettingSportsbookAddSelectionAction>({
              type: BETTING__SBK_ADD_SELECTIONS,
              payload: {
                selections,
                group: currentGroup,
                bettingOpportunityId: popularCombination?.bettingOpportunityId,
                bettingOpportunityType: popularCombination?.bettingOpportunityType,
              },
            });
          }
        });

        break;
      }

      case UI__MY_BETS_SBK_ADD_PREVIOUS_SELECTIONS_CLICK: {
        dispatch<BettingSportsbookAddSelectionAction>({
          type: BETTING__SBK_ADD_SELECTIONS,
          payload: { ...action.payload },
        });

        break;
      }

      case UI__MARKET_SBK_BET_BUTTON_CLICK: {
        dispatch<BettingSportsbookAddSelectionTaggingAction>({
          type: BETTING__SBK_ADD_SELECTION_TAGGING,
          payload: { ...action.payload },
        });

        break;
      }

      case BETTING__SBK_ADD_SELECTIONS: {
        const { selections } = action.payload;

        if (hasReachedLimit(sportsbookBetting, selections.length)) {
          dispatch<BettingSportsbookInvalidLegsAmountAction>({
            type: BETTING__SBK_INVALID_LEGS_AMOUNT,
            payload: { limit: SBK_MAX_LEGS },
          });
        }

        break;
      }

      case BETTING__SBK_ADD_SELECTIONS_SUCCESS: {
        const { selections, group, deeplink, options } = action.payload;
        const resolvers = getBettingResolvers(currentGroup);

        const bettingState = selections.reduce((betting, { runnerUrn }) => {
          const payload = resolvers.getAddLegPayload(state.entities, runnerUrn, options);

          if (!payload) {
            return betting;
          }

          payload.runners.forEach(({ marketId, selectionId }) => {
            emit("@@BETSLIP/SBK_RUNNER_ADDED", { marketId, selectionId });
          });

          return addLeg(betting, payload);
        }, clearPlaceFailures(sportsbookBetting));

        if (deeplink) {
          selections.forEach((selection) => {
            dispatch<BettingSportsbookAddSelectionTaggingAction>({
              type: BETTING__SBK_ADD_SELECTION_TAGGING,
              payload: {
                urn: selection.runnerUrn,
                betOriginURL: "",
                cardUrn: "",
                deeplink,
                group,
                uniqueId: "",
              },
            });
          });
        }

        dispatch<BettingSportsbookStateUpdateAction>({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: bettingState,
            group,
          },
        });

        dispatch<BettingSportsbookCombinationsOutdatedAction>({
          type: BETTING__SBK_COMBINATIONS_OUTDATED,
        });

        break;
      }

      case BETTING__SBK_LOAD_STORAGE_SUCCESS: {
        const { storageBettingState, betslip } = action.payload;
        let nextBettingState = storageBettingState;

        if (betslip.isCollapsed && isQuickBetslipExperimentActive(state) && getQuickBet(state)?.status === "valid") {
          nextBettingState = resetStateWithGreatestOddStake(storageBettingState);
        }

        dispatch<BettingSportsbookStateUpdateAction>({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: nextBettingState,
            group: betslip.group,
          },
        });

        dispatch<BettingSportsbookCombinationsOutdatedAction>({
          type: BETTING__SBK_COMBINATIONS_OUTDATED,
        });

        break;
      }

      case BETTING__SBK_REMOVE_LEG_ACTION: {
        const { legId } = action.payload;
        const legState = sportsbookBetting.legs[legId];
        const newBettingState = removeLeg(sportsbookBetting, { legId });
        const { legs, isBonusSelected } = newBettingState;
        const removeToggle = !Object.entries(legs).length && isBonusSelected;

        legState?.runners?.forEach((runnerId) => {
          const { marketId, selectionId } = sportsbookBetting.runners[runnerId];
          emit("@@BETSLIP/SBK_RUNNER_REMOVED", { marketId, selectionId });
        });

        dispatch<BettingSportsbookStateUpdateAction>({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: removeToggle ? updateBonusUse(newBettingState, { isBonusSelected: false }) : newBettingState,
            group: currentGroup,
          },
        });

        dispatch<BettingSportsbookCombinationsOutdatedAction>({
          type: BETTING__SBK_COMBINATIONS_OUTDATED,
        });
        break;
      }

      case BETTING__SBK_REMOVE_BOOSTED_COMBINATION_ACTION: {
        const { legIds } = action.payload;
        const newBettingState = legIds.reduce((acc, legId) => removeLeg(acc, { legId }), sportsbookBetting);

        dispatch<BettingSportsbookStateUpdateAction>({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: newBettingState,
            group: currentGroup,
          },
        });

        dispatch<BettingSportsbookCombinationsOutdatedAction>({
          type: BETTING__SBK_COMBINATIONS_OUTDATED,
        });
        break;
      }

      case BETTING__SBK_VALIDATE_STAKE: {
        const { combinationId } = action.payload;
        const {
          validations: { combinations },
        } = sportsbookBetting;

        const allCombinationValidations = combinations[combinationId];

        if (allCombinationValidations) {
          const validators = getValidators(combinationId);
          const validatedState = allCombinationValidations.reduce((lastState, currentValidation) => {
            const validate = validators[currentValidation.type];

            return validate ? validate(lastState, currentValidation) : lastState;
          }, sportsbookBetting);

          dispatch<BettingSportsbookStateUpdateAction>({
            type: BETTING__SBK_STATE_UPDATE,
            payload: {
              state: validatedState,
              group: currentGroup,
            },
          });
        }

        break;
      }

      case BETTING__SBK_UPDATE_COMBINATION_STAKE_ACTION: {
        const { combinationId, stake } = action.payload;

        dispatch<BettingSportsbookStateUpdateAction>({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: updateStake(sportsbookBetting, {
              combinationId,
              stake,
            }),
            group: currentGroup,
          },
        });
        break;
      }

      case BETTING__SBK_INCREMENT_STAKE_ACTION: {
        const { combinationId, increment } = action.payload;

        dispatch<BettingSportsbookStateUpdateAction>({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: incrementStake(sportsbookBetting, {
              combinationId,
              increment,
            }),
            group: currentGroup,
          },
        });
        break;
      }

      case NETWORK__PLACE_SBK_BET_SUCCESS:
      case BETTING__SBK_CLEAR_ACTION: {
        if (action.type === NETWORK__PLACE_SBK_BET_SUCCESS) {
          const combination = getGreatestOddCombination(state);

          if (combination?.stake) {
            dispatch<BetslipSetLastSuccessfulStakeAction>({
              type: UI__BETSLIP_SET_LAST_SUCCESSFUL_STAKE,
              payload: { stake: combination.stake },
            });
          }
        }

        const dailyPayoutLimitThrottle = getThrottle(state.entities.throttles, "DAILY_PAYOUT_LIMIT");

        emitAllRunnersRemovedUpdate(sportsbookBetting);

        dispatch<BettingSportsbookStateUpdateAction>({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state:
              dailyPayoutLimitThrottle?.isActive && limit
                ? init({ maxPayoutLimits: { warning: limit.softCap, error: limit.hardCap } })
                : init(),
            group: currentGroup,
          },
        });

        break;
      }

      case BETTING__SBK_BONUS_TOGGLE_ACTION: {
        dispatch<BettingSportsbookStateUpdateAction>({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: updateBonusUse(sportsbookBetting, {
              isBonusSelected: action.payload.isFreeBetsSelected,
            }),
            group: currentGroup,
          },
        });
        break;
      }

      case BETTING__SBK_EACH_WAY_TOGGLE: {
        dispatch<BettingSportsbookStateUpdateAction>({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: updateEachWay(sportsbookBetting, {
              combinationId: action.payload.combinationId,
              isEachWaySelected: action.payload.isSelected,
            }),
            group: currentGroup,
          },
        });
        break;
      }

      case BETTING__SBK_STARTING_PRICE_TOGGLE: {
        const { combinationId, isSelected } = action.payload;
        const combinations = getSportsbookBettingCombinations(state);
        const targetCombination = combinations[combinationId];
        let finalState = sportsbookBetting;

        const accaCombination = Object.values(combinations).find(
          (combination) => combination.isAccaInsuranceSelected && !combination.accaInsuranceTokenId,
        );

        if (accaCombination?.id) {
          finalState = updateAccaInsurance(sportsbookBetting, {
            combinationId: accaCombination.id,
            isAccaInsuranceSelected: false,
          });
        }

        finalState = targetCombination.legs.reduce((lastState, legId) => {
          const single = findSingleCombinationFromLegId(combinations, legId);

          if (!single) {
            return lastState;
          }

          return updateSP(lastState, {
            combinationId: single.id,
            isSPSelected: isSelected,
          });
        }, finalState);

        dispatch<BettingSportsbookStateUpdateAction>({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: finalState,
            group: currentGroup,
          },
        });

        break;
      }

      case BETTING__SBK_PRICE_BOOST_TOGGLE: {
        const { combinationId, selectedTokenId } = action.payload;
        const combinations = getSportsbookBettingCombinations(state);
        const { isPriceBoostAvailable } = combinations[combinationId];

        if (!isPriceBoostAvailable) {
          break;
        }

        dispatch<BettingSportsbookStateUpdateAction>({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: updatePriceBoost(sportsbookBetting, {
              combinationId,
              selectedTokenId,
              isPriceBoostSelected: !!selectedTokenId,
            }),
            group: currentGroup,
          },
        });
        break;
      }

      case BETTING__SBK_ACCA_INSURANCE_TOGGLE: {
        const { combinationId, selectedTokenId } = action.payload;
        const combinations = getSportsbookBettingCombinations(state);
        const { isAccaInsuranceSelected } = combinations[combinationId];

        dispatch<BettingSportsbookStateUpdateAction>({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: updateAccaInsurance(sportsbookBetting, {
              combinationId,
              selectedTokenId,
              isAccaInsuranceSelected: !!selectedTokenId || !isAccaInsuranceSelected,
            }),
            group: currentGroup,
          },
        });
        break;
      }

      case BETTING__SBK_GHOST_LEG_TOGGLE: {
        const { combinationId, selectedTokenId } = action.payload;

        dispatch<BettingSportsbookStateUpdateAction>({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: updateState(sportsbookBetting, UPDATE_ACTIONS.UPDATE_GHOST_LEG, {
              combinationId,
              selectedTokenId,
              isGhostLegSelected: !!selectedTokenId,
            }),
            group: currentGroup,
          },
        });
        break;
      }

      case BETTING__SBK_MONEY_BACK_TOGGLE: {
        const { combinationId, selectedTokenId } = action.payload;
        const combinations = getSportsbookBettingCombinations(state);
        const { isMoneyBackSelected } = combinations[combinationId];

        dispatch<BettingSportsbookStateUpdateAction>({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: updateMoneyBack(sportsbookBetting, {
              combinationId,
              selectedTokenId,
              isMoneyBackSelected: !!selectedTokenId || !isMoneyBackSelected,
            }),
            group: currentGroup,
          },
        });
        break;
      }

      case BETTING__SBK_ORDER_CHANGE: {
        dispatch<BettingSportsbookStateUpdateAction>({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: updateOrder(sportsbookBetting, {
              runnerIds: action.payload.order,
            }),
            group: currentGroup,
          },
        });
        break;
      }

      case NETWORK__SBK_COMBINATIONS_UPDATE_SUCCESS: {
        dispatch<BettingSportsbookStateUpdateAction>({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: updateCombinations(sportsbookBetting, {
              responses: action.payload.combinations,
            }),
            group: currentGroup,
          },
        });

        break;
      }

      case NETWORK__PLACE_SBK_BET_IN_PROGRESS: {
        dispatch<BettingSportsbookStateUpdateAction>({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: clearPlaceFailures(sportsbookBetting),
            group: currentGroup,
          },
        });
        break;
      }

      case NETWORK__PLACE_SBK_BET_FAILURE: {
        const { error, isTechnical } = action.payload;

        if (!isTechnical) {
          const { operation, definitions, combinations } = error;
          // TODO: Fix betslip core types to avoid casting
          let finalBettingState = updatePlaceFailures(sportsbookBetting, {
            operation: <PlaceResponse.PlaceBetResp>operation,
            placement: { definitions: <PlaceRequest.BetDefinition[]>definitions, combinations },
          });
          const isPlaceFailureInferralActive = getThrottle(state.entities.throttles, "SBK_PLACE_FAILURE_PRICE_INFERRAL")
            ?.isActive;

          if (isPlaceFailureInferralActive) {
            const span = getBasicSpan(
              transactionalTracer,
              "betting.placeBet.exception.operational.inferral",
              undefined,
              "betting.placeBet",
            );

            try {
              const inferredBettingState = updateCombinationsWithPlace(finalBettingState, {
                operation: <PlaceResponse.PlaceBetResp>operation,
              });

              // Reference comparison is sufficient to determine if the state was updated
              // as the updater will return the same object if no changes were made
              span.setAttribute("betting.state.wasUpdated", inferredBettingState !== finalBettingState);

              finalBettingState = inferredBettingState;
            } catch (error) {
              span.setAttribute("betting.state.inferral.operation", JSON.stringify(operation));
              if (error instanceof Error) {
                span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
                span.recordException(error as Error);
              }
            } finally {
              span.end();
            }
          }

          dispatch<BettingSportsbookPlaceFailedUpdateAction>({
            type: BETTING__SBK_PLACE_FAILED_UPDATE,
            payload: {
              state: finalBettingState,
            },
          });
        }
        break;
      }

      case NETWORK__FETCH_COMBINATIONS_LIST_SUCCESS: {
        dispatch<BettingSportsbookStateUpdateAction>({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: updateCombinationReview(sportsbookBetting, {
              combinationId: action.payload.combinationId,
              combinationsResponse: { ...action.payload.response, status: "SUCCESS" },
            }),
            group: currentGroup,
          },
        });
        break;
      }

      case NETWORK__FETCH_APP_CONTEXT_SUCCESS: {
        const appContextUserDetails = action.payload.initialState?.entities.userdetails;
        const appContextLimit =
          "currencyCode" in appContextUserDetails
            ? productConfiguration.getPayoutLimit(appContextUserDetails.currencyCode)
            : undefined;

        const dailyPayoutLimitThrottle = getThrottle(
          action.payload.initialState?.entities.throttles,
          "DAILY_PAYOUT_LIMIT",
        );

        if (dailyPayoutLimitThrottle?.isActive && appContextLimit) {
          updateMaxPayoutGroupOptions(dispatch, sportsbookBetting, currentGroup, appContextLimit);
        }

        break;
      }

      case NETWORK__INVALID_SESSION:
      case NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE: {
        emitAllRunnersRemovedUpdate(sportsbookBetting);

        dispatch<BettingSportsbookStateUpdateAction>({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: init(),
            group: currentGroup,
          },
        });

        break;
      }

      case MODULES__SBK_BETTING_LOADED: {
        const dailyPayoutLimitThrottle = getThrottle(state.entities.throttles, "DAILY_PAYOUT_LIMIT");

        if (dailyPayoutLimitThrottle?.isActive && limit) {
          updateMaxPayoutGroupOptions(dispatch, sportsbookBetting, currentGroup, limit);
        }
        break;
      }

      case BETTING__SPORTSBOOK_FREE_BETS_WALLETS_APPLY_ACTION: {
        const { combinationId, selectedWallets } = action.payload;

        const updatedBonusWallet = updateBonusWallets(sportsbookBetting, {
          combinationId,
          selectedWallets,
        });

        dispatch<BettingSportsbookStateUpdateAction>({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: updatedBonusWallet,
            group: currentGroup,
          },
        });
        break;
      }

      case BETTING__SPORTSBOOK_REMOVE_ALL_COMBINATION_FREE_BETS_WALLETS_ACTION: {
        const { combinationId } = action.payload;

        const updatedBonusWallet = updateBonusWallets(sportsbookBetting, {
          combinationId,
          selectedWallets: [],
        });

        dispatch<BettingSportsbookStateUpdateAction>({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: updatedBonusWallet,
            group: currentGroup,
          },
        });
        break;
      }

      case BETTING__SPORTSBOOK_REMOVE_ALL_FREE_BETS_WALLETS_ACTION: {
        const updatedBonusWallet = clearBonusWallets(sportsbookBetting);

        dispatch<BettingSportsbookStateUpdateAction>({
          type: BETTING__SBK_STATE_UPDATE,
          payload: {
            state: updatedBonusWallet,
            group: currentGroup,
          },
        });
        break;
      }

      default:
        break;
    }

    return result;
  };
