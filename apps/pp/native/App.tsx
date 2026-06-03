import WdyrDashboard from "@ppb/tbd-shared/components/Wdyr/wdyr.native";
import { enableLayoutAnimations } from "react-native-reanimated";

import type { FunctionComponent, JSX } from "react";
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Appearance, NativeModules, Platform, useWindowDimensions, View } from "react-native";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { CetProvider, CetStackNavigatorLinking, SetupPin } from "@flutter-global/react-native-cet-framework";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { IModuleStore } from "redux-dynamic-modules";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { OffsetProvider, ScrollIdleProvider } from "@ppb/the-wall-native/helpers/ScrollContext";
import { CustomModal, CustomStatusBar, SafeAreaContainer, Text } from "@ppb/the-wall-native";
import { setApplicationKey, setUserAgentClientsConfig } from "@ppb/tbd-store/services/client-factory";
import { spacings, tokens } from "@ppb/the-wall-common/base-theme";
import ConnectedNotificationsInitialPrompt from "@ppb/tbd-shared/components/NotificationsInitialPrompt";
import NotificationsInitialPrompt from "@ppb/tbd-shared/components/NotificationsInitialPrompt/NotificationsInitialPrompt.native";
import ConnectedOfflineNotification from "@ppb/tbd-shared/components/OfflineNotification";
import OfflineNotification from "@ppb/tbd-shared/components/OfflineNotification/OfflineNotification.native";
import ConnectedLoyaltyMessaging from "@ppb/tbd-shared/components/LoyaltyMessaging";
import LoyaltyMessaging from "@ppb/tbd-shared/components/LoyaltyMessaging/LoyaltyMessaging.native";
import ConnectedSnacks from "@ppb/tbd-shared/components/Snacks";
import Snacks from "@ppb/tbd-shared/components/Snacks/Snacks.native";
import { StickyContextProvider } from "@ppb/tbd-shared/components/StickyContext";
import { i18n } from "@ppb/tbd-shared/helpers/i18n";
import { navigationRef } from "@ppb/tbd-router/native";
import { QUANTUM_METRIC__INIT, QuantumMetricInitAction } from "@ppb/tbd-store/actions/quantum-metric";
import { ErrorBoundary } from "@ppb/tbd-shared/components/ErrorBoundary/ErrorBoundary";
import { getApolloClient } from "@ppb/tbd-shared/apollo-client/client";
import { ApolloProvider } from "@apollo/client/react";
import {
  APP_ENVIRONMENT_DEFAULT_PATH,
  CATALOGUE_LATEST_PATH,
  getBasePath,
  getCatalogueDefaultPath,
} from "@ppb/tbd-shared/config/base-path-utils.native";
import { getCustomUserAgent, registerCustomUserAgent } from "@ppb/tbd-shared/helpers/user-agent.native";
import { updateStoreRoute } from "@ppb/tbd-shared/components/Navigation/store-router-updater.native";
import { navigateOnBootFailure } from "@ppb/tbd-shared/components/Navigation/boot-failure-navigation.native";
import { GamingContextProvider } from "@ppb/tbd-shared/components/GamingPage/GamingContext";
import { type ThemeContextName, ThemeContextProvider } from "@ppb/the-wall-theme";
import { ErrorBoundaryProvider } from "@ppb/tbd-shared/components/ErrorBoundary/ErrorBoundaryProvider.native";
import { ErrorFallback } from "@ppb/tbd-shared/components/ErrorFallback/ErrorFallback.native";
import { RateMyApp } from "@ppb/tbd-shared/components/RateMyApp/RateMyApp.native";
import useNetworkStateListener from "@ppb/tbd-shared/hooks/useNetworkStateListener.native";
import NativeWebView from "@ppb/tbd-shared/components/Navigation/screens/NativeWebView.native";
import { RefreshEnabledProvider } from "@ppb/tbd-shared/hooks/useRefreshEnabled.native";
import { Feedback } from "@ppb/tbd-shared/components/Feedback/Feedback.native";
import { useOneTrust } from "@ppb/tbd-shared/cookie-consent/cookie-consent.native";
import {
  SplunkRumProvider,
  AgentConfiguration,
  CrashReportsModuleConfiguration,
  InteractionsModuleConfiguration,
  NetworkMonitorModuleConfiguration,
  StartupModuleConfiguration,
  ModuleConfiguration,
  SplunkRum,
} from "@splunk/otel-react-native";
import { hideSplash } from "@ppb/tbd-shared/helpers/splash";
import appConfig from "./app.config.json";
import styles, { CustomTheme } from "./App.styles";
import { LoopProvider } from "@ppb/tbd-shared/experimentation/provider/LoopProvider";
import { useResolveVisitorId } from "@ppb/tbd-shared/experimentation/visitor-id-resolver.native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  isLiveActivityModuleAvailable,
  getFinishedPushTokens,
  onLiveActivityEnded,
} from "@ppb/tbd-shared/helpers/live-activities.native";
import {
  LAUnsubscribeFinishedEventsAction,
  LA_UNSUBSCRIBE_FINISHED_EVENTS,
} from "@ppb/tbd-store/actions/push-notifications";

