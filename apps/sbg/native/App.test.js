import { setApplicationKey, setUserAgentClientsConfig } from "@ppb/tbd-store/services/client-factory";
import { CustomModal, CustomStatusBar } from "@ppb/the-wall-native";
import ReactNavigation from "@react-navigation/native";
import { act, renderAsync } from "@testing-library/react-native";
import { forwardRef } from "react";
import { Appearance, NativeModules } from "react-native";
import SplashScreen from "react-native-splash-screen";
import BootSplash from "react-native-bootsplash";
import { QUANTUM_METRIC__INIT } from "@ppb/tbd-store/actions/quantum-metric";
import { LA_UNSUBSCRIBE_FINISHED_EVENTS } from "@ppb/tbd-store/actions/push-notifications";
import { getBasePath } from "@ppb/tbd-shared/config/base-path-utils.native";
import { updateStoreRoute } from "@ppb/tbd-shared/components/Navigation/store-router-updater.native";
import { getCustomUserAgent, registerCustomUserAgent } from "@ppb/tbd-shared/helpers/user-agent.native";
import { ErrorFallback } from "@ppb/tbd-shared/components/ErrorFallback/ErrorFallback.native";
import useNetworkStateListener from "@ppb/tbd-shared/hooks/useNetworkStateListener.native";
import { RateMyApp } from "@ppb/tbd-shared/components/RateMyApp/RateMyApp.native";
import { Feedback } from "@ppb/tbd-shared/components/Feedback/Feedback.native";
import { navigationRef } from "@ppb/tbd-router/native";
import { SplunkRumProvider } from "@splunk/otel-react-native";

const IOS_APP_KEY = "IOSAPPKEY";
const QM_APP_KEY = "QMAPPKEY";
const PRELOADED_STATE = {
  entities: {
    userdetails: {
      countryCode: "IE",
      localeCode: "pt_BR",
      jurisdiction: {
        jurisdiction: "INTERNATIONAL",
      },
    },
  },
};
const mockNavigationContainer = jest.fn(() => <mock-navigation-container />);
const splashScreenHideSpy = jest.fn(() => {});

SplashScreen.hide = splashScreenHideSpy;
BootSplash.hide = splashScreenHideSpy;

jest.mock("react-native-splash-screen", () => ({
  SplashScreen: {
    hide: jest.fn(),
  },
}));

jest.mock("react-native-bootsplash", () => ({
  BootSplash: {
    hide: jest.fn(),
  },
}));

ReactNavigation.NavigationContainer = forwardRef(mockNavigationContainer);

jest.mock("@ppb/tbd-shared/components/Navigation/screens/NativeWebView.native", () =>
  jest.fn((props) => <native-webview-mock {...props} />),
);

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock("react-native", () => {
  const reactNative = jest.requireActual("react-native");

  reactNative.NativeModules.LaunchArgumentsModule = {
    getLaunchArguments: jest.fn().mockReturnValue({ MOCKHOST: "MOCKHOST", MOCKHOSTPORT: "MOCKHOSTPORT" }),
  };

  reactNative.NativeModules.TBDCurrentScreenModule = {
    setCurrentScreen: jest.fn(),
  };

  return reactNative;
});

jest.mock("react-native-quantum-metric-library", () => ({
  QuantumMetricLibrary: {
    initialize: jest.fn(),
  },
}));

jest.mock("@ppb/tbd-shared/gtm/tagging-collector.native", () => ({
  sendEvent: "sendEventFnMock",
}));

jest.mock("react-native-launch-arguments", () => ({
  LaunchArguments: {
    value: jest.fn().mockReturnValue({ MOCKHOST: "localhost", MOCKHOSTPORT: "1084" }),
  },
}));

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: jest.fn(({ children }) => <mock-safe-area>{children}</mock-safe-area>),
}));

jest.mock("@ppb/the-wall-native", () => ({
  CustomModal: jest.fn(({ children, props }) => <custom-modal-mock {...props}>{children}</custom-modal-mock>),
  SafeAreaContainer: jest.fn(({ children }) => <mock-safe-area>{children}</mock-safe-area>),
  CustomStatusBar: jest.fn(({ children, props }) => (
    <custom-status-bar-mock {...props}>{children}</custom-status-bar-mock>
  )),
  Text: jest.fn(({ children }) => <mock-text>{children}</mock-text>),
}));

