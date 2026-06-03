/* eslint-disable */
import { call, put, select, takeLatest } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import URN from "../state/layout/URN";
import {
  ACCEPT_PROMOTION,
  AcceptPromotion,
  CancelPromotion,
  CANCEL_PROMOTION,
  DEPOSIT_NAVIGATION,
  DepositNavigation,
  REFRESH_PROMOTION,
  RefreshPromotion,
  ADD_INTERACTIVE_RESPONSE_ERROR,
  AddInteractiveResponseError,
  RemoveInteractiveResponseError,
  CLEAR_ERROR_MESSAGE,
  ClearErrorMessage,
  REMOVE_INTERACTIVE_RESPONSE_ERROR,
} from "../actions/promotion";
import {
  FetchCatalogueSuccessAction,
  FETCH_CATALOGUE_SUCCESS,
  FetchCatalogueFailureAction,
  FETCH_CATALOGUE_FAILURE,
} from "../actions/catalogue";
import catalogService from "../services/catalogue/catalogue-service";
import { getBonusInstanceCode } from "../state/entities/ims-promotions/ims-promotion-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { PushAction, PUSH } from "../actions/router";
import catalogueService from "../services/catalogue/catalogue-service";
import { AcceptPromotionMutation } from "../clients/catalogue/catalogue-response-types";
import { TransformedLayout } from "../services/catalogue/catalogue-types";
import { getOverridenThrottles } from "../state/entities/throttles/throttles-selectors";
import { ViewLink } from "../state/layout/views/ViewLink.types";

function buildAcceptedPromotionStateLayout(response: AcceptPromotionMutation): TransformedLayout {
  if (!response?.acceptPromotion?.promotion) {
    return {
      data: {},
    };
  }

  return {
    data: {
      ImsPromotion: [
        {
          typename: "ImsPromotion",
          ...response.acceptPromotion.promotion,
        },
      ],
    },
  };
}

export function* acceptPromotion(urn: URN, amount?: number): SagaIterator {
  try {
    const throttleOverrides = yield select((state: ApplicationState) => getOverridenThrottles(state.entities));
    const result = yield call(catalogService.acceptImsPromotion, urn, amount, throttleOverrides);
    const acceptResult = result?.acceptPromotion;
    const { responseCode, responseMessage } = acceptResult ?? {};
    const promotion = acceptResult?.promotion;

    if (responseCode !== 0) {
      yield put<AddInteractiveResponseError>({
        type: ADD_INTERACTIVE_RESPONSE_ERROR,
        payload: {
          urn,
          data: { responseCode, responseMessage },
        },
      });
    }

    if (!promotion || !promotion.layout) {
      return;
    }

    yield put<FetchCatalogueSuccessAction>({
      type: FETCH_CATALOGUE_SUCCESS,
      payload: buildAcceptedPromotionStateLayout(result),
    });
  } catch (error) {
    if (error instanceof Error) {
      yield put<FetchCatalogueFailureAction>({
        type: FETCH_CATALOGUE_FAILURE,
        payload: { error },
      });
    } else {
      yield put<FetchCatalogueFailureAction>({
        type: FETCH_CATALOGUE_FAILURE,
        payload: { error: new Error(`Unknown error ${error}`) },
      });
    }
  }
}

