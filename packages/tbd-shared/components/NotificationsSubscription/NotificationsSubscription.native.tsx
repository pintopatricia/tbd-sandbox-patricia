import { tokens } from "@ppb/the-wall-common/base-theme";
import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon, Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { NotificationPrompt, Option, BottomSheet, PrimaryButton, SupportingContentButton } from "@ppb/the-wall-native";
import { FunctionComponent, memo, useCallback, useEffect, useMemo, useState } from "react";
import { View, Linking, Pressable } from "react-native";
import { PNLabelsEnum, PNModulesEnum } from "@ppb/tbd-store/middlewares/tagging-resolvers/interface";
import { useJoinNow, useLogin } from "@flutter-global/react-native-cet-framework";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Brand } from "@ppb/tbd-store/config/Brand";
import selectors from "./NotificationsSubscription.native.selectors";
import styles from "./NotificationsSubscription.native.styles";
import { ComponentProps } from "./props";
import { showNativePushPrompt } from "../../helpers/push-notifications.native";
import appConfiguration from "../../config/app-configuration.native";
import { NotificationsViewMode } from "./map-to-props-factory";
import { EventInfo } from "./notifications-subscription-mapper";
import emit from "../../event-broker/event-emitter";
import subscribeEvent from "../../event-broker/event-subscriber";
import { terminateLiveActivity } from "../../helpers/live-activities.native";
import {
  getLiveActivityToggleDisabledFlag,
  getLiveActivityToggleLabel,
  hasLiveActivitySubscription,
  onLiveActivityToggleUpdate,
  isLiveActivityEnabled,
} from "./live-activities-helper.native";

type MasterToggleProps = {
  title: string;
  subtitle: string;
  isSelected: boolean;
  isReadOnly?: boolean;
  onPress: () => void;
};

const MasterToggle = memo<MasterToggleProps>(function MasterToggle({
  title,
  subtitle,
  isSelected,
  onPress,
  isReadOnly,
}) {
  return (
    <View style={styles.toggleContainer}>
      <Option
        key={`master-toggle-${isSelected}`}
        title={title}
        subtitle={subtitle}
        isToggle={true}
        isSelected={isSelected}
        onPress={onPress}
        isReadOnly={isReadOnly}
      />
    </View>
  );
});

type EventOptionProps = {
  event: EventInfo;
  isSelected: boolean;
  onPress: (eventId: string) => void;
};

const EventOption = memo<EventOptionProps>(function EventOption({ event, isSelected, onPress }) {
  const handlePress = useCallback(() => onPress(event.id), [onPress, event.id]);

  return (
    <View style={styles.eventOptionContainer}>
      <Option title={event.name} checkboxId={event.id} isSelected={isSelected} onPress={handlePress} />
    </View>
  );
});

/**
 * Function component that wraps the connected notifications subscription component
 * @param viewMode Flag to identify from which screen the component is rendered, to adapt the behaviour accordingly
 * @param pushNotificationsData Data needed to handle push notifications
 * @param wasNotificationNativePromptShown Flag representing if the native notifications promp ia already shown
 * @param isLoggedIn Flag representing if the user is logged in
 * @returns NotificationsSubscription component
 */