jest.mock("@ppb/tbd-shared/components/Feedback/Feedback.native", () => ({
  Feedback: jest.fn(({ children, props }) => <feedback-button-mock {...props}>{children}</feedback-button-mock>),
}));

jest.mock("react-redux", () => ({
  Provider: jest.fn(({ children }) => <mock-provider>{children}</mock-provider>),
}));

jest.mock("@ppb/tbd-shared/experimentation/provider/LoopProvider", () => ({
  LoopProvider: jest.fn(({ children }) => <mock-provider>{children}</mock-provider>),
}));

jest.mock("@ppb/tbd-shared/experimentation/visitor-id-resolver.native", () => ({
  useResolveVisitorId: jest.fn(() => "xxx"),
}));

jest.mock("@react-navigation/native", () => ({
  DarkTheme: {},
  NavigationContainer: jest.fn(),
}));

jest.mock("@ppb/tbd-shared/helpers/user-agent.native", () => ({
  getCustomUserAgent: jest.fn().mockReturnValue("USER-AGENT-MOCK"),
  registerCustomUserAgent: jest.fn(),
}));

jest.mock("@ppb/tbd-store/services/client-factory", () => ({
  setApplicationKey: jest.fn(),
  setUserAgentClientsConfig: jest.fn().mockReturnValue("USER-AGENT-MOCK"),
}));

jest.mock("@flutter-global/react-native-cet-framework", () => ({
  CetProvider: jest.fn(({ children }) => <mock-cet-provider>{children}</mock-cet-provider>),
  CetStackNavigatorLinking: {},
  SetupPin: jest.fn(() => <web-view-mock />),
}));

jest.mock("@apollo/client/react", () => ({
  ApolloProvider: jest.fn(({ children }) => <mock-apollo-provider>{children}</mock-apollo-provider>),
}));

jest.mock("@ppb/tbd-shared/apollo-client/client", () => ({
  getApolloClient: jest.fn(),
}));

jest.mock("react-native-device-info", () => ({
  getDeviceNameSync: () => "iPhone 11",
  getBuildNumber: () => 5,
  getSystemVersion: () => "11.0",
  getBundleId: jest.fn(),
}));

jest.mock("@ppb/tbd-shared/config/base-path-utils.native", () => ({
  getBasePath: jest.fn(() => "https://base-path/"),
  isCurrentEnv: jest.fn(),
  APP_CONTEXT_DEFAULT_PATH: "api/tbd/app-context/v1/",
  getCatalogueDefaultPath: jest.fn(() => "api/tbd/bff-gql/v11"),
  getCurrentEnv: jest.fn(() => "QA"),
}));

