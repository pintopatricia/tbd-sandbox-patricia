import { FunctionComponent, useRef, useCallback, useState, useEffect } from "react";
import { Alert, AppState, Linking, Platform } from "react-native";
import { resetNavigationStack } from "@ppb/tbd-router/native";
import { NetworkStatus } from "@ppb/tbd-store/state/network-status/NetworkStatusState.types";
import { ComponentProps } from "./props";

const OfflineNotification: FunctionComponent<ComponentProps> = ({
  networkStatus,
  currentUrn,
  i18nLabels,
  dispatchFetchAppContext,
  bffEndpoint,
  latestBffEndpoint,
  appEnv,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const currentNetworkState = useRef<NetworkStatus>(undefined);

  const checkAppBootstrap = useCallback(() => {
    // if we're currently ONLINE but there's no currentUrn, the app didn't load completely (because it was offline)
    // then we need to fetch app context again
    if (currentNetworkState.current === "ONLINE" && !currentUrn) {
      resetNavigationStack();
      dispatchFetchAppContext(bffEndpoint, latestBffEndpoint, appEnv);
    }
  }, [currentUrn, dispatchFetchAppContext, bffEndpoint, latestBffEndpoint, appEnv]);

  const openDialog = useCallback(() => {
    setIsModalOpen(true);

    Alert.alert(i18nLabels.title, i18nLabels.text, [
      {
        text: i18nLabels.settings,
        onPress: () => {
          setIsModalOpen(false);

          if (Platform.OS === "ios") {
            Linking.openURL("App-prefs:");
          } else {
            Linking.sendIntent("android.settings.SETTINGS");
          }

          // since any button press will dismiss the alert, we need to check if we need to bootstrap the app again
          // (e.g. when user opened the app while offline) or just let the alert dialog close
          checkAppBootstrap();
        },
      },
      {
        text: i18nLabels.retry,
        onPress: () => {
          setIsModalOpen(false);

          // since any button press will dismiss the alert, we need to check if we need to bootstrap the app again
          // (e.g. when user opened the app while offline) or just let the alert dialog close
          checkAppBootstrap();
        },
      },
    ]);
  }, [checkAppBootstrap, i18nLabels]);

  useEffect(() => {
    currentNetworkState.current = networkStatus;

    if (networkStatus === "OFFLINE" && !isModalOpen) {
      // Only show the dialog if the app is active (in foreground)
      if (AppState.currentState === "active") {
        // request animation frame is needed because during the tests
        // in some Android devices the alert did not appeared.
        requestAnimationFrame(openDialog);
      }
    }
  }, [isModalOpen, networkStatus, openDialog]);

  return null;
};

export default OfflineNotification;
