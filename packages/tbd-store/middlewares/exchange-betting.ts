import { Middleware, Dispatch } from "redux";
import {
  BetEngineAPI,
  BetEngineState,
  CONST,
  helpers,
  LBROrder,
  PriceLadderValidation,
  SizeLadderValidation,
  EditedBets,
} from "@ppb/bet-engine";
import { ExchangeSettings, isOnlineUserDetails } from "../state/entities";
import { ApplicationState } from "../state/ApplicationState.types";
import {
  BETTING__ADD_POTENTIAL_BET_ACTION,
  BETTING__UPDATE_POTENTIAL_BET_ACTION,
  BETTING__REMOVE_POTENTIAL_BET_ACTION,
  BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION,
  BETTING__NUDGE_UP_POTENTIAL_BET_ACTION,
  BETTING__NUDGE_DOWN_POTENTIAL_BET_ACTION,
  BETTING__EXC_INCREMENT_SIZE_ACTION,
  BETTING__UPDATE_UNMATCHED_BET_ACTION,
  BETTING__NUDGE_UP_UNMATCHED_BET_ACTION,
  BETTING__NUDGE_DOWN_UNMATCHED_BET_ACTION,
  BETTING__EXC_STATE_UPDATE,
  BETTING__INVALID_UPDATE_UNMATCHED_BET_ACTION,
  BETTING__VALID_UPDATE_UNMATCHED_BET_ACTION,
  BETTING__INVALID_UPDATE_PRICE_POTENTIAL_BET_ACTION,
  BETTING__INVALID_UPDATE_SIZE_POTENTIAL_BET_ACTION,
  BETTING__VALID_UPDATE_POTENTIAL_BET_ACTION,
  BETTING__BONUS_TOGGLE_BET_ACTION,
  BettingExchangeStateUpdatedAction,
  AddPotentialBetAction,
  NudgeUpPotentialBetAction,
  NudgeDownPotentialBetAction,
  BettingExchangeIncrementSizeAction,
  UpdatePotentialBetAction,
  RemovePotentialBetAction,
  UpdateUnmatchedBetAction,
  NudgeUpUnmatchedBetAction,
  NudgeDownUnmatchedBetAction,
  InvalidUpdateUnmatchedBetAction,
  ValidUpdateUnmatchedBetAction,
  InvalidUpdatePricePotentialBetAction,
  InvalidUpdateSizePotentialBetAction,
  ValidUpdatePotentialBetAction,
  RemoveAllPotentialBetsAction,
  BettingBonusToggleBetAction,
} from "../actions/betting";
import {
  DISCOUNT,
  LADDER_DEFAULT_MIN_SIZE,
  PRICE_LADDER_CONFIG,
  SIZE_LADDER_CONFIG,
  SIZE_NUDGE_STEP,
} from "../config/bet-engine-config";
import { getUserDetails } from "../state/entities/user-details/user-details-selectors";
import {
  FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS,
  FetchExchangeMarketUpdatesSuccessAction,
} from "../actions/exchange-markets";
import { ExchangeServiceGetPricesResult } from "../services/exchange-market-service";
import { getUnmatchedBets } from "../state/betting/exchange-betting/exchange-betting-selectors";
import {
  getExchangeRunnerTree,
  createExcRunnerPotentialBetsByRunnerURNSelector,
} from "../state/entities/entities-selectors";
import { FETCH_EXC_OPEN_BETS_SUCCESS, FetchExchangeOpenBetsSuccessAction } from "../actions/exchange-open-bets";
import { NETWORK__PLACE_EXC_BET_SUCCESS, PlaceExchangeBetSuccessAction } from "../actions/betslip";
import { NETWORK__FETCH_APP_CONTEXT_SUCCESS, FetchAppContextSuccessAction } from "../actions/app-context";
import { getExchangeRunnerByURN } from "../state/entities/exchange-runners/exchange-runner-selectors";
import { createExchangeMarketSelector } from "../state/entities/exchange-markets/exchange-market-selectors";
import { getBetslipExchangeEdit } from "../state/betslip/betslip-card-selectors";
import {
  ExchangeMarketPositionViewResult,
  ExchangeMarketsPosition,
} from "../state/betting/exchange-orders/ExchangeOrder.types";

