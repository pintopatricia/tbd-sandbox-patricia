import { getPushNotificationsModule } from "./push-notifications-load-module";

jest.mock("../middlewares/push-notifications-saga", () => ({
  pushNotificationsSaga: "push-notifications-saga",
}));

jest.mock("../middlewares/live-activities-saga", () => ({
  liveActivitiesSaga: "live-activities-saga",
}));

describe("getPushNotificationsModule", () => {
  it("should return the push notifications module", () => {
    const pushNotificationsModule = getPushNotificationsModule();

    expect(pushNotificationsModule).toEqual({
      id: "push-notifications-load-module",
      middlewares: [],
      reducerMap: {},
      sagas: ["push-notifications-saga", "live-activities-saga"],
    });
  });
});