const TBDCurrentScreenModule = NativeModules?.TBDCurrentScreenModule;

// The RootNavigator only be imported when the translations module is initialized to prevent empty localized strings
const RootNavigator = lazy(() => import("./navigation/navigators/RootNavigator"));

const OS = Platform.OS as "android" | "ios";

// Load app key from device platform
const APP_KEY = appConfig.APP_KEYS[OS];

const FeedbackModal: FunctionComponent<{ handleDismissFeedbackModal: () => void }> = ({
  handleDismissFeedbackModal,
}) => {
  // Calculate the width of modal for feedback based on device width
  const windowDimensions = useWindowDimensions();

  // The customModal adds spacings["spacing-8"] to the width prop passed. So we need to remove that extra space to center the modal on the screen.
  const MODAL_FEEDBACK_WIDTH = useMemo(
    () => windowDimensions.width - spacings["spacing-8"] - spacings["spacing-6"],
    [windowDimensions.width],
  );

  return (
    <CustomModal
      width={MODAL_FEEDBACK_WIDTH}
      height={370}
      onDismiss={handleDismissFeedbackModal}
      dismissOnOutsideTap={false}
      title={i18n({ key: "I18N.FEEDBACK.MODAL.TITLE" })}
    >
      <View style={styles.feedbackWVContainer}>
        <NativeWebView
          textZoom={100}
          cacheEnabled={false}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          javaScriptEnabled
          source={{ uri: appConfig.FEEDBACK_WEBVIEW_URL }}
        />
      </View>
    </CustomModal>
  );
};

// Fallback for errors, shows a debug screen when in debug and renders child component otherwise
function Fallback({
  error,
  setErrorMessage,
}: Readonly<{
  error: Error | string;
  setErrorMessage?: (message: string | undefined) => void;
}>): JSX.Element {
  const onHide = useCallback(() => {
    setErrorMessage?.(undefined);
  }, [setErrorMessage]);

  return (
    <ErrorFallback reason={error} hide={onHide}>
      <Text style={styles.fallbackText}>oops! looks like an error occurred</Text>
    </ErrorFallback>
  );
}

