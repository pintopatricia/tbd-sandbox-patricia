import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import {
  PNInteraction,
  PNNativePromptShownAction,
  PNSubscribeEventsAction,
  PNUnsubscribeEventsAction,
  PNMyBetsSinglesBellClickAction,
  PNMyBetsMultiplesBellClickAction,
  PNMyBetsNotificationsCloseAction,
  PNMyBetsSaveClickAction,
  PNEventPageNotificationsToggleAction,
  PN_INTERACTION_EVENT,
  PN_NATIVE_PROMPT_SHOWN_EVENT,
  PN_SUBSCRIBE_EVENTS,
  PN_UNSUBSCRIBE_EVENTS,
  PN_MYBETS_SINGLES_BELL_CLICK,
  PN_MYBETS_MULTIPLES_BELL_CLICK,
  PN_MYBETS_NOTIFICATIONS_CLOSE,
  PN_MYBETS_SAVE_CLICK,
  PN_EVENT_PAGE_NOTIFICATIONS_TOGGLE,
  LASubscribeEventsAction,
  LAUnsubscribeEventsAction,
  LA_SUBSCRIBE_EVENTS,
  LA_UNSUBSCRIBE_EVENTS,
} from "@ppb/tbd-store/actions/push-notifications";
import { LiveActivityEvent, Topic } from "@ppb/tbd-store/state/entities/notifications/Notifications";
import { createGetThrottleSelector } from "@ppb/tbd-store";
import { i18n } from "../../helpers/i18n";
import {
  createPushNotificationsDataBuilderFromReport,
  createPushNotificationsDataFromUrn,
  createPushNotificationsDataFromSportsbookBet,
  EventInfo,
  createPushNotificationsDataFromRace,
} from "./notifications-subscription-mapper";
import { getLiveActivityState, LiveActivityState } from "../../helpers/live-activities.native";
import { createLiveActivityViewModel, LiveActivityViewModelProps } from "./live-activities-mapper";

export type PushNotificationsDataProps = {
  applicationTypeId?: string;
  deviceId?: string;
  isSystemPushEnabled?: boolean;
  showNotificationsToggle?: boolean;
  isNotificationsSelected?: boolean;
  isNotificationsUnavailable?: boolean;
  areAllEventsSubscribed?: boolean;
  locale: string;
  topics: Topic[];
  unsupportedTopics: string[];
  moduleName?: string;
  events?: EventInfo[];
  betType?: string;
  sportId?: string;
};

export type LiveActivityPayloadProps = {
  eventId: string;
  startTime: string;
  matchStatus: string;
  matchPeriod: string;
  teams: LiveActivityPayloadTeams;
  score?: LiveActivityPayloadScore;
  penaltyScore?: LiveActivityPayloadScore;
  clock?: LiveActivityPayloadClock;
};

export type LiveActivityPayloadTeams = {
  home: LiveActivityPayloadTeam;
  away: LiveActivityPayloadTeam;
};

export type LiveActivityPayloadTeam = {
  name: string;
  crest?: string;
};

export type LiveActivityPayloadScore = {
  home: number;
  away: number;
};

export type LiveActivityPayloadClock = {
  minutes: number;
  seconds: number;
};

export enum NotificationsViewMode {
  EVENT_OR_RACE = "EVENT_OR_RACE", // @deprecated for races use RACE instead
  BET_RECEIPT = "BET_RECEIPT",
  MY_BETS = "MY_BETS",
  RACE = "RACE",
}

export type ContainerProps = {
  viewMode: NotificationsViewMode;
  betURN?: string;
  raceId?: string;
  raceUrn?: string;
};

