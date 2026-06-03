import {
  BETTING__VALID_UPDATE_POTENTIAL_BET_ACTION,
  BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION,
  ValidUpdatePotentialBetAction,
  RemoveAllPotentialBetsAction,
  InvalidUpdatePricePotentialBetAction,
  InvalidUpdateSizePotentialBetAction,
  BETTING__INVALID_UPDATE_PRICE_POTENTIAL_BET_ACTION,
  BETTING__INVALID_UPDATE_SIZE_POTENTIAL_BET_ACTION,
} from "../../../actions/betting";
import { ExchangeBettingPotentialState } from "./ExchangeBettingPotential.types";

type ActionTypes =
  | ValidUpdatePotentialBetAction
  | InvalidUpdatePricePotentialBetAction
  | InvalidUpdateSizePotentialBetAction
  | RemoveAllPotentialBetsAction;

const INITIAL_STATE: ExchangeBettingPotentialState = {};

export const exchangeBettingPotentialStateReducer = (
  currentState: undefined | ExchangeBettingPotentialState,
  action: ActionTypes,
): ExchangeBettingPotentialState => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case BETTING__INVALID_UPDATE_PRICE_POTENTIAL_BET_ACTION: {
      const { runner, side, error, price } = action.payload;

      return {
        ...state,
        [runner]: {
          ...state[runner],
          [side.toLowerCase()]: {
            price,
            priceValidation: error,
          },
        },
      };
    }
    case BETTING__INVALID_UPDATE_SIZE_POTENTIAL_BET_ACTION: {
      const { runner, side, error, size } = action.payload;

      return {
        ...state,
        [runner]: {
          ...state[runner],
          [side.toLowerCase()]: {
            size,
            sizeValidation: error,
          },
        },
      };
    }
    case BETTING__VALID_UPDATE_POTENTIAL_BET_ACTION: {
      const { runner, side, price, size } = action.payload;
      return {
        ...state,
        [runner]: {
          ...state[runner],
          [side.toLowerCase()]: {
            price,
            priceValidation: undefined,
            size,
            sizeValidation: undefined,
          },
        },
      };
    }
    case BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION: {
      return {};
    }
    default:
      return state;
  }
};
