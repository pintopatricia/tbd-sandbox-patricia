import { SagaIterator } from "redux-saga";
import { call, fork, ForkEffect, put, retry, select, spawn, takeLatest, takeLeading } from "redux-saga/effects";
import { EntityType } from "@ppb/tbd-urn-codecs";
import {
  FetchCatalogueAction,
  FetchCatalogueAuthFailureAction,
  FetchCatalogueFailureAction,
  FetchCatalogueInProgressAction,
  FetchCatalogueSuccessAction,
  DeleteLayoutAction,
  FETCH_CATALOGUE,
  FETCH_CATALOGUE_FAILURE,
  FETCH_CATALOGUE_AUTH_FAILURE,
  FETCH_CATALOGUE_IN_PROGRESS,
  FETCH_CATALOGUE_SUCCESS,
  DELETE_LAYOUT,
  FETCH_CATALOGUE_EMPTY_VIEW_FAILURE,
  FetchCatalogueEmptyViewFailureAction,
  PUSH,
  PushAction,
  REFRESH,
  RefreshAction,
  RefreshInProgressAction,
  REFRESH_IN_PROGRESS,
} from "../actions";
import {
  SwitchProductPreferenceAction,
  UPDATE_PRODUCT_PREFERENCE,
  UI__SWITCH_PRODUCT_PREFERENCE,
  UpdateProductPreferenceAction,
} from "../actions/preferences";
import { MaintenanceToProduct, UI__MAINTENANCE_TO_PRODUCT } from "../actions/navigation";
import { FILLED_CARDS_PER_CARD_GROUP, FILLED_CARDS_PER_VIEW } from "../config/common-config";
import { isHttpUnauthorizedError } from "../helpers/error-parsing";
import catalogueService, { CatalogueServiceLayout } from "../services/catalogue/catalogue-service";
import { RouterState, ApplicationState } from "../state";
import { getActiveThrottles } from "../state/entities/throttles/throttles-selectors";
import { createViewByURNSelector, createFindCachedViewByURNSelector } from "../state/layout/views/view-selectors";
import { getUserDetails } from "../state/entities/user-details/user-details-selectors";
import { createContextForBFFSelector } from "../state/entities/isomorphic-selectors";
import { MyBetsViews, View } from "../state/layout/views/View.types";
import URN from "../state/layout/URN";

const MAX_TRIES = 3;
const RETRY_DELAY = 2000;
let withBottomBar = true;
let withLeftSidebar = true;
let withRegulatoryData = true;
let decorationsOnlyOverride: boolean | undefined;
let userLoggedInState: boolean;
const withPageInfo = true;

const getCachedViewByURN = createFindCachedViewByURNSelector();
const getMyBetsViewByURN = createViewByURNSelector<MyBetsViews, URN>();

const getContextForBFF = createContextForBFFSelector();

/**
 * Method that will request the catalog layout
 *
 * @param urn The urn to request
 */
function* request(urn: string): SagaIterator {
  const { loggedIn } = yield select(getUserDetails);
  const router = yield select((state: ApplicationState) => state.router);

  const { userPreferences, productExclusions, experiments, throttleOverrides }: ReturnType<typeof getContextForBFF> =
    yield select((state: ApplicationState) => getContextForBFF(state.entities, state.router));

  const throttles: string[] = yield select((state: ApplicationState) => getActiveThrottles(state.entities.throttles));

  const requestNoCards = throttles.includes("REQUEST_NO_CARDS");
  const decorationsOnly = decorationsOnlyOverride ?? [EntityType.PlayerView].includes(router.currentView);
  decorationsOnlyOverride = undefined;

  /*
  The regulatory data will be requested if the app context sent a different loggedIn state.
  This will refresh the regulatory data based on user authentication, as we want to hide the regulatory data's
  session items if the user logs out.
  */
  if (userLoggedInState !== loggedIn) {
    userLoggedInState = loggedIn;
    withRegulatoryData = true;
  }

  const response: CatalogueServiceLayout = yield call(
    catalogueService.getLayout,
    urn,
    FILLED_CARDS_PER_CARD_GROUP,
    requestNoCards ? 0 : FILLED_CARDS_PER_VIEW,
    withBottomBar,
    withLeftSidebar,
    withRegulatoryData,
    withPageInfo,
    undefined,
    userPreferences,
    productExclusions,
    router.currentUrl,
    experiments,
    throttleOverrides,
    decorationsOnly,
  );

  // check if catalogue response returns empty view
  if (Object.keys(response.data).length === 0) {
    yield put<FetchCatalogueEmptyViewFailureAction>({
      type: FETCH_CATALOGUE_EMPTY_VIEW_FAILURE,
    });
  }

  if (response?.data.BottomBar) {
    withBottomBar = false; // request bottom bar only on first request if bottom bar is fetched
  }

  if (response?.data.LeftSidebar) {
    withLeftSidebar = false; // request left sidebar only on first request if left sidebar is fetched
  }

  if (response?.data.RegulatoryData) {
    withRegulatoryData = false; // request regulatoryData only on first request if regulatoryData is fetched
  }

  return response;
}

/**
 * Saga that will retry the request in case of failure and dispatch the
 * correct actions for each state (success, in progress and failure)
 *
 * @param urn The urn to request
 */
