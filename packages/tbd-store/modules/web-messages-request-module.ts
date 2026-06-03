import { ISagaModule } from "redux-dynamic-modules-saga";
import { ApplicationState } from "../state/ApplicationState.types";
import { webMessagesRequestSaga } from "../middlewares/web-messages-saga";

export const getWebMessagesRequestModule = (): ISagaModule<ApplicationState> => ({
  id: "web-messages-request-module",
  middlewares: [],
  sagas: [webMessagesRequestSaga],
  initialActions: [],
});