jest.mock("@ppb/tbd-router/native", () => ({
  navigationRef: {
    current: {
      getCurrentRoute: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
  },
}));

jest.mock("@ppb/tbd-shared/components/Navigation/store-router-updater.native", () => ({
  updateStoreRoute: jest.fn(() => {}),
}));

jest.mock("./helpers/init-cet-framework", () => jest.fn(() => {}));

jest.mock("@ppb/tbd-shared/components/RateMyApp/RateMyApp.native", () => ({
  RateMyApp: jest.fn(({ children }) => <rate-my-app-mock>{children}</rate-my-app-mock>),
}));

jest.mock("./app.config.json", () => ({
  APP_KEYS: { ios: IOS_APP_KEY },
  QM_KEYS: { ios: QM_APP_KEY },
  SIGNALFX_CONFIGURATION: {
    endpoint: {
      realm: "eu0",
      rumAccessToken: "RUM_ACCESS_TOKEN",
    },
    appName: "Sky Bet",
    deploymentEnvironment: "dev",
    enableDebugLogging: false,
  },
  SIGNALFX_MODULE_CONFIGURATION: {
    crashReportingModule: false,
    interactionsModule: true,
    networkMonitorModule: true,
    startupModule: true,
  },
  TBDN_RELEASE_MODE: "production",
}));

jest.mock("@react-native-cookies/cookies", () => ({
  get: jest.fn(),
}));

jest.mock("@react-native-community/netinfo", () => ({
  NetInfo: jest.fn(),
}));

jest.mock("@ppb/tbd-shared/hooks/useNetworkStateListener.native", () => jest.fn());

jest.mock("./setup", () => ({
  initStore: jest.fn(() => ({ dispatch: jest.fn(), getState: jest.fn(), addModule: jest.fn() })),
  buildPreloadedState: jest.fn(() => PRELOADED_STATE),
  initI18n: jest.fn(),
}));

jest.mock("@ppb/tbd-shared/helpers/app-context/app-context-module.native", () => ({
  getAppContextModule: jest.fn((...args) => {
    const onReady = args[args.length - 1];
    if (typeof onReady === "function") {
      onReady();
    }
    return { appContextModule: "" };
  }),
}));

jest.mock("@ppb/tbd-shared/hooks/useNativeLazyLoading.native", () => ({
  VisibleItemsProvider: jest.fn(({ children }) => (
    <visible-items-provider-mock>{children}</visible-items-provider-mock>
  )),
}));

jest.mock("@ppb/tbd-shared/components/StickyContext", () => ({
  StickyContextProvider: jest.fn(({ children }) => (
    <sticky-context-provider-mock>{children}</sticky-context-provider-mock>
  )),
}));

jest.mock("@ppb/the-wall-theme", () => ({
  ThemeContextProvider: jest.fn(({ children }) => (
    <theme-context-provider-mock>{children}</theme-context-provider-mock>
  )),
}));

jest.mock("@ppb/tbd-shared/components/NotificationsInitialPrompt", () =>
  jest.fn(() => <connected-notifications-prompt-mock />),
);
jest.mock("@ppb/tbd-shared/components/NotificationsInitialPrompt/NotificationsInitialPrompt.native", () =>
  jest.fn(() => <notifications-prompt-mock />),
);

jest.mock("@ppb/tbd-shared/components/OfflineNotification", () =>
  jest.fn(() => <connected-offline-notification-mock />),
);
jest.mock("@ppb/tbd-shared/components/OfflineNotification/OfflineNotification.native", () =>
  jest.fn(() => <offline-notification-mock />),
);

jest.mock("@ppb/tbd-shared/components/LoyaltyMessaging", () => jest.fn(() => <connected-loyalty-messaging-mock />));
jest.mock("@ppb/tbd-shared/components/LoyaltyMessaging/LoyaltyMessaging.native", () =>
  jest.fn(() => <loyalty-messaging-mock />),
);

jest.mock("@ppb/tbd-shared/components/Snacks", () => jest.fn(() => <connected-snack-mock />));
jest.mock("@ppb/tbd-shared/components/Snacks/Snacks.native", () => jest.fn(() => <snack-mock />));

jest.mock("@ppb/tbd-shared/helpers/i18n", () => ({
  i18n: ({ key }) => key,
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {
    HeaderBackgroundPrimaryColour: "#18181A",
  },
  colors: {},
  spacings: {},
  typography: {},
  stackings: {},
}));

jest.mock("@ppb/the-wall-common/types", () => ({
  ComponentTheme: {
    Light: "light",
  },
}));

jest.mock("@ppb/tbd-shared/config/endpoints", () => ({
  getEndpoint: jest.fn(() => "endpoint"),
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/tbd-shared/components/ErrorFallback/ErrorFallback.native", () => ({
  ErrorFallback: jest.fn(() => <error-fallback-mock />),
}));

jest.mock("@ppb/tbd-shared/components/ErrorBoundary/ErrorBoundaryProvider.native", () => ({
  ErrorBoundaryProvider: jest.fn(({ children }) => <>{children}</>),
}));

jest.mock("@ppb/tbd-shared/components/ErrorBoundary/ErrorBoundary", () => ({
  ErrorBoundary: jest.fn(({ children }) => <>{children}</>),
}));

jest.mock("@ppb/the-wall-native/helpers/ScrollContext", () => ({
  OffsetProvider: jest.fn(({ children, props }) => <offset-provider-mock {...props}>{children}</offset-provider-mock>),
  ScrollIdleProvider: jest.fn(({ children, props }) => (
    <scroll-idle-provider-mock {...props}>{children} </scroll-idle-provider-mock>
  )),
}));

jest.mock("./helpers/init-cet-framework");

jest.mock("react-native-localize", () => ({
  getTimeZone: jest.fn(() => "Europe/London"),
}));

jest.mock("react-native-onetrust-cmp", () => ({
  startSDK: jest.fn(),
  setBroadcastAllowedValues: jest.fn(),
  listenForConsentChanges: jest.fn(),
  stopListeningForConsentChanges: jest.fn(),
  showBannerUI: jest.fn(),
  getConsentStatusForCategory: jest.fn(),
}));

jest.mock("@ppb/tbd-shared/hooks/useCetFramework.native", () => jest.fn());

jest.mock("@ppb/tbd-shared/cookie-consent/cookie-consent.native", () => ({
  useOneTrust: jest.fn(),
  reinitOneTrust: jest.fn(),
}));

jest.mock("@ppb/tbd-shared/setup/store.native", () => ({
  initStore: jest.fn(() => ({ dispatch: jest.fn(), getState: jest.fn(), addModule: jest.fn() })),
  buildPreloadedState: jest.fn(),
  gtmConfig: {},
}));

jest.mock("@splunk/otel-react-native", () => ({
  SplunkRumProvider: jest.fn(({ children }) => <otel-wrapper-mock>{children}</otel-wrapper-mock>),
  SplunkRum: { instance: { globalAttributes: { setAll: jest.fn() }, navigation: { track: jest.fn() } } },
  CrashReportsModuleConfiguration: jest.fn(),
  InteractionsModuleConfiguration: jest.fn(),
  NetworkMonitorModuleConfiguration: jest.fn(),
  StartupModuleConfiguration: jest.fn(),
}));

const mockIsLiveActivityModuleAvailable = jest.fn(() => true);
const mockGetFinishedPushTokens = jest.fn();
const mockOnLiveActivityEnded = jest.fn();

jest.mock("@ppb/tbd-shared/helpers/live-activities.native", () => ({
  isLiveActivityModuleAvailable: (...args) => mockIsLiveActivityModuleAvailable(...args),
  getFinishedPushTokens: (...args) => mockGetFinishedPushTokens(...args),
  onLiveActivityEnded: (...args) => mockOnLiveActivityEnded(...args),
}));

const defaultStoreState = {
  entities: { userdetails: { localeCode: "en-GB" }, throttles: {} },
  layouts: { views: { error: {} }, cards: {} },
};

const dispatchMock = jest.fn();

const stateMock = {
  entities: { userdetails: { localeCode: "en-GB" }, throttles: {} },
  layouts: { views: { error: {} }, cards: {} },
};

async function renderApp(App, state = stateMock) {
  const storeMock = {
    dispatch: dispatchMock,
    getState: jest.fn(() => state),
  };

  return renderAsync(<App store={storeMock} />);
}

const App = require("./App").default;

describe("App", () => {
  beforeEach(jest.clearAllMocks);
  describe("bootstrap", () => {
    describe("when app boots", () => {
      it("should build the base path", async () => {
        await renderApp(App);
        expect(getBasePath).toHaveBeenCalledWith();
      });

      it("should set the application key", async () => {
        await renderApp(App);
        expect(setApplicationKey).toHaveBeenCalledWith(IOS_APP_KEY);
      });

      it("should call setUserAgentClientsConfig", async () => {
        await renderApp(App);
        expect(setUserAgentClientsConfig).toHaveBeenCalled();
      });

      it("should call registerCustomUserAgent once", async () => {
        await renderApp(App);
        expect(registerCustomUserAgent).toHaveBeenCalled();
      });

      it("should call useNetworkStateListener with store", async () => {
        await renderApp(App);
        expect(useNetworkStateListener).toHaveBeenCalledWith(
          expect.objectContaining({ dispatch: expect.any(Function), getState: expect.any(Function) }),
        );
      });

      it("should call getCustomUserAgent", async () => {
        await renderApp(App);
        expect(getCustomUserAgent).toHaveBeenCalled();
      });

      it("should dispatch QuantumMetricInitAction", async () => {
        await renderApp(App);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith({
          type: QUANTUM_METRIC__INIT,
          payload: {
            subscription: "sbg",
            uid: QM_APP_KEY,
          },
        });
      });

      it("should render SplunkRumProvider with correct configuration", async () => {
        global.__DEV__ = false;
        await renderApp(App);
        expect(SplunkRumProvider).toHaveBeenCalledWith(
          expect.objectContaining({
            agentConfiguration: expect.objectContaining({
              endpoint: {
                realm: "eu0",
                rumAccessToken: "RUM_ACCESS_TOKEN",
              },
              appName: "Sky Bet",
              deploymentEnvironment: "prd",
              enableDebugLogging: false,
            }),
          }),
          undefined,
        );
      });

      it("should set deploymentEnvironment to 'dev' when __DEV__ is true", async () => {
        global.__DEV__ = true;
        await renderApp(App);
        expect(SplunkRumProvider).toHaveBeenCalledWith(
          expect.objectContaining({
            agentConfiguration: expect.objectContaining({
              deploymentEnvironment: "dev",
            }),
          }),
          undefined,
        );
      });

      describe("live activities cleanup", () => {
        beforeEach(() => {
          mockIsLiveActivityModuleAvailable.mockReturnValue(true);
          mockGetFinishedPushTokens.mockImplementation(() => {});
          mockOnLiveActivityEnded.mockImplementation(() => {});
        });

        it("should not query the live activities helper when the module is unavailable", async () => {
          mockIsLiveActivityModuleAvailable.mockReturnValueOnce(false);
          await renderApp(App);
          expect(mockGetFinishedPushTokens).not.toHaveBeenCalled();
          expect(mockOnLiveActivityEnded).not.toHaveBeenCalled();
        });

        it("should dispatch LA_UNSUBSCRIBE_FINISHED_EVENTS when there are finished push tokens", async () => {
          const finished = [{ eventId: "event-1", pushToken: "token-1" }];
          mockGetFinishedPushTokens.mockImplementation((cb) => cb(finished));

          await renderApp(App);

          expect(dispatchMock).toHaveBeenCalledWith({
            type: LA_UNSUBSCRIBE_FINISHED_EVENTS,
            payload: { liveActivityEvents: finished },
          });
        });

        it("should not dispatch LA_UNSUBSCRIBE_FINISHED_EVENTS when the finished push tokens list is empty", async () => {
          mockGetFinishedPushTokens.mockImplementation((cb) => cb([]));

          await renderApp(App);

          expect(dispatchMock).not.toHaveBeenCalledWith(
            expect.objectContaining({ type: LA_UNSUBSCRIBE_FINISHED_EVENTS }),
          );
        });

        it("should dispatch LA_UNSUBSCRIBE_FINISHED_EVENTS for each live activity ended event", async () => {
          const finishedEvent = { eventId: "event-2", pushToken: "token-2" };
          mockOnLiveActivityEnded.mockImplementation((cb) => cb(finishedEvent));

          await renderApp(App);

          expect(dispatchMock).toHaveBeenCalledWith({
            type: LA_UNSUBSCRIBE_FINISHED_EVENTS,
            payload: { liveActivityEvents: [finishedEvent] },
          });
        });
      });
    });
  });

  describe("when the throttle FEEDBACK_BUTTON_NATIVE is active", () => {
    const feedbackActiveState = {
      ...stateMock,
      entities: { ...stateMock.entities, throttles: { FEEDBACK_BUTTON_NATIVE: { isActive: true } } },
      layouts: { views: { error: {} } },
    };

    beforeEach(async () => {
      await renderApp(App, feedbackActiveState);

      act(() => {
        const [[mock]] = mockNavigationContainer.mock.calls;
        mock.onStateChange();
      });
    });

    it("should call Feedback", () => {
      expect(Feedback).toHaveBeenCalled();
    });

    describe("when Feedback button is pressed", () => {
      const triggerFeedbackButton = () => {
        const { onFeedbackTap } = Feedback.mock.calls[0][0];
        act(() => {
          onFeedbackTap();
        });
      };

      const triggerCustomModalDismiss = () => {
        const { onDismiss } = CustomModal.mock.calls[0][0];
        act(() => {
          onDismiss();
        });
      };

      it("should call the CustomModal", () => {
        triggerFeedbackButton();

        expect(CustomModal).toHaveBeenCalled();
      });

      describe("when CustomModal is dismiss", () => {
        it("should hide the CustomModal", () => {
          triggerFeedbackButton();
          triggerCustomModalDismiss();

          expect(CustomModal).toHaveBeenCalled();
        });
      });
    });

    describe("when it was displayed the error screen", () => {
      beforeEach(async () => {
        jest.clearAllMocks();

        const errorScreenState = {
          ...feedbackActiveState,
          layouts: { views: { error: { someError: true } } },
        };

        await renderApp(App, errorScreenState);

        act(() => {
          const [[mock]] = mockNavigationContainer.mock.calls;

          mock.onStateChange();
        });
      });

      it("shouldn't call Feedback", () => {
        expect(Feedback).not.toHaveBeenCalled();
      });
    });
  });

  describe("when navigation is ready", () => {
    beforeEach(async () => {
      const territoryBlockingState = {
        ...stateMock,
        entities: { ...stateMock.entities, appContextDetails: { isBlockedTerritory: false } },
      };

      await renderApp(App, territoryBlockingState);

      act(() => {
        const [[mock]] = mockNavigationContainer.mock.calls;
        mock.onReady();
      });
    });

    it("should setup user agent", () => {
      expect(setUserAgentClientsConfig).toHaveBeenCalledWith("USER-AGENT-MOCK");
    });

    it("should call useNetworkStateListener", () => {
      expect(useNetworkStateListener).toHaveBeenLastCalledWith(
        expect.objectContaining({ dispatch: expect.any(Function), getState: expect.any(Function) }),
      );
    });

    it("should call RateMyApp component", () => {
      expect(RateMyApp).toHaveBeenCalled();
    });
  });

  describe("when store has territory blocking set to true", () => {
    it("shouldn't display the feedback button", async () => {
      await renderApp(App);
      expect(Feedback).not.toHaveBeenCalled();
    });
  });

  describe("when there is a navigation", () => {
    beforeEach(async () => {
      await renderApp(App);
    });

    it("should call NavigationContainer", () => {
      expect(mockNavigationContainer).toHaveBeenCalled();
    });

    it("should call updateStoreRoute", () => {
      act(() => {
        const [[mock]] = mockNavigationContainer.mock.calls;
        mock.onStateChange();
      });

      expect(updateStoreRoute).toHaveBeenLastCalledWith(
        expect.objectContaining({
          getState: expect.any(Function),
          dispatch: expect.any(Function),
        }),
      );
    });
  });

  describe("when there is a navigation with a route", () => {
    beforeEach(async () => {
      navigationRef.current.getCurrentRoute = jest.fn().mockReturnValue({ name: "Home" });

      await renderApp(App);
    });

    it("should call TBDCurrentScreenModule.setCurrentScreen when route exists", () => {
      act(() => {
        const [[mock]] = mockNavigationContainer.mock.calls;
        mock.onStateChange();
      });

      expect(NativeModules.TBDCurrentScreenModule.setCurrentScreen).toHaveBeenCalledWith("Home");
    });
  });

  describe("when there is an error while booting the app", () => {
    describe("and error is instance of Error", () => {
      beforeEach(async () => {
        registerCustomUserAgent.mockImplementation(() => {
          throw new Error("Cannot read property 'details' of null");
        });

        await renderApp(App);
      });

      afterEach(() => {
        registerCustomUserAgent.mockImplementation(() => Promise.resolve());
      });

      it("should hide the splash screen", () => {
        expect(splashScreenHideSpy).toHaveBeenCalled();
      });

      it("should call ErrorFallback with the error reason", () => {
        expect(ErrorFallback).toHaveBeenCalledWith(
          expect.objectContaining({
            reason: expect.any(String),
            hide: expect.any(Function),
          }),
          undefined,
        );
        expect(ErrorFallback).toHaveBeenCalledTimes(1);
      });

      it("shouldn't display the feedback button", () => {
        expect(Feedback).not.toHaveBeenCalled();
      });
    });

    describe("and error is not instance of Error", () => {
      beforeEach(async () => {
        registerCustomUserAgent.mockImplementation(() => {
          throw "*shrug*";
        });

        await renderApp(App);
      });

      afterEach(() => {
        registerCustomUserAgent.mockImplementation(() => Promise.resolve());
      });

      it("should call ErrorFallback with the error reason", () => {
        expect(ErrorFallback).toHaveBeenCalledWith(
          expect.objectContaining({
            reason: "*shrug*",
            hide: expect.any(Function),
          }),
          undefined,
        );
        expect(ErrorFallback).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("themes", () => {
    describe("when device was dark theme selected", () => {
      it("should apply light-content style to CustomStatusBar", async () => {
        jest.spyOn(Appearance, "getColorScheme").mockReturnValueOnce("dark");
        await renderApp(App);

        expect(CustomStatusBar).toHaveBeenCalledWith({ background: "#18181A", barStyle: "light-content" }, undefined);
      });
    });

    describe("when device was light theme selected", () => {
      it("should apply light-content style to CustomStatusBar", async () => {
        jest.spyOn(Appearance, "getColorScheme").mockReturnValueOnce("light");
        await renderApp(App);

        expect(CustomStatusBar).toHaveBeenCalledWith({ background: "#18181A", barStyle: "dark-content" }, undefined);
      });
    });
  });
});
