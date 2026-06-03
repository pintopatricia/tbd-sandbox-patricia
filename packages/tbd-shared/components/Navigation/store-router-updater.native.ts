import {
  NativeEntityTypes,
  NativeViewLink,
  navigationRef,
  ScreenName,
  ThirdPartyScreenName,
  ThirdPartyScreenNameType,
} from "@ppb/tbd-router/native";
import analytics from "@react-native-firebase/analytics";
import { MyBetsResetFilters, MY_BETS_RESET_FILTERS } from "@ppb/tbd-store/actions/my-bets";
import { DELETE_VIEW, DeleteViewAction } from "@ppb/tbd-store/actions/catalogue";
import {
  PushSameViewAction,
  PUSH_SAME_VIEW,
  REFRESH,
  RefreshAction,
  APOLLO_VIEW_PUSH,
  ApolloViewPushAction,
} from "@ppb/tbd-store/actions/router";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { Route } from "@react-navigation/native";
import { Store } from "redux";
import {
  QUANTUM_METRIC__SEND_NEW_PAGE_NAMED,
  QuantumMetricSendNewPageNamedAction,
} from "@ppb/tbd-store/actions/quantum-metric";
import { dispatchRoutePushAction } from "@ppb/tbd-store/helpers/store";
import { QUALTRICS__SEND_NEW_PAGE_NAMED, QualtricsSendAction, QualtricsView } from "@ppb/tbd-store/actions/qualtrics";
import { close as closeHamburgerMenu } from "@ppb/tbd-store/state/hamburger-menu";
import { resetApolloCacheWithAppContext } from "../../apollo-client/client";
import { updateOneTrustJavascriptWithinCET } from "../../cookie-consent/cookie-consent.native";

let currentRoute: Route<string> | undefined;

/**
 * Temporary logging - To explore options for cloud logging with Firebase.
 */
const log = (message: string, details = ""): void => {
  if (__DEV__) {
    console.log(message, details);
  }
};

function isApolloViewNavigation(store: Store<ApplicationState>, type: EntityType): boolean {
  const throttles = store.getState().entities.throttles;

  // Player view is always an apollo view
  if (type === EntityType.PlayerView) {
    return true;
  }

  // Race meeting view is always an apollo view
  if (type === EntityType.RaceMeetingView) {
    return true;
  }

  // Race view is an apollo view if the RACE_MEETING_VIEW throttle is active
  if (type === EntityType.RaceView && throttles["RACE_MEETING_VIEW"]?.isActive) {
    return true;
  }

  return false;
}

/**
 * When navigation changes occur in a React Navigation context we are required
 * to sync up the store with the focused screen route.
 * @param store The application store
 */
