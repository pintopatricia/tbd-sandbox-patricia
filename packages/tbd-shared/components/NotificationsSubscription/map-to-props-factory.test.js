import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import {
  PN_INTERACTION_EVENT,
  PN_NATIVE_PROMPT_SHOWN_EVENT,
  PN_SUBSCRIBE_EVENTS,
  PN_UNSUBSCRIBE_EVENTS,
  PN_MYBETS_SINGLES_BELL_CLICK,
  PN_MYBETS_MULTIPLES_BELL_CLICK,
  PN_MYBETS_NOTIFICATIONS_CLOSE,
  PN_MYBETS_SAVE_CLICK,
  PN_EVENT_PAGE_NOTIFICATIONS_TOGGLE,
  LA_SUBSCRIBE_EVENTS,
  LA_UNSUBSCRIBE_EVENTS,
} from "@ppb/tbd-store/actions/push-notifications";
import { makeMapStateToProps, mapDispatchToProps, NotificationsViewMode } from "./map-to-props-factory";
import {
  createPushNotificationsDataBuilderFromReport,
  createPushNotificationsDataFromUrn,
  createPushNotificationsDataFromSportsbookBet,
  createPushNotificationsDataFromRace,
  createLiveActivitiesToggleTitle,
  createLiveActivitiesToggleDescription,
} from "./notifications-subscription-mapper";
import { createLiveActivityViewModel } from "./live-activities-mapper";

const getThrottle = jest.fn(() => ({ isActive: false }));

jest.mock("../../helpers/live-activities.native", () => ({
  getLiveActivityState: jest.fn(() => "AVAILABLE"),
  LiveActivityState: {
    Unavailable: "UNAVAILABLE",
    Available: "AVAILABLE",
    AvailableWithScheduling: "AVAILABLE_WITH_SCHEDULING",
  },
}));

jest.mock("@ppb/tbd-store/state/entities/competitions/competition-selectors", () => ({
  getCompetitionByURN: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/sports/sport-selectors", () => ({
  getSportByURN: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/layout/layout-selectors", () => ({
  createViewTypeSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/meetings/meeting-selectors", () => ({
  createMeetingByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/sport-events/sport-event-selectors", () => ({
  createSportEventByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/races/race-selectors", () => ({
  createRaceByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/notifications/notifications-selectors", () => ({
  createGetNotificationsDeviceSelector: jest.fn(),
  createIsEventSubscribedByEventIdSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(),
  getUserDetails: jest.fn(() => ({ loggedIn: true })),
}));

jest.mock("@ppb/tbd-store", () => ({
  createGetThrottleSelector: jest.fn(() => getThrottle),
}));

jest.mock("./notifications-subscription-mapper", () => ({
  createPushNotificationsDataBuilderFromReport: jest.fn(),
  createPushNotificationsDataFromUrn: jest.fn(),
  createPushNotificationsDataFromSportsbookBet: jest.fn(),
  createPushNotificationsDataFromRace: jest.fn(),
  createLiveActivitiesToggleDescription: jest.fn(),
  createLiveActivitiesToggleTitle: jest.fn(),
}));

jest.mock("./live-activities-mapper", () => ({
  createLiveActivityViewModel: jest.fn(() => jest.fn()),
}));

