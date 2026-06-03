import { NotificationsCenterService } from "@flutter-global/uki-channels-http-clients";
import { createClientFactory } from "./client-factory";

const ncsClientFactory = createClientFactory(NotificationsCenterService);

export default {
  /**
   * Gets the current unread notifications
   * for the logged in user
   *
   * @returns a NotificationSummary containing
   *  a count of unread notifications
   */
  async retrieveCount() {
    const wmsClient = ncsClientFactory("WMS");

    return await wmsClient.retrieveNotificationSummary();
  },
};