const { EXCHANGE: EXCHANGE_BET_CATEGORY } = CONST.BET.CATEGORY_TYPE;
const { MIN_PRICE, MAX_PRICE, STEPS } = PRICE_LADDER_CONFIG;
const { MAX_SIZE, INTERVAL } = SIZE_LADDER_CONFIG;
let betEngine: BetEngineAPI;
let sizeMinStake: number = LADDER_DEFAULT_MIN_SIZE;

type NudgeDirection = "UP" | "DOWN";

async function instantiateBetEngine(
  exchangeSettings: ExchangeSettings | null,
  onStateChange: (state: BetEngineState) => void,
): Promise<BetEngineAPI> {
  const { factory } = await import(/* webpackChunkName: "BetEngine", webpackPreload: true */ "@ppb/bet-engine");

  const discount = exchangeSettings?.discount ?? DISCOUNT;
  const minSize = exchangeSettings?.currencyDetails?.minStake ?? LADDER_DEFAULT_MIN_SIZE;
  sizeMinStake = minSize;

  const priceLadder = factory.createPriceLadder(MIN_PRICE, MAX_PRICE, STEPS);
  const sizeLadder = factory.createSizeLadder(minSize, MAX_SIZE, INTERVAL);

  const be = factory.createBetEngine({
    discount,
    ladders: { price: { default: priceLadder }, size: { default: sizeLadder } },
  });

  be.subscribe(onStateChange);

  return be;
}

function removeAllPotentialBets(be: BetEngineAPI, state: ApplicationState): void {
  const marketUrns = Object.keys(state.betting.exchangeBetting);
  marketUrns.forEach((urn) => be.removePotentialBets(urn));
}

type Validations = {
  price: PriceLadderValidation;
  size: SizeLadderValidation;
};

function getUpdateValidity(
  marketUrn: string,
  beSide: string,
  price?: number,
  size?: number,
  originalSize?: number,
): Validations {
  return {
    price:
      price !== undefined
        ? betEngine.validatePrice(
            marketUrn,
            beSide,
            EXCHANGE_BET_CATEGORY, // could be EXCHANGE or SP
            price,
          )
        : { isValid: true },
    size:
      size !== undefined
        ? betEngine.validateSize(
            beSide,
            EXCHANGE_BET_CATEGORY, // could be EXCHANGE or SP
            size,
            originalSize,
          )
        : { isValid: true },
  };
}

function isValidUpdate(validations: Validations): boolean {
  const { price, size } = validations;

  return price.isValid && size.isValid;
}

function addPotentialBet(be: BetEngineAPI, state: ApplicationState, action: AddPotentialBetAction): void {
  const { runner, side, price, size } = action.payload;
  const runnerTree = getExchangeRunnerTree(state.entities, runner);

  if (!runnerTree) {
    return;
  }

  const { market, marketRunner } = runnerTree;
  const { urn, type, bettingType } = market;

  be.addPotentialBet(urn, {
    side,
    selectionId: marketRunner.selectionId,
    handicap: marketRunner.handicap,
    price,
    size,
  });

  be.updateMarket(urn, {
    type,
    bettingType,
    bonus: 0,
  });
}

function updatePotentialBet(
  be: BetEngineAPI,
  state: ApplicationState,
  action: UpdatePotentialBetAction,
  dispatch: Dispatch,
): void {
  const { runner, side, price, size } = action.payload;
  const runnerTree = getExchangeRunnerTree(state.entities, runner);
  const [potentialBet] = createExcRunnerPotentialBetsByRunnerURNSelector()(state, runner);

  if (!runnerTree || !potentialBet) {
    return;
  }

  const { market, marketRunner } = runnerTree;
  const validations = getUpdateValidity(market.urn, side, price, size, potentialBet?.size);

  if (!validations.price.isValid && validations.price.data?.reason) {
    dispatch<InvalidUpdatePricePotentialBetAction>({
      type: BETTING__INVALID_UPDATE_PRICE_POTENTIAL_BET_ACTION,
      payload: {
        price,
        runner,
        side,
        error: { ...validations.price.data },
      },
    });
    return;
  }

  if (!validations.size.isValid && validations.size.data?.reason) {
    dispatch<InvalidUpdateSizePotentialBetAction>({
      type: BETTING__INVALID_UPDATE_SIZE_POTENTIAL_BET_ACTION,
      payload: {
        size,
        runner,
        side,
        error: { ...validations.size.data },
      },
    });
    return;
  }

  dispatch<ValidUpdatePotentialBetAction>({
    type: BETTING__VALID_UPDATE_POTENTIAL_BET_ACTION,
    payload: {
      price,
      size,
      runner,
      side,
    },
  });

  be.updatePotentialBet(market.urn, marketRunner.selectionId, marketRunner.handicap, side, {
    price,
    size,
  });
}

