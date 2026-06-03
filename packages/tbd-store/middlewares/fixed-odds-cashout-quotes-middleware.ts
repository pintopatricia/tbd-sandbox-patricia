import { Middleware, Dispatch, AnyAction } from "redux";
import { getEventRegistry } from "eventemitter3-singleton";

import type { FixedOddsCashoutQuotesUpdateCallbackPayload } from "./fixed-odds-cashout-quotes-observable";
import { Observer } from "./http-poller/http-poller-observable";
import { PUSH, PushAction } from "../actions";
import { getActiveThrottles } from "../state/entities/throttles/throttles-selectors";
import { ApplicationState, Product } from "../state";

import { createSportsbookBetSelector } from "../state/betting/sportsbook-bets/sportsbook-bets-selectors";
import {
  FetchSportsbookQuotesFailureAction,
  FetchSportsbookQuotesSuccessAction,
  NETWORK__CASHOUT_TAKE,
  NETWORK__CASHOUT_TAKE_SUCCESS,
  NETWORK__FETCH_SBK_QUOTES_FAILURE,
  NETWORK__FETCH_SBK_QUOTES_SUCCESS,
  TakeCashoutAction,
  TakeCashoutSuccessAction,
  NETWORK__CASHOUT_TAKE_IN_PROGRESS,
  TakeCashoutInProgressAction,
  NETWORK__CASHOUT_TAKE_FAILURE_SBK,
  TakeCashoutFailureSbkAction,
  NETWORK__FETCH_SBK_QUOTES_AUTH_FAILURE,
  FetchSportsbookQuotesAuthFailureAction,
  TakeCashoutAuthFailureSbkAction,
  NETWORK__CASHOUT_TAKE_AUTH_FAILURE_SBK,
} from "../actions/cashout";
import {
  MyBetsSubscribeCardUpdatesAction,
  MyBetsUnsubscribeCardUpdatesAction,
  MY_BETS_SUBSCRIBE_CARD_UPDATES,
  MY_BETS_UNSUBSCRIBE_CARD_UPDATES,
  UI__MY_BETS_ORDER_TYPE_FILTER_CLICK,
  MyBetsOrderTypeFilterClick,
} from "../actions/my-bets";
import { isHttpForbiddenError, isHttpUnauthorizedError } from "../helpers/error-parsing";
import { UPDATE_PRODUCT_PREFERENCE, UpdateProductPreferenceAction } from "../actions/preferences";
import { createSportsbookCashoutQuoteSelector } from "../state/betting/sportsbook-cashouts/sportsbook-cashout-selectors";
import { CashoutStep } from "../state/constants";
import { createSportsbookBetLegSelector } from "../state/entities/sportsbook-bet-legs/sportsbook-bet-legs-selectors";
import cashoutService from "../services/cashout-service";
import { buildQuoteReceipt } from "../helpers/receipt";
import { EntityType } from "@ppb/tbd-urn-codecs";

type Actions =
  | MyBetsSubscribeCardUpdatesAction
  | MyBetsUnsubscribeCardUpdatesAction
  | MyBetsOrderTypeFilterClick
  | UpdateProductPreferenceAction
  | TakeCashoutAction
  | PushAction;

let fixedOddsCashoutQuotesUpdatesObserver: Observer<FixedOddsCashoutQuotesUpdateCallbackPayload>;
const { emit } = getEventRegistry();

const getSportsbookBetByURN = createSportsbookBetSelector();
const getSportsbookCashoutQuoteByURN = createSportsbookCashoutQuoteSelector();
const getSportsbookBetLegByURN = createSportsbookBetLegSelector();

const TAKE_CASHOUT_GENERIC_ERROR_STATUS = "GENERIC";