const NotificationsSubscription: FunctionComponent<ComponentProps> = ({
  viewMode,
  raceUrn,
  isLoggedIn,
  wasNotificationNativePromptShown,
  joinNowLabel,
  loginLabel,
  loginPromptTitle,
  loginPromptDescription,
  settingsPromptTitle,
  settingsPromptDescription,
  goToSettingsLabel,
  notificationsToggleLabel,
  notificationsBottomSheetTitle,
  notificationsBottomSheetHeaderTitle,
  notificationsBottomSheetHeaderDescription,
  notificationsBottomSheetFooterTitle,
  pushNotificationsData,
  liveActivitiesToggleTitle,
  liveActivitiesToggleDescription,
  liveActivitiesToggleDisabledDescription,
  liveActivitiesToggleMoreThanTwoHoursDescription,
  liveActivityViewModel,
  isSBGJoinNowEnabled,
  isEventPageLiveActivitiesActive,
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
}) => {
  const [showLoggedOutPrompt, setShowLoggedOutPrompt] = useState(false);
  const [showGoToSettingsPrompt, setShowGoToSettingsPrompt] = useState(false);
  const [showEventsBottomSheet, setShowEventsBottomSheet] = useState(false);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [originalSelectedEventIds, setOriginalSelectedEventIds] = useState<string[]>([]);
  const [isLiveActivityToggleSelected, setIsLiveActivityToggleSelected] = useState(false);
  const login = useLogin();
  const joinNow = useJoinNow();

  /**
   * Hides the Join Now button
   * Remove when new register initiative is completed
   * @see CHCKMT-257 for more details
   */
  const hasJoinNowButton = appConfiguration.appBrand === Brand.Skybet ? isSBGJoinNowEnabled : true;

  const isLiveActivityActive = isLiveActivityEnabled(isEventPageLiveActivitiesActive, liveActivityViewModel);

  const onIconClick = useCallback(async () => {
    if (!isLoggedIn) {
      setShowLoggedOutPrompt(true);
      return;
    }

    if (!pushNotificationsData) return;

    const {
      unsupportedTopics,
      topics,
      areAllEventsSubscribed,
      applicationTypeId,
      deviceId,
      locale,
      isSystemPushEnabled,
      moduleName,
      events,
      betType,
      sportId,
    } = pushNotificationsData;

    if (!isSystemPushEnabled) {
      if (wasNotificationNativePromptShown) {
        setShowGoToSettingsPrompt(true);
        return;
      }
      showNativePushPrompt(dispatchNativePromptShown);
      return;
    }

    if (applicationTypeId && deviceId) {
      const isToOpenBottomSheetMyBets = viewMode === NotificationsViewMode.MY_BETS && events && events.length > 1;
      const isToOpenBottomSheetEventPage =
        viewMode === NotificationsViewMode.EVENT_OR_RACE && isLiveActivityActive && events;

      if (isToOpenBottomSheetMyBets || isToOpenBottomSheetEventPage) {
        const subscribedIds = events.filter((event) => event.isSubscribed).map((event) => event.id);
        setSelectedEventIds(subscribedIds);
        setOriginalSelectedEventIds(subscribedIds);
        setShowEventsBottomSheet(true);

        // GA4 tracking for Multiples in my bets - bell click
        if (isToOpenBottomSheetMyBets && betType) {
          dispatchMyBetsMultiplesBellClickEvent(subscribedIds.length, events.length, betType);
        }
        return;
      }

      if (!areAllEventsSubscribed) {
        // Subscribe push notifications
        dispatchSubscribeToEventsNotifications(unsupportedTopics, topics, applicationTypeId, deviceId, locale);
      } else {
        // Unsubscribe push notifications
        dispatchUnsubscribeToEventsNotifications(unsupportedTopics, topics, applicationTypeId, deviceId);
      }

      if (viewMode === NotificationsViewMode.EVENT_OR_RACE && moduleName) {
        dispatchPushNotificationEvent(!areAllEventsSubscribed ? PNLabelsEnum.ON : PNLabelsEnum.OFF, moduleName);
      }
      if (viewMode === NotificationsViewMode.RACE && raceUrn) {
        emit("@@UI/PN_INTERACTION_RACE", { raceUrn });
      }
      if (viewMode === NotificationsViewMode.MY_BETS && betType && sportId) {
        dispatchMyBetsSinglesBellClickEvent(!areAllEventsSubscribed, betType, sportId);
      }
    }
  }, [
    dispatchNativePromptShown,
    dispatchPushNotificationEvent,
    dispatchSubscribeToEventsNotifications,
    dispatchUnsubscribeToEventsNotifications,
    dispatchMyBetsSinglesBellClickEvent,
    dispatchMyBetsMultiplesBellClickEvent,
    isLiveActivityActive,
    isLoggedIn,
    pushNotificationsData,
    raceUrn,
    viewMode,
    wasNotificationNativePromptShown,
  ]);

  const onLoginPromptOutsideTap = useCallback(() => {
    setShowLoggedOutPrompt(false);
    dispatchPushNotificationEvent(PNLabelsEnum.CLOSE, PNModulesEnum.CONFIRMATION);
  }, [dispatchPushNotificationEvent]);

  const onSettingsPromptOutsideTap = useCallback(() => {
    setShowGoToSettingsPrompt(false);
    dispatchPushNotificationEvent(PNLabelsEnum.CLOSE, PNModulesEnum.CONFIRMATION);
  }, [dispatchPushNotificationEvent]);

  const onLoginButtonTap = useCallback(() => {
    setShowLoggedOutPrompt(false);
    dispatchPushNotificationEvent(loginLabel, PNModulesEnum.NOTIFICATION);
    login();
  }, [dispatchPushNotificationEvent, login, loginLabel]);

  const onJoinButtonTap = useCallback(() => {
    setShowLoggedOutPrompt(false);
    dispatchPushNotificationEvent(joinNowLabel, PNModulesEnum.NOTIFICATION);
    joinNow();
  }, [dispatchPushNotificationEvent, joinNow, joinNowLabel]);

  const onGoToSettingsTap = useCallback(() => {
    setShowGoToSettingsPrompt(false);
    dispatchPushNotificationEvent(goToSettingsLabel, PNModulesEnum.NOTIFICATION);

    Linking.openSettings();
  }, [dispatchPushNotificationEvent, goToSettingsLabel]);

  const onEventsBottomSheetClose = useCallback(() => {
    if (viewMode === NotificationsViewMode.MY_BETS && pushNotificationsData?.betType) {
      dispatchMyBetsNotificationsCloseEvent(pushNotificationsData.betType);
    }

    setShowEventsBottomSheet(false);
  }, [viewMode, pushNotificationsData, dispatchMyBetsNotificationsCloseEvent]);

  const pushNotificationsSave = useCallback(
    (selectedEventIds: string[], originalSelectedEventIds: string[]) => {
      if (!pushNotificationsData) return;

      const { topics, unsupportedTopics, applicationTypeId, deviceId, locale } = pushNotificationsData;

      if (applicationTypeId && deviceId) {
        // Events that were unsubscribed but are now subscribed (newly subscribed)
        const newlySubscribedIds = selectedEventIds.filter((id) => !originalSelectedEventIds.includes(id));
        // Events that were subscribed but are now unsubscribed (newly unsubscribed)
        const newlyUnsubscribedIds = originalSelectedEventIds.filter((id) => !selectedEventIds.includes(id));

        const topicsToSubscribe = topics.filter((topic) => newlySubscribedIds.includes(topic.topicId));
        const topicsToUnsubscribe = topics.filter((topic) => newlyUnsubscribedIds.includes(topic.topicId));

        if (topicsToSubscribe.length) {
          dispatchSubscribeToEventsNotifications(
            unsupportedTopics,
            topicsToSubscribe,
            applicationTypeId,
            deviceId,
            locale,
          );
        }

        if (topicsToUnsubscribe.length) {
          const showToastMessage = !topicsToSubscribe.length;

          dispatchUnsubscribeToEventsNotifications(
            unsupportedTopics,
            topicsToUnsubscribe,
            applicationTypeId,
            deviceId,
            showToastMessage,
          );
        }
      }

      setOriginalSelectedEventIds(selectedEventIds);
    },
    [dispatchSubscribeToEventsNotifications, dispatchUnsubscribeToEventsNotifications, pushNotificationsData],
  );

  const onPushNotificationToggle = useCallback(() => {
    if (!pushNotificationsData?.events) return;

    const allEventIds = pushNotificationsData.events.map((event) => event.id);
    const newSelectedIds = selectedEventIds.length > 0 ? [] : allEventIds;

    setSelectedEventIds(newSelectedIds);
    if (viewMode === NotificationsViewMode.EVENT_OR_RACE) {
      pushNotificationsSave(newSelectedIds, originalSelectedEventIds);

      if (pushNotificationsData.moduleName) {
        dispatchEventPageNotificationsToggleEvent(!!newSelectedIds.length, pushNotificationsData.moduleName);
      }
    }
  }, [
    pushNotificationsData,
    selectedEventIds,
    originalSelectedEventIds,
    pushNotificationsSave,
    viewMode,
    dispatchEventPageNotificationsToggleEvent,
  ]);

  const onEventPress = useCallback((eventId: string) => {
    setSelectedEventIds((prevSelected) =>
      prevSelected.includes(eventId) ? prevSelected.filter((id) => id !== eventId) : [...prevSelected, eventId],
    );
  }, []);

  const hasSelectionChanged = useMemo(() => {
    if (selectedEventIds.length !== originalSelectedEventIds.length) return true;
    const sortedSelected = [...selectedEventIds].sort();
    const sortedOriginal = [...originalSelectedEventIds].sort();
    return sortedSelected.some((id, index) => id !== sortedOriginal[index]);
  }, [selectedEventIds, originalSelectedEventIds]);

  const onSavePress = useCallback(() => {
    pushNotificationsSave(selectedEventIds, originalSelectedEventIds);

    // GA4 analytics for save button
    const { events, betType } = pushNotificationsData || {};
    if (events && betType) {
      const numberOfEvents = events.length;
      const subscribedSportsIds = events
        .filter((event) => selectedEventIds.includes(event.id))
        .map((event) => event.sportId)
        .filter((sportId): sportId is string => !!sportId);
      const uniqueSportsIds = Array.from(new Set(subscribedSportsIds)).join(",");

      dispatchMyBetsSaveClickEvent(selectedEventIds.length, numberOfEvents, betType, uniqueSportsIds);
    }

    setShowEventsBottomSheet(false);
  }, [
    pushNotificationsSave,
    selectedEventIds,
    originalSelectedEventIds,
    pushNotificationsData,
    dispatchMyBetsSaveClickEvent,
  ]);

  const notificationIconName = (): Icons => {
    if (pushNotificationsData?.isNotificationsUnavailable) return SystemIconName.NOTIFICATION_UNAVAILABLE;
    if (!pushNotificationsData?.isNotificationsSelected) {
      return SystemIconName.NOTIFICATION_OFF;
    }
    return SystemIconName.NOTIFICATION_ON;
  };

  const notificationIcon = useMemo(
    () => (
      <>
        {pushNotificationsData?.areAllEventsSubscribed && pushNotificationsData?.isSystemPushEnabled ? (
          <View {...getTestProps(selectors.NOTIFICATIONS_ICON_ON)}>
            <GenericIcon name={SystemIconName.NOTIFICATION_ON} color={tokens.NotificationsSubscriptionIconColour} />
          </View>
        ) : (
          <View {...getTestProps(selectors.NOTIFICATIONS_ICON_OFF)}>
            <GenericIcon
              name={SystemIconName.NOTIFICATION_OFF}
              color={tokens.NotificationsSubscriptionDisabledIconColour}
            />
          </View>
        )}
      </>
    ),
    [pushNotificationsData?.areAllEventsSubscribed, pushNotificationsData?.isSystemPushEnabled],
  );

  const isAnyEventSubscribed = useMemo(
    () => pushNotificationsData?.events?.some((event) => event.isSubscribed) ?? false,
    [pushNotificationsData?.events],
  );

  // ################
  // Live Activities
  // ################

  const checkLiveActivitySubscription = useCallback(() => {
    if (isLiveActivityActive && liveActivityViewModel?.eventId) {
      hasLiveActivitySubscription(liveActivityViewModel?.eventId, (hasLiveActivity: boolean) => {
        setIsLiveActivityToggleSelected(hasLiveActivity);
      });
    }
  }, [liveActivityViewModel, isLiveActivityActive]);

  // Live-activities-saga will update NativeModule to reflect the unsubscribe
  // in case of NSS subscription failure
  useEffect(() => {
    subscribeEvent("@@UI/NSS_SUBSCRIPTION_FAILED", ({ eventId }) => {
      terminateLiveActivity(eventId, checkLiveActivitySubscription);
    });
  }, []);

  // Live Activities Initial State Setup
  useEffect(() => {
    checkLiveActivitySubscription();
  }, [liveActivityViewModel?.eventId, isLiveActivityActive]);

  // Live Activities Toggle Handler
  const onLiveActivitiesToggle = useCallback(() => {
    if (isLiveActivityActive && liveActivityViewModel?.eventId) {
      const updateCallback = ({ isSubscribed, pushToken }: { isSubscribed: boolean; pushToken?: string }) => {
        if (isSubscribed && pushToken) {
          dispatchLiveActivitySubscribe(
            liveActivityViewModel.deviceId,
            liveActivityViewModel.applicationTypeId,
            liveActivityViewModel.locale,
            [
              {
                pushToken: pushToken,
                eventId: liveActivityViewModel.eventId,
              },
            ],
          );
        } else if (!isSubscribed && pushToken) {
          dispatchLiveActivityUnsubscribe(liveActivityViewModel.deviceId, liveActivityViewModel.applicationTypeId, [
            {
              pushToken: pushToken,
              eventId: liveActivityViewModel.eventId,
            },
          ]);
        }

        setIsLiveActivityToggleSelected(isSubscribed);
      };

      onLiveActivityToggleUpdate(!isLiveActivityToggleSelected, liveActivityViewModel, updateCallback);
    }
  }, [
    isLiveActivityToggleSelected,
    liveActivityViewModel,
    isLiveActivityActive,
    dispatchLiveActivitySubscribe,
    dispatchLiveActivityUnsubscribe,
  ]);

  const isLiveActivitiesToggleDisabled = isLiveActivityActive
    ? getLiveActivityToggleDisabledFlag(liveActivityViewModel)
    : true;

  const liveActivitiesToggleLabel = isLiveActivityActive
    ? getLiveActivityToggleLabel(
        liveActivitiesToggleDisabledDescription,
        liveActivitiesToggleMoreThanTwoHoursDescription,
        liveActivitiesToggleDescription,
        liveActivityViewModel,
      )
    : "";

  return (
    <>
      <View {...getTestProps(selectors.NOTIFICATIONS_SUBSCRIPTION, false)}>
        {viewMode === NotificationsViewMode.BET_RECEIPT && pushNotificationsData?.showNotificationsToggle && (
          <View
            {...getTestProps(selectors.NOTIFICATIONS_SUBSCRIPTION_TOGGLE, false)}
            style={styles.notificationToggleContainer}
          >
            <Option
              title={notificationsToggleLabel}
              icon={notificationIconName()}
              iconSize="small"
              isToggle={true}
              isSelected={pushNotificationsData?.isNotificationsSelected ?? false}
              isReadOnly={pushNotificationsData?.isNotificationsUnavailable}
              onPress={onIconClick}
              disabled={!pushNotificationsData?.isSystemPushEnabled}
            />
          </View>
        )}
        {(viewMode === NotificationsViewMode.EVENT_OR_RACE || viewMode === NotificationsViewMode.RACE) && (
          <View {...getTestProps(selectors.NOTIFICATIONS_SUBSCRIPTION_BELL, false)}>
            <Pressable
              {...getTestProps(selectors.NOTIFICATIONS_SUBSCRIPTION_PRESSABLE, false)}
              style={styles.icon}
              onPress={onIconClick}
            >
              {notificationIcon}
            </Pressable>
          </View>
        )}
        {viewMode === NotificationsViewMode.MY_BETS && !!pushNotificationsData?.events?.length && (
          <SupportingContentButton
            icon={isAnyEventSubscribed ? SystemIconName.NOTIFICATION_ON : SystemIconName.NOTIFICATION_OFF}
            isHighlighted
            isOpen={isAnyEventSubscribed}
            onPress={onIconClick}
          />
        )}
      </View>

      {showLoggedOutPrompt ? (
        <NotificationPrompt
          title={hasJoinNowButton ? loginPromptTitle : loginLabel}
          description={loginPromptDescription}
          onOutsideTap={onLoginPromptOutsideTap}
          primaryButtonLabel={hasJoinNowButton ? joinNowLabel : loginLabel}
          secondaryButtonLabel={hasJoinNowButton ? loginLabel : undefined}
          onPrimaryButtonTap={hasJoinNowButton ? onJoinButtonTap : onLoginButtonTap}
          onSecondaryButtonTap={hasJoinNowButton ? onLoginButtonTap : undefined}
        />
      ) : (
        <>
          {showGoToSettingsPrompt && (
            <NotificationPrompt
              title={settingsPromptTitle}
              description={settingsPromptDescription}
              onOutsideTap={onSettingsPromptOutsideTap}
              primaryButtonLabel={goToSettingsLabel}
              onPrimaryButtonTap={onGoToSettingsTap}
            />
          )}
        </>
      )}

      {showEventsBottomSheet && (
        <BottomSheet
          title={notificationsBottomSheetTitle}
          onHeaderIconTap={onEventsBottomSheetClose}
          showOverlay={true}
          withModal={true}
          headerContent={
            <View style={styles.headerContentContainer}>
              {isLiveActivityActive && viewMode === NotificationsViewMode.EVENT_OR_RACE && (
                <MasterToggle
                  title={liveActivitiesToggleTitle}
                  subtitle={liveActivitiesToggleLabel}
                  isSelected={isLiveActivityToggleSelected}
                  isReadOnly={isLiveActivitiesToggleDisabled}
                  onPress={onLiveActivitiesToggle}
                />
              )}
              <MasterToggle
                title={notificationsBottomSheetHeaderTitle}
                subtitle={notificationsBottomSheetHeaderDescription}
                isSelected={!!selectedEventIds.length}
                onPress={onPushNotificationToggle}
              />
            </View>
          }
          footerContent={
            viewMode !== NotificationsViewMode.EVENT_OR_RACE ? (
              <PrimaryButton
                label={notificationsBottomSheetFooterTitle}
                onTap={onSavePress}
                disabled={!hasSelectionChanged}
              />
            ) : null
          }
        >
          {viewMode === NotificationsViewMode.MY_BETS && (
            <View style={styles.eventListContainer}>
              {pushNotificationsData?.events?.map((event) => (
                <EventOption
                  key={event.id}
                  event={event}
                  isSelected={selectedEventIds.includes(event.id)}
                  onPress={onEventPress}
                />
              ))}
            </View>
          )}
        </BottomSheet>
      )}
    </>
  );
};

export default NotificationsSubscription;