function nudgePotentialBet(
  be: BetEngineAPI,
  state: ApplicationState,
  action: NudgeUpPotentialBetAction | NudgeDownPotentialBetAction,
  direction: NudgeDirection,
  dispatch: Dispatch,
): void {
  const { runner, side, input } = action.payload;
  const runnerTree = getExchangeRunnerTree(state.entities, runner);
  const [potentialBet] = createExcRunnerPotentialBetsByRunnerURNSelector()(state, runner);

  if (!runnerTree || !potentialBet) {
    return;
  }

  const { market, marketRunner } = runnerTree;

  if (input === "size") {
    const currentSize = potentialBet.size ?? 0;
    const delta = direction === "UP" ? SIZE_NUDGE_STEP : -SIZE_NUDGE_STEP;
    const newSize = Math.max(parseFloat((currentSize + delta).toFixed(2)), sizeMinStake);

    be.updatePotentialBet(market.urn, marketRunner.selectionId, marketRunner.handicap, side, {
      size: newSize,
    });
  } else {
    const nudgePrice = potentialBet.price ? potentialBet.price : 1;
    const nudgePotentialBetPrice = direction === "UP" ? be.nudgeUpPotentialBetPrice : be.nudgeDownPotentialBetPrice;

    nudgePotentialBetPrice(market.urn, marketRunner.selectionId, marketRunner.handicap, side, nudgePrice);
  }

  dispatch<ValidUpdatePotentialBetAction>({
    type: BETTING__VALID_UPDATE_POTENTIAL_BET_ACTION,
    payload: {
      runner,
      side,
    },
  });
}

function incrementPotentialBet(
  be: BetEngineAPI,
  state: ApplicationState,
  action: BettingExchangeIncrementSizeAction,
): void {
  const { runner, side, increment } = action.payload;

  const runnerTree = getExchangeRunnerTree(state.entities, runner);

  if (!runnerTree) {
    return;
  }

  const { market, marketRunner } = runnerTree;

  be.incrementPotentialBetSize(market.urn, marketRunner.selectionId, marketRunner.handicap, side, increment);
}

function removePotentialBet(be: BetEngineAPI, state: ApplicationState, action: RemovePotentialBetAction): void {
  const { runner, side } = action.payload;
  const runnerTree = getExchangeRunnerTree(state.entities, runner);

  if (!runnerTree) {
    return;
  }

  const { market, marketRunner } = runnerTree;

  be.removePotentialBet(market.urn, marketRunner.selectionId, marketRunner.handicap, side);
}

function updateUnmatchedBet(
  be: BetEngineAPI,
  state: ApplicationState,
  dispatch: Dispatch,
  action: UpdateUnmatchedBetAction,
): void {
  const { runner, price, size, side, betId } = action.payload;
  const runnerTree = getExchangeRunnerTree(state.entities, runner);

  if (!runnerTree) {
    return;
  }

  const { market, marketRunner } = runnerTree;

  const [unmatchedBet] = getUnmatchedBets(state, market.urn, [betId]);

  if (!unmatchedBet) {
    return;
  }

  const validations = getUpdateValidity(market.urn, side, price, size, unmatchedBet?.size);

  if (!isValidUpdate(validations)) {
    dispatch<InvalidUpdateUnmatchedBetAction>({
      type: BETTING__INVALID_UPDATE_UNMATCHED_BET_ACTION,
      payload: {
        betId,
        order: {
          price,
          size,
          validations: {
            price: !validations.price.isValid ? validations.price : undefined,
            size: !validations.size.isValid ? validations.size : undefined,
          },
        },
      },
    });

    return;
  }

  dispatch<ValidUpdateUnmatchedBetAction>({
    type: BETTING__VALID_UPDATE_UNMATCHED_BET_ACTION,
    payload: {
      betId,
      order: { price, size },
    },
  });

  be.updateUnmatchedBet(market.urn, marketRunner.selectionId, marketRunner.handicap, unmatchedBet.id, {
    price,
    size,
  });
}