const takeCashoutActionHandler = async (
  action: TakeCashoutAction,
  dispatch: Dispatch<AnyAction>,
  state: ApplicationState,
  throttles: string[],
  fixedOddsCashoutQuotesUpdatesObservable: InstanceType<
    typeof import("./fixed-odds-cashout-quotes-observable").default
  >,
) => {
  const { cashoutUrn } = action.payload;

  const sbkQuote = getSportsbookCashoutQuoteByURN(state.betting.sportsbookcashouts, cashoutUrn);

  if (!sbkQuote || sbkQuote.step === CashoutStep.CASHING_OUT) {
    return;
  }

  const { betDelay = 0, betUrn, stake = 0, quote = 0, cashOutToken = "" } = sbkQuote;

  const sbkBet = getSportsbookBetByURN(state.betting.sportsbookbets, betUrn);

  if (!sbkBet) {
    return;
  }

  const { betId, legs, betType, numLines, isSGM } = sbkBet;

  const firstLeg = getSportsbookBetLegByURN(state.entities.sportsbookbetlegs, legs[0]);

  if (!firstLeg) {
    return;
  }

  dispatch<TakeCashoutInProgressAction>({
    type: NETWORK__CASHOUT_TAKE_IN_PROGRESS,
    payload: {
      cashoutUrn,
    },
  });

  let takeCashoutResponse = undefined;

  try {
    takeCashoutResponse = await cashoutService.takeSBK(betDelay, betId, cashOutToken, quote);
  } catch (err) {
    dispatch<TakeCashoutFailureSbkAction>({
      type: NETWORK__CASHOUT_TAKE_FAILURE_SBK,
      payload: {
        entityURN: cashoutUrn,
        errorCode: (err as any).errorCode ?? TAKE_CASHOUT_GENERIC_ERROR_STATUS,
      },
    });

    if (err instanceof Error) {
      if (throttles.includes("CASHOUT_AUTH_REDIRECT") && (isHttpUnauthorizedError(err) || isHttpForbiddenError(err))) {
        dispatch<TakeCashoutAuthFailureSbkAction>({
          type: NETWORK__CASHOUT_TAKE_AUTH_FAILURE_SBK,
        });
      }
    }
  }

  if (!takeCashoutResponse) {
    return;
  }

  const { respStatus, cashedOutQuote = 0 } = takeCashoutResponse;

  if (takeCashoutResponse.respStatus === "SUCCESS") {
    const firstPart = firstLeg.parts[0];

    emit("@@THE_BRIDGE/SBK_BET_CASHED_OUT", null);

    dispatch<TakeCashoutSuccessAction>({
      type: NETWORK__CASHOUT_TAKE_SUCCESS,
      payload: {
        product: Product.Sportsbook,
        receipt: buildQuoteReceipt(
          cashoutUrn,
          respStatus,
          firstPart?.eventDescription,
          firstPart?.eventMarketDescription,
          cashedOutQuote,
          cashedOutQuote - stake,
          betType,
          numLines,
          isSGM,
        ),
        errorCode: respStatus,
      },
    });

    fixedOddsCashoutQuotesUpdatesObservable.restart();
  } else {
    dispatch<TakeCashoutFailureSbkAction>({
      type: NETWORK__CASHOUT_TAKE_FAILURE_SBK,
      payload: {
        entityURN: cashoutUrn,
        errorCode: respStatus ?? TAKE_CASHOUT_GENERIC_ERROR_STATUS,
      },
    });
  }
};

export const fixedOddsCashoutQuotesUpdatesMiddleware: Middleware =
  ({ dispatch, getState }) =>
  (next) =>
  async (action: Actions) => {
    next(action); // forward the action for further processing

    const state: ApplicationState = getState();
    const throttles: string[] = getActiveThrottles(state.entities.throttles);

    const FixedOddsCashoutQuotesUpdatesObservable = await import(
      /* webpackChunkName: "fixed-odds-cashout-quotes-observable" */ "./fixed-odds-cashout-quotes-observable"
    ).then((module) => module.default);
    const fixedOddsCashoutQuotesUpdatesObservable = FixedOddsCashoutQuotesUpdatesObservable.getInstance();

    if (!fixedOddsCashoutQuotesUpdatesObserver) {
      fixedOddsCashoutQuotesUpdatesObserver = ({ fcqQuotes, error }) => {
        if (fcqQuotes) {
          dispatch<FetchSportsbookQuotesSuccessAction>({
            type: NETWORK__FETCH_SBK_QUOTES_SUCCESS,
            payload: fcqQuotes,
          });
        } else if (error instanceof Error) {
          dispatch<FetchSportsbookQuotesFailureAction>({
            type: NETWORK__FETCH_SBK_QUOTES_FAILURE,
            error: error.message,
          });

          if (
            throttles.includes("CASHOUT_AUTH_REDIRECT") &&
            (isHttpUnauthorizedError(error) || isHttpForbiddenError(error))
          ) {
            dispatch<FetchSportsbookQuotesAuthFailureAction>({
              type: NETWORK__FETCH_SBK_QUOTES_AUTH_FAILURE,
            });
          }
        } else if (error) {
          dispatch<FetchSportsbookQuotesFailureAction>({
            type: NETWORK__FETCH_SBK_QUOTES_FAILURE,
            error: `Unknown error ${JSON.stringify(error)}`,
          });
        }
      };

      fixedOddsCashoutQuotesUpdatesObservable.subscribe(fixedOddsCashoutQuotesUpdatesObserver);
    }

    switch (action.type) {
      case MY_BETS_SUBSCRIBE_CARD_UPDATES: {
        const bet = getSportsbookBetByURN(state.betting.sportsbookbets, action.payload.urn);

        if (!bet) {
          return;
        }

        fixedOddsCashoutQuotesUpdatesObservable.addBet({ betURN: bet.urn, betId: bet.betId });
        break;
      }
      case MY_BETS_UNSUBSCRIBE_CARD_UPDATES:
        fixedOddsCashoutQuotesUpdatesObservable.removeBet(action.payload.urn);
        break;
      case UPDATE_PRODUCT_PREFERENCE:
      case UI__MY_BETS_ORDER_TYPE_FILTER_CLICK:
      case PUSH: {
        // Block when the user is in My Bets view and tries to navigate to it again (or from other view) (bottom bar/deep link)
        // These scenarios do not trigger again the quotes subscriptions, leading to no quotes updates
        if (action.type === PUSH && action.payload.viewUrn.includes(EntityType.MyBetsView)) {
          return;
        }

        fixedOddsCashoutQuotesUpdatesObservable.resetBets();
        break;
      }

      case NETWORK__CASHOUT_TAKE: {
        await takeCashoutActionHandler(action, dispatch, state, throttles, fixedOddsCashoutQuotesUpdatesObservable);
        break;
      }
      default:
        break;
    }
  };
