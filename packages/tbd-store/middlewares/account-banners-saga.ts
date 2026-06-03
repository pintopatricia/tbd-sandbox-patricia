import { call, put, takeLatest } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import URN from "../state/layout/URN";
import {
  UpdateCurrentBannerAction,
  UPDATE_CURRENT_BANNER,
  SetErrorBannerAction,
  SET_ERROR_BANNER,
  BannerActionRequest,
  BANNER_ACTION_REQUEST,
} from "../actions/catalogue";

import bannersService from "../services/max/banners-service";
import { BannerCTA } from "../state/layout/cards/Card.types";

type Request = {
  urn: URN;
  index: number;
  bannerAction: BannerCTA;
};

/**
 * Request data and put the payload
 */
export function* request({ urn, index, bannerAction: { data, action, actionFinalize } }: Request): SagaIterator {
  // if success it should skip to the next banner (set the currentBanner to the next one or it should set to null if there are no banners left)
  try {
    if (data && action) {
      yield call(bannersService.handleBannerAction, data, action);
      yield put<UpdateCurrentBannerAction>({
        type: UPDATE_CURRENT_BANNER,
        payload: { urn, index },
      });
    }
    // if it fails should show the error banner
  } catch {
    if (actionFinalize && actionFinalize.onErrorBanner) {
      yield put<SetErrorBannerAction>({
        type: SET_ERROR_BANNER,
        payload: { urn, errorBanner: actionFinalize.onErrorBanner },
      });
    }
  }
}

export function* handleBannerActionRequest(action: BannerActionRequest): SagaIterator {
  const data = action.payload;
  yield call(request, data);
}

export function* bannerActionRequestSaga(): SagaIterator {
  yield takeLatest(BANNER_ACTION_REQUEST, handleBannerActionRequest);
}