function App({ store }: { store: IModuleStore<ApplicationState> }): JSX.Element | null {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [showFeedbackButton, setShowFeedbackButton] = useState<boolean>(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const visitorId = useResolveVisitorId();
  const visitorIdResolver = useCallback(() => visitorId, [visitorId]);

  setApplicationKey(APP_KEY);

  // LayoutAnimation in android is experimental, and there are some issues associated to it,
  // such as placeholders being enabled forever. Given this and until this module is not stable enough,
  // the LayoutAnimation for react-native-reanimated should be disabled for Android.
  if (OS === "android") {
    enableLayoutAnimations(false);
  }

  const customUserAgent = getCustomUserAgent();

  // build the base path that depends on the environment the app was generated for
  // or settings defined by the user on the device settings for internal builds of the app.
  const basePath = getBasePath();

  const handleFeedbackTap = useCallback(() => {
    setShowFeedbackModal(true);
  }, []);

  const handleDismissFeedbackModal = useCallback(() => {
    setShowFeedbackModal(false);
  }, []);

  const navigationContainerOnReady = useCallback(() => {
    // Navigation on boot failure
    if (store.getState().boot?.failed) {
      navigateOnBootFailure(store);
    }

    // Hide splash screen
    hideSplash();
  }, [store]);

  const navigationContainerOnStateChange = useCallback(() => {
    if (!store) {
      return;
    }

    // update native screen module to ensure we can trace and use for FPS
    const route = navigationRef.current?.getCurrentRoute();
    if (route) {
      SplunkRum.instance.navigation.track(route.name);
      TBDCurrentScreenModule?.setCurrentScreen(route.name);
    }

    // We don't wont to show the feedback button if appear any error to user or if the throttle is disabled
    setShowFeedbackButton(
      store.getState().layouts.views.error &&
        Object.keys(store.getState().layouts.views.error).length === 0 &&
        !!store.getState().entities.throttles.FEEDBACK_BUTTON_NATIVE?.isActive,
    );
    updateStoreRoute(store);
  }, [store]);

  useEffect(() => {
    const bootstrap = async (): Promise<void> => {
      try {
        // setup user agent for http client config before request anything
        setUserAgentClientsConfig(customUserAgent);

        // Overwrite default WebView user-agent for iOS
        await registerCustomUserAgent();
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage(`${error}`);
        }
      }
    };
    bootstrap();
  }, [customUserAgent]);

  useEffect(() => {
    store.dispatch<QuantumMetricInitAction>({
      type: QUANTUM_METRIC__INIT,
      payload: {
        subscription: "betfair",
        uid: appConfig.QM_KEYS[OS],
      },
    });
  }, [store]);

  useEffect(() => {
    if (isLiveActivityModuleAvailable()) {
      // Clear live activities from NSS that finished while the APP was closed
      getFinishedPushTokens((finishedLiveActivityEvents) => {
        if (finishedLiveActivityEvents.length) {
          store.dispatch<LAUnsubscribeFinishedEventsAction>({
            type: LA_UNSUBSCRIBE_FINISHED_EVENTS,
            payload: {
              liveActivityEvents: finishedLiveActivityEvents,
            },
          });
        }
      });

      // Clear live activities from NSS that finished while the APP was open trough a Event listener.
      onLiveActivityEnded((finishedLiveActivityEvent) => {
        store.dispatch<LAUnsubscribeFinishedEventsAction>({
          type: LA_UNSUBSCRIBE_FINISHED_EVENTS,
          payload: {
            liveActivityEvents: [finishedLiveActivityEvent],
          },
        });
      });
    }
  }, [store]);

  // Hook that listens to network state changes
  useNetworkStateListener(store);

  // Hook that initializes OneTrust
  useOneTrust(store);

  if (errorMessage) {
    // Hide splash screen
    hideSplash();

    return <Fallback error={errorMessage} setErrorMessage={setErrorMessage} />;
  }

  // Configuration for linking integration used for CET Framework (deep linking and URL support)
  const prefixes = [
    "https://.betfair.com",
    "https://.nxt.betfair.com",
    "https://.qa.betfair.com",
    "https://.drk.betfair.com",
  ];

  const CETLinking = {
    prefixes,
    config: {
      screens: {
        CetStackNavigator: CetStackNavigatorLinking,
      },
    },
  };

  const signalFxConfig = {
    ...appConfig.SIGNALFX_CONFIGURATION,
    deploymentEnvironment: __DEV__ || appConfig.TBDN_RELEASE_MODE !== "production" ? "dev" : "prd",
    user: { trackingMode: "ANONYMOUS_TRACKING" },
  } satisfies AgentConfiguration;

  const { crashReportingModule, interactionsModule, networkMonitorModule, startupModule } =
    appConfig.SIGNALFX_MODULE_CONFIGURATION;

  const signalfxModuleConfig = [
    new CrashReportsModuleConfiguration(crashReportingModule),
    new InteractionsModuleConfiguration(interactionsModule),
    new NetworkMonitorModuleConfiguration(networkMonitorModule),
    new StartupModuleConfiguration(startupModule),
  ] satisfies ModuleConfiguration[];

  return (
    <SplunkRumProvider agentConfiguration={signalFxConfig} modules={signalfxModuleConfig}>
      <ErrorBoundaryProvider>
        <SafeAreaProvider>
          <SafeAreaContainer>
            <ThemeContextProvider value={{ theme: process.env.APP_BRAND as ThemeContextName }}>
              <CustomStatusBar
                background={tokens.HeaderBackgroundPrimaryColour}
                barStyle={Appearance.getColorScheme() === "light" ? "dark-content" : "light-content"}
              />
              <CetProvider>
                <Provider store={store}>
                  <ApolloProvider client={getApolloClient()}>
                    <LoopProvider store={store} visitorIdResolver={visitorIdResolver}>
                      <StickyContextProvider>
                        <OffsetProvider>
                          <ScrollIdleProvider>
                            <RefreshEnabledProvider>
                              {showFeedbackButton && (
                                <View style={styles.feedbackButton}>
                                  <Feedback onFeedbackTap={handleFeedbackTap} />
                                </View>
                              )}
                              {showFeedbackModal && (
                                <FeedbackModal handleDismissFeedbackModal={handleDismissFeedbackModal} />
                              )}
                              <RateMyApp>
                                <GamingContextProvider>
                                  <NavigationContainer
                                    ref={navigationRef}
                                    theme={CustomTheme}
                                    onReady={navigationContainerOnReady}
                                    onStateChange={navigationContainerOnStateChange}
                                    linking={CETLinking}
                                  >
                                    <ErrorBoundary Fallback={Fallback}>
                                      <Suspense
                                        fallback={
                                          <View style={styles.activityIndicator}>
                                            <ActivityIndicator size="large" />
                                          </View>
                                        }
                                      >
                                        <GestureHandlerRootView>
                                          <RootNavigator />
                                        </GestureHandlerRootView>
                                      </Suspense>
                                      <SetupPin />
                                      <ConnectedNotificationsInitialPrompt component={NotificationsInitialPrompt} />
                                    </ErrorBoundary>
                                    <ConnectedOfflineNotification
                                      component={OfflineNotification}
                                      appEnv={`${basePath}${APP_ENVIRONMENT_DEFAULT_PATH}`}
                                      bffEndpoint={`${basePath}${getCatalogueDefaultPath()}`}
                                      latestBffEndpoint={`${basePath}${CATALOGUE_LATEST_PATH}`}
                                    />
                                    <ConnectedLoyaltyMessaging component={LoyaltyMessaging} basePath={basePath} />
                                    <ConnectedSnacks component={Snacks} />
                                  </NavigationContainer>
                                </GamingContextProvider>
                              </RateMyApp>
                            </RefreshEnabledProvider>
                          </ScrollIdleProvider>
                        </OffsetProvider>
                      </StickyContextProvider>
                    </LoopProvider>
                  </ApolloProvider>
                </Provider>
              </CetProvider>
            </ThemeContextProvider>
          </SafeAreaContainer>
        </SafeAreaProvider>
      </ErrorBoundaryProvider>
    </SplunkRumProvider>
  );
}

export default function AppRoot({ store }: { store: IModuleStore<ApplicationState> }): JSX.Element {
  return (
    <View style={styles.rootBackground}>
      <WdyrDashboard />
      <App store={store} />
    </View>
  );
}
