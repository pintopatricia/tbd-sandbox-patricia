import { EntityType } from "@ppb/tbd-urn-codecs";
import { SagaIterator } from "redux-saga";
import { takeLatest, put, select } from "redux-saga/effects";
import { RouterState } from "../state/router/RouterState.types";
import { ApplicationState } from "../state/ApplicationState.types";
import { NavigateToEventViewFirstTime, UI__NAVIGATE_TO_EVENT_FIRST_TIME } from "../actions/navigation";
import { PUSH } from "../actions/router";
import { getBetslipVisibilityState } from "../state/betslip/betslip-card-selectors";
import { getUserDetails } from "../state/entities/user-details/user-details-selectors";

export function* handleNotificationHowToSubscribeEvent(): Generator {
  const wasNotificationHowToSubscribeEventsShown = yield select(
    (state: ApplicationState) => state.notifications.wasNotificationHowToSubscribeEventsShown,
  );

  const router = yield select((state: ApplicationState) => state.router);
  const { currentView } = router as RouterState;
  const isEventView = currentView === EntityType.EventView;

  const loggedIn = yield select((state: ApplicationState) => getUserDetails(state).loggedIn);

  const isBetslipOpened = yield select((state: ApplicationState) => getBetslipVisibilityState(state));
  const isBetslipCollapsed = yield select((state: ApplicationState) => state.betslip?.isCollapsed);

  if (
    !wasNotificationHowToSubscribeEventsShown &&
    isEventView &&
    loggedIn &&
    (!isBetslipOpened || isBetslipCollapsed)
  ) {
    yield put<NavigateToEventViewFirstTime>({
      type: UI__NAVIGATE_TO_EVENT_FIRST_TIME,
    });
  }
}

export function* pushHandlerSaga(): SagaIterator {
  yield takeLatest(PUSH, handleNotificationHowToSubscribeEvent);
}
