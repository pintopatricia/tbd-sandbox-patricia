import { SagaIterator } from "redux-saga";
import { call, put, select, takeEvery, takeLeading, all, takeLatest } from "redux-saga/effects";
import {
  BETTING__OBB_IMPLY_BETS,
  BETTING__OBB_PLACE_BETS,
  BETTING__OBB_UPDATE_QUOTES,
  BettingObbUpdateQuotesAction,
} from "../actions/betting";
import catalogueService from "../services/catalogue/catalogue-service";
import {
  ImplyObbBetsInProgressAction,
  ImplyObbBetsSuccessAction,
  NETWORK__OBB_IMPLY_BETS_IN_PROGRESS,
  NETWORK__OBB_IMPLY_BETS_SUCCESS,
  NETWORK__OBB_PLACE_BET_FAILURE,
  NETWORK__OBB_PLACE_BET_IN_PROGRESS,
  NETWORK__OBB_PLACE_BET_SUCCESS,
  NETWORK__OBB_QUOTES_UPDATE_IN_PROGRESS,
  NETWORK__OBB_FETCH_LEG_QUOTES_FAILURE,
  NETWORK__OBB_FETCH_LEG_QUOTES_SUCCESS,
  ObbQuotesUpdateFailureAction,
  ObbQuotesUpdateInProgressAction,
  ObbQuotesUpdateSuccessAction,
  PlaceObbBetFailureAction,
  PlaceObbBetInProgressAction,
  PlaceObbBetSuccessAction,
  NETWORK__OBB_IMPLY_BETS_REQUEST_FAILURE,
  ObbImplyBetsRequestFailureAction,
} from "../actions/betslip";
import { getObbBettingLegs, getObbBettingState } from "../state/betting/obb-betting/obb-betting-selectors";

import { ObbBettingState, ObbLegMap } from "../state/betting/obb-betting/ObbBetting.types";
import { ApplicationState, BetslipObbPlaceBetResponse, getOverridenThrottles, ThrottleOverrides } from "../state";
import {
  Supplier,
  ObbQuotesQuery,
  ImplyBetsRequestInput,
  ExpressionParamsInput,
  PlaceBetDefinitionInput,
} from "../clients/catalogue/catalogue-response-types";
import {
  buildObbReport,
  buildBetslipQuoteInputLegs,
  buildRequestInputBet,
  checkIfQuotesShouldBeUpdated,
  mapObbBettingLegsByEvent,
} from "../helpers/obb-betting";
import { createCustomerRefBuilder } from "../helpers/betting";

const buildObbCustomerReference = createCustomerRefBuilder();

function* placeBet(): SagaIterator {
  try {
    const throttleOverrides = yield select((state: ApplicationState) => getOverridenThrottles(state.entities));
    const obbBetting: ObbBettingState = yield select(getObbBettingState);

    yield put<PlaceObbBetInProgressAction>({
      type: NETWORK__OBB_PLACE_BET_IN_PROGRESS,
    });

    const { potentialBets, legs } = obbBetting;

    const betsToBePlaced: PlaceBetDefinitionInput[] = Object.values(potentialBets).reduce<PlaceBetDefinitionInput[]>(
      (acc, potentialBet) => {
        const { legs: potentialBetLegs, betType, quote, stake, id } = potentialBet;

        if (!quote || !stake) return acc;

        const { price } = quote;

        const betDefinitions = buildRequestInputBet(id, betType, price, potentialBetLegs, legs, stake);

        if (!betDefinitions) return acc;

        acc.push(betDefinitions);
        return acc;
      },
      [],
    );

    const requestInput = { customerRef: buildObbCustomerReference(), betDefinitions: betsToBePlaced };

    const result: BetslipObbPlaceBetResponse = yield call(
      catalogueService.placeObbBet,
      requestInput,
      throttleOverrides,
    );

    const placeBetResponse = result.obbPlaceBet;

    if (placeBetResponse.result.resultCode !== "SUCCESS") {
      const shouldUpdateQuotes = placeBetResponse.betPlacementsResult
        ? checkIfQuotesShouldBeUpdated(placeBetResponse.betPlacementsResult)
        : false;

      if (shouldUpdateQuotes) {
        yield put<BettingObbUpdateQuotesAction>({
          type: BETTING__OBB_UPDATE_QUOTES,
        });
      }

      yield put<PlaceObbBetFailureAction>({
        type: NETWORK__OBB_PLACE_BET_FAILURE,
        payload: {
          betPlacementResponse: placeBetResponse,
        },
      });
    } else {
      yield put<PlaceObbBetSuccessAction>({
        type: NETWORK__OBB_PLACE_BET_SUCCESS,
        payload: {
          ...buildObbReport(placeBetResponse, obbBetting),
        },
      });
    }
  } catch {
    yield put<PlaceObbBetFailureAction>({
      type: NETWORK__OBB_PLACE_BET_FAILURE,
      payload: {
        betPlacementResponse: {
          result: {
            resultCode: "GENERAL_FAILURE",
            errorDetails: null,
          },
          betPlacementsResult: [],
        },
      },
    });
  }
}

