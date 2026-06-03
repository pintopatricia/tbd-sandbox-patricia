import { ISagaModule } from "redux-dynamic-modules-saga";
import { ApplicationState } from "../state/ApplicationState.types";
import { pushNotificationsSaga } from "../middlewares/push-notifications-saga";
import { liveActivitiesSaga } from "../middlewares/live-activities-saga";

export const getPushNotificationsModule = (): ISagaModule<ApplicationState> => ({
  id: "push-notifications-load-module",
  reducerMap: {} as any,
  middlewares: [],
  sagas: [pushNotificationsSaga, liveActivitiesSaga],
});
