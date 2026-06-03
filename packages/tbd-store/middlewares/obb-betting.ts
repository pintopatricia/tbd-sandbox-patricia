import { Dispatch, Middleware } from "redux";
import { ApplicationState, ImplyBetsMapper, isOnlineUserDetails } from "../state";
import {
  BETTING__BETSLIP_TYPE_SWITCH_TO_OBB,
  BETTING__OBB_LOADED,
  BETTING__OBB_CHANGE_STAKE_ACTION,
  BETTING__OBB_CLEAR_ACTION,
  BETTING__OBB_IMPLY_BETS,
  BETTING__OBB_INCREMENT_STAKE_ACTION,
  BETTING__OBB_REMOVE_LEG_ACTION,
  BETTING__OBB_STATE_UPDATE,
  BETTING__OBB_TOGGLE_MULTIPLE_LEG_ACTION,
  BETTING__OBB_TOGGLE_LEG_ACTION,
  BETTING__OBB_UPDATE_ODDS_MOVEMENT,
  BETTING__OBB_VALIDATE_STAKE,
  BETTING__SBK_CLEAR_ACTION,
  BettingObbLoadedAction,
  BettingObbChangeStakeAction,
  BettingObbClearAction,
  BettingObbImplyBetsAction,
  BettingObbIncrementStakeAction,
  BettingObbLoadStorageSuccessAction,
  BettingObbRemoveLegAction,
  BettingObbStateUpdateAction,
  BettingObbToggleMultipleLegAction,
  BettingObbToggleLegAction,
  BettingObbUpdateOddsMovementAction,
  BettingObbValidateStake,
  BettingSportsbookClearAction,
  BettingSwitchToObbBetslipAction,
  BETTING__OBB_SBK_KEEP_ACTION,
  BETTING__OBB_SBK_CLEAR_ACTION,
  BETTING__OBB_PLACE_FAILED_UPDATE,
  BettingObbPlaceFailedUpdateAction,
  BETTING__SBK_INVALID_LEGS_AMOUNT,
  BettingSportsbookInvalidLegsAmountAction,
  BETTING__OBB_TRANSFER_POTENTIAL_BET_STAKE,
  BettingObbTransferPotentialBetStakeAction,
  BettingObbNewCombinationAction,
  BETTING__OBB_NEW_COMBINATION,
} from "../actions/betting";
import { ConfirmationAction, UI__ACTION_CONFIRMATION } from "../actions/confirmation";
import {
  updatePotentialBetStake,
  addLeg,
  removeLeg,
  shouldImplyBets,
  updatePotentialBetsQuotes,
  isDailyPayoutLimitActive,
  getObbValidators,
  updateFailures,
  updateQuoteFailures,
  clearPlaceFailures,
  updateLegsQuotes,
  hasReachedLegLimit,
  verify,
  updateLegQuoteImply,
  updatePotentialBetDetailsImply,
  createCombinedLegs,
  createCombinedPotentialBet,
  updateImplyLegFailure,
  updateCombinedPotentialBetFailuresImply,
  updateCombinedLegsFailuresImply,
  transferPotentialBetStake,
} from "../helpers/obb-betting";
import {
  ImplyObbBetsSuccessAction,
  NETWORK__OBB_IMPLY_BETS_SUCCESS,
  NETWORK__OBB_FETCH_LEG_QUOTES_SUCCESS,
  NETWORK__OBB_PLACE_BET_SUCCESS,
  NETWORK__OBB_PLACE_BET_FAILURE,
  ObbQuotesUpdateSuccessAction,
  PlaceObbBetSuccessAction,
  PlaceObbBetFailureAction,
  ObbQuotesUpdateFailureAction,
  NETWORK__OBB_PLACE_BET_IN_PROGRESS,
  PlaceObbBetInProgressAction,
  BetslipCollapseToggleAction,
  UI__BETSLIP_SET_COLLAPSE_ACTION,
} from "../actions/betslip";
import { productConfiguration } from "../config";
import { INITIAL_STATE } from "../state/betting/obb-betting/obb-betting-reducer";
import {
  IMPLY_BETS_FAILURES_BLOCKLIST,
  PLACE_BETS_FAILURES_BLOCKLIST,
} from "../state/betting/obb-betting/obb-betting.constants";
import { ObbBettingState } from "../state/betting/obb-betting/ObbBetting.types";
import { buildObbLeg } from "../state/entities/obb-legs/obb-legs-selector";
import { OBB_MAX_LEGS } from "../config/common-config";
import { SelectorObbLeg } from "../state/entities/obb-legs/ObbLegs.types";
type ActionTypes =
  | BettingObbToggleLegAction
  | BettingSwitchToObbBetslipAction
  | BettingObbRemoveLegAction
  | BettingObbValidateStake
  | BettingObbChangeStakeAction
  | BettingObbIncrementStakeAction
  | ObbQuotesUpdateSuccessAction
  | PlaceObbBetSuccessAction
  | ImplyObbBetsSuccessAction
  | BettingObbLoadedAction
  | PlaceObbBetFailureAction
  | ObbQuotesUpdateFailureAction
  | PlaceObbBetInProgressAction
  | BettingObbNewCombinationAction
  | BettingObbLoadStorageSuccessAction
  | BettingObbClearAction
  | BettingObbToggleMultipleLegAction
  | BettingObbTransferPotentialBetStakeAction;