export function* cancelPromotion(urn: URN): SagaIterator {
  const bonusInstanceCode = yield select((state: ApplicationState) => {
    return getBonusInstanceCode(state.entities.imspromotions, urn);
  });

  const currentUrl = yield select((state: ApplicationState) => {
    return state.router.currentUrl;
  });

  const queryParams = currentUrl?.split("?")[1];
  const params = new URLSearchParams(queryParams);

  const returnUrl = params.get("url");
  const returnUrn = params.get("urn");
  const returnViewLink =
    returnUrn && returnUrl
      ? {
          viewUrn: returnUrn,
          viewUrl: returnUrl,
        }
      : {
          viewUrn: "ppb:tbd:view:promotions:1",
          viewUrl: "casino/p-1",
        };

  try {
    const throttleOverrides = yield select((state: ApplicationState) => getOverridenThrottles(state.entities));
    const payload = yield call(catalogService.cancelImsPromotion, urn, bonusInstanceCode, throttleOverrides);

    const { responseCode, responseMessage } = payload.cancelPromotion;

    responseCode !== 0
      ? yield put<AddInteractiveResponseError>({
          type: ADD_INTERACTIVE_RESPONSE_ERROR,
          payload: {
            urn,
            data: { responseCode, responseMessage },
          },
        })
      : yield put<PushAction>({
          type: PUSH,
          payload: returnViewLink,
        });
  } catch (error) {
    if (error instanceof Error) {
      yield put<FetchCatalogueFailureAction>({
        type: FETCH_CATALOGUE_FAILURE,
        payload: { error },
      });
    } else {
      yield put<FetchCatalogueFailureAction>({
        type: FETCH_CATALOGUE_FAILURE,
        payload: { error: new Error(`Unknown error ${error}`) },
      });
    }
  }
}

export function* depositNavigationHandler(viewLink: ViewLink) {
  yield put<PushAction>({
    type: PUSH,
    payload: viewLink,
  });
}

export function* handleDepositNavigation(action: DepositNavigation): SagaIterator {
  const { viewLink } = action.payload;
  yield call(depositNavigationHandler, viewLink);
}

export function* refreshPromotion(urn: URN, promotion: string): SagaIterator {
  try {
    const throttleOverrides = yield select((state: ApplicationState) => getOverridenThrottles(state.entities));
    const router = yield select((state: ApplicationState) => state.router);

    const payload = yield call(
      catalogueService.getCards,
      [urn],
      undefined,
      undefined,
      undefined,
      undefined,
      throttleOverrides,
      router,
      undefined,
      undefined,
    );

    const promoData = payload?.entities?.imspromotions?.[promotion];

    if (promoData?.status === "COMPLETED") {
      const viewLink = yield select((state: ApplicationState) => {
        return { viewUrn: state.router.currentUrn, viewUrl: state.router.currentUrl };
      });

      yield put<PushAction>({
        type: PUSH,
        payload: viewLink,
      });
    }

    yield put<FetchCatalogueSuccessAction>({
      type: FETCH_CATALOGUE_SUCCESS,
      payload,
    });
  } catch (error) {
    if (error instanceof Error) {
      yield put<FetchCatalogueFailureAction>({
        type: FETCH_CATALOGUE_FAILURE,
        payload: { error },
      });
    } else {
      yield put<FetchCatalogueFailureAction>({
        type: FETCH_CATALOGUE_FAILURE,
        payload: { error: new Error(`Unknown error ${error}`) },
      });
    }
  }
}

export function* clearErrorMessage(urn: URN): SagaIterator {
  yield put<ClearErrorMessage>({
    type: CLEAR_ERROR_MESSAGE,
    payload: {
      urn,
      data: {},
    },
  });
}

export function* handleAcceptPromotion(action: AcceptPromotion): SagaIterator {
  const { urn, amount } = action.payload;
  yield call(acceptPromotion, urn, amount);
}

export function* handleCancelPromotion(action: CancelPromotion): SagaIterator {
  const { urn } = action.payload;
  yield call(cancelPromotion, urn);
}

export function* handleRefreshPromotion(action: RefreshPromotion): SagaIterator {
  const { urn, promotion } = action.payload;

  yield call(refreshPromotion, urn, promotion);
}

export function* handleClearErrorMessage(action: RemoveInteractiveResponseError): SagaIterator {
  const { urn } = action.payload;

  yield call(clearErrorMessage, urn);
}

export function* imsPromotionSaga(): SagaIterator {
  yield takeLatest(ACCEPT_PROMOTION, handleAcceptPromotion);
  yield takeLatest(CANCEL_PROMOTION, handleCancelPromotion);
  yield takeLatest(DEPOSIT_NAVIGATION, handleDepositNavigation);
  yield takeLatest(REFRESH_PROMOTION, handleRefreshPromotion);
  yield takeLatest(REMOVE_INTERACTIVE_RESPONSE_ERROR, handleClearErrorMessage);
}
