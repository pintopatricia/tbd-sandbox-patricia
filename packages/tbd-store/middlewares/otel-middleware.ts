import { Middleware } from "redux";
import { SpanStatusCode, trace } from "@opentelemetry/api";
import { ApplicationState } from "../state/ApplicationState.types";
import { FetchAppContextSuccessAction } from "../actions/app-context";
import {
  BETTING__SBK_CLEAR_ACTION,
  BETTING__SBK_COMBINATIONS_OUTDATED,
  BETTING__SBK_PLACE_BETS,
} from "../actions/betting";
import {
  NETWORK__PLACE_SBK_BET_AUTH_FAILURE,
  NETWORK__PLACE_SBK_BET_FAILURE,
  NETWORK__PLACE_SBK_BET_IN_PROGRESS,
  NETWORK__PLACE_SBK_BET_SUCCESS,
  NETWORK__SBK_COMBINATIONS_UPDATE_AUTH_FAILURE,
  NETWORK__SBK_COMBINATIONS_UPDATE_FAILURE,
  NETWORK__SBK_COMBINATIONS_UPDATE_IN_PROGRESS,
  NETWORK__SBK_COMBINATIONS_UPDATE_SUCCESS,
} from "../actions/betslip";
import { UI__SWITCH_PRODUCT_PREFERENCE } from "../actions/preferences";

type ActionTypes = FetchAppContextSuccessAction;

const TRANSACTIONAL_ACTION_TYPES = [
  BETTING__SBK_PLACE_BETS,
  NETWORK__PLACE_SBK_BET_IN_PROGRESS,
  NETWORK__PLACE_SBK_BET_FAILURE,
  NETWORK__PLACE_SBK_BET_AUTH_FAILURE,
  NETWORK__PLACE_SBK_BET_SUCCESS,
];
const COMBINATOR_ACTION_TYPES = [
  BETTING__SBK_COMBINATIONS_OUTDATED,
  BETTING__SBK_CLEAR_ACTION,
  NETWORK__SBK_COMBINATIONS_UPDATE_IN_PROGRESS,
  NETWORK__SBK_COMBINATIONS_UPDATE_FAILURE,
  NETWORK__SBK_COMBINATIONS_UPDATE_AUTH_FAILURE,
  NETWORK__SBK_COMBINATIONS_UPDATE_SUCCESS,
  UI__SWITCH_PRODUCT_PREFERENCE,
];

export const otelMiddleware: Middleware<Record<string, never>, ApplicationState> =
  () => (next) => async (action: ActionTypes) => {
    const span = trace.getTracer("reduxAction").startSpan(`Redux - ${action.type}`);

    try {
      if (TRANSACTIONAL_ACTION_TYPES.includes(action.type)) {
        span.setAttribute("workflow.name", "betting.placeBet");
      }

      if (COMBINATOR_ACTION_TYPES.includes(action.type)) {
        span.setAttribute("workflow.name", "betting.implyBets");
      }

      return next(action);
    } catch (error) {
      if (error instanceof Error) {
        span.recordException(error);
        span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      }

      throw error;
    } finally {
      span.end();
    }
  };
