/**
 * @file Manages notification subscriptions.
 * https://flutteruki.atlassian.net/wiki/spaces/BSBG/pages/145436577/BFRB+Native+Feature+Analysis+-+Push+Notifications
 */
import { NotificationSubscriptionService } from "@flutter-global/uki-channels-http-clients";
import {
  RegisterOptions,
  Topic,
  SubscribeLiveActivity,
  LiveActivityResponse,
  UnsubscribeLiveActivity,
} from "../state/entities/notifications/Notifications";
import { createClientFactory } from "./client-factory";

const nssClientFactory = createClientFactory(NotificationSubscriptionService);

// TODO: typings

export default {
  /**
   * Register a device
   *
   * @returns void No result
   */
  async register(
    applicationTypeId: string,
    deviceId: string,
    { applicationDetails, deviceDetails, notificationPreferences }: RegisterOptions = {},
  ) {
    if (!applicationTypeId || !deviceId) {
      throw new Error(`Insufficient data provided, cannot register device`);
    }

    const nssClient = nssClientFactory("NSS");
    await nssClient.register(applicationTypeId, deviceId, {
      applicationDetails,
      deviceDetails,
      notificationPreferences,
    });
  },

  /**
   * Subscribe to an event
   *
   * @returns List<Topic> The list of newly created subscriptions. Existing or invalid subscription combinations are ignored.
   */
  async subscribeToEvents(
    applicationTypeId: string,
    deviceId: string,
    locale: string,
    topics: Topic[],
  ): Promise<Topic[]> {
    if (!applicationTypeId || !deviceId || !locale || !topics) {
      throw new Error(`Insufficient data provided, cannot subscribe event`);
    }

    const nssClient = nssClientFactory("NSS");
    const subscriptions = await nssClient.subscribeToEvents({
      topics,
      applicationTypeId,
      deviceId,
      locale,
    });

    return subscriptions.reduce((result: Topic[], subscription) => {
      if (subscription.topic.topicSpecification?.eventId) {
        const topic = topics.find((a) => a.topicId === subscription.topic.topicSpecification?.eventId?.toString());
        if (topic) {
          result.push({
            topicId: subscription.topic.topicSpecification.eventId.toString(),
            eventType: topic.eventType,
            incidentTypes: [],
          });
        }
      } else if (subscription.topic.topicSpecification?.marketId) {
        const topic = topics.find((a) => a.topicId === subscription.topic.topicSpecification?.marketId?.toString());
        if (topic) {
          result.push({
            topicId: subscription.topic.topicSpecification.marketId.toString(),
            eventType: topic.eventType,
            incidentTypes: [],
          });
        }
      }

      return result;
    }, []);
  },

  /**
   * Unsubscribe from an event
   *
   * @returns void No result
   */
  async unsubscribeFromEvents(applicationTypeId: string, deviceId: string, topics: Topic[]) {
    if (!applicationTypeId || !deviceId || !topics) {
      throw new Error(`Insufficient data provided, cannot unsubscribe from event`);
    }

    const nssClient = nssClientFactory("NSS");
    await nssClient.unsubscribeFromEvents({
      topics,
      applicationTypeId,
      deviceId,
    });
  },

  /**
   * Performs a subscription for live activity notifications for a specific application and a list of events. The application must be registered before it can subscribe to live activities.
   *
   * @returns {Promise<LiveActivityResponse>} Return ok if it was a successful call and fail otherwise, together with an error code.
   */
  async subscribeLiveActivity(subscribeLiveActivity: SubscribeLiveActivity): Promise<LiveActivityResponse> {
    if (!subscribeLiveActivity) {
      throw new Error(`Insufficient data provided, cannot subscribe to live activity`);
    }

    const nssClient = nssClientFactory("NSS");
    const liveActivityResponse = await nssClient.subscribeLiveActivity(subscribeLiveActivity);
    return liveActivityResponse;
  },

  /**
   * Cancels a list of subscriptions from live activity updates.
   *
   * @returns {Promise<LiveActivityResponse>} Return ok if it was a successful call and fail otherwise, together with an error code.
   */
  async unsubscribeLiveActivity(unsubscribeLiveActivity: UnsubscribeLiveActivity): Promise<LiveActivityResponse> {
    if (!unsubscribeLiveActivity) {
      throw new Error(`Insufficient data provided, cannot unsubscribe from live activity`);
    }

    const nssClient = nssClientFactory("NSS");
    const liveActivityResponse = await nssClient.unsubscribeLiveActivity(unsubscribeLiveActivity);
    return liveActivityResponse;
  },
};