function* implyBets(): SagaIterator {
  try {
    const [throttleOverrides, obbBetting]: [ThrottleOverrides, ObbBettingState] = yield all([
      select((state: ApplicationState) => getOverridenThrottles(state.entities)),
      select(getObbBettingState),
      put<ImplyObbBetsInProgressAction>({
        type: NETWORK__OBB_IMPLY_BETS_IN_PROGRESS,
      }),
    ]);

    const { legs } = obbBetting;

    const implyRequestInput = Object.values(legs).reduce<ImplyBetsRequestInput>(
      (acc, leg) => {
        const { id, event, params, templateId } = leg;
        const { eventId } = event;

        if (templateId === "xOfN") {
          return acc;
        }

        acc.betDefinitions.push({
          id,
          eventId: {
            id: eventId.toString(),
            supplier: Supplier.Sportex,
          },
          expressionTemplateId: templateId,
          expressionParams: params as ExpressionParamsInput,
        });

        return acc;
      },
      { betDefinitions: [] },
    );

    const implyResult = yield call(catalogueService.implyObbBets, implyRequestInput, throttleOverrides);

    const {
      obb: { implyBets: implyBetsResponse },
    } = implyResult;

    yield put<ImplyObbBetsSuccessAction>({
      type: NETWORK__OBB_IMPLY_BETS_SUCCESS,
      payload: {
        implyBetsResponse,
      },
    });
  } catch (error) {
    yield put<ObbImplyBetsRequestFailureAction>({
      type: NETWORK__OBB_IMPLY_BETS_REQUEST_FAILURE,
      payload: {
        error,
      },
    });
  }
}

function* fetchOBBQuotes(action: BettingObbUpdateQuotesAction): SagaIterator {
  try {
    const { clearOnFailure } = action.payload || {};

    const [throttleOverrides, obbBettingLegs]: [ThrottleOverrides, ObbLegMap] = yield all([
      select((state: ApplicationState) => getOverridenThrottles(state.entities)),
      select(getObbBettingLegs),
    ]);

    if (!Object.values(obbBettingLegs).length) {
      return;
    }

    const mappedBettingLegsByEvent = mapObbBettingLegsByEvent(obbBettingLegs);
    const legQuotesRequests = Object.keys(mappedBettingLegsByEvent).map((eventId) => {
      const legsToQuote = mappedBettingLegsByEvent[eventId];
      const quoteInputLegs = buildBetslipQuoteInputLegs(legsToQuote);

      return call(
        catalogueService.getObbQuotes,
        {
          eventId: {
            id: eventId,
            supplier: Supplier.Sportex,
          },
          toQuote: quoteInputLegs,
        },
        throttleOverrides,
      );
    });

    yield put<ObbQuotesUpdateInProgressAction>({ type: NETWORK__OBB_QUOTES_UPDATE_IN_PROGRESS });

    const results: ObbQuotesQuery[] = yield all(legQuotesRequests);

    const legsQuotes = results.flatMap((result) => {
      if (!result.obb) {
        return [];
      }

      const { quotes } = result.obb;

      return quotes.prices;
    });

    yield put<ObbQuotesUpdateSuccessAction>({
      type: NETWORK__OBB_FETCH_LEG_QUOTES_SUCCESS,
      payload: {
        legsQuotes,
        clearOnFailure,
      },
    });
  } catch (error) {
    yield put<ObbQuotesUpdateFailureAction>({
      type: NETWORK__OBB_FETCH_LEG_QUOTES_FAILURE,
      payload: { error },
    });
  }
}

export function* obbBettingSaga(): SagaIterator {
  yield takeEvery(BETTING__OBB_UPDATE_QUOTES, fetchOBBQuotes);
  yield takeLeading(BETTING__OBB_PLACE_BETS, placeBet);
  yield takeLatest(BETTING__OBB_IMPLY_BETS, implyBets);
}
