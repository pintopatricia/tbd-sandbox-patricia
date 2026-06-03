import { fireEvent, render, act } from "@testing-library/react-native";

import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { NotificationPrompt, BottomSheet, PrimaryButton, SupportingContentButton, Option } from "@ppb/the-wall-native";
import { tokens } from "@ppb/the-wall-common/base-theme";

import selectors from "./NotificationsSubscription.native.selectors";

import NotificationsSubscription from "./NotificationsSubscription.native";
import { NotificationsViewMode } from "./map-to-props-factory";
import { showNativePushPrompt } from "../../helpers/push-notifications.native";

const mockUseJoinNow = jest.fn();
const mockUseLogin = jest.fn();

jest.mock("react-native", () => {
  const { StyleSheet, View, Text, Pressable, Platform, Linking, Easing } = jest.requireActual("react-native");

  return {
    Platform,
    Pressable,
    StyleSheet,
    View,
    Text,
    Linking,
    Easing,
    Animated: {
      ...jest.requireActual("react-native").Animated,
      timing: jest.fn(() => ({
        start: jest.fn(),
      })),
    },
  };
});

jest.mock("@flutter-global/react-native-cet-framework", () => ({
  useLogin: () => mockUseLogin,
  useJoinNow: () => mockUseJoinNow,
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn((props) => <generic-icon {...props} testID="generic-icon" />),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Option: jest.fn((props) => (
    <option testID={props.checkboxId || (props.isToggle ? "master-toggle" : "option")} {...props} />
  )),
  NotificationPrompt: jest.fn(() => <notification-prompt />),
  BottomSheet: jest.fn(({ children, headerContent, footerContent }) => (
    <bottom-sheet testID="bottom-sheet">
      {headerContent}
      {children}
      {footerContent}
    </bottom-sheet>
  )),
  PrimaryButton: jest.fn((props) => <primary-button testID="primary-button" onPress={props.onTap} {...props} />),
  SupportingContentButton: jest.fn((props) => (
    <supporting-content-button testID="supporting-content-button" {...props} />
  )),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  heights: {},
  spacings: {},
  tokens: {
    NotificationsSubscriptionDisabledIconColour: "#C6C6C6",
    NotificationsSubscriptionIconColour: "#FFB80C",
    CheckboxBorderRadius: {},
    CheckboxEnabledUnselectedBorder: {},
    OptionHorizontalGapPrimary: {},
    OptionVerticalGap: {},
    TogglePadding: {
      padding: 2,
    },
  },
}));

jest.mock("../../helpers/push-notifications.native", () => ({
  showNativePushPrompt: jest.fn(),
}));
jest.mock("../../helpers/storage.native", () => ({
  getItem: jest.fn(() => Promise.resolve(true)),
}));

const mockIsLiveActivityEnabled = jest.fn();
const mockGetLiveActivityToggleDisabledFlag = jest.fn();
const mockGetLiveActivityToggleLabel = jest.fn();
const mockHasLiveActivitySubscription = jest.fn();
const mockOnLiveActivityToggleUpdate = jest.fn();

jest.mock("./live-activities-helper.native", () => ({
  isLiveActivityEnabled: (...args) => mockIsLiveActivityEnabled(...args),
  getLiveActivityToggleDisabledFlag: (...args) => mockGetLiveActivityToggleDisabledFlag(...args),
  getLiveActivityToggleLabel: (...args) => mockGetLiveActivityToggleLabel(...args),
  hasLiveActivitySubscription: (...args) => mockHasLiveActivitySubscription(...args),
  onLiveActivityToggleUpdate: (...args) => mockOnLiveActivityToggleUpdate(...args),
}));

const mockSubscribeEvent = jest.fn();

jest.mock("../../event-broker/event-subscriber", () => ({
  __esModule: true,
  default: (...args) => mockSubscribeEvent(...args),
}));

const mockTerminateLiveActivity = jest.fn();

jest.mock("../../helpers/live-activities.native", () => ({
  terminateLiveActivity: (...args) => mockTerminateLiveActivity(...args),
}));

const appConfigurationMock = jest.requireMock("../../config/app-configuration.native");

jest.mock("../../config/app-configuration.native", () => ({
  appBrand: "betfair",
}));

// Use Jest globals
jest.mock("react-native-device-info", () => ({
  getSystemVersion: jest.fn(() => "26.0"),
}));

const mockNowDate = "2020-01-01T12:15:00Z";
const threeHoursInMillis = 3 * 60 * 60 * 1000;
global.Date.now = jest.fn(() => new Date(mockNowDate).getTime());

const dispatchSubscribeToEventsNotificationsMock = jest.fn();
const dispatchUnsubscribeToEventsNotificationsMock = jest.fn();
const dispatchNativePromptShownMock = jest.fn();
const dispatchLiveActivitySubscribeMock = jest.fn();
const dispatchLiveActivityUnsubscribeMock = jest.fn();
const dispatchPushNotificationEventMock = jest.fn();
const dispatchMyBetsSinglesBellClickEventMock = jest.fn();
const dispatchMyBetsMultiplesBellClickEventMock = jest.fn();
const dispatchMyBetsNotificationsCloseEventMock = jest.fn();
const dispatchMyBetsSaveClickEventMock = jest.fn();
const dispatchEventPageNotificationsToggleEventMock = jest.fn();

const PUSH_NOTIFICATIONS_DATA_MOCK = {
  applicationTypeId: "applicationTypeId",
  deviceId: "deviceId",
  isSystemPushEnabled: true,
  locale: "localeCode",
  areAllEventsSubscribed: false,
  moduleName: "sport-notification-competition-match",
  isNotificationsUnavailable: false,
  isNotificationsSelected: false,
  topics: [
    {
      topicId: "12345",
      eventType: "FOOTBALL",
      incidentTypes: [],
    },
  ],
  unsupportedTopics: [],
  betType: "SGL",
  sportId: "1",
};

const LIVE_ACTIVITY_VIEW_MODEL_MOCK = {
  applicationTypeId: "applicationTypeId",
  deviceId: "deviceId",
  locale: "localeCode",
  eventId: "event-123",
  startTime: new Date(Date.now()).toISOString(),
  matchStatus: "MATCH_STATUS_STARTED",
  matchPeriod: "FIRST_HALF",
  teams: {
    home: {
      name: "Team A",
      crest: "https://example.com/team-a-crest.png",
    },
    away: {
      name: "Team B",
      crest: "https://example.com/team-b-crest.png",
    },
  },
  score: {
    home: 1,
    away: 0,
  },
  clock: {
    minutes: 25,
    seconds: 30,
  },
};