function handleAutoCollapse(
  dispatch: Dispatch<BetslipCollapseToggleAction>,
  obbBettingState: ObbBettingState,
  minimizeBetslip: boolean,
): void {
  if (minimizeBetslip) {
    dispatch<BetslipCollapseToggleAction>({
      type: UI__BETSLIP_SET_COLLAPSE_ACTION,
      payload: {
        collapse: true,
      },
    });

    return;
  }

  const numberOfLegs = Object.keys(obbBettingState.legs).length;

  if (numberOfLegs === 1) {
    dispatch<BetslipCollapseToggleAction>({
      type: UI__BETSLIP_SET_COLLAPSE_ACTION,
      payload: {
        collapse: false,
      },
    });
  }
}

export const obbBettingMiddleware: Middleware<Record<string, never>, ApplicationState> =
  ({ dispatch, getState }) =>
  (next) =>
  (action: ActionTypes) => {
    const state = getState();
    const {
      betting: { sportsbookBetting, obbBetting },
      entities: { obbLegs, obbParticipants, userdetails, throttles, brandSettings },
    } = state;
    const result = next(action);

    switch (action.type) {
      case BETTING__OBB_LOADED: {
        const { softCap = null, hardCap = null } =
          productConfiguration.getPayoutLimit(isOnlineUserDetails(userdetails) ? userdetails.countryCode : "") || {};

        const obbBettingState = isDailyPayoutLimitActive(throttles)
          ? { ...obbBetting, maxPayoutLimits: { warning: softCap, error: hardCap } }
          : obbBetting;

        dispatch<BettingObbStateUpdateAction>({
          type: BETTING__OBB_STATE_UPDATE,
          payload: { state: obbBettingState },
        });

        break;
      }

      case BETTING__BETSLIP_TYPE_SWITCH_TO_OBB: {
        const { legIds } = action.payload;

        dispatch<BettingSportsbookClearAction>({
          type: BETTING__SBK_CLEAR_ACTION,
        });

        const obbLegList: Array<SelectorObbLeg> = legIds
          .map((legId) => buildObbLeg(obbLegs[legId], obbParticipants))
          .filter((leg): leg is SelectorObbLeg => leg !== undefined);

        if (!obbLegList.length) {
          return result;
        }

        const newObbBettingState = obbLegList.reduce(
          (updatedObbBettingState, obbLeg) => addLeg(updatedObbBettingState, obbLeg),
          obbBetting,
        );

        dispatch<BettingObbStateUpdateAction>({
          type: BETTING__OBB_STATE_UPDATE,
          payload: { state: newObbBettingState },
        });

        dispatch<BettingObbImplyBetsAction>({
          type: BETTING__OBB_IMPLY_BETS,
        });

        handleAutoCollapse(dispatch, newObbBettingState, brandSettings?.MINIMIZE_BETSLIP ?? false);

        break;
      }

      case BETTING__OBB_TOGGLE_MULTIPLE_LEG_ACTION: {
        const { legIds, cardUrn, eventName } = action.payload;
        const betslipHasSbkLegs = Object.values(sportsbookBetting.legs).length;

        if (betslipHasSbkLegs) {
          dispatch<ConfirmationAction>({
            type: UI__ACTION_CONFIRMATION,
            payload: {
              cardUrn,
              eventName,
              id: "BETTING_BETSLIP_TYPE_SWITCH",
              refuseActions: [
                {
                  type: BETTING__OBB_SBK_KEEP_ACTION,
                  payload: { cardUrn, clickedOutside: false, eventName },
                },
              ],
              acceptActions: [
                {
                  type: BETTING__BETSLIP_TYPE_SWITCH_TO_OBB,
                  payload: { legIds },
                },
                {
                  type: BETTING__OBB_SBK_CLEAR_ACTION,
                  payload: { cardUrn, eventName },
                },
              ],
            },
          });

          break;
        }

        const obbLegList: Array<SelectorObbLeg> = legIds
          .map((legId) => buildObbLeg(obbLegs[legId], obbParticipants))
          .filter((leg): leg is SelectorObbLeg => leg !== undefined);

        if (!obbLegList.length) {
          return result;
        }

        const resetStateWithEmptyFailures = clearPlaceFailures(obbBetting);

        if (hasReachedLegLimit(resetStateWithEmptyFailures, obbLegList.length)) {
          dispatch<BettingSportsbookInvalidLegsAmountAction>({
            type: BETTING__SBK_INVALID_LEGS_AMOUNT,
            payload: { limit: OBB_MAX_LEGS },
          });

          break;
        }

        const newObbBettingState = obbLegList.reduce(
          (updatedState, leg) => addLeg(updatedState, leg),
          resetStateWithEmptyFailures,
        );

        dispatch<BettingObbStateUpdateAction>({
          type: BETTING__OBB_STATE_UPDATE,
          payload: { state: newObbBettingState },
        });

        handleAutoCollapse(dispatch, newObbBettingState, !!brandSettings?.MINIMIZE_BETSLIP);

        dispatch<BettingObbImplyBetsAction>({
          type: BETTING__OBB_IMPLY_BETS,
        });

        break;
      }
      case BETTING__OBB_TOGGLE_LEG_ACTION: {
        const { legId, cardUrn, eventName } = action.payload;
        const betslipHasSbkLegs = Object.values(sportsbookBetting.legs).length;

        if (betslipHasSbkLegs) {
          dispatch<ConfirmationAction>({
            type: UI__ACTION_CONFIRMATION,
            payload: {
              cardUrn,
              eventName,
              id: "BETTING_BETSLIP_TYPE_SWITCH",
              refuseActions: [
                {
                  type: BETTING__OBB_SBK_KEEP_ACTION,
                  payload: { cardUrn, clickedOutside: false, eventName },
                },
              ],
              acceptActions: [
                {
                  type: BETTING__BETSLIP_TYPE_SWITCH_TO_OBB,
                  payload: { legIds: [legId] },
                },
                {
                  type: BETTING__OBB_SBK_CLEAR_ACTION,
                  payload: { cardUrn, eventName },
                },
              ],
            },
          });

          break;
        }

        const resetStateWithEmptyFailures = clearPlaceFailures(obbBetting);
        const isLegInState = !!resetStateWithEmptyFailures.legs[legId];

        const obbLeg = buildObbLeg(obbLegs[legId], obbParticipants);

        if (!obbLeg) {
          return result;
        }

        let newObbBettingState;

        if (isLegInState) {
          newObbBettingState = removeLeg(resetStateWithEmptyFailures, legId);
        } else {
          if (hasReachedLegLimit(obbBetting, 1)) {
            dispatch<BettingSportsbookInvalidLegsAmountAction>({
              type: BETTING__SBK_INVALID_LEGS_AMOUNT,
              payload: { limit: OBB_MAX_LEGS },
            });

            break;
          }
          newObbBettingState = addLeg(resetStateWithEmptyFailures, obbLeg);
        }

        dispatch<BettingObbStateUpdateAction>({
          type: BETTING__OBB_STATE_UPDATE,
          payload: { state: newObbBettingState },
        });

        handleAutoCollapse(dispatch, newObbBettingState, brandSettings?.MINIMIZE_BETSLIP ?? false);

        const hasLegsLeft = Object.keys(newObbBettingState.potentialBets).length;

        if (hasLegsLeft) {
          dispatch<BettingObbImplyBetsAction>({
            type: BETTING__OBB_IMPLY_BETS,
          });
        }

        break;
      }

      case BETTING__OBB_REMOVE_LEG_ACTION: {
        const { legId } = action.payload;

        const resetStateWithEmptyFailures = clearPlaceFailures(obbBetting);
        const newObbBettingState = removeLeg(resetStateWithEmptyFailures, legId);

        dispatch<BettingObbStateUpdateAction>({
          type: BETTING__OBB_STATE_UPDATE,
          payload: { state: newObbBettingState },
        });

        const hasLegsLeft = Object.keys(newObbBettingState.potentialBets).length;

        if (hasLegsLeft) {
          dispatch<BettingObbImplyBetsAction>({
            type: BETTING__OBB_IMPLY_BETS,
          });
        }

        break;
      }

      case BETTING__OBB_VALIDATE_STAKE: {
        const { potentialBetId } = action.payload;
        const {
          validations: { potentialBets },
        } = obbBetting;

        const potentialBetValidations = potentialBets[potentialBetId];

        if (potentialBetValidations) {
          const obbValidators = getObbValidators(potentialBetId);

          const newObbBettingState = potentialBetValidations.reduce((obbBettingState, validation) => {
            const validator = obbValidators[validation.type];

            return validator ? validator(obbBettingState, validation) : obbBettingState;
          }, obbBetting);

          dispatch<BettingObbStateUpdateAction>({
            type: BETTING__OBB_STATE_UPDATE,
            payload: { state: newObbBettingState },
          });
        }

        break;
      }

      case BETTING__OBB_INCREMENT_STAKE_ACTION: {
        const { potentialBetId, increment } = action.payload;

        dispatch<BettingObbStateUpdateAction>({
          type: BETTING__OBB_STATE_UPDATE,
          payload: {
            state: updatePotentialBetStake(obbBetting, potentialBetId, {
              stake: increment,
              isIncrement: true,
            }),
          },
        });
        break;
      }

      case BETTING__OBB_CLEAR_ACTION: {
        dispatch<BettingObbStateUpdateAction>({
          type: BETTING__OBB_STATE_UPDATE,
          payload: {
            state: {
              ...INITIAL_STATE,
              maxPayoutLimits: obbBetting.maxPayoutLimits,
            },
          },
        });
        break;
      }

      case BETTING__OBB_CHANGE_STAKE_ACTION: {
        const { potentialBetId, newValue } = action.payload;

        dispatch<BettingObbStateUpdateAction>({
          type: BETTING__OBB_STATE_UPDATE,
          payload: {
            state: updatePotentialBetStake(obbBetting, potentialBetId, { stake: newValue }),
          },
        });
        break;
      }

      case BETTING__OBB_TRANSFER_POTENTIAL_BET_STAKE: {
        const { oldPotentialBetId, newPotentialBetId } = action.payload;

        dispatch<BettingObbStateUpdateAction>({
          type: BETTING__OBB_STATE_UPDATE,
          payload: {
            state: transferPotentialBetStake(obbBetting, oldPotentialBetId, newPotentialBetId),
          },
        });
        break;
      }

      case NETWORK__OBB_PLACE_BET_FAILURE: {
        const { betPlacementResponse } = action.payload;

        const newFailuresState = updateFailures(
          obbBetting,
          betPlacementResponse.result.resultCode,
          betPlacementResponse.betPlacementsResult || [],
          PLACE_BETS_FAILURES_BLOCKLIST,
        );

        dispatch<BettingObbPlaceFailedUpdateAction>({
          type: BETTING__OBB_PLACE_FAILED_UPDATE,
          payload: { state: newFailuresState },
        });

        break;
      }

      case NETWORK__OBB_PLACE_BET_SUCCESS: {
        dispatch<BettingObbClearAction>({
          type: BETTING__OBB_CLEAR_ACTION,
        });
        break;
      }

      case NETWORK__OBB_PLACE_BET_IN_PROGRESS: {
        dispatch<BettingObbStateUpdateAction>({
          type: BETTING__OBB_STATE_UPDATE,
          payload: { state: clearPlaceFailures(obbBetting) },
        });

        break;
      }

      case NETWORK__OBB_FETCH_LEG_QUOTES_SUCCESS: {
        const { legsQuotes, clearOnFailure } = action.payload;
        const { potentialBets, legs } = obbBetting;

        const implyBets = shouldImplyBets(legsQuotes, potentialBets);

        const updatedPotentialBets = updatePotentialBetsQuotes(legsQuotes, potentialBets);
        const updatedLegs = updateLegsQuotes(legsQuotes, legs);
        const updatedQuotesFailures = updateQuoteFailures(legsQuotes);

        if (clearOnFailure && Object.keys(updatedQuotesFailures).length) {
          dispatch<BettingObbClearAction>({
            type: BETTING__OBB_CLEAR_ACTION,
          });

          return result;
        }

        if (implyBets) {
          dispatch<BettingObbImplyBetsAction>({
            type: BETTING__OBB_IMPLY_BETS,
          });
        }

        const stateWithUpdatedQuotes = {
          ...obbBetting,
          potentialBets: { ...potentialBets, ...updatedPotentialBets },
          legs: { ...legs, ...updatedLegs },
          failures: {
            ...obbBetting.failures,
            legs: {
              ...obbBetting.failures.legs,
              ...updatedQuotesFailures,
            },
          },
        };

        dispatch<BettingObbStateUpdateAction>({
          type: BETTING__OBB_STATE_UPDATE,
          payload: { state: stateWithUpdatedQuotes },
        });

        dispatch<BettingObbUpdateOddsMovementAction>({
          type: BETTING__OBB_UPDATE_ODDS_MOVEMENT,
          payload: { state: stateWithUpdatedQuotes },
        });

        break;
      }

      case NETWORK__OBB_IMPLY_BETS_SUCCESS: {
        const { legs, potentialBets } = obbBetting;
        const { implyBetsResponse } = action.payload;
        const { betDefinitions, combinedBetDefinitions, result: implyResult } = implyBetsResponse;

        /*
         * "Creating" new legs and potential bets with new quotes and details from Imply
         * If the leg has a failure, we update the failures map
         * The Imply is the state's source of truth, so we only use its data from legs and potentialBets that we don't get from Imply
         */
        const betDefinitionsDerivedState = betDefinitions.reduce<ImplyBetsMapper>(
          (acc, betDefinition) => {
            const baseLeg = legs[betDefinition.id];

            const basePotentialBet = Object.values(potentialBets).find((potentialBet) =>
              potentialBet.legs.includes(betDefinition.id),
            );

            if (betDefinition.result.resultCode !== "SUCCESS") {
              const updatedLegFailure = updateImplyLegFailure(legs, betDefinition, IMPLY_BETS_FAILURES_BLOCKLIST);
              acc.failures.legs = { ...acc.failures.legs, ...updatedLegFailure };

              // in this case, we don't get the quote and details from Imply but the leg and potential bet should remain in the state
              acc.legs[betDefinition.id] = baseLeg;
              if (basePotentialBet) {
                acc.potentialBets[basePotentialBet.id] = basePotentialBet;
              }

              return acc;
            }

            if (!baseLeg || !basePotentialBet) {
              return acc;
            }

            const legWithUpdatedQuote = updateLegQuoteImply(baseLeg, betDefinition);
            const potentialBetWithUpdatedDetails = updatePotentialBetDetailsImply(basePotentialBet, betDefinition);

            acc.legs = { ...acc.legs, ...legWithUpdatedQuote };
            acc.potentialBets = { ...acc.potentialBets, ...potentialBetWithUpdatedDetails };

            return acc;
          },
          { legs: {}, potentialBets: {}, failures: { betslip: null, potentialBets: {}, legs: {} } },
        );

        /*
         * Creating new combined legs and potential bets with new quotes and details from Imply
         * If the combined legs and bets have a failure, we update the failures map
         * The Imply is the state's source of truth, so we only use its data from legs and potentialBets that we don't get from Imply
         */
        const combinedBetDefinitionsDerivedState = combinedBetDefinitions.reduce<ImplyBetsMapper>(
          (acc, combinedBetDefinition) => {
            const combinedBetObbTaggingMetadata = Object.fromEntries(
              Object.keys(betDefinitionsDerivedState.legs).map((leg) => [
                leg,
                state.betslip?.obbTaggingMetadata?.[leg] ?? null,
              ]),
            );
            // Even if the combined bet definition has a failure, we still create the combined legs and potential bet first
            const newCombinedLegs = createCombinedLegs(
              betDefinitionsDerivedState.legs,
              combinedBetDefinition,
              combinedBetObbTaggingMetadata,
            );
            const newCombinedPotentialBet = createCombinedPotentialBet(
              newCombinedLegs,
              combinedBetDefinition,
              potentialBets,
            );

            acc.legs = { ...acc.legs, ...newCombinedLegs };
            acc.potentialBets = { ...acc.potentialBets, ...newCombinedPotentialBet };

            Object.values(newCombinedLegs).forEach((combinedLeg) => {
              dispatch<BettingObbNewCombinationAction>({
                type: BETTING__OBB_NEW_COMBINATION,
                payload: { legId: combinedLeg.id },
              });
            });

            // After creating the new combined legs and potential bets, we check if the combined bet definition has a failure
            if (combinedBetDefinition.result.resultCode !== "SUCCESS") {
              const combinedPotentialBetFailureMap = updateCombinedPotentialBetFailuresImply(
                newCombinedPotentialBet,
                combinedBetDefinition,
                IMPLY_BETS_FAILURES_BLOCKLIST,
              );

              const combinedLegsFailuresMap = updateCombinedLegsFailuresImply(
                newCombinedLegs,
                combinedBetDefinition,
                betDefinitionsDerivedState.legs,
                IMPLY_BETS_FAILURES_BLOCKLIST,
              );

              acc.failures = {
                ...acc.failures,
                legs: { ...acc.failures.legs, ...combinedLegsFailuresMap },
                potentialBets: { ...acc.failures.potentialBets, ...combinedPotentialBetFailureMap },
              };
            }

            return acc;
          },
          { legs: {}, potentialBets: {}, failures: { betslip: null, potentialBets: {}, legs: {} } },
        );

        const updatedStateWithImplyDetails = verify({
          ...obbBetting,
          legs: { ...betDefinitionsDerivedState.legs, ...combinedBetDefinitionsDerivedState.legs },
          potentialBets: {
            ...betDefinitionsDerivedState.potentialBets,
            ...combinedBetDefinitionsDerivedState.potentialBets,
          },
          failures: {
            betslip: !IMPLY_BETS_FAILURES_BLOCKLIST.includes(implyResult.resultCode) ? implyResult.resultCode : null,
            potentialBets: combinedBetDefinitionsDerivedState.failures.potentialBets,
            legs: {
              ...betDefinitionsDerivedState.failures.legs,
              ...combinedBetDefinitionsDerivedState.failures.legs,
            },
          },
        });

        dispatch<BettingObbStateUpdateAction>({
          type: BETTING__OBB_STATE_UPDATE,
          payload: { state: updatedStateWithImplyDetails },
        });

        // Since Imply now returns prices, we need to update the odds movement here as well
        dispatch<BettingObbUpdateOddsMovementAction>({
          type: BETTING__OBB_UPDATE_ODDS_MOVEMENT,
          payload: { state: updatedStateWithImplyDetails },
        });

        break;
      }

      default:
        break;
    }

    return result;
  };