jest.mock("../../helpers/notifications", () => ({
  getIncidentsByEventType: jest.fn(() => []),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("../../helpers/dates", () => ({
  formatTime: jest.fn(() => "15:56"),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

const DEFAULT_STATE = {
  layouts: {
    cards: {
      markets: {},
    },
  },
};

const NOTIFICATIONS_STATE = {
  entities: {
    userdetails: {
      currencyCode: "EUR",
      localeCode: "en",
      countryCode: "GB",
      loggedIn: true,
    },
    throttles: { SBG_HAS_JOIN_NOW: { isActive: true } },
  },
  notifications: {
    wasNotificationNativePromptShown: false,
    deviceInfo: {},
  },
};

const setupMapStateToProps = ({ state = DEFAULT_STATE, urn } = {}) => makeMapStateToProps()(state, { urn });

describe("MapToPropsFactory - NotificationsSubscription", () => {
  beforeEach(jest.clearAllMocks);

  describe("makeMapStateToProps", () => {
    it("should create the selectors", () => {
      makeMapStateToProps();

      expect(createGetCountryLocalCurrencyCodeSelector).toHaveBeenCalledTimes(1);
      expect(createPushNotificationsDataBuilderFromReport).toHaveBeenCalledTimes(1);
      expect(createPushNotificationsDataFromUrn).toHaveBeenCalledTimes(1);
      expect(createPushNotificationsDataFromSportsbookBet).toHaveBeenCalledTimes(1);
      expect(createPushNotificationsDataFromRace).toHaveBeenCalledTimes(1);
    });

    describe("mapStateToProps", () => {
      const USER_DETAILS = {
        localeCode: "en",
        loggedIn: true,
        localeCodeBcp47: "locale",
        timezone: "timezone",
      };

      const getCountryLocalCurrencyCodeSelector = jest.fn(() => USER_DETAILS);
      const buildPushNotificationsDataFromUrn = jest.fn();
      const buildPushNotificationsDataFromReport = jest.fn();
      const buildPushNotificationsDataFromSportsbookBet = jest.fn();
      const buildPushNotificationsDataFromRace = jest.fn();
      const buildLiveActivityViewModelMock = jest.fn();

      const STATE = {
        entities: {
          sportevents: { "sport:event:1": {} },
          races: { "ppb:race:31155193.1550": {} },
          meetings: { "meeting:event:1": {} },
          competitions: { "competition:event:1": {} },
        },
        notifications: { deviceInfo: {}, wasNotificationNativePromptShown: false },
      };

      let mapStateToProps;

      beforeEach(() => {
        createGetCountryLocalCurrencyCodeSelector.mockReturnValue(getCountryLocalCurrencyCodeSelector);
        createPushNotificationsDataFromUrn.mockReturnValue(buildPushNotificationsDataFromUrn);
        createPushNotificationsDataBuilderFromReport.mockReturnValue(buildPushNotificationsDataFromReport);
        createPushNotificationsDataFromSportsbookBet.mockReturnValue(buildPushNotificationsDataFromSportsbookBet);
        createPushNotificationsDataFromRace.mockReturnValue(buildPushNotificationsDataFromRace);
        createLiveActivityViewModel.mockReturnValue(buildLiveActivityViewModelMock);
        mapStateToProps = makeMapStateToProps();
      });

      describe("when viewMode is BET_RECEIPT", () => {
        it("should call getCountryLocalCurrencyCodeSelector and buildPushNotificationsDataFromReport", () => {
          mapStateToProps(STATE, { viewMode: NotificationsViewMode.BET_RECEIPT, betURN: "ppb:bet:123" });

          expect(getCountryLocalCurrencyCodeSelector).toHaveBeenCalledWith(STATE);
          expect(buildPushNotificationsDataFromReport).toHaveBeenCalled();
          expect(buildPushNotificationsDataFromUrn).not.toHaveBeenCalled();
          expect(buildPushNotificationsDataFromSportsbookBet).not.toHaveBeenCalled();
        });
      });

      describe("when viewMode is EVENT_OR_RACE", () => {
        it("should call getCountryLocalCurrencyCodeSelector and buildPushNotificationsDataFromUrn", () => {
          mapStateToProps(STATE, { viewMode: NotificationsViewMode.EVENT_OR_RACE });

          expect(getCountryLocalCurrencyCodeSelector).toHaveBeenCalledWith(STATE);
          expect(buildPushNotificationsDataFromUrn).toHaveBeenCalled();
          expect(buildPushNotificationsDataFromReport).not.toHaveBeenCalled();
          expect(buildPushNotificationsDataFromSportsbookBet).not.toHaveBeenCalled();
        });
      });

      describe("when viewMode is MY_BETS", () => {
        it("should call getCountryLocalCurrencyCodeSelector and buildPushNotificationsDataFromSportsbookBet with betURN", () => {
          const betURN = "ppb:bet:123";
          mapStateToProps(STATE, { viewMode: NotificationsViewMode.MY_BETS, betURN });

          expect(getCountryLocalCurrencyCodeSelector).toHaveBeenCalledWith(STATE);
          expect(buildPushNotificationsDataFromSportsbookBet).toHaveBeenCalledWith(STATE, betURN);
          expect(buildPushNotificationsDataFromReport).not.toHaveBeenCalled();
          expect(buildPushNotificationsDataFromUrn).not.toHaveBeenCalled();
        });
      });

      describe("when viewMode is RACE", () => {
        it("should call getCountryLocalCurrencyCodeSelector and buildPushNotificationsDataFromRace with raceId", () => {
          const raceId = "31155193";
          mapStateToProps(STATE, { viewMode: NotificationsViewMode.RACE, raceId });

          expect(getCountryLocalCurrencyCodeSelector).toHaveBeenCalledWith(STATE);
          expect(buildPushNotificationsDataFromRace).toHaveBeenCalledWith(STATE, raceId);
          expect(buildPushNotificationsDataFromReport).not.toHaveBeenCalled();
          expect(buildPushNotificationsDataFromUrn).not.toHaveBeenCalled();
          expect(buildPushNotificationsDataFromSportsbookBet).not.toHaveBeenCalled();
        });
      });

      describe("SBG_HAS_JOIN_NOW throttle", () => {
        it("should return isSBGJoinNowEnabled flag as true", () => {
          getThrottle.mockReturnValue({ isActive: true });

          const props = setupMapStateToProps({ state: NOTIFICATIONS_STATE });

          expect(getThrottle).toHaveBeenCalledWith(NOTIFICATIONS_STATE.entities.throttles, "SBG_HAS_JOIN_NOW");
          expect(props.isSBGJoinNowEnabled).toEqual(true);
        });

        it("should return isSBGJoinNowEnabled flag as false", () => {
          getThrottle.mockReturnValue({ isActive: false });

          const props = setupMapStateToProps({ state: NOTIFICATIONS_STATE });

          expect(getThrottle).toHaveBeenCalledWith(NOTIFICATIONS_STATE.entities.throttles, "SBG_HAS_JOIN_NOW");
          expect(props.isSBGJoinNowEnabled).toEqual(false);
        });
      });

      describe("EVENT_PAGE_LIVE_ACTIVITIES throttle", () => {
        it("should return isEventPageLiveActivitiesActive flag as true", () => {
          getThrottle.mockReturnValue({ isActive: true });

          const props = setupMapStateToProps({ state: NOTIFICATIONS_STATE });

          expect(getThrottle).toHaveBeenCalledWith(
            NOTIFICATIONS_STATE.entities.throttles,
            "EVENT_PAGE_LIVE_ACTIVITIES",
          );
          expect(props.isEventPageLiveActivitiesActive).toEqual(true);
        });

        it("should return isEventPageLiveActivitiesActive flag as false", () => {
          getThrottle.mockReturnValue({ isActive: false });

          const props = setupMapStateToProps({ state: NOTIFICATIONS_STATE });

          expect(getThrottle).toHaveBeenCalledWith(
            NOTIFICATIONS_STATE.entities.throttles,
            "EVENT_PAGE_LIVE_ACTIVITIES",
          );
          expect(props.isEventPageLiveActivitiesActive).toEqual(false);
        });
      });

      describe("i18n labels", () => {
        it("should return the login and join now i18n labels", () => {
          const props = setupMapStateToProps({ state: NOTIFICATIONS_STATE });

          expect(props.joinNowLabel).toEqual("I18N.HEADER.JOIN_NOW");
          expect(props.loginLabel).toEqual("I18N.HEADER.LOGIN");
          expect(props.loginPromptTitle).toEqual("I18N.PROMPT.LOGIN_OR_JOIN_NOW");
          expect(props.loginPromptDescription).toEqual("I18N.PROMPT.TO_RECEIVE_ALERTS_NEED_LOGIN");
        });

        it("should return the settings prompt i18n labels", () => {
          const props = setupMapStateToProps({ state: NOTIFICATIONS_STATE });

          expect(props.settingsPromptTitle).toEqual("I18N.PROMPT.ENABLE_PUSH_NOTIFICATIONS");
          expect(props.settingsPromptDescription).toEqual("I18N.PROMPT.ENABLE_PUSH_NOTIFICATIONS_DESCRIPTION");
          expect(props.goToSettingsLabel).toEqual("I18N.PROMPT.GO_TO_NOTIFICATIONS_SETTINGS");
        });

        it("should return the notifications toggle i18n label", () => {
          const props = setupMapStateToProps({ state: NOTIFICATIONS_STATE });

          expect(props.notificationsToggleLabel).toEqual("I18N.NOTIFICATION.RECEIPT.TOGGLE.TITLE");
        });

        it("should return the bottom sheet i18n labels", () => {
          const props = setupMapStateToProps({ state: NOTIFICATIONS_STATE });

          expect(props.notificationsBottomSheetTitle).toEqual("I18N.MYBETS.NOTIFICATION.HEADER");
          expect(props.notificationsBottomSheetHeaderTitle).toEqual("I18N.MYBETS.NOTIFICATION.TITLE");
          expect(props.notificationsBottomSheetHeaderDescription).toEqual("I18N.MYBETS.NOTIFICATION.DESCRIPTION");
          expect(props.notificationsBottomSheetFooterTitle).toEqual("I18N.MYBETS.NOTIFICATION.SAVE");
        });

        it("should return the live activities toggle i18n labels", () => {
          const props = setupMapStateToProps({ state: NOTIFICATIONS_STATE });

          expect(props.liveActivitiesToggleTitle).toEqual("I18N.EVENT.LIVE_ACTIVITIES");
          expect(props.liveActivitiesToggleDescription).toEqual("I18N.EVENT.LIVE_ACTIVITIES_DESC");
          expect(props.liveActivitiesToggleDisabledDescription).toEqual("I18N.EVENT.LIVE_ACTIVITIES_IOS16");
          expect(props.liveActivitiesToggleMoreThanTwoHoursDescription).toEqual("I18N.EVENT.LIVE_ACTIVITIES_2H");
        });
      });

      describe("live activities mapping", () => {
        it("should expose the liveActivitiesFeatureState from getLiveActivityState", () => {
          const props = setupMapStateToProps({ state: NOTIFICATIONS_STATE });

          expect(props.liveActivitiesFeatureState).toEqual("AVAILABLE");
        });

        it("should call the live activity view model builder with the state and expose its result", () => {
          const viewModel = { eventId: "event-1", startTime: "2026-05-21T15:00:00Z" };
          buildLiveActivityViewModelMock.mockReturnValueOnce(viewModel);

          const props = setupMapStateToProps({ state: NOTIFICATIONS_STATE });

          expect(buildLiveActivityViewModelMock).toHaveBeenCalledWith(NOTIFICATIONS_STATE);
          expect(props.liveActivityViewModel).toEqual(viewModel);
        });
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  describe("dispatchPushNotificationEvent", () => {
    it("should unsubscribe to event action", () => {
      const { dispatchPushNotificationEvent } = mapDispatchToProps;
      const module = "module";
      const label = "label";

      expect(dispatchPushNotificationEvent(label, module)).toEqual({
        payload: {
          module,
          label,
        },
        type: PN_INTERACTION_EVENT,
      });
    });
  });

  describe("dispatchNativePromptShown", () => {
    beforeAll(jest.clearAllMocks);

    it("should dispatch push notification prompt action", () => {
      const { dispatchNativePromptShown } = mapDispatchToProps;

      expect(dispatchNativePromptShown()).toEqual({
        type: PN_NATIVE_PROMPT_SHOWN_EVENT,
      });
    });
  });

  describe("dispatchSubscribeToEventsNotifications", () => {
    it("should dispatch subscribe to events action", () => {
      const { dispatchSubscribeToEventsNotifications } = mapDispatchToProps;
      const unsupportedTopics = ["unsupported"];
      const topics = [{ topicId: "topic1" }];
      const applicationTypeId = "appTypeId";
      const deviceId = "deviceId";
      const locale = "en";

      expect(
        dispatchSubscribeToEventsNotifications(unsupportedTopics, topics, applicationTypeId, deviceId, locale),
      ).toEqual({
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
    });
  });

  describe("dispatchLiveActivitySubscribe", () => {
    it("should build an LA_SUBSCRIBE_EVENTS action with the subscribeLiveActivity payload", () => {
      const { dispatchLiveActivitySubscribe } = mapDispatchToProps;
      const liveActivityEvents = [{ eventId: "event-1", pushToken: "token-1" }];

      expect(dispatchLiveActivitySubscribe("deviceId", "appTypeId", "en", liveActivityEvents)).toEqual({
        type: LA_SUBSCRIBE_EVENTS,
        payload: {
          subscribeLiveActivity: {
            liveActivityEvents,
            applicationTypeId: "appTypeId",
            deviceId: "deviceId",
            locale: "en",
          },
        },
      });
    });
  });

  describe("dispatchLiveActivityUnsubscribe", () => {
    it("should build an LA_UNSUBSCRIBE_EVENTS action with the unsubscribeLiveActivity payload", () => {
      const { dispatchLiveActivityUnsubscribe } = mapDispatchToProps;
      const liveActivityEvents = [{ eventId: "event-1", pushToken: "token-1" }];

      expect(dispatchLiveActivityUnsubscribe("deviceId", "appTypeId", liveActivityEvents)).toEqual({
        type: LA_UNSUBSCRIBE_EVENTS,
        payload: {
          unsubscribeLiveActivity: {
            liveActivityEvents,
            applicationTypeId: "appTypeId",
            deviceId: "deviceId",
          },
        },
      });
    });
  });

  describe("dispatchUnsubscribeToEventsNotifications", () => {
    it("should dispatch unsubscribe to events action with showToastMessage defaulting to true", () => {
      const { dispatchUnsubscribeToEventsNotifications } = mapDispatchToProps;
      const unsupportedTopics = ["unsupported"];
      const topics = [{ topicId: "topic1" }];
      const applicationTypeId = "appTypeId";
      const deviceId = "deviceId";

      expect(dispatchUnsubscribeToEventsNotifications(unsupportedTopics, topics, applicationTypeId, deviceId)).toEqual({
        type: PN_UNSUBSCRIBE_EVENTS,
        payload: {
          applicationTypeId,
          deviceId,
          topics,
          unsupportedTopics,
          isSelected: false,
          showToastMessage: true,
        },
      });
    });

    it("should dispatch unsubscribe to events action with showToastMessage set to false", () => {
      const { dispatchUnsubscribeToEventsNotifications } = mapDispatchToProps;
      const unsupportedTopics = ["unsupported"];
      const topics = [{ topicId: "topic1" }];
      const applicationTypeId = "appTypeId";
      const deviceId = "deviceId";

      expect(
        dispatchUnsubscribeToEventsNotifications(unsupportedTopics, topics, applicationTypeId, deviceId, false),
      ).toEqual({
        type: PN_UNSUBSCRIBE_EVENTS,
        payload: {
          applicationTypeId,
          deviceId,
          topics,
          unsupportedTopics,
          isSelected: false,
          showToastMessage: false,
        },
      });
    });
  });

  describe("dispatchMyBetsSinglesBellClickEvent", () => {
    it("should dispatch singles bell click event", () => {
      const { dispatchMyBetsSinglesBellClickEvent } = mapDispatchToProps;
      const toggleOn = true;
      const betType = "SGL";
      const sportId = "1";

      expect(dispatchMyBetsSinglesBellClickEvent(toggleOn, betType, sportId)).toEqual({
        type: PN_MYBETS_SINGLES_BELL_CLICK,
        payload: {
          toggleOn,
          betType,
          sportId,
        },
      });
    });
  });

  describe("dispatchMyBetsMultiplesBellClickEvent", () => {
    it("should dispatch multiples bell click event with subscribed count and total fixtures", () => {
      const { dispatchMyBetsMultiplesBellClickEvent } = mapDispatchToProps;
      const subscribedCount = 2;
      const numberOfEvents = 5;
      const betType = "ACC4";

      expect(dispatchMyBetsMultiplesBellClickEvent(subscribedCount, numberOfEvents, betType)).toEqual({
        type: PN_MYBETS_MULTIPLES_BELL_CLICK,
        payload: {
          subscribedCount,
          numberOfEvents,
          betType,
        },
      });
    });
  });

  describe("dispatchMyBetsNotificationsCloseEvent", () => {
    it("should dispatch notifications close event with bet type", () => {
      const { dispatchMyBetsNotificationsCloseEvent } = mapDispatchToProps;
      const betType = "SGL";

      expect(dispatchMyBetsNotificationsCloseEvent(betType)).toEqual({
        type: PN_MYBETS_NOTIFICATIONS_CLOSE,
        payload: {
          betType,
        },
      });
    });
  });
  describe("dispatchMyBetsSaveClickEvent", () => {
    it("should dispatch save click event with correct props", () => {
      const { dispatchMyBetsSaveClickEvent } = mapDispatchToProps;
      const subscribedCount = 3;
      const numberOfEvents = 4;
      const betType = "TBL";
      const sportsIds = "1,7,21";

      expect(dispatchMyBetsSaveClickEvent(subscribedCount, numberOfEvents, betType, sportsIds)).toEqual({
        type: PN_MYBETS_SAVE_CLICK,
        payload: {
          subscribedCount,
          numberOfEvents,
          betType,
          sportsIds,
        },
      });
    });
  });

  describe("dispatchEventPageNotificationsToggleEvent", () => {
    it("should dispatch event page notifications toggle event", () => {
      const { dispatchEventPageNotificationsToggleEvent } = mapDispatchToProps;
      const isSelected = true;
      const moduleName = "sport-notification-competition-match";

      expect(dispatchEventPageNotificationsToggleEvent(isSelected, moduleName)).toEqual({
        type: PN_EVENT_PAGE_NOTIFICATIONS_TOGGLE,
        payload: {
          isSelected,
          moduleName,
        },
      });
    });
  });
});
