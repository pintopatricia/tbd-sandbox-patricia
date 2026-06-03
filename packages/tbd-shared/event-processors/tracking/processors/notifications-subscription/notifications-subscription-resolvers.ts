import { buildInterfaceEvent } from "tagging-library";
import type { InterfaceEvent } from "tagging-library";
import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { PNLabelsEnum } from "@ppb/tbd-store/middlewares/tagging-resolvers/interface";
import { getStore } from "@ppb/tbd-store/create-store";
import { createViewTypeSelector } from "@ppb/tbd-store/state/layout/layout-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { createIsEventSubscribedByEventIdSelector } from "@ppb/tbd-store/state/entities/notifications/notifications-selectors";
import { NotificationsSubscriptionEvents } from "@ppb/tbd-store/actions/push-notifications";
import { formatTime } from "../../../../helpers/dates";
import { getRaceTrackingData } from "./NotificationsSubscription.graphql";

export async function pnInteractionRaceTrackingResolver(
  payload: NotificationsSubscriptionEvents["@@UI/PN_INTERACTION_RACE"],
  sendEvent: (payload: InterfaceEvent) => void,
) {
  const race = await getRaceTrackingData(payload.raceUrn);
  if (!race) return;

  const state = getStore().getState();
  const getViewTypeSelector = createViewTypeSelector();
  const pageType = getViewTypeSelector(state);

  const getUserDetails = createGetCountryLocalCurrencyCodeSelector();
  const { localeCode, timezone } = getUserDetails(state);

  const isEventSubscribedByEventId = createIsEventSubscribedByEventIdSelector();
  const wasSubscribed = isEventSubscribedByEventId(state.entities.notifications, race.raceId);
  const label = wasSubscribed ? PNLabelsEnum.OFF : PNLabelsEnum.ON;

  const sportName = race.meeting.sport.name.toLocaleLowerCase();
  const meetingVenue = race.meeting.venue.toLocaleLowerCase();
  const raceName = race.name.toLocaleLowerCase();
  const raceStartTime = formatTime(race.startTime, localeCode, timezone);

  sendEvent(
    buildInterfaceEvent({
      action: TaggingAction.CLICKED,
      elementText: label,
      module: `${pageType} - notifications - ${sportName} - ${meetingVenue} - ${raceName} ${raceStartTime}`,
    }),
  );
}