export const updateStoreRoute = (store: Store<ApplicationState>): void => {
  const previousRoute = currentRoute;
  currentRoute = navigationRef.current?.getCurrentRoute();
  const params = currentRoute?.params as {
    viewLink: NativeViewLink;
  };
  const previousParams = previousRoute?.params as {
    viewLink: NativeViewLink;
  };

  // React Native applications run inside a single Activity/ViewController,
  // meaning any screen changes won't be tracked by the native Firebase SDKs.
  // To track screen changes in a React Native application, you need to call the
  // logScreenView method in the Firebase Analytics SDK.
  // https://rnfirebase.io/analytics/screen-tracking
  if (currentRoute) {
    analytics().logScreenView({
      screen_name: currentRoute.name,
      screen_class: currentRoute.name,
    });
  }

  if (params?.viewLink?.viewUrn) {
    if (previousParams?.viewLink?.viewUrn !== params.viewLink.viewUrn) {
      store.dispatch<QuantumMetricSendNewPageNamedAction>({
        type: QUANTUM_METRIC__SEND_NEW_PAGE_NAMED,
        payload: {
          pageName: params.viewLink.viewUrn,
        },
      });
    }

    if (
      previousParams?.viewLink?.viewUrn !== params.viewLink.viewUrn &&
      params.viewLink.viewUrn === NativeEntityTypes.Home
    ) {
      store.dispatch<QualtricsSendAction>({
        type: QUALTRICS__SEND_NEW_PAGE_NAMED,
        payload: {
          pageName: QualtricsView.Home,
        },
      });
    }
  }

  // When the BottomBar navigator is mounted (previous route), the next route defaults
  // to Home (ppb:tbd:view:generic:home) or Maintenance View (ppb:tbd:view:maintenance:maintenance),
  // when splashed. At this point, the App Context middleware would have already made a call to
  // the Catalogue for requesting the bottom bar along with the Home layout. For performance's
  // sake, as soon as the HomeNavigator mounts, the return block below will prevent a second call
  // to the Catalogue to request the Home layout during launch time.
  if (
    previousRoute?.name === ScreenName.BottomBar &&
    (currentRoute?.name === NativeEntityTypes.Home || currentRoute?.name === EntityType.MaintenanceView)
  ) {
    return;
  }

  // When we are navigate to an external view page, the push action should not be trigger.
  // the return block below will prevent the dispatch and consequently redirect to the 404 page.
  // This error was found in a PromotionCard when we are open an external url inside a webview
  if (currentRoute?.name === EntityType.ExternalView || currentRoute?.name === EntityType.GamingExternalView) {
    return;
  }

  if (params?.viewLink?.viewUrn) {
    const { viewUrn, viewUrl } = params.viewLink;

    // whenever we're navigating away from a maintenace view/screen (e.g. in a partial product splash) dispatch a
    // delete_view and a refresh action so that we always do a new request to BFF to check the current splash status
    // and reset the layout state
    if (
      (previousRoute?.name === EntityType.MaintenanceView && currentRoute?.name !== EntityType.MaintenanceView) ||
      (previousRoute?.name === ScreenName.RootMaintenanceScreen &&
        currentRoute?.name !== ScreenName.RootMaintenanceScreen)
    ) {
      store.dispatch<DeleteViewAction>({
        type: DELETE_VIEW,
        payload: viewUrn,
      });
      store.dispatch<RefreshAction>({
        type: REFRESH,
        payload: {
          urn: viewUrn,
          shouldRefreshBottomBar: true,
        },
      });

      resetApolloCacheWithAppContext();

      return;
    }

    // Apollo views need to be handled differently than other views because they are not using the same push action
    if (isApolloViewNavigation(store, currentRoute?.name as EntityType)) {
      store.dispatch(closeHamburgerMenu());

      store.dispatch<ApolloViewPushAction>({
        type: APOLLO_VIEW_PUSH,
        payload: {
          viewUrn,
          viewUrl: viewUrl || "",
          type: currentRoute?.name as EntityType,
        },
      });
      return;
    }

    if (currentRoute?.name === EntityType.MyBetsView) {
      if (params?.viewLink?.isDeepLink) {
        // when navigation to my bets is made trough a deepLink, the filters should be reset in order to be filled with
        // data from bff response
        store.dispatch<MyBetsResetFilters>({
          type: MY_BETS_RESET_FILTERS,
        });
      }
      const myBetsViewUrn = (!params?.viewLink?.isDeepLink && store.getState().layouts.cards.mybets.viewUrn) || viewUrn;

      dispatchRoutePushAction(store, myBetsViewUrn);
    } else {
      const { currentUrn, currentUrl } = store.getState().router;
      const isSameView = viewUrn === currentUrn && viewUrl === currentUrl;
      const isSameScreen = currentRoute?.name === previousRoute?.name;

      /* In some scenarios React Navigation will trigger *updateStoreRoute* multiple times in the same navigation
      like when performing a navigation that forces a specific tab to open (e.g. deep links, browse, mybets, gaming).
      If we allow the dispatch below to happen every one of those times, we'll end up with duplicated cards and that's no bueno.
      This is an attempt to prevent that by validating if we are trying to push to the same route we are already in. */
      // since some gaming navigations aren't using the viewUrn param (thus not updating the router state with a PUSH action), we're comparing the screens too
      if (!isSameView || !isSameScreen) {
        dispatchRoutePushAction(store, viewUrn, viewUrl);
      } else {
        store.dispatch<PushSameViewAction>({
          type: PUSH_SAME_VIEW,
          payload: {
            viewUrn,
            viewUrl,
          },
        });
      }
    }
  } else if (
    currentRoute?.name &&
    Object.values(ThirdPartyScreenName).includes(currentRoute.name as ThirdPartyScreenNameType)
  ) {
    // We must call to send CET the updated consent javascript
    updateOneTrustJavascriptWithinCET();
    log("Open CET screen");
  } else {
    log("updateStoreRoute Invalid `viewUrn`");
  }
};