export type CardProps = {
  isLoggedIn: boolean;
  wasNotificationNativePromptShown: boolean;
  joinNowLabel: string;
  loginLabel: string;
  loginPromptTitle: string;
  loginPromptDescription: string;
  settingsPromptTitle: string;
  settingsPromptDescription: string;
  goToSettingsLabel: string;
  notificationsToggleLabel: string;
  notificationsBottomSheetTitle: string;
  notificationsBottomSheetHeaderTitle: string;
  notificationsBottomSheetHeaderDescription: string;
  notificationsBottomSheetFooterTitle: string;
  pushNotificationsData?: PushNotificationsDataProps | null;
  liveActivitiesToggleTitle: string;
  liveActivitiesToggleDescription: string;
  liveActivitiesToggleDisabledDescription: string;
  liveActivitiesToggleMoreThanTwoHoursDescription: string;
  liveActivitiesFeatureState: LiveActivityState;
  liveActivityViewModel: LiveActivityViewModelProps | null;
  isSBGJoinNowEnabled: boolean;
  isEventPageLiveActivitiesActive: boolean;
};
export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getThrottle = createGetThrottleSelector();
  const getCountryLocalCurrencyCodeSelector = createGetCountryLocalCurrencyCodeSelector();
  const buildPushNotificationsDataFromReport = createPushNotificationsDataBuilderFromReport();
  const buildPushNotificationsDataFromUrn = createPushNotificationsDataFromUrn();
  const buildPushNotificationsDataFromSportsbookBet = createPushNotificationsDataFromSportsbookBet();
  const buildPushNotificationsDataFromRace = createPushNotificationsDataFromRace();
  const buildLiveActivityViewModel = createLiveActivityViewModel();

  const liveActivitiesFeatureState = getLiveActivityState();

  return function mapStateToProps(state: ApplicationState, { viewMode, betURN, raceId }: ContainerProps): StateProps {
    try {
      const { loggedIn } = <UserDetails>getCountryLocalCurrencyCodeSelector(state);
      const isSBGJoinNowEnabled = !!getThrottle(state.entities.throttles, "SBG_HAS_JOIN_NOW")?.isActive;
      const isEventPageLiveActivitiesActive = !!getThrottle(state.entities.throttles, "EVENT_PAGE_LIVE_ACTIVITIES")
        ?.isActive;

      let pushNotificationsData: PushNotificationsDataProps | null = null;

      if (viewMode === NotificationsViewMode.RACE && raceId) {
        pushNotificationsData = buildPushNotificationsDataFromRace(state, raceId);
      } else if (viewMode === NotificationsViewMode.BET_RECEIPT) {
        pushNotificationsData = buildPushNotificationsDataFromReport(state);
      } else if (viewMode === NotificationsViewMode.EVENT_OR_RACE) {
        pushNotificationsData = buildPushNotificationsDataFromUrn(state);
      } else if (viewMode === NotificationsViewMode.MY_BETS && betURN) {
        pushNotificationsData = buildPushNotificationsDataFromSportsbookBet(state, betURN);
      }

      const liveActivityViewModel = buildLiveActivityViewModel(state);

      return {
        isLoggedIn: loggedIn,
        wasNotificationNativePromptShown: state.notifications.wasNotificationNativePromptShown,
        pushNotificationsData,
        isSBGJoinNowEnabled,
        isEventPageLiveActivitiesActive,
        joinNowLabel: i18n({ key: "I18N.HEADER.JOIN_NOW" }),
        loginLabel: i18n({ key: "I18N.HEADER.LOGIN" }),
        loginPromptTitle: i18n({ key: "I18N.PROMPT.LOGIN_OR_JOIN_NOW" }),
        loginPromptDescription: i18n({ key: "I18N.PROMPT.TO_RECEIVE_ALERTS_NEED_LOGIN" }),
        settingsPromptTitle: i18n({ key: "I18N.PROMPT.ENABLE_PUSH_NOTIFICATIONS" }),
        settingsPromptDescription: i18n({ key: "I18N.PROMPT.ENABLE_PUSH_NOTIFICATIONS_DESCRIPTION" }),
        goToSettingsLabel: i18n({ key: "I18N.PROMPT.GO_TO_NOTIFICATIONS_SETTINGS" }),
        notificationsToggleLabel: i18n({ key: "I18N.NOTIFICATION.RECEIPT.TOGGLE.TITLE" }),
        notificationsBottomSheetTitle: i18n({ key: "I18N.MYBETS.NOTIFICATION.HEADER" }),
        notificationsBottomSheetHeaderTitle: i18n({ key: "I18N.MYBETS.NOTIFICATION.TITLE" }),
        notificationsBottomSheetHeaderDescription: i18n({ key: "I18N.MYBETS.NOTIFICATION.DESCRIPTION" }),
        notificationsBottomSheetFooterTitle: i18n({ key: "I18N.MYBETS.NOTIFICATION.SAVE" }),
        liveActivitiesToggleTitle: i18n({ key: "I18N.EVENT.LIVE_ACTIVITIES" }),
        liveActivitiesToggleDescription: i18n({ key: "I18N.EVENT.LIVE_ACTIVITIES_DESC" }),
        liveActivitiesToggleDisabledDescription: i18n({ key: "I18N.EVENT.LIVE_ACTIVITIES_IOS16" }),
        liveActivitiesToggleMoreThanTwoHoursDescription: i18n({ key: "I18N.EVENT.LIVE_ACTIVITIES_2H" }),
        liveActivitiesFeatureState: liveActivitiesFeatureState,
        liveActivityViewModel,
      };
    } catch (e) {
      console.error(e);
      return {};
    }
  };
};

const dispatchSubscribeToEventsNotifications = (
  unsupportedTopics: string[],
  topics: Topic[],
  applicationTypeId: string,
  deviceId: string,
  locale: string,
): PNSubscribeEventsAction => ({
  type: PN_SUBSCRIBE_EVENTS,
  payload: {
    applicationTypeId,
    deviceId,
    locale,
    topics,
    unsupportedTopics,
    isSelected: true,
  },
});

