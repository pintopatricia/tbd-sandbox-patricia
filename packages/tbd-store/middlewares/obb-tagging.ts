import { Middleware } from "redux";
import { ApplicationState, ObbTaggingMetadata } from "../state";
import {
  BETTING__OBB_CLEAR_ACTION,
  BETTING__OBB_NEW_COMBINATION,
  BETTING__OBB_REMOVE_LEG_ACTION,
  BETTING__OBB_TOGGLE_LEG_ACTION,
  BETTING__OBB_TOGGLE_MULTIPLE_LEG_ACTION,
  BETTING_UPDATE_OBB_TAGGING_METADATA,
  BettingObbClearAction,
  BettingObbNewCombinationAction,
  BettingObbRemoveLegAction,
  BettingObbToggleLegAction,
  BettingObbToggleMultipleLegAction,
  BettingObbUpdateTaggingMetadata,
} from "../actions/betting";
import { generateBetDetailsFromState } from "../helpers/gtm-obb";

type ActionTypes =
  | BettingObbToggleLegAction
  | BettingObbRemoveLegAction
  | BettingObbClearAction
  | BettingObbNewCombinationAction
  | BettingObbToggleMultipleLegAction;

export const obbTaggingMiddleware: Middleware<{}, ApplicationState> =
  ({ dispatch, getState }) =>
  (next) =>
  (action: ActionTypes) => {
    next(action);

    switch (action.type) {
      case BETTING__OBB_CLEAR_ACTION: {
        dispatch<BettingObbUpdateTaggingMetadata>({
          type: BETTING_UPDATE_OBB_TAGGING_METADATA,
          payload: {
            metadata: {},
          },
        });
        break;
      }
      case BETTING__OBB_REMOVE_LEG_ACTION: {
        const state = getState();
        const { legId } = action.payload;
        const existingMetadata = state.betslip?.obbTaggingMetadata || {};
        const newObbTaggingMetadata: ObbTaggingMetadata = { ...existingMetadata };
        delete newObbTaggingMetadata[legId]; // eslint-disable-line @typescript-eslint/no-dynamic-delete

        dispatch<BettingObbUpdateTaggingMetadata>({
          type: BETTING_UPDATE_OBB_TAGGING_METADATA,
          payload: {
            metadata: newObbTaggingMetadata,
          },
        });
        break;
      }
      case BETTING__OBB_NEW_COMBINATION:
      case BETTING__OBB_TOGGLE_LEG_ACTION: {
        const state = getState();
        const { legId } = action.payload;
        const betDetails = generateBetDetailsFromState(legId, state);
        if (!betDetails) return;

        const existingMetadata = state.betslip?.obbTaggingMetadata || {};
        const newObbTaggingMetadata: ObbTaggingMetadata = {
          ...existingMetadata,
          [legId]: betDetails,
        };

        dispatch<BettingObbUpdateTaggingMetadata>({
          type: BETTING_UPDATE_OBB_TAGGING_METADATA,
          payload: {
            metadata: newObbTaggingMetadata,
          },
        });
        break;
      }

      case BETTING__OBB_TOGGLE_MULTIPLE_LEG_ACTION: {
        const state = getState();
        const { legIds } = action.payload;

        const betDetails = legIds.reduce<ObbTaggingMetadata>((acc, legId) => {
          const details = generateBetDetailsFromState(legId, state);
          if (!details) return acc;
          acc[legId] = details;

          return acc;
        }, {});

        if (Object.keys(betDetails).length === 0) return;

        const existingMetadata = state.betslip?.obbTaggingMetadata || {};
        const newObbTaggingMetadata: ObbTaggingMetadata = {
          ...existingMetadata,
          ...betDetails,
        };

        dispatch<BettingObbUpdateTaggingMetadata>({
          type: BETTING_UPDATE_OBB_TAGGING_METADATA,
          payload: {
            metadata: newObbTaggingMetadata,
          },
        });
        break;
      }
      default: {
        break;
      }
    }
  };