function renderNotificationsSubscription({
  viewMode = NotificationsViewMode.EVENT_OR_RACE,
  isLoggedIn = true,
  loginLabel = "Login",
  joinNowLabel = "Join Now",
  goToSettingsLabel = "Go to Settings",
  loginPromptTitle = "Login or Join Now",
  loginPromptDescription = "problem description",
  settingsPromptTitle = "Settings Prompt",
  settingsPromptDescription = "Settings Prompt description",
  notificationsToggleLabel = "Live Alerts",
  notificationsBottomSheetTitle = "Notifications Bottom Sheet Title",
  notificationsBottomSheetHeaderTitle = "Notifications Bottom Sheet Header Title",
  notificationsBottomSheetHeaderDescription = "Notifications Bottom Sheet Header Description",
  notificationsBottomSheetFooterTitle = "Notifications Bottom Sheet Footer Title",
  liveActivitiesToggleTitle = "Live Activities Header Title",
  liveActivitiesToggleDescription = "Live Activities Header Description",
  liveActivitiesToggleDisabledDescription = "Live Activities Disabled",
  liveActivitiesToggleMoreThanTwoHoursDescription = "Live Activities More Than Two Hours",
  liveActivityIsSubscribed = false,
  liveActivityViewModel = LIVE_ACTIVITY_VIEW_MODEL_MOCK,
  wasNotificationNativePromptShown = true,
  moduleName = "sport-notification-competition-match",
  pushNotificationsData = PUSH_NOTIFICATIONS_DATA_MOCK,
  isSBGJoinNowEnabled = true,
  isEventPageLiveActivitiesActive = false,
  dispatchSubscribeToEventsNotifications = dispatchSubscribeToEventsNotificationsMock,
  dispatchUnsubscribeToEventsNotifications = dispatchUnsubscribeToEventsNotificationsMock,
  dispatchNativePromptShown = dispatchNativePromptShownMock,
  dispatchLiveActivitySubscribe = dispatchLiveActivitySubscribeMock,
  dispatchLiveActivityUnsubscribe = dispatchLiveActivityUnsubscribeMock,
  dispatchPushNotificationEvent = dispatchPushNotificationEventMock,
  dispatchMyBetsSinglesBellClickEvent = dispatchMyBetsSinglesBellClickEventMock,
  dispatchMyBetsMultiplesBellClickEvent = dispatchMyBetsMultiplesBellClickEventMock,
  dispatchMyBetsNotificationsCloseEvent = dispatchMyBetsNotificationsCloseEventMock,
  dispatchMyBetsSaveClickEvent = dispatchMyBetsSaveClickEventMock,
  dispatchEventPageNotificationsToggleEvent = dispatchEventPageNotificationsToggleEventMock,
} = {}) {
  return render(
    <NotificationsSubscription
      viewMode={viewMode}
      isLoggedIn={isLoggedIn}
      loginLabel={loginLabel}
      joinNowLabel={joinNowLabel}
      goToSettingsLabel={goToSettingsLabel}
      loginPromptTitle={loginPromptTitle}
      loginPromptDescription={loginPromptDescription}
      settingsPromptTitle={settingsPromptTitle}
      settingsPromptDescription={settingsPromptDescription}
      notificationsToggleLabel={notificationsToggleLabel}
      notificationsBottomSheetTitle={notificationsBottomSheetTitle}
      notificationsBottomSheetHeaderTitle={notificationsBottomSheetHeaderTitle}
      notificationsBottomSheetHeaderDescription={notificationsBottomSheetHeaderDescription}
      notificationsBottomSheetFooterTitle={notificationsBottomSheetFooterTitle}
      liveActivitiesToggleTitle={liveActivitiesToggleTitle}
      liveActivitiesToggleDescription={liveActivitiesToggleDescription}
      liveActivitiesToggleDisabledDescription={liveActivitiesToggleDisabledDescription}
      liveActivitiesToggleMoreThanTwoHoursDescription={liveActivitiesToggleMoreThanTwoHoursDescription}
      liveActivityIsSubscribed={liveActivityIsSubscribed}
      liveActivityViewModel={liveActivityViewModel}
      wasNotificationNativePromptShown={wasNotificationNativePromptShown}
      moduleName={moduleName}
      pushNotificationsData={pushNotificationsData}
      isSBGJoinNowEnabled={isSBGJoinNowEnabled}
      isEventPageLiveActivitiesActive={isEventPageLiveActivitiesActive}
      dispatchSubscribeToEventsNotifications={dispatchSubscribeToEventsNotifications}
      dispatchUnsubscribeToEventsNotifications={dispatchUnsubscribeToEventsNotifications}
      dispatchNativePromptShown={dispatchNativePromptShown}
      dispatchLiveActivitySubscribe={dispatchLiveActivitySubscribe}
      dispatchLiveActivityUnsubscribe={dispatchLiveActivityUnsubscribe}
      dispatchPushNotificationEvent={dispatchPushNotificationEvent}
      dispatchMyBetsSinglesBellClickEvent={dispatchMyBetsSinglesBellClickEvent}
      dispatchMyBetsMultiplesBellClickEvent={dispatchMyBetsMultiplesBellClickEvent}
      dispatchMyBetsNotificationsCloseEvent={dispatchMyBetsNotificationsCloseEvent}
      dispatchMyBetsSaveClickEvent={dispatchMyBetsSaveClickEvent}
      dispatchEventPageNotificationsToggleEvent={dispatchEventPageNotificationsToggleEvent}
    />,
  );
}