function* retryRequestSaga(urn: string): SagaIterator {
  try {
    yield put<FetchCatalogueInProgressAction>({
      type: FETCH_CATALOGUE_IN_PROGRESS,
      payload: urn,
    });

    const response = yield retry(MAX_TRIES, RETRY_DELAY, request, urn);
    yield put<FetchCatalogueSuccessAction>({
      type: FETCH_CATALOGUE_SUCCESS,
      payload: { ...response, requestedUrns: [urn] },
    });
  } catch (error) {
    const isErrorInstance = error instanceof Error;
    if (isErrorInstance && isHttpUnauthorizedError(error)) {
      yield put<FetchCatalogueAuthFailureAction>({
        type: FETCH_CATALOGUE_AUTH_FAILURE,
        urn,
      });
    } else {
      yield put<FetchCatalogueFailureAction>({
        type: FETCH_CATALOGUE_FAILURE,
        payload: {
          error: isErrorInstance ? error : new Error(`Unknown error ${error}`),
          urn,
        },
      });
    }
  }
}

function* handlePushAction(action: PushAction): SagaIterator {
  const { viewUrn } = action.payload;

  if (viewUrn.includes(EntityType.ExternalView)) {
    return;
  }

  const view: View | null = yield select((state: ApplicationState) => getCachedViewByURN(state, viewUrn));

  // FIXME: Browse Page has a default state so we can't rely of this selector
  const isBrowsePage = ["ppb:tbd:view:browse:sports", "ppb:tbd:view:browse:gaming"].includes(viewUrn);

  // If is MyBets Page, data should be refreshed, so a new request should be done
  const isMyBetsPage = !!(yield select((state: ApplicationState) =>
    getMyBetsViewByURN(state.layouts.views.mybets, viewUrn),
  ));

  if (!view || isBrowsePage || isMyBetsPage) {
    yield fork(retryRequestSaga, viewUrn);
  }
}

function* handleFetchCatalogue(action: FetchCatalogueAction): SagaIterator {
  const {
    urn,
    withBottomBar: shouldRefreshBottomBar,
    withLeftSidebar: shouldRefreshLeftSidebar,
    decorationsOnly,
  } = action.payload;

  if (decorationsOnly) {
    // Preserve dedup: only fetch a decoration we don't already have.
    withBottomBar = withBottomBar && !!shouldRefreshBottomBar;
    withLeftSidebar = withLeftSidebar && !!shouldRefreshLeftSidebar;

    // If everything is cached, skip the BFF call — avoids a wasteful round-trip
    // and a false FETCH_CATALOGUE_EMPTY_VIEW_FAILURE dispatch. The override must
    // only be set when we will actually run `request`, otherwise it leaks into
    // the next unrelated navigation and forces decorationsOnly on its view query.
    if (!withBottomBar && !withLeftSidebar && !withRegulatoryData) {
      return;
    }
    decorationsOnlyOverride = true;
  } else {
    withBottomBar = !!shouldRefreshBottomBar;
    withLeftSidebar = !!shouldRefreshLeftSidebar;
    decorationsOnlyOverride = decorationsOnly;
  }

  yield spawn(retryRequestSaga, urn);
}

function* handleProductSwitcher(action: SwitchProductPreferenceAction): SagaIterator {
  const { productSwitcherPreference } = action.payload;

  const router: RouterState = yield select((state: ApplicationState) => state.router);

  if (!router.currentUrn) {
    return;
  }

  withBottomBar = true;
  withLeftSidebar = true;

  yield put<UpdateProductPreferenceAction>({
    type: UPDATE_PRODUCT_PREFERENCE,
    payload: {
      productSwitcherPreference,
    },
  });

  yield put<DeleteLayoutAction>({
    type: DELETE_LAYOUT,
  });

  withBottomBar = true;
  withLeftSidebar = true;

  yield call(retryRequestSaga, router.currentUrn);
}

function* handleRefresh(action: RefreshAction): SagaIterator {
  const { shouldRefreshBottomBar = false } = action.payload;

  const router = yield select((state: ApplicationState) => state.router);

  const urn = action.payload.urn || router.currentUrn;
  withBottomBar = shouldRefreshBottomBar;
  withLeftSidebar = true;

  yield put<RefreshInProgressAction>({
    type: REFRESH_IN_PROGRESS,
    payload: { urn },
  });

  yield put<DeleteLayoutAction>({
    type: DELETE_LAYOUT,
  });

  try {
    const response = yield call(request, urn);

    yield put<FetchCatalogueSuccessAction>({
      type: FETCH_CATALOGUE_SUCCESS,
      payload: { ...response, requestedUrns: [urn] },
    });
  } catch (error) {
    const isErrorInstance = error instanceof Error;
    if (isErrorInstance && isHttpUnauthorizedError(error)) {
      yield put<FetchCatalogueAuthFailureAction>({
        type: FETCH_CATALOGUE_AUTH_FAILURE,
      });
    } else {
      yield put<FetchCatalogueFailureAction>({
        type: FETCH_CATALOGUE_FAILURE,
        payload: {
          error: error instanceof Error ? error : new Error(`Unknown error ${error}`),
          urn,
        },
      });
    }
  }
}

function* loadCatalogueForProduct(action: MaintenanceToProduct): SagaIterator {
  withBottomBar = true;
  withLeftSidebar = true;

  yield put<PushAction>({
    type: PUSH,
    payload: action.payload.viewLink,
  });
}

/**
 * Saga that takes every `FETCH_CATALOGUE` request and trigger the request
 */
export function* fetchCatalogueSaga(): IterableIterator<ForkEffect> {
  yield takeLatest(PUSH, handlePushAction);
  yield takeLatest(FETCH_CATALOGUE, handleFetchCatalogue);
  yield takeLatest(REFRESH, handleRefresh);
  yield takeLeading(UI__SWITCH_PRODUCT_PREFERENCE, handleProductSwitcher);
  yield takeLeading(UI__MAINTENANCE_TO_PRODUCT, loadCatalogueForProduct);
}
