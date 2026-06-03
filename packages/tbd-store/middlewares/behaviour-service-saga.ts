import { SagaIterator } from "redux-saga";
import { takeLatest, select, call } from "redux-saga/effects";
import { TrackableItem } from "../state/tagging/BehaviourService.types";
import { ApplicationState } from "../state/ApplicationState.types";
import { createFindViewByURNSelector } from "../state/layout/views/view-selectors";
import { BehaviourTracker, TRACKING_EVENT_NAMES } from "../services/behaviour-tracking";

import {
  LaunchGame,
  NavigateToGameCategoryView,
  NavigateToCategoryUsingSeeAllButton,
  UI__LAUNCH_GAME,
  UI__NAVIGATE_TO_GAMING_CATEGORY_USING_CATEGORY_LINK_CARD,
  UI__NAVIGATE_TO_GAMING_CATEGORY_USING_SEE_ALL_BUTTON,
} from "../actions/navigation";

import { LOYALTY__RECEIVE_MESSAGE, ReceiveLoyaltyMessageAction } from "../actions/loyalty-messaging";

import { getApplicationKey } from "../config/application-key";
import { PAGE_LOAD_SUCCESS } from "../actions/catalogue";
import { getHttpClientsConfig } from "../services/client-factory";
import { RouterState } from "../state/router/RouterState.types";
import { getLayoutMetadata } from "../state/layout-snapshot";

let behaviour: BehaviourTracker;

type actionTypes = LaunchGame | NavigateToGameCategoryView | NavigateToCategoryUsingSeeAllButton;
export function* handleTrackingBehaviourService(action: actionTypes): SagaIterator {
  const { href, cardUrn } = action.payload;
  const getViewByViewUrn = createFindViewByURNSelector();

  let viewUrn: RouterState["currentUrn"] = yield select((state: ApplicationState) => state.router.currentUrn);

  if (!viewUrn && "viewUrn" in action.payload) {
    viewUrn = action.payload.viewUrn;
  }

  // initialize library once
  if (!behaviour) {
    const CBS_ENDPOINT = getHttpClientsConfig().ENDPOINTS.CBS;

    behaviour = new BehaviourTracker();
    yield call(behaviour.initLibrary, CBS_ENDPOINT, getApplicationKey());

    // track initial page view
    const url = yield select(
      (state: ApplicationState) => getViewByViewUrn(state.layouts.views, viewUrn || "")?.url ?? href,
    );

    behaviour.triggerEvent(TRACKING_EVENT_NAMES.PAGE_VIEW, { uri: url, urn: viewUrn || cardUrn });
  }

  switch (action.type) {
    case UI__LAUNCH_GAME: {
      const { gameUrn } = action.payload;
      const metadata = getLayoutMetadata(cardUrn);

      const formattedGameUrn = `ppb:game:${gameUrn.split("/")[1]}`;
      const trackableItem: TrackableItem = { urn: formattedGameUrn, container: metadata.cardGroupUrn || "" };

      behaviour.triggerEvent(TRACKING_EVENT_NAMES.GAME_LAUNCH, { gameId: formattedGameUrn, item: trackableItem });
      break;
    }
    case UI__NAVIGATE_TO_GAMING_CATEGORY_USING_CATEGORY_LINK_CARD:
    case UI__NAVIGATE_TO_GAMING_CATEGORY_USING_SEE_ALL_BUTTON: {
      behaviour.triggerEvent(TRACKING_EVENT_NAMES.NAVIGATE, { uri: href });
      break;
    }
    default:
  }
}

export function* handleLoyaltyMessageTracking(action: ReceiveLoyaltyMessageAction): Generator {
  if (!behaviour) {
    const CBS_ENDPOINT = getHttpClientsConfig().ENDPOINTS.CBS;

    behaviour = new BehaviourTracker();
    yield behaviour.initLibrary(CBS_ENDPOINT, getApplicationKey());
  }

  const {
    correlationId,
    message: { urn },
  } = action.payload.content;

  if (urn && correlationId) {
    behaviour.triggerEvent(TRACKING_EVENT_NAMES.EXPOSE, { urn, correlationId });
  }
}

export function* handlePageViewTracking(): Generator {
  const getViewByViewUrn = createFindViewByURNSelector();

  if (!behaviour) {
    const CBS_ENDPOINT = getHttpClientsConfig().ENDPOINTS.CBS;

    behaviour = new BehaviourTracker();
    yield behaviour.initLibrary(CBS_ENDPOINT, getApplicationKey());
  }

  let uri;
  /**
   *  for web apps, URI should be the current page URL
   */
  if (window?.location) {
    uri = window?.location?.href;
  } else {
    // for native apps, URI should be the relative path to the given page
    uri = yield select(
      (state: ApplicationState) => state.router.currentUrl || "/", // fallback to "/" root path in case there's no relative path
    );
  }

  const view = (yield select((state: ApplicationState) => {
    const viewURN = state.router.currentUrn;
    return viewURN ? getViewByViewUrn(state.layouts.views, viewURN) : null;
  })) as ReturnType<typeof getViewByViewUrn>; // related issue https://github.com/redux-saga/redux-saga/issues/2015

  let urn = null;
  if (view && view.typename) {
    switch (view.typename) {
      case "SportView":
        urn = view.sport;
        break;
      case "CompetitionView":
        urn = view.competition;
        break;
      case "EventView":
        urn = view.sportevent;
        break;
      case "MarketView":
        urn = view.mainMarket;
        break;
      case "RaceView":
        urn = view.race;
        break;

      default:
        break;
    }
  }

  // track page view except modals
  // TODO: View should be modal aware to avoid typename validations
  if (
    view &&
    view.typename !== "RunnerView" &&
    view.typename !== "ImsPromotionView" &&
    view.typename !== "SettingsView"
  ) {
    behaviour.triggerEvent(TRACKING_EVENT_NAMES.PAGE_VIEW, { uri, urn });
  }
}

export function* behaviourTrackingSaga(): SagaIterator {
  yield takeLatest(
    [
      UI__LAUNCH_GAME,
      UI__NAVIGATE_TO_GAMING_CATEGORY_USING_CATEGORY_LINK_CARD,
      UI__NAVIGATE_TO_GAMING_CATEGORY_USING_SEE_ALL_BUTTON,
    ],
    handleTrackingBehaviourService,
  );
  yield takeLatest(LOYALTY__RECEIVE_MESSAGE, handleLoyaltyMessageTracking);
  yield takeLatest(PAGE_LOAD_SUCCESS, handlePageViewTracking);
}