describe("NotificationsSubscription", () => {
  beforeEach(jest.clearAllMocks);

  describe("hasJoinNowButton", () => {
    let container;

    describe("when brand is Betfair", () => {
      it("Notification prompt should be configured for Login or Join now", () => {
        container = renderNotificationsSubscription({ isLoggedIn: false });
        const pressable = container.queryByTestId(selectors.NOTIFICATIONS_SUBSCRIPTION_PRESSABLE);
        fireEvent.press(pressable);

        expect(NotificationPrompt).toHaveBeenLastCalledWith(
          {
            description: "problem description",
            onOutsideTap: expect.any(Function),
            onPrimaryButtonTap: expect.any(Function),
            onSecondaryButtonTap: expect.any(Function),
            primaryButtonLabel: "Join Now",
            secondaryButtonLabel: "Login",
            title: "Login or Join Now",
          },
          undefined,
        );
      });
    });

    describe("when brand is SkyBet", () => {
      beforeEach(() => {
        appConfigurationMock.appBrand = "skybet";
      });

      it("Notification prompt should be configured for Login or Join now when isSBGJoinNowEnabled is true", () => {
        container = renderNotificationsSubscription({ isLoggedIn: false });
        const pressable = container.queryByTestId(selectors.NOTIFICATIONS_SUBSCRIPTION_PRESSABLE);
        fireEvent.press(pressable);

        expect(NotificationPrompt).toHaveBeenLastCalledWith(
          {
            description: "problem description",
            onOutsideTap: expect.any(Function),
            onPrimaryButtonTap: expect.any(Function),
            onSecondaryButtonTap: expect.any(Function),
            primaryButtonLabel: "Join Now",
            secondaryButtonLabel: "Login",
            title: "Login or Join Now",
          },
          undefined,
        );
      });

      it("Notification prompt should be configured for Login when isSBGJoinNowEnabled is false", () => {
        container = renderNotificationsSubscription({ isLoggedIn: false, isSBGJoinNowEnabled: false });
        const pressable = container.queryByTestId(selectors.NOTIFICATIONS_SUBSCRIPTION_PRESSABLE);
        fireEvent.press(pressable);

        expect(NotificationPrompt).toHaveBeenLastCalledWith(
          {
            description: "problem description",
            onOutsideTap: expect.any(Function),
            onPrimaryButtonTap: expect.any(Function),
            onSecondaryButtonTap: undefined,
            primaryButtonLabel: "Login",
            secondaryButtonLabel: undefined,
            title: "Login",
          },
          undefined,
        );
      });
    });
  });

  describe("when viewMode is BET_RECEIPT", () => {
    describe("When isNotificationsUnavailable is true", () => {
      let container;

      beforeEach(() => {
        container = renderNotificationsSubscription({
          viewMode: NotificationsViewMode.BET_RECEIPT,
          pushNotificationsData: {
            ...PUSH_NOTIFICATIONS_DATA_MOCK,
            areAllEventsSubscribed: false,
            isNotificationsUnavailable: true,
            isNotificationsSelected: false,
            isSystemPushEnabled: true,
            showNotificationsToggle: true,
          },
        });
      });

      it("should render the toggle", () => {
        expect(container.queryByTestId("master-toggle")).not.toBeNull();
      });

      it("should not render the NOTIFICATION_OFF", () => {
        expect(container.queryByTestId("generic-icon")).toBeNull();
      });
    });

    describe("When isNotificationsUnavailable is false", () => {
      describe("when event is not subscribed", () => {
        let container;

        beforeEach(() => {
          container = renderNotificationsSubscription({
            viewMode: NotificationsViewMode.BET_RECEIPT,
            pushNotificationsData: {
              ...PUSH_NOTIFICATIONS_DATA_MOCK,
              areAllEventsSubscribed: false,
              isNotificationsSelected: false,
              isSystemPushEnabled: true,
              showNotificationsToggle: true,
            },
          });
        });

        it("should render the toggle", () => {
          expect(container.queryByTestId("master-toggle")).not.toBeNull();
        });

        it("should not render notification icon", () => {
          expect(container.queryByTestId("generic-icon")).toBeNull();
        });

        describe("when the toggle icon is pressed", () => {
          let pressable;
          beforeEach(async () => {
            pressable = container.queryByTestId("master-toggle");
            await fireEvent.press(pressable);
          });

          it("should dispatch event subscribe", () => {
            const { topics, applicationTypeId, deviceId, locale, unsupportedTopics } = PUSH_NOTIFICATIONS_DATA_MOCK;

            expect(dispatchSubscribeToEventsNotificationsMock).toHaveBeenLastCalledWith(
              unsupportedTopics,
              topics,
              applicationTypeId,
              deviceId,
              locale,
            );
          });

          it("should not dispatch an event interaction", () => {
            expect(dispatchPushNotificationEventMock).not.toHaveBeenCalled();
          });
        });
      });

      describe("when event is subscribed", () => {
        let container;
        beforeEach(() => {
          container = renderNotificationsSubscription({
            viewMode: NotificationsViewMode.BET_RECEIPT,
            pushNotificationsData: {
              ...PUSH_NOTIFICATIONS_DATA_MOCK,
              areAllEventsSubscribed: true,
              isNotificationsSelected: true,
              isSystemPushEnabled: true,
              showNotificationsToggle: true,
            },
          });
        });

        it("should render the toggle", () => {
          const toggle = container.queryByTestId("master-toggle");
          expect(toggle).not.toBeNull();
        });

        it("should not render the notification icon", () => {
          expect(container.queryByTestId("generic-icon")).toBeNull();
        });

        describe("when switch is pressed", () => {
          let pressable;
          beforeEach(async () => {
            pressable = container.queryByTestId("master-toggle");
            await fireEvent.press(pressable);
          });

          it("should dispatch event unsubscribe", () => {
            expect(dispatchUnsubscribeToEventsNotificationsMock).toHaveBeenCalled();
          });

          it("should not dispatch event interaction", () => {
            expect(dispatchPushNotificationEventMock).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe("when the user is logged in", () => {
      describe("and it didn't show the native prompt yet", () => {
        describe("and the notifications are disabled", () => {
          beforeEach(async () => {
            const { queryByTestId } = renderNotificationsSubscription({
              viewMode: NotificationsViewMode.BET_RECEIPT,
              wasNotificationNativePromptShown: false,
              pushNotificationsData: {
                ...PUSH_NOTIFICATIONS_DATA_MOCK,
                areAllEventsSubscribed: false,
                isNotificationsSelected: false,
                isSystemPushEnabled: false,
                showNotificationsToggle: true,
              },
            });
            const toggle = queryByTestId("master-toggle");
            await fireEvent.press(toggle);
          });

          it("should show the native prompt", () => {
            expect(showNativePushPrompt).toHaveBeenLastCalledWith(dispatchNativePromptShownMock);
          });
        });
      });

      describe("and it has shown the native prompt before", () => {
        describe("and the notifications are disabled", () => {
          let container;
          beforeEach(async () => {
            container = renderNotificationsSubscription({
              viewMode: NotificationsViewMode.BET_RECEIPT,
              wasNotificationNativePromptShown: true,
              pushNotificationsData: {
                ...PUSH_NOTIFICATIONS_DATA_MOCK,
                areAllEventsSubscribed: false,
                isNotificationsSelected: false,
                isSystemPushEnabled: false,
                showNotificationsToggle: true,
              },
            });
            const toggle = container.queryByTestId("master-toggle");
            await act(() => fireEvent.press(toggle));
          });

          it("should still not show the bell icon in the background", () => {
            expect(container.queryByTestId("generic-icon")).toBeNull();
          });

          it("should show the go to settings prompt", () => {
            expect(NotificationPrompt).toHaveBeenLastCalledWith(
              {
                description: "Settings Prompt description",
                onOutsideTap: expect.any(Function),
                onPrimaryButtonTap: expect.any(Function),
                primaryButtonLabel: "Go to Settings",
                title: "Settings Prompt",
              },
              undefined,
            );
          });
        });
      });
    });
  });

  describe("when viewMode is EVENT_OR_RACE", () => {
    describe("when isEventPageLiveActivitiesActive is true and events is passed", () => {
      let container;

      beforeEach(() => {
        mockIsLiveActivityEnabled.mockReturnValue(true);
        mockGetLiveActivityToggleDisabledFlag.mockReturnValue(false);
        mockGetLiveActivityToggleLabel.mockReturnValue("Live Activities Header Description");

        container = renderNotificationsSubscription({
          isEventPageLiveActivitiesActive: true,
          pushNotificationsData: {
            ...PUSH_NOTIFICATIONS_DATA_MOCK,
            events: [{ id: "event1", name: "Event 1", isSubscribed: false }],
            topics: [{ topicId: "event1", eventType: "FOOTBALL", incidentTypes: [] }],
          },
        });
      });

      it("must render the bell icon in white", () => {
        expect(GenericIcon.mock.calls.length).toEqual(1);
        expect(GenericIcon).toHaveBeenCalledWith(
          { name: SystemIconName.NOTIFICATION_OFF, color: tokens.NotificationsSubscriptionDisabledIconColour },
          undefined,
        );
      });

      describe("when the bell icon is pressed", () => {
        beforeEach(async () => {
          const pressable = container.queryByTestId(selectors.NOTIFICATIONS_SUBSCRIPTION_PRESSABLE);
          await act(() => fireEvent.press(pressable));
        });

        it("should render the bottomsheet with the correct props", () => {
          expect(BottomSheet).toHaveBeenCalledWith(
            expect.objectContaining({
              title: "Notifications Bottom Sheet Title",
              onHeaderIconTap: expect.any(Function),
              showOverlay: true,
              withModal: true,
              headerContent: expect.any(Object),
              footerContent: null,
            }),
            undefined,
          );
        });

        it("should render no event options", () => {
          // Event options only render for MY_BETS viewMode, not EVENT_OR_RACE
          expect(Option).not.toHaveBeenCalledWith(
            expect.objectContaining({
              checkboxId: expect.any(String),
            }),
            undefined,
          );
        });

        it("should render two master toggles with the correct props in the header", () => {
          expect(Option).toHaveBeenNthCalledWith(
            1,
            {
              title: "Live Activities Header Title",
              subtitle: "Live Activities Header Description",
              isToggle: true,
              isSelected: false,
              isReadOnly: false,
              onPress: expect.any(Function),
            },
            undefined,
          );

          expect(Option).toHaveBeenNthCalledWith(
            2,
            {
              title: "Notifications Bottom Sheet Header Title",
              subtitle: "Notifications Bottom Sheet Header Description",
              isToggle: true,
              isSelected: false,
              onPress: expect.any(Function),
            },
            undefined,
          );
        });

        describe("when the user clicks on the second master toggle", () => {
          it("should subscribe to notifications", async () => {
            const masterToggles = container.queryAllByTestId("master-toggle");
            await act(() => fireEvent.press(masterToggles[1]));

            expect(dispatchSubscribeToEventsNotificationsMock).toHaveBeenCalledWith(
              [],
              [{ topicId: "event1", eventType: "FOOTBALL", incidentTypes: [] }],
              "applicationTypeId",
              "deviceId",
              "localeCode",
            );
          });

          it("should dispatch event page notifications toggle event", async () => {
            const masterToggles = container.queryAllByTestId("master-toggle");
            await act(() => fireEvent.press(masterToggles[1]));

            expect(dispatchEventPageNotificationsToggleEventMock).toHaveBeenCalledWith(
              true,
              "sport-notification-competition-match",
            );
          });
        });

        describe("when the user clicks on the first master toggle (live activities)", () => {
          it("should call onLiveActivityToggleUpdate with the negated current toggle state", async () => {
            const masterToggles = container.queryAllByTestId("master-toggle");
            await act(() => fireEvent.press(masterToggles[0]));

            expect(mockOnLiveActivityToggleUpdate).toHaveBeenCalledWith(
              true,
              expect.objectContaining({ eventId: "event-123" }),
              expect.any(Function),
            );
          });

          it("should dispatch dispatchLiveActivitySubscribe when the helper reports isSubscribed=true with a push token", async () => {
            const masterToggles = container.queryAllByTestId("master-toggle");
            await act(() => fireEvent.press(masterToggles[0]));

            const updateCallback = mockOnLiveActivityToggleUpdate.mock.calls.at(-1)[2];
            await act(() => updateCallback({ isSubscribed: true, pushToken: "push-token-abc" }));

            expect(dispatchLiveActivitySubscribeMock).toHaveBeenCalledWith(
              "deviceId",
              "applicationTypeId",
              "localeCode",
              [{ pushToken: "push-token-abc", eventId: "event-123" }],
            );
            expect(dispatchLiveActivityUnsubscribeMock).not.toHaveBeenCalled();
          });

          it("should dispatch dispatchLiveActivityUnsubscribe when the helper reports isSubscribed=false with a push token", async () => {
            const masterToggles = container.queryAllByTestId("master-toggle");
            await act(() => fireEvent.press(masterToggles[0]));

            const updateCallback = mockOnLiveActivityToggleUpdate.mock.calls.at(-1)[2];
            await act(() => updateCallback({ isSubscribed: false, pushToken: "push-token-abc" }));

            expect(dispatchLiveActivityUnsubscribeMock).toHaveBeenCalledWith("deviceId", "applicationTypeId", [
              { pushToken: "push-token-abc", eventId: "event-123" },
            ]);
            expect(dispatchLiveActivitySubscribeMock).not.toHaveBeenCalled();
          });

          it("should not dispatch subscribe or unsubscribe when the push token is missing", async () => {
            const masterToggles = container.queryAllByTestId("master-toggle");
            await act(() => fireEvent.press(masterToggles[0]));

            const updateCallback = mockOnLiveActivityToggleUpdate.mock.calls.at(-1)[2];
            await act(() => updateCallback({ isSubscribed: true }));

            expect(dispatchLiveActivitySubscribeMock).not.toHaveBeenCalled();
            expect(dispatchLiveActivityUnsubscribeMock).not.toHaveBeenCalled();
          });
        });

        describe("live activities initial state", () => {
          it("should query hasLiveActivitySubscription on mount with the eventId from the view model", () => {
            expect(mockHasLiveActivitySubscription).toHaveBeenCalledWith("event-123", expect.any(Function));
          });

          it("should reflect the subscription state from hasLiveActivitySubscription on the first master toggle", async () => {
            mockHasLiveActivitySubscription.mockImplementationOnce((_id, cb) => cb(true));

            // Re-render so the effect runs against a fresh implementation
            const fresh = renderNotificationsSubscription({
              isEventPageLiveActivitiesActive: true,
              pushNotificationsData: {
                ...PUSH_NOTIFICATIONS_DATA_MOCK,
                events: [{ id: "event1", name: "Event 1", isSubscribed: false }],
                topics: [{ topicId: "event1", eventType: "FOOTBALL", incidentTypes: [] }],
              },
            });
            const pressable = fresh.queryByTestId(selectors.NOTIFICATIONS_SUBSCRIPTION_PRESSABLE);
            await act(() => fireEvent.press(pressable));

            expect(Option).toHaveBeenCalledWith(
              expect.objectContaining({ title: "Live Activities Header Title", isSelected: true }),
              undefined,
            );
          });

          it("should subscribe to @@UI/NSS_SUBSCRIPTION_FAILED on mount", () => {
            expect(mockSubscribeEvent).toHaveBeenCalledWith("@@UI/NSS_SUBSCRIPTION_FAILED", expect.any(Function));
          });

          it("should call terminateLiveActivity with the eventId from the emitted payload when @@UI/NSS_SUBSCRIPTION_FAILED fires", () => {
            const subscribeCall = mockSubscribeEvent.mock.calls.find(
              ([event]) => event === "@@UI/NSS_SUBSCRIPTION_FAILED",
            );
            const handler = subscribeCall[1];
            mockTerminateLiveActivity.mockClear();

            handler({ eventId: "event-from-saga" });

            expect(mockTerminateLiveActivity).toHaveBeenCalledWith("event-from-saga", expect.any(Function));
          });
        });
      });
    });

    describe("when live activity is unavailable", () => {
      let container;

      beforeEach(() => {
        mockIsLiveActivityEnabled.mockReturnValue(true);
        mockGetLiveActivityToggleDisabledFlag.mockReturnValue(true);
        mockGetLiveActivityToggleLabel.mockReturnValue("Live Activities Disabled");

        container = renderNotificationsSubscription({
          isEventPageLiveActivitiesActive: true,
          pushNotificationsData: {
            ...PUSH_NOTIFICATIONS_DATA_MOCK,
            events: [{ id: "event1", name: "Event 1", isSubscribed: false }],
            topics: [{ topicId: "event1", eventType: "FOOTBALL", incidentTypes: [] }],
          },
        });
      });

      describe("when the bell icon is pressed", () => {
        beforeEach(async () => {
          const pressable = container.queryByTestId(selectors.NOTIFICATIONS_SUBSCRIPTION_PRESSABLE);
          await act(() => fireEvent.press(pressable));
        });

        it("should render the first master toggle as read only with the correct description", () => {
          expect(Option).toHaveBeenNthCalledWith(
            1,
            {
              title: "Live Activities Header Title",
              subtitle: "Live Activities Disabled",
              isToggle: true,
              isSelected: false,
              isReadOnly: true,
              onPress: expect.any(Function),
            },
            undefined,
          );
        });
      });
    });

    describe("when live activity is available and event is more than two hours away", () => {
      let container;

      beforeEach(() => {
        mockIsLiveActivityEnabled.mockReturnValue(true);
        mockGetLiveActivityToggleDisabledFlag.mockReturnValue(true);
        mockGetLiveActivityToggleLabel.mockReturnValue("Live Activities More Than Two Hours");

        container = renderNotificationsSubscription({
          isEventPageLiveActivitiesActive: true,
          pushNotificationsData: {
            ...PUSH_NOTIFICATIONS_DATA_MOCK,
            events: [{ id: "event1", name: "Event 1", isSubscribed: false }],
            topics: [{ topicId: "event1", eventType: "FOOTBALL", incidentTypes: [] }],
          },
          liveActivityViewModel: {
            ...LIVE_ACTIVITY_VIEW_MODEL_MOCK,
            startTime: new Date(Date.now() + threeHoursInMillis).toISOString(),
          },
        });
      });

      describe("when the bell icon is pressed", () => {
        beforeEach(async () => {
          const pressable = container.queryByTestId(selectors.NOTIFICATIONS_SUBSCRIPTION_PRESSABLE);
          await act(() => fireEvent.press(pressable));
        });

        it("should render the first master toggle as read only with the correct description", () => {
          expect(Option).toHaveBeenNthCalledWith(
            1,
            {
              title: "Live Activities Header Title",
              subtitle: "Live Activities More Than Two Hours",
              isToggle: true,
              isSelected: false,
              isReadOnly: true,
              onPress: expect.any(Function),
            },
            undefined,
          );
        });
      });
    });

    // describe("when isEventPageLiveActivitiesActive is true", () => {
    //   let container;

    //   beforeEach(() => {
    //     container = renderNotificationsSubscription({
    //       isEventPageLiveActivitiesActive: true,
    //       liveActivitiesToggleIsReadOnly: true,
    //       pushNotificationsData: {
    //         ...PUSH_NOTIFICATIONS_DATA_MOCK,
    //         events: [{ id: "event1", name: "Event 1", isSubscribed: false }],
    //         topics: [{ topicId: "event1", eventType: "FOOTBALL", incidentTypes: [] }],
    //       },
    //       liveActivitiesFeatureState: "AVAILABLE",
    //       liveActivityPayload: {
    //         ...LIVE_ACTIVITY_PAYLOAD_MOCK,
    //         startTime: new Date().toLocaleDateString()
    //       }
    //     });
    //   });

    //   describe("when the bell icon is pressed", () => {
    //     beforeEach(async () => {
    //       const pressable = container.queryByTestId(selectors.NOTIFICATIONS_SUBSCRIPTION_PRESSABLE);
    //       await act(() => fireEvent.press(pressable));
    //     });

    //     it("should render two master toggles with the correct props in the header", () => {
    //       expect(Option).toHaveBeenNthCalledWith(
    //         1,
    //         {
    //           title: "Live Activities Header Title",
    //           subtitle: "Live Activities Header Description",
    //           isToggle: true,
    //           isSelected: false,
    //           isReadOnly: false,
    //           onPress: expect.any(Function),
    //         },
    //         undefined,
    //       );

    //       expect(Option).toHaveBeenNthCalledWith(
    //         2,
    //         {
    //           title: "Notifications Bottom Sheet Header Title",
    //           subtitle: "Notifications Bottom Sheet Header Description",
    //           isToggle: true,
    //           isSelected: false,
    //           onPress: expect.any(Function),
    //         },
    //         undefined,
    //       );
    //     });

    //     // live activity deactivated/etc

    //     describe("when the user clicks on the second master toggle", () => {
    //       it("should subscribe to notifications", async () => {
    //         const masterToggles = container.queryAllByTestId("master-toggle");
    //         await act(() => fireEvent.press(masterToggles[1]));

    //         expect(dispatchSubscribeToEventsNotificationsMock).toHaveBeenCalledWith(
    //           [],
    //           [{ topicId: "event1", eventType: "FOOTBALL", incidentTypes: [] }],
    //           "applicationTypeId",
    //           "deviceId",
    //           "localeCode",
    //         );
    //       });

    //       it("should dispatch event page notifications toggle event", async () => {
    //         const masterToggles = container.queryAllByTestId("master-toggle");
    //         await act(() => fireEvent.press(masterToggles[1]));

    //         expect(dispatchEventPageNotificationsToggleEventMock).toHaveBeenCalledWith(
    //           true,
    //           "sport-notification-competition-match",
    //         );
    //       });
    //     });
    //   });
    // });

    describe("when isEventPageLiveActivitiesActive is false", () => {
      describe("when event is not subscribed", () => {
        let container;

        beforeEach(() => {
          container = renderNotificationsSubscription();
        });

        it("must render the bell icon in white", () => {
          expect(GenericIcon.mock.calls.length).toEqual(1);
          expect(GenericIcon).toHaveBeenCalledWith(
            { name: SystemIconName.NOTIFICATION_OFF, color: tokens.NotificationsSubscriptionDisabledIconColour },
            undefined,
          );
        });

        describe("when the bell icon is pressed", () => {
          let pressable;
          beforeEach(async () => {
            pressable = container.queryByTestId(selectors.NOTIFICATIONS_SUBSCRIPTION_PRESSABLE);
            await fireEvent.press(pressable);
          });

          it("should dispatch event subscribe", () => {
            const { topics, applicationTypeId, deviceId, locale, unsupportedTopics } = PUSH_NOTIFICATIONS_DATA_MOCK;

            expect(dispatchSubscribeToEventsNotificationsMock).toHaveBeenLastCalledWith(
              unsupportedTopics,
              topics,
              applicationTypeId,
              deviceId,
              locale,
            );
          });

          it("should dispatch event interaction", () => {
            expect(dispatchPushNotificationEventMock).toHaveBeenLastCalledWith(
              "notification on",
              "sport-notification-competition-match",
            );
          });
        });
      });

      describe("when event is subscribed", () => {
        let container;
        beforeEach(() => {
          container = renderNotificationsSubscription({
            pushNotificationsData: { ...PUSH_NOTIFICATIONS_DATA_MOCK, areAllEventsSubscribed: true },
          });
        });

        it("must render the bell icon in yellow", () => {
          expect(GenericIcon.mock.calls.length).toEqual(1);
          expect(GenericIcon).toHaveBeenCalledWith(
            { name: SystemIconName.NOTIFICATION_ON, color: "#FFB80C" },
            undefined,
          );
        });

        describe("when button is pressed", () => {
          let pressable;
          beforeEach(async () => {
            pressable = container.queryByTestId(selectors.NOTIFICATIONS_SUBSCRIPTION_PRESSABLE);
            await fireEvent.press(pressable);
          });

          it("should dispatch event subscribe", () => {
            expect(dispatchSubscribeToEventsNotificationsMock).not.toHaveBeenCalled();
          });

          it("should dispatch event interaction", () => {
            expect(dispatchPushNotificationEventMock).toHaveBeenLastCalledWith(
              "notification off",
              "sport-notification-competition-match",
            );
          });
        });
      });

      describe("when the user is not logged in and the bell icon is pressed", () => {
        let container;

        beforeEach(() => {
          container = renderNotificationsSubscription({ isLoggedIn: false });
          const pressable = container.queryByTestId(selectors.NOTIFICATIONS_SUBSCRIPTION_PRESSABLE);
          fireEvent.press(pressable);
        });

        it("should still show the bell icon in the background", () => {
          expect(GenericIcon).toHaveBeenCalledWith(
            { name: SystemIconName.NOTIFICATION_OFF, color: "#C6C6C6" },
            undefined,
          );
        });

        it("shouldn't dispatch an event subscribe", () => {
          expect(dispatchSubscribeToEventsNotificationsMock).not.toHaveBeenCalled();
        });

        it("should render the notification prompt", () => {
          expect(NotificationPrompt).toHaveBeenLastCalledWith(
            {
              description: "problem description",
              onOutsideTap: expect.any(Function),
              onPrimaryButtonTap: expect.any(Function),
              onSecondaryButtonTap: expect.any(Function),
              primaryButtonLabel: "Join Now",
              secondaryButtonLabel: "Login",
              title: "Login or Join Now",
            },
            undefined,
          );
        });

        describe("and the onJoinButtonTap callback is called", () => {
          it("should call the login hook", () => {
            const { onPrimaryButtonTap } = NotificationPrompt.mock.calls[0][0];
            act(() => onPrimaryButtonTap());

            expect(mockUseJoinNow).toHaveBeenCalledTimes(1);

            expect(dispatchPushNotificationEventMock).toHaveBeenLastCalledWith("Join Now", "notifications");
          });
        });

        describe("and the onLoginButtonTap callback is called", () => {
          it("should call the login hook", () => {
            const { onSecondaryButtonTap } = NotificationPrompt.mock.calls[0][0];
            act(() => onSecondaryButtonTap());

            expect(mockUseLogin).toHaveBeenCalledTimes(1);

            expect(dispatchPushNotificationEventMock).toHaveBeenLastCalledWith("Login", "notifications");
          });
        });
      });

      describe("when the user is logged in", () => {
        describe("and it didn't show the native prompt yet", () => {
          describe("and the notifications are disabled", () => {
            beforeEach(async () => {
              const { queryByTestId } = renderNotificationsSubscription({
                isLoggedIn: true,
                wasNotificationNativePromptShown: false,
                pushNotificationsData: {
                  isSystemPushEnabled: false,
                },
              });
              const bellIcon = queryByTestId(selectors.NOTIFICATIONS_SUBSCRIPTION_PRESSABLE);
              await fireEvent.press(bellIcon);
            });

            it("should show the native prompt", () => {
              expect(showNativePushPrompt).toHaveBeenLastCalledWith(dispatchNativePromptShownMock);
            });
          });
        });

        describe("and it has shown the native prompt before", () => {
          describe("and the notifications are disabled", () => {
            beforeEach(async () => {
              const { queryByTestId } = renderNotificationsSubscription({
                isLoggedIn: true,
                wasNotificationNativePromptShown: true,
                pushNotificationsData: {
                  isSystemPushEnabled: false,
                },
              });
              const bellIcon = queryByTestId(selectors.NOTIFICATIONS_SUBSCRIPTION_PRESSABLE);
              await act(() => fireEvent.press(bellIcon));
            });

            it("should still show the bell icon in the background", () => {
              expect(GenericIcon).toHaveBeenCalledWith(
                { name: SystemIconName.NOTIFICATION_OFF, color: "#C6C6C6" },
                undefined,
              );
            });

            it("should show the go to settings prompt", () => {
              expect(NotificationPrompt).toHaveBeenLastCalledWith(
                {
                  description: "Settings Prompt description",
                  onOutsideTap: expect.any(Function),
                  onPrimaryButtonTap: expect.any(Function),
                  primaryButtonLabel: "Go to Settings",
                  title: "Settings Prompt",
                },
                undefined,
              );
            });
          });
        });
      });
    });
  });

  describe("when viewMode is MY_BETS", () => {
    const PUSH_NOTIFICATIONS_DATA_WITH_EVENTS_MOCK = {
      ...PUSH_NOTIFICATIONS_DATA_MOCK,
      events: [
        { id: "event1", name: "Event 1", isSubscribed: false },
        { id: "event2", name: "Event 2", isSubscribed: true },
        { id: "event3", name: "Event 3", isSubscribed: false },
      ],
      topics: [
        { topicId: "event1", eventType: "FOOTBALL", incidentTypes: [] },
        { topicId: "event2", eventType: "FOOTBALL", incidentTypes: [] },
        { topicId: "event3", eventType: "FOOTBALL", incidentTypes: [] },
      ],
    };

    describe("when there are no events", () => {
      it("should not render the SupportingContentButton", () => {
        const container = renderNotificationsSubscription({
          viewMode: NotificationsViewMode.MY_BETS,
          pushNotificationsData: {
            ...PUSH_NOTIFICATIONS_DATA_MOCK,
            events: [],
          },
        });

        expect(container.queryByTestId("supporting-content-button")).toBeNull();
      });
    });

    describe("when there is at least one event", () => {
      describe("and at least one event is subscribed", () => {
        it("should render the SupportingContentButton with the correct props", () => {
          renderNotificationsSubscription({
            viewMode: NotificationsViewMode.MY_BETS,
            pushNotificationsData: PUSH_NOTIFICATIONS_DATA_WITH_EVENTS_MOCK,
          });

          expect(SupportingContentButton).toHaveBeenCalledWith(
            {
              icon: SystemIconName.NOTIFICATION_ON,
              isOpen: true,
              isHighlighted: true,
              onPress: expect.any(Function),
            },
            undefined,
          );
        });
      });

      describe("and no events are subscribed", () => {
        it("should render the SupportingContentButton with the correct props", () => {
          renderNotificationsSubscription({
            viewMode: NotificationsViewMode.MY_BETS,
            pushNotificationsData: {
              ...PUSH_NOTIFICATIONS_DATA_WITH_EVENTS_MOCK,
              events: [
                { id: "event1", name: "Event 1", isSubscribed: false },
                { id: "event2", name: "Event 2", isSubscribed: false },
              ],
            },
          });

          expect(SupportingContentButton).toHaveBeenCalledWith(
            {
              icon: SystemIconName.NOTIFICATION_OFF,
              isOpen: false,
              isHighlighted: true,
              onPress: expect.any(Function),
            },
            undefined,
          );
        });
      });
    });

    describe("when SupportingContentButton is pressed", () => {
      describe("and there is only one event", () => {
        describe("and it is already subscribed", () => {
          it("should dispatch unsubscribe directly without showing bottom sheet", async () => {
            const container = renderNotificationsSubscription({
              viewMode: NotificationsViewMode.MY_BETS,
              pushNotificationsData: {
                ...PUSH_NOTIFICATIONS_DATA_MOCK,
                areAllEventsSubscribed: true,
                events: [{ id: "event1", name: "Event 1", isSubscribed: true }],
                topics: [{ topicId: "event1", eventType: "FOOTBALL", incidentTypes: [] }],
              },
            });

            const button = container.queryByTestId("supporting-content-button");
            await act(() => fireEvent.press(button));

            expect(BottomSheet).not.toHaveBeenCalled();
            expect(dispatchUnsubscribeToEventsNotificationsMock).toHaveBeenCalled();
          });

          it("should dispatch Singles bell click event with turn OFF", async () => {
            const container = renderNotificationsSubscription({
              viewMode: NotificationsViewMode.MY_BETS,
              pushNotificationsData: {
                ...PUSH_NOTIFICATIONS_DATA_MOCK,
                areAllEventsSubscribed: true,
                events: [{ id: "event1", name: "Event 1", isSubscribed: true }],
                topics: [{ topicId: "event1", eventType: "FOOTBALL", incidentTypes: [] }],
                betType: "SGL",
                sportId: "1",
              },
            });

            const button = container.queryByTestId("supporting-content-button");
            await act(() => fireEvent.press(button));

            expect(dispatchMyBetsSinglesBellClickEventMock).toHaveBeenCalledWith(false, "SGL", "1");
          });
        });

        describe("and it is not subscribed", () => {
          it("should dispatch subscribe directly without showing bottom sheet", async () => {
            const container = renderNotificationsSubscription({
              viewMode: NotificationsViewMode.MY_BETS,
              pushNotificationsData: {
                ...PUSH_NOTIFICATIONS_DATA_MOCK,
                areAllEventsSubscribed: false,
                events: [{ id: "event1", name: "Event 1", isSubscribed: false }],
                topics: [{ topicId: "event1", eventType: "FOOTBALL", incidentTypes: [] }],
              },
            });

            const button = container.queryByTestId("supporting-content-button");
            await act(() => fireEvent.press(button));

            expect(BottomSheet).not.toHaveBeenCalled();
            expect(dispatchSubscribeToEventsNotificationsMock).toHaveBeenCalled();
          });

          it("should dispatch Singles bell click event with turn ON", async () => {
            const container = renderNotificationsSubscription({
              viewMode: NotificationsViewMode.MY_BETS,
              pushNotificationsData: {
                ...PUSH_NOTIFICATIONS_DATA_MOCK,
                areAllEventsSubscribed: false,
                events: [{ id: "event1", name: "Event 1", isSubscribed: false }],
                topics: [{ topicId: "event1", eventType: "FOOTBALL", incidentTypes: [] }],
                betType: "SGL",
                sportId: "1",
              },
            });

            const button = container.queryByTestId("supporting-content-button");
            await act(() => fireEvent.press(button));

            expect(dispatchMyBetsSinglesBellClickEventMock).toHaveBeenCalledWith(true, "SGL", "1");
          });
        });
      });

      describe("and there are multiple events", () => {
        let container;
        beforeEach(async () => {
          container = renderNotificationsSubscription({
            viewMode: NotificationsViewMode.MY_BETS,
            pushNotificationsData: PUSH_NOTIFICATIONS_DATA_WITH_EVENTS_MOCK,
          });
          const button = container.queryByTestId("supporting-content-button");
          await act(() => fireEvent.press(button));
        });

        it("should call the bottom sheet with the correct props", () => {
          expect(BottomSheet).toHaveBeenCalledWith(
            expect.objectContaining({
              title: "Notifications Bottom Sheet Title",
              onHeaderIconTap: expect.any(Function),
              showOverlay: true,
              withModal: true,
              headerContent: expect.any(Object),
              footerContent: expect.any(Object),
            }),
            undefined,
          );
        });

        it("should dispatch Multiples bell click event with subscribed count and total fixtures", () => {
          // 1 event is subscribed out of 3 total events
          expect(dispatchMyBetsMultiplesBellClickEventMock).toHaveBeenCalledWith(1, 3, "SGL");
        });

        it("should render event options in the bottom sheet", () => {
          expect(Option).toHaveBeenCalledWith(
            {
              title: "Event 1",
              checkboxId: "event1",
              isSelected: false,
              onPress: expect.any(Function),
            },
            undefined,
          );
          expect(Option).toHaveBeenCalledWith(
            {
              title: "Event 2",
              checkboxId: "event2",
              isSelected: true,
              onPress: expect.any(Function),
            },
            undefined,
          );
          expect(Option).toHaveBeenCalledWith(
            {
              title: "Event 3",
              checkboxId: "event3",
              isSelected: false,
              onPress: expect.any(Function),
            },
            undefined,
          );
        });
        it("should render the master toggle in the header", () => {
          expect(Option).toHaveBeenCalledWith(
            {
              title: "Notifications Bottom Sheet Header Title",
              subtitle: "Notifications Bottom Sheet Header Description",
              isToggle: true,
              isSelected: true,
              onPress: expect.any(Function),
            },
            undefined,
          );
        });

        it("should render the save button disabled when no changes are made", () => {
          expect(PrimaryButton).toHaveBeenCalledWith(
            {
              label: "Notifications Bottom Sheet Footer Title",
              disabled: true,
              onTap: expect.any(Function),
            },
            undefined,
          );
        });

        describe("and the user closes the bottom sheet", () => {
          beforeEach(async () => {
            const onHeaderIconTap = BottomSheet.mock.calls[0][0].onHeaderIconTap;
            await act(() => onHeaderIconTap());
          });

          it("should dispatch the notifications close event with the bet type", () => {
            expect(dispatchMyBetsNotificationsCloseEventMock).toHaveBeenCalledWith("SGL");
          });
        });

        describe("and the user clicks on the only subscribed event option", () => {
          beforeEach(async () => {
            const event2Option = container.queryByTestId("event2");
            await act(() => fireEvent.press(event2Option));
          });

          it("should enable the save button", () => {
            expect(PrimaryButton).toHaveBeenLastCalledWith(
              {
                label: "Notifications Bottom Sheet Footer Title",
                disabled: false,
                onTap: expect.any(Function),
              },
              undefined,
            );
          });

          it("should disable the master toggle", () => {
            expect(Option).toHaveBeenCalledWith(
              {
                title: "Notifications Bottom Sheet Header Title",
                subtitle: "Notifications Bottom Sheet Header Description",
                isToggle: true,
                isSelected: false,
                onPress: expect.any(Function),
              },
              undefined,
            );
          });

          describe("and then user clicks on the master toggle to subscribe to all events", () => {
            beforeEach(async () => {
              const masterToggle = container.queryByTestId("master-toggle");
              await act(() => fireEvent.press(masterToggle));
            });

            it("should enable all the event options", () => {
              expect(Option).toHaveBeenCalledWith(
                {
                  title: "Event 1",
                  checkboxId: "event1",
                  isSelected: true,
                  onPress: expect.any(Function),
                },
                undefined,
              );
              expect(Option).toHaveBeenCalledWith(
                {
                  title: "Event 2",
                  checkboxId: "event2",
                  isSelected: true,
                  onPress: expect.any(Function),
                },
                undefined,
              );
              expect(Option).toHaveBeenCalledWith(
                {
                  title: "Event 3",
                  checkboxId: "event3",
                  isSelected: true,
                  onPress: expect.any(Function),
                },
                undefined,
              );
            });

            describe("and then the user deselects one event option and clicks on the save button", () => {
              beforeEach(async () => {
                const event2Option = container.queryByTestId("event2");
                await act(() => fireEvent.press(event2Option));

                const saveButton = container.queryByTestId("primary-button");
                await act(() => fireEvent.press(saveButton));
              });

              it("should dispatch subscribe and unsubscribe with the correct params", () => {
                // Event 1 and Event 3 were not subscribed, now they are -> subscribe
                expect(dispatchSubscribeToEventsNotificationsMock).toHaveBeenCalledWith(
                  [],
                  [
                    { topicId: "event1", eventType: "FOOTBALL", incidentTypes: [] },
                    { topicId: "event3", eventType: "FOOTBALL", incidentTypes: [] },
                  ],
                  "applicationTypeId",
                  "deviceId",
                  "localeCode",
                );

                // Event 2 was subscribed, now it's not -> unsubscribe
                expect(dispatchUnsubscribeToEventsNotificationsMock).toHaveBeenCalledWith(
                  [],
                  [{ topicId: "event2", eventType: "FOOTBALL", incidentTypes: [] }],
                  "applicationTypeId",
                  "deviceId",
                  false,
                );
              });
            });
          });
        });
      });
    });

    describe("save button analytics", () => {
      const PUSH_NOTIFICATIONS_DATA_WITH_SPORT_IDS = {
        ...PUSH_NOTIFICATIONS_DATA_MOCK,
        betType: "ACC4",
        events: [
          { id: "event1", name: "Event 1", isSubscribed: false, sportId: "1" },
          { id: "event2", name: "Event 2", isSubscribed: true, sportId: "1" },
          { id: "event3", name: "Event 3", isSubscribed: false, sportId: "7" },
        ],
        topics: [
          { topicId: "event1", eventType: "FOOTBALL", incidentTypes: [] },
          { topicId: "event2", eventType: "FOOTBALL", incidentTypes: [] },
          { topicId: "event3", eventType: "TENNIS", incidentTypes: [] },
        ],
      };

      it("should dispatch save click event with correct subscribed count and sports ids", async () => {
        const container = renderNotificationsSubscription({
          viewMode: NotificationsViewMode.MY_BETS,
          pushNotificationsData: PUSH_NOTIFICATIONS_DATA_WITH_SPORT_IDS,
        });

        // Open bottom sheet
        const button = container.queryByTestId("supporting-content-button");
        await act(() => fireEvent.press(button));

        // Select event1 (sportId: 1)
        const event1Option = container.queryByTestId("event1");
        await act(() => fireEvent.press(event1Option));

        // Click save button
        const saveButton = container.queryByTestId("primary-button");
        await act(() => fireEvent.press(saveButton));

        // Should dispatch with 2 subscribed events (event1 + event2), 3 total, betType ACC4, and sportsIds "1"
        expect(dispatchMyBetsSaveClickEventMock).toHaveBeenCalledWith(2, 3, "ACC4", "1");
      });

      it("should dispatch save click event with multiple unique sports ids", async () => {
        const container = renderNotificationsSubscription({
          viewMode: NotificationsViewMode.MY_BETS,
          pushNotificationsData: PUSH_NOTIFICATIONS_DATA_WITH_SPORT_IDS,
        });

        // Open bottom sheet
        const button = container.queryByTestId("supporting-content-button");
        await act(() => fireEvent.press(button));

        // Select event1 (sportId: 1) and event3 (sportId: 7)
        const event1Option = container.queryByTestId("event1");
        await act(() => fireEvent.press(event1Option));

        const event3Option = container.queryByTestId("event3");
        await act(() => fireEvent.press(event3Option));

        // Click save button
        const saveButton = container.queryByTestId("primary-button");
        await act(() => fireEvent.press(saveButton));

        // Should dispatch with 3 subscribed events (event1 + event2 + event3), 3 total, betType ACC4, and sportsIds "1,7"
        expect(dispatchMyBetsSaveClickEventMock).toHaveBeenCalledWith(3, 3, "ACC4", "1,7");
      });

      it("should dispatch save click event with empty sportsIds when all events are unsubscribed", async () => {
        const container = renderNotificationsSubscription({
          viewMode: NotificationsViewMode.MY_BETS,
          pushNotificationsData: PUSH_NOTIFICATIONS_DATA_WITH_SPORT_IDS,
        });

        // Open bottom sheet
        const button = container.queryByTestId("supporting-content-button");
        await act(() => fireEvent.press(button));

        // Unsubscribe event2 (the only subscribed one)
        const event2Option = container.queryByTestId("event2");
        await act(() => fireEvent.press(event2Option));

        // Click save button
        const saveButton = container.queryByTestId("primary-button");
        await act(() => fireEvent.press(saveButton));

        // Should dispatch with 0 subscribed events, 3 total, betType ACC4, and empty sportsIds
        expect(dispatchMyBetsSaveClickEventMock).toHaveBeenCalledWith(0, 3, "ACC4", "");
      });
    });
  });
});
