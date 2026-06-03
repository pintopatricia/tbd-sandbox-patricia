import { createSelector, ParametricSelector, Selector } from "reselect";
import URN from "../../layout/URN";
import { DeviceInfo, NotificationsState } from "./Notifications";

/**
 * For a given eventId, returns if it's in the list of subscribed events
 */
const isEventSubscribedByEventId = ({ subscribedEventIds }: NotificationsState, eventId: string): boolean => {
  if (subscribedEventIds.includes(eventId)) {
    return true;
  }

  return false;
};

export const createIsEventSubscribedByEventIdSelector = (): ParametricSelector<NotificationsState, URN, boolean> =>
  createSelector(
    [(state: NotificationsState) => state, (_: NotificationsState, eventId: string) => eventId],
    isEventSubscribedByEventId,
  );

export const createGetSubscribedEventIdsSelector = (): Selector<NotificationsState, string[]> =>
  createSelector([(state: NotificationsState) => state], (state: NotificationsState) => state.subscribedEventIds);

export const createGetUnsupportedEventIdsSelector = (): Selector<NotificationsState, string[]> =>
  createSelector([(state: NotificationsState) => state], (state: NotificationsState) => state.unsupportedEventIds);

export const createGetNotificationsDeviceSelector = (): Selector<NotificationsState, DeviceInfo | undefined> =>
  createSelector([(state: NotificationsState) => state], (state: NotificationsState) => state.deviceInfo);