function nudgeUnmatchedBet(
  be: BetEngineAPI,
  state: ApplicationState,
  action: NudgeUpUnmatchedBetAction | NudgeDownUnmatchedBetAction,
  direction: NudgeDirection,
  dispatch: Dispatch,
): void {
  const { runner, betId, input } = action.payload;
  const runnerTree = getExchangeRunnerTree(state.entities, runner);

  if (!runnerTree) {
    return;
  }

  const { market, marketRunner } = runnerTree;
  const [unmatchedBet] = getUnmatchedBets(state, market.urn, [betId]);

  if (!unmatchedBet) {
    return;
  }

  let size = unmatchedBet.size;
  let price = unmatchedBet.price;

  if (input === "size") {
    const editedSize = getBetslipExchangeEdit(state)?.order?.size;
    const currentSize = editedSize === undefined ? unmatchedBet.size ?? 0 : editedSize ?? 0;
    const delta = direction === "UP" ? SIZE_NUDGE_STEP : -SIZE_NUDGE_STEP;
    size = Math.max(parseFloat((currentSize + delta).toFixed(2)), sizeMinStake);

    be.updateUnmatchedBet(market.urn, marketRunner.selectionId, marketRunner.handicap, unmatchedBet.id, {
      size,
    });
  } else {
    const nudgeUnmatchedBetPrice = direction === "UP" ? be.nudgeUpUnmatchedBetPrice : be.nudgeDownUnmatchedBetPrice;

    price = nudgeUnmatchedBetPrice(market.urn, marketRunner.selectionId, marketRunner.handicap, unmatchedBet.id);
  }

  dispatch<ValidUpdateUnmatchedBetAction>({
    type: BETTING__VALID_UPDATE_UNMATCHED_BET_ACTION,
    payload: {
      betId,
      order: {
        size,
        price,
      },
    },
  });
}

function createEditedBet(state: ApplicationState): EditedBets {
  const editState = getBetslipExchangeEdit(state);
  if (!editState?.order) {
    return {};
  }

  return {
    [editState.betId]: {
      newPrice: editState.order.price || undefined,
      newSize: editState.order.size || undefined,
    },
  };
}

function updateMarketsOpenBets(positions: ExchangeMarketsPosition, state: ApplicationState): void {
  Object.values(positions).forEach((pos: ExchangeMarketPositionViewResult): void => {
    const { orders, market, marketId, settledProfit } = pos;
    if (betEngine.hasMarket(market)) {
      const editedBets = createEditedBet(state);
      const openBets = helpers.mapLBROrdersToOpenBets(orders as LBROrder[], editedBets);
      betEngine.setMarketOpenBets(market, openBets[marketId] || {}, settledProfit);
    }
  });
}

function updateMarketWithBonus(be: BetEngineAPI, state: ApplicationState, action: BettingBonusToggleBetAction): void {
  const { runner, marketEligibleBonus, isFreeBetsSelected } = action.payload;
  const { exchangerunners, exchangemarkets } = state.entities;
  const exchangeRunner = getExchangeRunnerByURN(exchangerunners, runner);
  const getExchangeMarketByURN = createExchangeMarketSelector();

  if (!exchangeRunner) {
    return;
  }

  const market = getExchangeMarketByURN(exchangemarkets, exchangeRunner.market);

  if (!market) {
    return;
  }

  const { urn, type, bettingType } = market;

  be.updateMarket(urn, { type, bettingType, bonus: isFreeBetsSelected ? marketEligibleBonus : 0 });
}

type ActionTypes =
  | FetchExchangeOpenBetsSuccessAction
  | BettingExchangeIncrementSizeAction
  | RemoveAllPotentialBetsAction
  | PlaceExchangeBetSuccessAction
  | NudgeUpPotentialBetAction
  | NudgeDownPotentialBetAction
  | RemovePotentialBetAction
  | AddPotentialBetAction
  | UpdatePotentialBetAction
  | UpdateUnmatchedBetAction
  | NudgeUpUnmatchedBetAction
  | NudgeDownUnmatchedBetAction
  | FetchExchangeMarketUpdatesSuccessAction
  | BettingBonusToggleBetAction
  | FetchAppContextSuccessAction;