const dispatchUnsubscribeToEventsNotifications = (
  unsupportedTopics: string[],
  topics: Topic[],
  applicationTypeId: string,
  deviceId: string,
  showToastMessage: boolean = true,
): PNUnsubscribeEventsAction => ({
  type: PN_UNSUBSCRIBE_EVENTS,
  payload: {
    applicationTypeId,
    deviceId,
    topics,
    unsupportedTopics,
    isSelected: false,
    showToastMessage,
  },
});

const dispatchLiveActivitySubscribe = (
  deviceId: string,
  applicationTypeId: string,
  locale: string,
  liveActivityEvents: LiveActivityEvent[],
): LASubscribeEventsAction => ({
  type: LA_SUBSCRIBE_EVENTS,
  payload: {
    subscribeLiveActivity: {
      liveActivityEvents,
      applicationTypeId,
      deviceId,
      locale,
    },
  },
});

const dispatchLiveActivityUnsubscribe = (
  deviceId: string,
  applicationTypeId: string,
  liveActivityEvents: LiveActivityEvent[],
): LAUnsubscribeEventsAction => ({
  type: LA_UNSUBSCRIBE_EVENTS,
  payload: {
    unsubscribeLiveActivity: {
      liveActivityEvents,
      applicationTypeId,
      deviceId,
    },
  },
});

const dispatchNativePromptShown = (): PNNativePromptShownAction => ({
  type: PN_NATIVE_PROMPT_SHOWN_EVENT,
});

const dispatchPushNotificationEvent = (label: string, module: string): PNInteraction => ({
  type: PN_INTERACTION_EVENT,
  payload: {
    label,
    module,
  },
});

const dispatchMyBetsSinglesBellClickEvent = (
  toggleOn: boolean,
  betType: string,
  sportId: string,
): PNMyBetsSinglesBellClickAction => ({
  type: PN_MYBETS_SINGLES_BELL_CLICK,
  payload: {
    toggleOn,
    betType,
    sportId,
  },
});

const dispatchMyBetsMultiplesBellClickEvent = (
  subscribedCount: number,
  numberOfEvents: number,
  betType: string,
): PNMyBetsMultiplesBellClickAction => ({
  type: PN_MYBETS_MULTIPLES_BELL_CLICK,
  payload: {
    subscribedCount,
    numberOfEvents,
    betType,
  },
});

const dispatchMyBetsNotificationsCloseEvent = (betType: string): PNMyBetsNotificationsCloseAction => ({
  type: PN_MYBETS_NOTIFICATIONS_CLOSE,
  payload: {
    betType,
  },
});

const dispatchMyBetsSaveClickEvent = (
  subscribedCount: number,
  numberOfEvents: number,
  betType: string,
  sportsIds: string,
): PNMyBetsSaveClickAction => ({
  type: PN_MYBETS_SAVE_CLICK,
  payload: {
    subscribedCount,
    numberOfEvents,
    betType,
    sportsIds,
  },
});

const dispatchEventPageNotificationsToggleEvent = (
  isSelected: boolean,
  moduleName: string,
): PNEventPageNotificationsToggleAction => ({
  type: PN_EVENT_PAGE_NOTIFICATIONS_TOGGLE,
  payload: {
    isSelected,
    moduleName,
  },
});

export type DispatchProps = {
  dispatchNativePromptShown: typeof dispatchNativePromptShown;
  dispatchLiveActivitySubscribe: typeof dispatchLiveActivitySubscribe;
  dispatchLiveActivityUnsubscribe: typeof dispatchLiveActivityUnsubscribe;
  dispatchPushNotificationEvent: typeof dispatchPushNotificationEvent;
  dispatchSubscribeToEventsNotifications: typeof dispatchSubscribeToEventsNotifications;
  dispatchUnsubscribeToEventsNotifications: typeof dispatchUnsubscribeToEventsNotifications;
  dispatchMyBetsSinglesBellClickEvent: typeof dispatchMyBetsSinglesBellClickEvent;
  dispatchMyBetsMultiplesBellClickEvent: typeof dispatchMyBetsMultiplesBellClickEvent;
  dispatchMyBetsNotificationsCloseEvent: typeof dispatchMyBetsNotificationsCloseEvent;
  dispatchMyBetsSaveClickEvent: typeof dispatchMyBetsSaveClickEvent;
  dispatchEventPageNotificationsToggleEvent: typeof dispatchEventPageNotificationsToggleEvent;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchNativePromptShown,
  dispatchLiveActivitySubscribe,
  dispatchLiveActivityUnsubscribe,
  dispatchPushNotificationEvent,
  dispatchSubscribeToEventsNotifications,
  dispatchUnsubscribeToEventsNotifications,
  dispatchMyBetsSinglesBellClickEvent,
  dispatchMyBetsMultiplesBellClickEvent,
  dispatchMyBetsNotificationsCloseEvent,
  dispatchMyBetsSaveClickEvent,
  dispatchEventPageNotificationsToggleEvent,
};
