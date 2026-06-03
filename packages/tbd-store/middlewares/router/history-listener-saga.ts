import { eventChannel, SagaIterator } from "redux-saga";
import { call, cancelled, put, take } from "redux-saga/effects";
import { BackButtonClickAction, UI__BACK_BUTTON_CLICK } from "../../actions/navigation";
import { LocationKeyAction, LOCATION_KEY, PUSH, PushAction } from "../../actions/router";
import { ApplicationState } from "../../state";
import { ViewLink } from "../../state/layout/cards/ViewLink.types";
import { Action, History, Location } from "./history.types";

type HistoryChange = { location: Location<ViewLink>; type: Action };

function onHistoryChange(history: History<ViewLink>) {
  return eventChannel<HistoryChange>((emitter) => {
    const unregister = history.listen((location, type): void => {
      emitter({ location, type });
    });

    return () => {
      unregister();
    };
  });
}

export function createHistoryListenerSaga(history: History<ViewLink>, preloadedState: ApplicationState) {
  return function* historyListenerSaga(): SagaIterator {
    const viewLink = {
      viewUrn: preloadedState.router.currentUrn || "",
      viewUrl: preloadedState.router.currentUrl || "",
    };

    // Update first page impression with viewLink state and back button visibility
    history.replace(
      // @ts-expect-error TODO: Add reason why ts-ignore is needed here
      { pathname: history.location.pathname, search: history.location.search },
      { ...viewLink },
    );

    // Use the updated location key to update store
    yield put<LocationKeyAction>({
      type: LOCATION_KEY,
      payload: history.location.key || "",
    });

    const historyChannel: ReturnType<typeof onHistoryChange> = yield call(onHistoryChange, history);

    try {
      while (true) {
        const { location, type }: HistoryChange = yield take(historyChannel);

        yield put<LocationKeyAction>({
          type: LOCATION_KEY,
          payload: location.key || "",
        });

        // Trigger a new navigation with the stored state from previous navigations
        if (type === "POP" && location.state) {
          // Trigger GTM action for back button since POP is the action associated to back navigation
          // When returning to homepage with "?loginStatus=SUCCESS" we want to send an empty string to GTM
          const url = location.search === location.state.viewUrl ? "" : location.state.viewUrl;
          yield put<BackButtonClickAction>({
            type: UI__BACK_BUTTON_CLICK,
            payload: {
              url,
              text: "back",
              module: "header",
            },
          });
          yield put<PushAction>({
            type: PUSH,
            payload: location.state,
          });
        }
      }
    } finally {
      if (yield cancelled()) {
        historyChannel.close();
      }
    }
  };
}
