import { ISagaModule } from "redux-dynamic-modules-saga";
import { ApplicationState } from "../state/ApplicationState.types";
import { pushHandlerSaga } from "../middlewares/event-push-handler-saga";

export const getEventPushHandlerModule = (): ISagaModule<ApplicationState> => ({
  id: "event-push-handler-module",
  reducerMap: {} as any,
  middlewares: [],
  sagas: [pushHandlerSaga],
});
