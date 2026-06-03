import { Store } from "redux";
import { ApplicationState } from "../state";
import { PUSH, PushAction } from "../actions";
/**
 * Router PUSH action dispatch wrapper.
 * @param store The application store
 * @param viewUrn The internal screen route as view entity type
 */
export const dispatchRoutePushAction = (store: Store<ApplicationState>, viewUrn: string, viewUrl?: string): void => {
  store.dispatch<PushAction>({
    type: PUSH,
    payload: {
      viewUrn,
      viewUrl: viewUrl || "",
    },
  });
};