export const exchangeBettingMiddleware: Middleware =
  ({ dispatch, getState }) =>
  (next) =>
  async (action: ActionTypes) => {
    try {
      const state: ApplicationState = getState();
      const onStateChange = (beState: BetEngineState): void => {
        dispatch<BettingExchangeStateUpdatedAction>({
          type: BETTING__EXC_STATE_UPDATE,
          payload: {
            state: beState,
          },
        });
      };

      if (!betEngine) {
        const stateUserDetails = getUserDetails(state);
        if (isOnlineUserDetails(stateUserDetails)) {
          betEngine = await instantiateBetEngine(stateUserDetails.excSettings, onStateChange);
        }
      }

      switch (action.type) {
        case NETWORK__FETCH_APP_CONTEXT_SUCCESS: {
          const { userdetails } = action.payload.initialState?.entities || {};

          if (userdetails) {
            if (isOnlineUserDetails(userdetails)) {
              betEngine.setUserDiscount(userdetails.excSettings?.discount ?? DISCOUNT);
            }
          }
          break;
        }

        case FETCH_EXC_OPEN_BETS_SUCCESS: {
          updateMarketsOpenBets(action.payload.markets, state);
          break;
        }

        case BETTING__EXC_INCREMENT_SIZE_ACTION: {
          incrementPotentialBet(betEngine, state, action);
          break;
        }

        case BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION: {
          removeAllPotentialBets(betEngine, state);
          break;
        }

        case NETWORK__PLACE_EXC_BET_SUCCESS: {
          removeAllPotentialBets(betEngine, state);
          break;
        }

        case BETTING__NUDGE_UP_POTENTIAL_BET_ACTION: {
          nudgePotentialBet(betEngine, state, action, "UP", dispatch);
          break;
        }

        case BETTING__NUDGE_DOWN_POTENTIAL_BET_ACTION: {
          nudgePotentialBet(betEngine, state, action, "DOWN", dispatch);
          break;
        }

        case BETTING__REMOVE_POTENTIAL_BET_ACTION: {
          removePotentialBet(betEngine, state, action);
          break;
        }

        case BETTING__ADD_POTENTIAL_BET_ACTION: {
          addPotentialBet(betEngine, state, action);
          break;
        }

        case BETTING__UPDATE_POTENTIAL_BET_ACTION: {
          updatePotentialBet(betEngine, state, action, dispatch);
          break;
        }

        case BETTING__UPDATE_UNMATCHED_BET_ACTION: {
          updateUnmatchedBet(betEngine, state, dispatch, action);
          break;
        }

        case BETTING__NUDGE_UP_UNMATCHED_BET_ACTION: {
          nudgeUnmatchedBet(betEngine, state, action, "UP", dispatch);
          break;
        }

        case BETTING__NUDGE_DOWN_UNMATCHED_BET_ACTION: {
          nudgeUnmatchedBet(betEngine, state, action, "DOWN", dispatch);
          break;
        }

        case BETTING__BONUS_TOGGLE_BET_ACTION: {
          updateMarketWithBonus(betEngine, state, action);
          break;
        }

        case FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS: {
          const { payload }: { payload: ExchangeServiceGetPricesResult } = action;

          Object.values(payload.markets).forEach((payloadMarket) => {
            const { runners, ...storeMarket } = state.entities.exchangemarkets[payloadMarket.urn];
            if (betEngine.hasMarket(payloadMarket.urn)) {
              betEngine.updateMarket(
                payloadMarket.urn,
                {
                  ...storeMarket,
                  ...payloadMarket,
                },
                runners,
              );
            } else {
              betEngine.addMarket(
                {
                  ...storeMarket,
                  ...payloadMarket,
                  id: payloadMarket.urn,
                  settledProfit: 0,
                },
                runners,
              );
            }
          });
          break;
        }

        default:
          break;
      }
    } catch (e) {
      console.warn(`bet engine initialisation - ${e}`);
    }
    return next(action);
  };
